import { useAuth } from "@/react-app/hooks/useApi";
import { useApi } from "@/react-app/hooks/useApi";
import { Button } from "@/react-app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { CreditCard, Download, Crown, LogOut, User, Settings, History, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { apiService } from "@/react-app/services/api";
import { useState } from "react";
import UserProfile from "@/react-app/components/UserProfile";
import UserActivity from "@/react-app/components/UserActivity";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  // Fetch user payments
  const { data: payments, loading: paymentsLoading } = useApi(
    () => apiService.payments.getUserPayments()
  );

  const { data: templates, loading: templatesLoading } = useApi(
    () => apiService.cards.getTemplates()
  );

  // Calculate user statistics
  const userStats = {
    totalPayments: payments?.length || 0,
    totalSpent: payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0,
    premiumPayments: payments?.filter(p => p.description?.toLowerCase().includes('premium')).length || 0,
    availableTemplates: templates?.length || 0,
    premiumTemplates: templates?.filter(t => t.Is_premium).length || 0
  };

  const handleLogout = () => {
    logout("http://localhost:5173/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* User Info Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">{user?.name}</div>
              <div className="text-xs text-slate-500">{user?.email}</div>
            </div>
            {user?.role === 'Premium User' && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-xs text-white font-semibold">
                <Crown className="w-3 h-3" />
                Premium
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Your Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Manage your business cards and account settings
          </p>
        </div>

        {/* User Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <CreditCard className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Basic Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Create professional business cards with basic templates
              </p>
              <Button asChild className="w-full">
                <Link to="/products/basic">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-200 transition-colors">
            <CardHeader>
              <Crown className="w-12 h-12 text-purple-600 mb-4" />
              <CardTitle>Luxury Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Premium templates with advanced customization options
              </p>
              {user?.role === 'Premium User' ? (
                <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  <Link to="/products/luxury">Access Premium</Link>
                </Button>
              ) : (
                <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  <Link to="/upgrade">Upgrade Now</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-green-200 transition-colors">
            <CardHeader>
              <History className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle>My Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                View your recently created business cards
              </p>
              <div className="text-sm text-slate-500 mb-3">
                {templatesLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading templates...
                  </div>
                ) : (
                  <span>{userStats.availableTemplates} templates available</span>
                )}
              </div>
              <Button variant="outline" className="w-full">
                View History
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-200 transition-colors">
            <CardHeader>
              <Settings className="w-12 h-12 text-orange-600 mb-4" />
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Manage your profile and preferences
              </p>
              <Button variant="outline" className="w-full">
                Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-pink-200 transition-colors">
            <CardHeader>
              <Download className="w-12 h-12 text-pink-600 mb-4" />
              <CardTitle>Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Download your created business cards
              </p>
              <div className="text-sm text-slate-500 mb-3">
                {paymentsLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading payment history...
                  </div>
                ) : (
                  <span>{userStats.totalPayments} payment{userStats.totalPayments !== 1 ? 's' : ''} processed</span>
                )}
              </div>
              <Button variant="outline" className="w-full">
                View Downloads
              </Button>
            </CardContent>
          </Card>

          {user?.role === 'Premium User' && (
            <Card className="border-2 hover:border-yellow-200 transition-colors bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader>
                <Crown className="w-12 h-12 text-yellow-600 mb-4" />
                <CardTitle>Premium Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-600 space-y-2 mb-4">
                  <li>• Unlimited luxury templates</li>
                  <li>• Advanced customization</li>
                  <li>• Priority support</li>
                  <li>• No watermarks</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Manage Subscription
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* User Statistics */}
        <UserActivity />

        {/* Recent Activity */}
        {(payments && payments.length > 0) && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Recent Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{payment.description || 'Payment'}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(payment.paymentDate).toLocaleDateString()} • {payment.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">${payment.amount.toFixed(2)}</p>
                      <p className={`text-xs px-2 py-1 rounded-full inline-block ${
                        payment.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {payment.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Profile Details</h3>
                <div className="space-y-1 text-sm">
                  <div><span className="text-slate-500">Name:</span> {user?.name}</div>
                  <div><span className="text-slate-500">Email:</span> {user?.email}</div>
                  <div><span className="text-slate-500">User ID:</span> {user?.id}</div>
                  <div><span className="text-slate-500">Account Type:</span> 
                    <span className={user?.role === 'Premium User' ? "text-yellow-600 font-semibold" : "text-slate-600"}>
                      {user?.role === 'Premium User' ? "Premium User" : "Free User"}
                    </span>
                  </div>
                  {user?.created_at && (
                    <div><span className="text-slate-500">Member Since:</span> {new Date(user.created_at).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setShowProfile(true)}>
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                  {user?.role !== 'Premium User' && (
                    <Button size="sm" className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Profile Modal */}
      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}
