import { useState, useEffect } from 'react';
import { apiService, Payment } from '../services/api';

export interface UserStatistics {
  totalSpent: number;
  totalPayments: number;
  premiumPayments: number;
  averagePaymentAmount: number;
  availableTemplates: number;
  premiumTemplates: number;
  freeTemplates: number;
  recentPayments: Payment[];
  membershipDuration: string;
  membershipDays: number;
  lastPaymentDate?: string;
  paymentMethods: string[];
  statusDistribution: {
    completed: number;
    pending: number;
    failed: number;
  };
}

export function useUserStatistics(userId?: string) {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch payments and templates in parallel
        const [paymentsResponse, templatesResponse] = await Promise.all([
          apiService.payments.getUserPayments(),
          apiService.cards.getTemplates()
        ]);

        if (paymentsResponse.success && templatesResponse.success) {
          const payments = paymentsResponse.data || [];
          const templates = templatesResponse.data || [];

          // Calculate statistics
          const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);
          const totalPayments = payments.length;
          const premiumPayments = payments.filter(p => 
            p.description?.toLowerCase().includes('premium') || 
            p.description?.toLowerCase().includes('upgrade')
          ).length;
          
          const averagePaymentAmount = totalPayments > 0 ? totalSpent / totalPayments : 0;
          
          const premiumTemplates = templates.filter(t => t.Is_premium).length;
          const freeTemplates = templates.filter(t => !t.Is_premium).length;
          
          const recentPayments = payments
            .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
            .slice(0, 5);

          // Calculate membership duration
          const firstPaymentDate = payments.length > 0 
            ? new Date(payments[0].paymentDate)
            : new Date(); // Fallback to current date
          
          const membershipDays = Math.floor(
            (new Date().getTime() - firstPaymentDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          const membershipDuration = membershipDays > 0 
            ? `${Math.floor(membershipDays / 30)} months ${membershipDays % 30} days`
            : 'Less than 1 day';

          const lastPaymentDate = payments.length > 0 
            ? new Date(Math.max(...payments.map(p => new Date(p.paymentDate).getTime()))).toLocaleDateString()
            : undefined;

          // Get unique payment methods
          const paymentMethods = [...new Set(payments.map(p => p.paymentMethod))];

          // Payment status distribution
          const statusDistribution = payments.reduce(
            (acc, payment) => {
              const status = payment.status?.toLowerCase() || 'unknown';
              if (status === 'completed' || status === 'success') {
                acc.completed++;
              } else if (status === 'pending') {
                acc.pending++;
              } else {
                acc.failed++;
              }
              return acc;
            },
            { completed: 0, pending: 0, failed: 0 }
          );

          setStatistics({
            totalSpent,
            totalPayments,
            premiumPayments,
            averagePaymentAmount,
            availableTemplates: templates.length,
            premiumTemplates,
            freeTemplates,
            recentPayments,
            membershipDuration,
            membershipDays,
            lastPaymentDate,
            paymentMethods,
            statusDistribution
          });
        } else {
          setError(paymentsResponse.message || templatesResponse.message || 'Failed to fetch statistics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [userId]);

  return { statistics, loading, error };
}
