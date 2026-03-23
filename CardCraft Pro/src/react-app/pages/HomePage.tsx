import Layout from "@/react-app/components/Layout";
import { Button } from "@/react-app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { CreditCard, Palette, Download, Crown, ArrowRight, Star, CheckCircle, Zap, Users } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Card3D } from "@/react-app/components/ui/3d-card";
import { HeroText } from "@/react-app/components/ui/hero-text";
import { BackgroundGrid } from "@/react-app/components/ui/background-grid";
import { FloatingParticles } from "@/react-app/components/ui/floating-particles";
import { Badge } from "@/react-app/components/ui/badge";

export default function HomePage() {
  const showcaseItems = [
    {
      title: "Professional Design",
      description: "Clean and modern business card layouts",
      icon: "🎯",
      color: "from-indigo-500 to-purple-600"
    },
    {
      title: "Quick Customization",
      description: "Edit and personalize in minutes",
      icon: "⚡",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Premium Quality",
      description: "High-resolution print-ready files",
      icon: "💎",
      color: "from-emerald-500 to-teal-600"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      features: ["10 Basic Templates", "PDF Download", "Standard Quality"],
      color: "border-gray-300",
      buttonColor: "bg-gray-600 hover:bg-gray-700"
    },
    {
      name: "Professional",
      price: "$9.99",
      period: "/month",
      features: ["200+ Templates", "Premium Designs", "High Resolution", "Custom Colors", "Logo Upload"],
      color: "border-blue-500",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$29.99",
      period: "/month",
      features: ["Unlimited Templates", "Custom Designs", "Priority Support", "Team Collaboration", "API Access"],
      color: "border-purple-500",
      buttonColor: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  return (
    <Layout>
      <BackgroundGrid />
      <FloatingParticles />
      <div className="relative z-10">
        {/* Modern Hero Section */}
        <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mb-6 border border-purple-500/30">
                  <span className="text-purple-300 text-sm font-medium">✨ Trusted by 50,000+ professionals</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  Create Business Cards That
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Make an Impact</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Design stunning professional business cards in minutes. No design experience needed - just your creativity.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg shadow-xl">
                    <Link to="/products/basic">
                      Start Creating Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                    View Examples
                  </Button>
                </div>
                <div className="flex items-center gap-8 text-gray-400">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                    <span className="ml-2">4.9/5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>50K+ Users</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/7654117/pexels-photo-7654117.jpeg"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-8">
                      <div className="text-center">
                        <div className="text-4xl mb-2"></div>
                        <p className="text-white text-lg font-semibold"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Showcase Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Why Professionals Choose CardCraft Pro
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need to create impressive business cards that represent your brand perfectly
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {showcaseItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + (index * 0.1) }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-background to-muted border border-border hover:border-muted-foreground/20 transition-all duration-300">
                    <div className="mb-6">
                      <img 
                        src={`/images/${index === 0 ? 'professional-design.jpg' : index === 1 ? 'quick-customization.png' : 'premium-quality.png'}`}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-xl mb-4"
                      />
                      <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto text-3xl group-hover:scale-110 transition-transform duration-300`}>
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-lg">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose the perfect plan for your business needs
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + (index * 0.1) }}
                  whileHover={{ y: -10 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <div className={`p-8 rounded-2xl bg-card border-2 ${plan.color} hover:shadow-xl transition-all duration-300 ${plan.popular ? 'shadow-lg' : ''}`}>
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                        {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                      </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-foreground">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${plan.buttonColor} text-white py-3 text-lg`}>
                      Get Started
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-900 to-pink-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Create Your Perfect Business Card?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Join thousands of professionals who trust CardCraft Pro for their business card needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  Start Creating Free
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                  Schedule Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
