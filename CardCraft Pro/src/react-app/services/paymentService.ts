// Payment Service for CardCraft Pro
import { apiService, ApiResponse } from './api';

// Payment Types matching backend DTOs
export interface CreatePaymentDto {
  userId: number;
  accountNumber: number;
  cvv: number;
  expiryDate: string;
  amount: number;
}

export interface PaymentDto {
  id: number;
  userId: number;
  accountNumber: number;
  cvv: number;
  expiryDate: string;
  amount: number;
  paymentDate: string;
  status?: string;
  processedDate?: string;
  transactionId?: string;
}

export interface UpdatePaymentStatusDto {
  status: string;
  transactionId?: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Cancelled';
  amount: number;
  currency: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt?: string;
  clientSecret?: string; // For Stripe payment intent
  redirectUrl?: string; // For external payment gateways
  transactionId?: string; // Added from API response
  errorMessage?: string; // Added from API response
}

export interface PaymentStatusResponse {
  status: string;
  amount: number;
  paidAt?: string;
  failureReason?: string;
}

export interface UserPayment {
  id: string;
  userId: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Cancelled';
  paymentMethod: string;
  createdAt: string;
  updatedAt?: string;
  transactionId?: string;
  errorMessage?: string;
}

// Payment Service Class
class PaymentService {
  private baseUrl = 'http://localhost:7130/api/payments';

  // Create a new payment
  async createPayment(paymentData: CreatePaymentDto): Promise<ApiResponse<PaymentDto>> {
    try {
      console.log('Creating payment with data:', paymentData);
      
      // Use the existing API service
      const response = await apiService.payments.createPayment({
        userId: paymentData.userId,
        accountNumber: paymentData.accountNumber,
        cvv: paymentData.cvv,
        expiryDate: paymentData.expiryDate,
        amount: paymentData.amount
      });

      // Return the API response directly without transformation
      return response as ApiResponse<PaymentDto>;
    } catch (error) {
      console.error('Payment creation error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Payment creation failed'
      };
    }
  }

  // Get payment status by ID
  async getPaymentStatus(paymentId: string): Promise<ApiResponse<PaymentStatusResponse>> {
    try {
      const response = await apiService.payments.getPaymentStatus(paymentId);
      
      if (response.success && response.data) {
        const statusResponse: PaymentStatusResponse = {
          status: response.data.status,
          amount: response.data.amount,
          paidAt: response.data.paidAt
        };

        return {
          success: true,
          data: statusResponse
        };
      }

      return response;
    } catch (error) {
      console.error('Payment status check error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get payment status'
      };
    }
  }

  // Get all payments for the current user
  async getUserPayments(): Promise<ApiResponse<UserPayment[]>> {
    try {
      const response = await apiService.payments.getUserPayments();
      
      if (response.success && response.data) {
        const userPayments: UserPayment[] = response.data.map(payment => ({
          id: payment.id.toString(),
          userId: payment.userId.toString(),
          amount: payment.amount,
          status: payment.status as UserPayment['status'],
          paymentMethod: payment.paymentMethod,
          createdAt: payment.paymentDate,
          updatedAt: payment.processedDate,
          transactionId: payment.transactionId,
          errorMessage: '' // No error message in successful responses
        }));

        return {
          success: true,
          data: userPayments
        };
      }

      return {
        success: false,
        message: 'Failed to get user payments'
      } as ApiResponse<UserPayment[]>;
    } catch (error) {
      console.error('Get user payments error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get user payments'
      };
    }
  }

  // Process payment with Stripe (if needed)
  async processStripePayment(paymentIntentId: string): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/stripe/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ paymentIntentId })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Stripe payment processing failed'
        };
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Stripe payment processing error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Stripe payment processing failed'
      };
    }
  }

  // Refund payment
  async refundPayment(paymentId: string, reason?: string): Promise<ApiResponse<{ refundId: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Refund failed'
        };
      }

      return {
        success: true,
        data: { refundId: data.refundId }
      };
    } catch (error) {
      console.error('Refund error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Refund failed'
      };
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService;
