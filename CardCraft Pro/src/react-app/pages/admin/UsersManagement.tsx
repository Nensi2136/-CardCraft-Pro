import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AdminLayout from "@/react-app/components/AdminLayout";
import { Card, CardContent } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Badge } from "@/react-app/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { ArrowLeft, Search, Users, Crown, Mail, Calendar, Ban, CheckCircle, Star } from "lucide-react";
import { apiService } from "@/react-app/services/api";

interface User {
  user_Id: number; // Changed from id to user_Id
  username: string; // Added username field
  email: string;
  password_hash?: string; // Added password_hash field
  is_premium?: boolean; // Changed from isPremium to is_premium
  is_admin?: boolean; // Changed from isAdmin to is_admin
  created_at: string; // Changed from createdAt to created_at
  updated_at?: string; // Added updated_at field
  // For backward compatibility with existing UI
  id?: string;
  name?: string;
  role?: string;
  isPremium?: boolean;
  isAdmin?: boolean;
  createdAt?: string;
  templatesCreated?: number;
  totalSpent?: number;
  lastLogin?: string;
  isActive?: boolean;
  subscriptionExpiry?: string;
}

export default function UsersManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.users.getAllUsers();
      console.log('Users API Response:', response);
      
      if (response.success && response.data) {
        // Transform API data to match our interface
        const transformedUsers: User[] = response.data.map(apiUser => ({
          // API fields
          user_Id: apiUser.user_Id,
          username: apiUser.username,
          email: apiUser.email,
          password_hash: apiUser.password_hash,
          is_premium: apiUser.is_premium,
          is_admin: apiUser.is_admin,
          created_at: apiUser.created_at,
          updated_at: apiUser.updated_at,
          // Backward compatibility fields for UI
          id: apiUser.user_Id?.toString() || '1',
          name: apiUser.username || apiUser.email?.split('@')[0] || 'User',
          role: apiUser.is_admin ? 'admin' : (apiUser.is_premium ? 'Premium User' : 'Free User'),
          isPremium: apiUser.is_premium,
          isAdmin: apiUser.is_admin,
          createdAt: apiUser.created_at,
          templatesCreated: 0, // Default value
          totalSpent: 0, // Default value
          lastLogin: apiUser.created_at, // Use created_at as lastLogin
          isActive: true, // Default to true
          subscriptionExpiry: undefined // Default to undefined
        }));
        setUsers(transformedUsers);
      } else {
        console.error('Failed to fetch users:', response.message);
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await apiService.users.toggleUserStatus(userId, !currentStatus);
      if (response.success) {
        // Refresh the users list
        fetchUsers();
      } else {
        console.error('Failed to toggle user status:', response.message);
        // Still refresh to show current state
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      // Still refresh to show current state
      fetchUsers();
    }
  };

  const upgradeUserToPremium = async (userId: string) => {
    try {
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year from now
      
      const response = await apiService.users.upgradeToPremium(userId, expiryDate.toISOString());
      if (response.success) {
        // Refresh the users list
        fetchUsers();
      } else {
        console.error('Failed to upgrade user:', response.message);
        // Still refresh to show current state
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to upgrade user:', error);
      // Still refresh to show current state
      fetchUsers();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'premium':
        return 'bg-yellow-100 text-yellow-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || (user.role || '') === filterRole;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && user.isActive) ||
                         (filterStatus === "inactive" && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.isPremium).length;
  const activeUsers = users.filter(u => u.isActive).length;
  const totalRevenue = users.reduce((sum, user) => sum + (user.totalSpent || 0), 0);

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
              <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
              <p className="text-muted-foreground mt-1">View and manage user accounts</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{totalUsers}</div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Crown className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{premiumUsers}</div>
                  <p className="text-sm text-muted-foreground">Premium Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{activeUsers}</div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
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
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">Free Users</SelectItem>
                    <SelectItem value="premium">Premium Users</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {(user.name || '').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-foreground">{user.name}</h3>
                          <Badge className={getRoleColor(user.role || '')}>
                            {(user.role || 'user').charAt(0).toUpperCase() + (user.role || 'user').slice(1)}
                          </Badge>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Joined: {formatDate(user.createdAt || user.created_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {user.templatesCreated} templates
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">
                        ${(user.totalSpent || 0).toFixed(2)}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      {user.isPremium && user.subscriptionExpiry && (
                        <p className="text-sm text-yellow-600 mt-1">
                          Expires: {formatDate(user.subscriptionExpiry || '')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-muted-foreground">
                    <div>Last Login: {formatDateTime(user.lastLogin || user.createdAt || user.created_at)}</div>
                    <div className="flex gap-2 mt-3 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id || user.user_Id.toString(), user.isActive || false)}
                        className={user.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                      >
                        {user.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        {user.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      
                      {!user.isPremium && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => upgradeUserToPremium(user.id || user.user_Id.toString())}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <Star className="w-4 h-4" />
                          Upgrade
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <h3 className="text-lg font-medium mb-2">
                  {searchTerm || filterRole !== "all" || filterStatus !== "all" ? 'No users found' : 'No users yet'}
                </h3>
                <p>
                  {searchTerm || filterRole !== "all" || filterStatus !== "all"
                    ? 'Try adjusting your search or filters.'
                    : 'Users will appear here once they start registering on the platform.'
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
