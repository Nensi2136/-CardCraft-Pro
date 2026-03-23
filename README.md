# 🎴 CardCraft Pro

**Professional Business Card Design & Management Platform**

A comprehensive web application for creating, customizing, and managing professional business cards with role-based access control, payment integration, and cloud storage.

---

## ✨ Features

### 🎨 **Card Design & Customization**
- Multiple card templates (Basic, Luxury, Premium)
- Real-time card customization with live preview
- Text editing, font selection, and color customization
- Image upload and logo integration via Supabase storage
- Export functionality for high-quality printing

### 👥 **User Management**
- Role-based authentication (User/Admin)
- Secure login and registration system
- User profiles and dashboard
- Contact management

### 💳 **Payment Integration**
- Stripe payment processing
- Tiered pricing plans (Basic, Premium, Enterprise)
- Payment history and invoice management
- Upgrade and subscription management

### 🛠️ **Admin Panel**
- Template management (CRUD operations)
- Category organization
- User management and analytics
- Review management
- Payment tracking and reporting
- Contact message management

### ☁️ **Cloud Infrastructure**
- Supabase for image storage and database
- Cloudflare Workers for API deployment
- Responsive design with Tailwind CSS
- Modern React 19 with TypeScript

---

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library
- **React Router** - Navigation
- **Recharts** - Data visualization

### Backend & Storage
- **Supabase** - Database and image storage
- **Cloudflare Workers** - Serverless API
- **Hono** - Web framework for Workers
- **Zod** - Schema validation

### Development Tools
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Wrangler** - Cloudflare deployment

---

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd CardCraft-Pro
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

Configure your environment variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run knip` - Check for unused dependencies
- `npm run check` - Full build and deployment check
- `npm run cf-typegen` - Generate Cloudflare types

---

## 🏗️ Project Structure

```
src/
├── react-app/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (Auth, Theme)
│   ├── lib/           # Utilities and configurations
│   ├── pages/         # Page components
│   │   ├── admin/     # Admin panel pages
│   │   └── ...        # User-facing pages
│   └── types/         # TypeScript definitions
├── worker/            # Cloudflare Worker API
└── styles/            # Global styles and themes
```

---

## 🔐 Authentication & Roles

### User Roles
- **User**: Access to card creation, customization, and personal dashboard
- **Admin**: Full access to admin panel and system management

### Protected Routes
All sensitive routes are protected with role-based access control using React Context and custom route guards.

---

## 💾 Storage & Database

### Supabase Integration
- **Image Storage**: Templates and user uploads stored in `templates/` bucket
- **Database**: User data, templates, categories, and transactions
- **Real-time Updates**: Live synchronization across components

---

## 🚀 Deployment

### Cloudflare Workers Deployment
```bash
npm run build
wrangler deploy
```

### Environment Variables for Production
Configure production environment variables in Cloudflare Workers dashboard or `.env` file.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

Need help or want to join the community?
- Join our [Discord](https://discord.gg/shDEGBSe2d)
- Created with [Mocha](https://getmocha.com)

---

## 🎯 Key Features Highlight

- **🎨 Professional Templates**: Multiple professionally designed card templates
- **⚡ Real-time Editing**: Live preview of changes as you design
- **☁️ Cloud Storage**: Reliable image storage with Supabase
- **💰 Payment Processing**: Integrated Stripe payment system
- **📱 Responsive Design**: Works seamlessly on all devices
- **🔒 Secure Authentication**: Role-based access control
- **📊 Analytics Dashboard**: Comprehensive admin analytics
- **🖨️ Export Ready**: High-quality output for printing
