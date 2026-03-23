import { useState } from "react";
import Layout from "@/react-app/components/Layout";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Clock, MessageSquare, Users } from "lucide-react";
import { apiService } from "@/react-app/services/api";
import { motion } from "framer-motion";
import { Card3D } from "@/react-app/components/ui/3d-card";
import { HeroText } from "@/react-app/components/ui/hero-text";
import { BackgroundGrid } from "@/react-app/components/ui/background-grid";
import { Badge } from "@/react-app/components/ui/badge";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage("");

    try {
      const response = await apiService.contact.submitContactForm(formData);
      
      if (response.success) {
        setSubmitStatus('success');
        // Reset form on success
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(response.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <BackgroundGrid />
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroText 
            text="Get In Touch" 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
          />
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Have questions? We'd love to hear from you. Our team is ready to help you create stunning business cards.
          </motion.p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card3D>
            <CardContent className="p-8 text-center">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Mail className="w-8 h-8 text-blue-600" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-4">Get in touch via email</p>
              <a href="mailto:support@cardcraftpro.com" className="text-primary hover:underline">
                support@cardcraftpro.com
              </a>
            </CardContent>
          </Card3D>

          <Card3D>
            <CardContent className="p-8 text-center">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-purple-500/10 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Phone className="w-8 h-8 text-purple-600" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Call Us</h3>
              <p className="text-muted-foreground mb-4">Mon-Fri: 9AM-6PM EST</p>
              <a href="tel:+15551234567" className="text-primary hover:underline">
                +1 (555) 123-4567
              </a>
            </CardContent>
          </Card3D>

          <Card3D>
            <CardContent className="p-8 text-center">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-pink-500/10 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <MapPin className="w-8 h-8 text-pink-600" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Visit Us</h3>
              <p className="text-muted-foreground">
                123 Business St<br />
                Suite 100<br />
                San Francisco, CA 94102
              </p>
            </CardContent>
          </Card3D>
        </motion.div>

        {/* Contact Form and Image Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card3D>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Send us a message</CardTitle>
                <CardDescription className="text-lg">
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                    >
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="border-2 focus:border-primary transition-colors"
                      />
                    </motion.div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="border-2 focus:border-primary transition-colors"
                      />
                    </motion.div>
                  </div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                  >
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="border-2 focus:border-primary transition-colors"
                    />
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your project or questions..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="border-2 focus:border-primary transition-colors resize-none"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                  >
                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <motion.div 
                      className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <p className="text-green-800 font-medium">Message sent successfully! We'll get back to you soon.</p>
                    </motion.div>
                  )}

                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <motion.div 
                      className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      <p className="text-red-800 font-medium">{errorMessage}</p>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card3D>
          </motion.div>

          {/* Image and Stats Section */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="space-y-8"
          >
            {/* Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-3xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop" 
                alt="Customer support team"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card3D>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-2xl font-bold">24h</h3>
                  <p className="text-muted-foreground text-sm">Response Time</p>
                </CardContent>
              </Card3D>
              <Card3D>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-2xl font-bold">50K+</h3>
                  <p className="text-muted-foreground text-sm">Happy Customers</p>
                </CardContent>
              </Card3D>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
