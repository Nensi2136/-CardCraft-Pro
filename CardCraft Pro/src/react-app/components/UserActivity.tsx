import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { Progress } from "@/react-app/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  CreditCard, 
  Crown,
  Package,
  Activity,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { useUserStatistics } from "@/react-app/hooks/useUserStatistics";

export default function UserActivity() {
  const { statistics, loading, error } = useUserStatistics();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <span>Failed to load user statistics: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!statistics) {
    return null;
  }

  const successRate = statistics.totalPayments > 0 
    ? (statistics.statusDistribution.completed / statistics.totalPayments) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${statistics.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.totalPayments} transaction{statistics.totalPayments !== 1 ? 's' : ''}
            </p>
            {statistics.averagePaymentAmount > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Avg: ${statistics.averagePaymentAmount.toFixed(2)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Status</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.premiumPayments}</div>
            <p className="text-xs text-muted-foreground">
              Premium upgrade{statistics.premiumPayments !== 1 ? 's' : ''}
            </p>
            <div className="mt-2">
              <Progress 
                value={statistics.totalPayments > 0 ? (statistics.premiumPayments / statistics.totalPayments) * 100 : 0} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.availableTemplates}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.premiumTemplates} premium, {statistics.freeTemplates} free
            </p>
            <div className="flex gap-1 mt-2">
              <Badge variant="secondary" className="text-xs">
                {statistics.premiumTemplates} Premium
              </Badge>
              <Badge variant="outline" className="text-xs">
                {statistics.freeTemplates} Free
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membership</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.membershipDays}</div>
            <p className="text-xs text-muted-foreground">days active</p>
            <p className="text-xs text-muted-foreground mt-1">
              {statistics.membershipDuration}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Success Rate and Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Payment Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Success Rate</span>
                <span className="text-sm font-bold">{successRate.toFixed(1)}%</span>
              </div>
              <Progress value={successRate} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-bold">{statistics.statusDistribution.completed}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-yellow-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-bold">{statistics.statusDistribution.pending}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-red-600">
                    <XCircle className="w-4 h-4" />
                    <span className="font-bold">{statistics.statusDistribution.failed}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics.paymentMethods.length > 0 ? (
                statistics.paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Badge variant="outline">{method}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {statistics.recentPayments.filter(p => p.paymentMethod === method).length} uses
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No payment methods recorded</p>
              )}
              {statistics.lastPaymentDate && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Last payment: {statistics.lastPaymentDate}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {statistics.recentPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Payment Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics.recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      payment.status === 'Completed' ? 'bg-green-500' : 
                      payment.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{payment.description || 'Payment'}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.paymentDate).toLocaleDateString()} • {payment.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${payment.amount.toFixed(2)}</p>
                    <Badge 
                      variant={payment.status === 'Completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
