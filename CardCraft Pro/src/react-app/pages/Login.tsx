import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { CreditCard, User, Shield, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { useAuth } from "@/react-app/contexts/AuthContext";
import { motion } from "framer-motion";
import { Card3D } from "@/react-app/components/ui/3d-card";
import { BackgroundGrid } from "@/react-app/components/ui/background-grid";
import { FloatingParticles } from "@/react-app/components/ui/floating-particles";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isPremium: boolean;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user" as "admin" | "user"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        return;
      }

      // Use the login function from auth context
      const success = await login(formData.email, formData.password, formData.role);
      
      if (success) {
        // Get the user data from localStorage to check the actual role
        const userData = localStorage.getItem('currentUser');
        if (userData) {
          const user = JSON.parse(userData);
          console.log('User role after login:', user.role, 'Is admin:', user.is_admin);
          
          // Redirect based on actual user role from backend, not form selection
          if (user.is_admin || user.role === 'admin') {
            navigate("/admin/dashboard");
          } else {
            navigate("/home");
          }
        } else {
          // Fallback - navigate based on form selection if userData is not available
          if (formData.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/home");
          }
        }
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch (formData.role) {
      case "admin":
        return <Shield className="w-8 h-8 text-white" />;
      case "user":
        return <User className="w-8 h-8 text-white" />;
      default:
        return <CreditCard className="w-8 h-8 text-white" />;
    }
  };

  const getRoleGradient = () => {
    switch (formData.role) {
      case "admin":
        return "from-purple-600 to-pink-600";
      case "user":
        return "from-blue-600 to-purple-600";
      default:
        return "from-blue-600 to-purple-600";
    }
  };

  const getRoleBgGradient = () => {
    switch (formData.role) {
      case "admin":
        return "from-slate-900 via-purple-900 to-slate-900";
      case "user":
        return "from-blue-900 via-indigo-900 to-purple-900";
      default:
        return "from-blue-900 via-indigo-900 to-purple-900";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <BackgroundGrid />
      <FloatingParticles />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600/10 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card3D>
          <div className={`bg-gradient-to-br ${getRoleBgGradient()} backdrop-blur-xl rounded-2xl shadow-2xl`}>
            <CardHeader className="text-center pb-6">
              <motion.div 
                className="flex justify-center mb-6 pt-8"
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${getRoleGradient()} rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  {getRoleIcon()}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CardTitle className="text-3xl font-bold text-white mb-2">Welcome Back</CardTitle>
                <CardDescription className="text-gray-300 text-base">
                  Sign in to your <span className="font-semibold text-white">{formData.role === "admin" ? "admin" : "user"}</span> account
                </CardDescription>
              </motion.div>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              {error && (
                <motion.div 
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm backdrop-blur-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Label htmlFor="role" className="text-gray-300 font-medium">Login As</Label>
                  <Select value={formData.role} onValueChange={(value: "admin" | "user") => setFormData({ ...formData, role: value })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 backdrop-blur-sm">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      <SelectItem value="user" className="text-white focus:bg-white/10">User</SelectItem>
                      <SelectItem value="admin" className="text-white focus:bg-white/10">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Label htmlFor="email" className="text-gray-300 font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={formData.role === "admin" ? "demo@gmail.com" : "user@example.com"}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 backdrop-blur-sm"
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Label htmlFor="password" className="text-gray-300 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="•••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 backdrop-blur-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Button 
                    type="submit" 
                    className={`w-full bg-gradient-to-r ${getRoleGradient()} hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Sign In as {formData.role === "admin" ? "Admin" : "User"}
                        <Sparkles className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div 
                className="mt-6 text-center text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <span className="text-gray-400">Don't have an account? </span>
                <Link to="/register" className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors">
                  Sign up
                </Link>
              </motion.div>
            </CardContent>
          </div>
        </Card3D>
      </motion.div>
    </div>
  );
}
