import { Link, useLocation } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/react-app/components/ui/dropdown-menu";
import { CreditCard, ChevronDown, LogOut } from "lucide-react";
import { ThemeToggle } from "@/react-app/components/theme-toggle";
import { motion } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // Clear auth state
    localStorage.removeItem("auth_token");
    window.location.href = "http://localhost:5173/login";
  };

  return (
    <div className="min-h-screen bg-background">
      <motion.header 
        className="bg-card border-b shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CardCraft Pro
                </span>
              </Link>
            </motion.div>

            <motion.nav 
              className="flex items-center gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/home"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/home")
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Home
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/about"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/about")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  About Us
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground gap-1"
                    >
                      Products
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/products/basic" className="cursor-pointer">
                        Basic Card
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/products/luxury" className="cursor-pointer">
                        Luxury Card
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/upgrade"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/upgrade")
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Upgrade Premium
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/contact")
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Contact Us
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <ThemeToggle />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </motion.div>
            </motion.nav>
          </div>
        </div>
      </motion.header>

      <main>{children}</main>

      <motion.footer 
        className="bg-card border-t mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CardCraft Pro
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Create stunning business cards with our easy-to-use customization tools.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <h3 className="font-semibold text-foreground">Quick Links</h3>
              <div className="space-y-2">
                <motion.div whileHover={{ x: 5 }} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Home
                </motion.div>
                <motion.div whileHover={{ x: 5 }} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  About Us
                </motion.div>
                <motion.div whileHover={{ x: 5 }} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Products
                </motion.div>
                <motion.div whileHover={{ x: 5 }} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Contact
                </motion.div>
              </div>
            </motion.div>

            {/* Services */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <h3 className="font-semibold text-foreground">Services</h3>
              <div className="space-y-2">
                <motion.div whileHover={{ x: 5 }} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Basic Cards
                </motion.div>
                <motion.div whileHover={{ x: 5 }} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Luxury Cards
                </motion.div>
                <motion.div whileHover={{ x: 5 }} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Premium Upgrade
                </motion.div>
                <motion.div whileHover={{ x: 5 }} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Custom Design
                </motion.div>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <h3 className="font-semibold text-foreground">Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>support@cardcraftpro.com</div>
                <div>+1 (555) 123-4567</div>
                <div>Mon-Fri: 9AM-6PM EST</div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div 
            className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <div className="text-sm text-muted-foreground">
              © 2024 CardCraft Pro. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <motion.div whileHover={{ y: -2 }} className="hover:text-foreground transition-colors cursor-pointer">
                Privacy Policy
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="hover:text-foreground transition-colors cursor-pointer">
                Terms of Service
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="hover:text-foreground transition-colors cursor-pointer">
                Cookie Policy
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
