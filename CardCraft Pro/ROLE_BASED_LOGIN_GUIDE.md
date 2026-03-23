# 🔐 Role-Based Login System Guide

## 🎯 **Overview**
The CardCraft Pro application now features a **role-based authentication system** that directs users to different dashboards based on their role:

- **Admin Role** → Admin Panel with full management capabilities
- **User Role** → User Dashboard with personal features

---

## 🚀 **How to Access Different Panels**

### **1. Start the Development Server**
```bash
cd "e:\AAD\PROJECT\CardCraft Pro"
npm run dev
```

### **2. Open Login Page**
Navigate to: `http://localhost:5173/login`

### **3. Select Role and Login**

#### **🔴 FOR ADMIN PANEL ACCESS:**
- **Role**: Select "Admin"
- **Email**: `admin@cardcraftpro.com`
- **Password**: `admin123`
- **Redirects to**: `/admin/dashboard`

#### **🔵 FOR USER PANEL ACCESS:**

**Regular User:**
- **Role**: Select "User"
- **Email**: `user@example.com`
- **Password**: `user123`
- **Redirects to**: `/home`

**Premium User:**
- **Role**: Select "User"
- **Email**: `premium@example.com`
- **Password**: `premium123`
- **Redirects to**: `/home` (with premium features)

---

## 🎨 **UI Features**

### **Dynamic Login Interface**
- **Role Selector**: Dropdown to choose between User/Admin
- **Dynamic Icons**: Changes based on selected role
- **Color Themes**: Different gradients for User vs Admin
- **Contextual Placeholders**: Email hints change based on role
- **Smart Validation**: Role-specific credential checking

### **Visual Indicators**
- **Admin**: Purple/Pink gradient with Shield icon
- **User**: Blue/Purple gradient with User icon
- **Premium Badge**: Gold crown for premium users

---

## 🏠 **Dashboard Differences**

### **🔴 Admin Panel** (`/admin/dashboard`)
- **Full Management**: Categories, Templates, Reviews, Payments, Users
- **Statistics**: Overview of all platform data
- **PDF Reports**: Download dashboard analytics
- **Admin Navigation**: Sidebar with all admin sections
- **Full CRUD**: Create, edit, delete all resources

### **🔵 User Dashboard** (`/home` or `/dashboard`)
- **Personal Features**: Create cards, view history
- **Account Management**: Profile settings, preferences
- **Premium Status**: Shows subscription status
- **Limited Access**: Only personal data and features
- **User-Focused**: Card creation, downloads, settings

---

## 🔐 **Authentication Flow**

### **Login Process**
1. **Select Role**: User chooses User or Admin
2. **Enter Credentials**: Email and password
3. **Role Validation**: System checks credentials for selected role
4. **Token Storage**: JWT token and user data saved to localStorage
5. **Redirect**: User sent to appropriate dashboard

### **Session Management**
- **Auth Context**: Global authentication state
- **Protected Routes**: Role-based route protection
- **Auto-Redirect**: Wrong role attempts are redirected
- **Logout**: Clears all auth data and returns to login

---

## 🛡️ **Security Features**

### **Route Protection**
```typescript
// Admin-only routes
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>

// User-only routes  
<ProtectedRoute requiredRole="user">
  <UserDashboard />
</ProtectedRoute>
```

### **Role Validation**
- **Admin Credentials**: Hardcoded admin login
- **User Credentials**: Multiple user types (regular/premium)
- **Cross-Role Prevention**: Users can't access admin routes
- **Token Verification**: JWT tokens checked on protected routes

---

## 📱 **Navigation Structure**

### **Admin Navigation**
```
/admin/dashboard     → Main admin overview
/admin/categories    → Manage categories
/admin/templates     → Manage templates  
/admin/reviews       → Manage reviews
/admin/payments      → View payments
/admin/users         → View users
```

### **User Navigation**
```
/home              → Main user homepage
/dashboard          → User dashboard
/products/basic     → Basic card templates
/products/luxury   → Luxury card templates
/customize/:type   → Card customization
/upgrade           → Upgrade to premium
```

---

## 🎯 **Key Differences**

| Feature | Admin Panel | User Panel |
|----------|--------------|------------|
| **Access** | Full platform management | Personal features only |
| **Navigation** | Sidebar with all sections | Simple top navigation |
| **Data View** | All users, payments, etc. | Personal data only |
| **Actions** | CRUD on all resources | Create cards, manage profile |
| **Reports** | PDF downloads available | No reports |
| **Settings** | System-wide settings | Account settings only |

---

## 🔧 **Technical Implementation**

### **Auth Hook** (`/hooks/useAuth.tsx`)
```typescript
const { user, isAuthenticated, isAdmin, isUser, isPremium, login, logout } = useAuth();
```

### **Protected Routes** (`/App.tsx`)
```typescript
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

### **Role Detection**
```typescript
// Automatic role-based redirects
if (role === 'admin') {
  navigate('/admin/dashboard');
} else {
  navigate('/home');
}
```

---

## 🚨 **Important Notes**

### **Demo Credentials**
- **Admin**: `admin@cardcraftpro.com` / `admin123`
- **Regular User**: `user@example.com` / `user123`
- **Premium User**: `premium@example.com` / `premium123`

### **Browser Storage**
- **authToken**: JWT authentication token
- **userRole**: 'admin' or 'user'
- **currentUser**: User object with details
- **premiumPaymentCompleted**: Premium status flag

### **Security**
- **Role Isolation**: Admin and user sections completely separate
- **Token Validation**: All protected routes check auth
- **Auto-Logout**: Invalid tokens clear session
- **Cross-Role Blocking**: Users can't access admin routes

---

## 🎉 **Summary**

The role-based login system provides:

✅ **Separate Experiences**: Admin vs User dashboards
✅ **Secure Access**: Role-based route protection  
✅ **Easy Switching**: Role selector on login
✅ **Visual Feedback**: Dynamic UI based on role
✅ **Full Features**: Complete functionality for both roles
✅ **Demo Ready**: Multiple test accounts available

**Choose your role and experience the appropriate interface! 🎯**
