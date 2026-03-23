import { useState } from "react";
import { useAuth } from "@/react-app/hooks/useApi";
import Layout from "@/react-app/components/Layout";
import { Button } from "@/react-app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { User, Save, ArrowLeft, Crown, Mail, Phone, Calendar, Shield, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { apiService } from "@/react-app/services/api";

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || user?.email?.split('@')[0] || '',
    phoneNumber: user?.phoneNumber || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await apiService.users.updateProfile({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        username: formData.username
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Update user data in auth context
        if (user) {
          const updatedUser = {
            ...user,
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            username: formData.username
          };
          
          // Update localStorage
          localStorage.setItem('userData', JSON.stringify(updatedUser));
        }
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An unexpected error occurred' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                  </Link>
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Overview Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <CardTitle className="text-xl">{user?.name}</CardTitle>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </div>
                  {user?.role === 'Premium User' && (
                    <div className="flex items-center justify-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-white text-sm font-semibold">
                      <Crown className="w-4 h-4" />
                      Premium Member
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Username:</span>
                      <span className="font-medium">{user?.username || 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{user?.phoneNumber || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Member Since:</span>
                      <span className="font-medium">{
                        user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'
                      }</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Account Type:</span>
                      <span className="font-medium">{user?.role || 'Standard User'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Edit Profile Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Edit Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="+1 555 0123 4567"
                      />
                    </div>

                    {message && (
                      <div className={`p-4 rounded-lg text-sm ${
                        message.type === 'success' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {message.text}
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving Changes...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        asChild
                        disabled={loading}
                      >
                        <Link to="/dashboard">Cancel</Link>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Account Statistics */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-gray-600">Cards Created</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">0</div>
                      <div className="text-sm text-gray-600">Downloads</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-gray-600">Templates Used</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">0</div>
                      <div className="text-sm text-gray-600">Days Active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
