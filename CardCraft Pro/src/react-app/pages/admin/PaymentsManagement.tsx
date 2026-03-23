import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AdminLayout from "@/react-app/components/AdminLayout";
import { Card, CardContent } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Badge } from "@/react-app/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { ArrowLeft, Search, CreditCard, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { apiService, ApiResponse } from "@/react-app/services/api";

interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  completedAt?: string;
  templateName?: string;
}

export default function PaymentsManagement() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use admin endpoint to get all payments
      const response: ApiResponse<unknown[]> = await apiService.payments.getAllPayments();
      
      if (response.success && response.data) {
        console.log('Raw payment data:', response.data); // Debug logging
        
        // Transform API response to match Payment interface
        const transformedPayments: (Payment | null)[] = await Promise.all(
          (response.data as unknown[]).map(async (payment: unknown, index: number) => {
            const paymentObj = payment as Record<string, unknown>;
            console.log(`Processing payment ${index}:`, paymentObj); // Debug each payment
            
            // Handle null/undefined userId
            const userId = paymentObj.userId as string | number | null | undefined;
            if (!userId) {
              console.warn(`Payment ${paymentObj.id} has null/undefined userId`);
              return null;
            }
            
            // Try to get user details for each payment
            let userName = `User ${userId}`;
            let userEmail = `user${userId}@example.com`;
            
            try {
              const userResponse = await apiService.users.getUserById(userId.toString());
              if (userResponse.success && userResponse.data) {
                userName = userResponse.data.name || userResponse.data.username || userName;
                userEmail = userResponse.data.email || userEmail;
              }
            } catch (userError) {
              console.warn(`Failed to fetch user details for user ${userId}:`, userError);
            }
            
            // Handle null/undefined status with fallback
            const status = paymentObj.status ? String(paymentObj.status).toLowerCase() : 'pending';
            const validStatus = ['pending', 'completed', 'failed', 'refunded'].includes(status) 
              ? status as Payment['status'] 
              : 'pending';
            
            return {
              id: paymentObj.id?.toString() || '',
              userId: userId.toString(),
              userName,
              userEmail,
              amount: Number(paymentObj.amount) || 0,
              currency: String(paymentObj.currency || 'USD'),
              status: validStatus,
              paymentMethod: String(paymentObj.paymentMethod || 'unknown'),
              transactionId: String(paymentObj.transactionId || ''),
              createdAt: String(paymentObj.paymentDate || new Date().toISOString()),
              completedAt: paymentObj.processedDate ? String(paymentObj.processedDate) : undefined,
              templateName: String(paymentObj.description || 'Premium Subscription')
            };
          })
        );
        
        // Filter out null payments and set the valid ones
        const validPayments = transformedPayments.filter(payment => payment !== null) as Payment[];
        setPayments(validPayments);
      } else {
        setError(response.message || 'Failed to fetch payments');
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'refunded':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (payment.templateName && payment.templateName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesMethod = filterMethod === "all" || payment.paymentMethod === filterMethod;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const failedPayments = payments.filter(p => p.status === 'failed').length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load payments</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchPayments} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Payments Management</h1>
              <p className="text-muted-foreground mt-1">View and manage payment transactions</p>
            </div>
          </div>
          <Button 
            onClick={fetchPayments} 
            variant="outline" 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{payments.length}</div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{pendingPayments}</div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{failedPayments}</div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search payments by user, email, transaction ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterMethod} onValueChange={setFilterMethod}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-foreground">{payment.userName}</h3>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{payment.userEmail}</p>
                        <p className="text-sm text-muted-foreground">
                          Transaction ID: {payment.transactionId}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">
                        ${payment.amount.toFixed(2)}
                      </div>
                      <p className="text-sm text-muted-foreground">{payment.paymentMethod.replace('_', ' ')}</p>
                      {payment.templateName && (
                        <p className="text-sm text-muted-foreground">{payment.templateName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-muted-foreground">
                    <div>Created: {formatDate(payment.createdAt)}</div>
                    {payment.completedAt && (
                      <div>Completed: {formatDate(payment.completedAt)}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPayments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <h3 className="text-lg font-medium mb-2">
                  {searchTerm || filterStatus !== "all" || filterMethod !== "all" ? 'No payments found' : 'No payments yet'}
                </h3>
                <p>
                  {searchTerm || filterStatus !== "all" || filterMethod !== "all"
                    ? 'Try adjusting your search or filters.'
                    : 'Payment transactions will appear here once users start making purchases.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
