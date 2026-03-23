import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider, ProtectedRoute } from "@/react-app/contexts/AuthContext";
import { ThemeProvider } from "@/react-app/components/theme-provider";
import RegistrationPage from "@/react-app/pages/Registration";
import LoginPage from "@/react-app/pages/Login";
import HomePage from "@/react-app/pages/HomePage";
import UserDashboard from "@/react-app/pages/UserDashboard";
import ProfilePage from "@/react-app/pages/Profile";
import AboutUsPage from "@/react-app/pages/AboutUs";
import ContactUsPage from "@/react-app/pages/ContactUs";
import ProductsPage from "@/react-app/pages/Products";
import CustomizePage from "@/react-app/pages/Customize";
import UpgradePage from "@/react-app/pages/Upgrade";
import PaymentPage from "@/react-app/pages/Payment";
import ApiTest from "@/react-app/components/ApiTest";
import PaymentTest from "@/react-app/components/PaymentTest";
import AdminLoginPage from "@/react-app/pages/admin/AdminLogin";
import AdminDashboard from "@/react-app/pages/admin/AdminDashboard";
import CategoriesManagement from "@/react-app/pages/admin/CategoriesManagement";
import TemplatesManagement from "@/react-app/pages/admin/TemplatesManagement";
import ReviewsManagement from "@/react-app/pages/admin/ReviewsManagement";
import PaymentsManagement from "@/react-app/pages/admin/PaymentsManagement";
import UsersManagement from "@/react-app/pages/admin/UsersManagement";
import ContactMessagesManagement from "@/react-app/pages/admin/ContactMessagesManagement";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="/payment-test" element={<PaymentTest />} />
          
          {/* Protected User Routes */}
          <Route path="/home" element={
            <ProtectedRoute requiredRole="user">
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute requiredRole="user">
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/about" element={
            <ProtectedRoute requiredRole="user">
              <AboutUsPage />
            </ProtectedRoute>
          } />
          <Route path="/contact" element={
            <ProtectedRoute requiredRole="user">
              <ContactUsPage />
            </ProtectedRoute>
          } />
          <Route path="/products/:type" element={
            <ProtectedRoute requiredRole="user">
              <ProductsPage />
            </ProtectedRoute>
          } />
          <Route path="/customize/:type/:templateId" element={
            <ProtectedRoute requiredRole="user">
              <CustomizePage />
            </ProtectedRoute>
          } />
          <Route path="/customize" element={<Navigate to="/products/basic" replace />} />
          <Route path="/upgrade" element={
            <ProtectedRoute requiredRole="user">
              <UpgradePage />
            </ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute requiredRole="user">
              <PaymentPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute requiredRole="admin">
              <CategoriesManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/templates" element={
            <ProtectedRoute requiredRole="admin">
              <TemplatesManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/reviews" element={
            <ProtectedRoute requiredRole="admin">
              <ReviewsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/payments" element={
            <ProtectedRoute requiredRole="admin">
              <PaymentsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <UsersManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/contact-messages" element={
            <ProtectedRoute requiredRole="admin">
              <ContactMessagesManagement />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  </ThemeProvider>
  );
}
