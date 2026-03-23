import { Link, useLocation } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { Shield, LogOut, LayoutDashboard, Tag, FileImage, MessageSquare, CreditCard, Users, Mail } from "lucide-react";
import { ThemeToggle } from "@/react-app/components/theme-toggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "http://localhost:5173/login";
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/categories", icon: Tag, label: "Categories" },
    { path: "/admin/templates", icon: FileImage, label: "Templates" },
    { path: "/admin/reviews", icon: MessageSquare, label: "Reviews" },
    { path: "/admin/payments", icon: CreditCard, label: "Payments" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/contact-messages", icon: Mail, label: "Contact Messages" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Admin Panel</h1>
                <p className="text-xs text-slate-400">CardCraft Pro</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-purple-600 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background">
        {children}
      </main>
    </div>
  );
}
