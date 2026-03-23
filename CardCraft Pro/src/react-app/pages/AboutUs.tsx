import Layout from "@/react-app/components/Layout";
import { Card, CardContent } from "@/react-app/components/ui/card";
import { Users, Target, Zap, Award, Globe, Heart, ArrowRight, Mail, Phone, MapPin, Star, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Card3D } from "@/react-app/components/ui/3d-card";
import { HeroText } from "@/react-app/components/ui/hero-text";
import { BackgroundGrid } from "@/react-app/components/ui/background-grid";
import { Button } from "@/react-app/components/ui/button";
import { Link } from "react-router";
import { Badge } from "@/react-app/components/ui/badge";

export default function AboutUsPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c5ca?w=400&h=400&fit=crop&crop=face",
      bio: "Visionary leader with 10+ years in design technology"
    },
    {
      name: "Michael Chen",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Award-winning designer passionate about user experience"
    },
    {
      name: "Emily Rodriguez",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Tech innovator building scalable solutions"
    },
    {
      name: "David Kim",
      role: "Head of Marketing",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
      bio: "Growth strategist with proven track record"
    }
  ];

  const features = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Professional Templates",
      description: "200+ industry-specific designs crafted by experts"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Easy Customization",
      description: "Intuitive drag-and-drop editor with real-time preview"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "High-Quality Output",
      description: "Print-ready PDFs with premium resolution"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Fast Delivery",
      description: "Download your cards instantly after customization"
    }
  ];

  return (
    <Layout>
      <BackgroundGrid />
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Hero Section with Image */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 items-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="order-2 lg:order-1">
            <HeroText 
              text="About CardCraft Pro" 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            />
            <motion.p 
              className="text-xl text-muted-foreground mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Your trusted partner in professional business card design. We're revolutionizing how professionals create stunning business cards that make lasting impressions.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 mr-4">
                <Link to="/products/basic">
                  Start Creating
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 hover:bg-accent transition-all duration-200">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </motion.div>
          </div>
          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-3xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop" 
                alt="Professional business cards"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            { value: "50K+", label: "Happy Customers", color: "from-blue-600 to-blue-700" },
            { value: "200+", label: "Professional Templates", color: "from-purple-600 to-purple-700" },
            { value: "99%", label: "Customer Satisfaction", color: "from-pink-600 to-pink-700" },
            { value: "150+", label: "Countries Served", color: "from-green-600 to-green-700" }
          ].map((stat, index) => (
            <Card3D key={index}>
              <CardContent className="p-8 text-center">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Users className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card3D>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Why Choose CardCraft Pro?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.1 + (index * 0.1) }}
                whileHover={{ scale: 1.05 }}
              >
                <Card3D>
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary/20"
                      />
                      <div className="absolute bottom-0 right-1/2 translate-x-12 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <Badge className="mb-3 bg-gradient-to-r from-primary to-purple-600 text-white border-none">
                      {member.role}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                    <div className="flex justify-center gap-2 mt-4">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                        <Phone className="w-4 h-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Our Story Section with Image */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 items-center mb-20"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <div>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Our Story</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                CardCraft Pro was born from a simple idea: making professional business card design accessible to everyone. We understand that first impressions matter, and a well-designed business card can open doors to new opportunities.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
              >
                Founded in 2020, we've helped over 50,000 professionals create stunning business cards that represent their brand perfectly. Our platform combines ease of use with powerful customization tools.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
                Whether you're a freelancer, small business owner, or corporate professional, we have the perfect solution for you.
              </motion.p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl transform -rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop" 
                alt="Office workspace"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Testimonials */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Thompson",
                role: "Marketing Director",
                content: "CardCraft Pro transformed how we create business cards. The templates are professional and the customization options are incredible.",
                rating: 5
              },
              {
                name: "Jessica Lee",
                role: "Freelance Designer",
                content: "As a designer, I appreciate the attention to detail. My clients love their new business cards!",
                rating: 5
              },
              {
                name: "Robert Chen",
                role: "CEO, TechStart",
                content: "The quality is outstanding and the process is so simple. Highly recommend for any business.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.7 + (index * 0.1) }}
                whileHover={{ scale: 1.05 }}
              >
                <Card3D>
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full"></div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <Card3D>
            <CardContent className="p-12 text-center bg-gradient-to-br from-primary/5 to-purple-600/5">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who trust CardCraft Pro for their business card needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  <Link to="/products/basic">
                    Get Started Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 hover:bg-accent transition-all duration-200">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card3D>
        </motion.div>
      </div>
    </Layout>
  );
}
