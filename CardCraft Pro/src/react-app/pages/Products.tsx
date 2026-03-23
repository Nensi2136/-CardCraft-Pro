import { useParams } from "react-router";
import { useState, useEffect, useCallback } from "react";
import Layout from "@/react-app/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { Input } from "@/react-app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { Lock, CheckCircle, Crown, Search, Grid, List, Clock } from "lucide-react";
import { Link } from "react-router";
import { apiService } from "@/react-app/services/api";
import { useApi } from "@/react-app/hooks/useApi";
import { getImageUrl as getSupabaseImageUrl } from "@/react-app/lib/supabase";
import { motion } from "framer-motion";
import { Card3D } from "@/react-app/components/ui/3d-card";

// Get base URL for image serving
const getBaseUrl = () => {
  const isDevelopment = import.meta.env.DEV;
  return isDevelopment ? 'http://localhost:5021' : '';
};

// Function to get correct image URL (same as admin panel)
const getLocalImageUrl = (imagePath: string, isPreview: boolean = false): string | null => {
  if (!imagePath) return null;
  
  // For preview, allow blob URLs
  if (isPreview && imagePath.startsWith('blob:')) {
    return imagePath;
  }
  
  // Fix double templates/ prefix issue - multiple patterns
  if (imagePath.includes('templates//templates/')) {
    imagePath = imagePath.replace('templates//templates/', 'templates/');
  }
  if (imagePath.includes('/templates//templates/')) {
    imagePath = imagePath.replace('/templates//templates/', '/templates/');
  }
  
  // For Supabase images (check if it's a UUID-like filename or default template)
  if (imagePath.includes('-') || imagePath === 'default-template.png' || (imagePath && imagePath.match(/^[a-zA-Z0-9_]+\.jpeg$/))) {
    // Extract filename and ensure it has the correct extension
    let filename = imagePath.split('/').pop() || imagePath;
    
    // If filename doesn't have an extension, try common ones
    if (!filename.includes('.')) {
      // Try .jpeg first (most common for uploaded images)
      filename = `${filename}.jpeg`;
    }
    
    const supabaseUrl = getSupabaseImageUrl(filename);
    console.log('Supabase UUID image - Original:', imagePath, 'Final filename:', filename, 'Final URL:', supabaseUrl);
    return supabaseUrl;
  }
  
  // For images that have templates/ prefix, remove it for Supabase (since they're stored at root)
  if (imagePath.startsWith('templates/')) {
    let filename = imagePath.replace('templates/', '');
    
    // If filename doesn't have an extension, try common ones
    if (!filename.includes('.')) {
      filename = `${filename}.jpeg`;
    }
    
    const supabaseUrl = getSupabaseImageUrl(filename);
    console.log('Templates prefix image - Original:', imagePath, 'Filename:', filename, 'Final URL:', supabaseUrl);
    return supabaseUrl;
  }
  
  // For display in template list, never return blob URLs
  if (imagePath.startsWith('blob:')) {
    // Map known blob URLs to actual server URLs using actual filenames
    const blobToServerMap: { [key: string]: string } = {
      'blob:http://localhost:5173/f7a4a9aa-5d4a-4ae4-bde7-d41dc468bd1d': '59cc1f39-e028-4bcf-bf2a-9db1bfd8d783.jpeg',
      'blob:http://localhost:5173/58e4b01e-472d-4f0f-9b7e-bdaec695ca5c': '5634678f-9900-4334-b382-01b8a0904485.jpeg',
      'blob:http://localhost:5173/26445a16-c289-43fa-a812-b3afce634030': '3c16d432-ede9-4337-8288-c4e0f7cb940a.jpeg'
    };
    
    const serverPath = blobToServerMap[imagePath];
    if (serverPath) {
      return getLocalImageUrl(serverPath, false);
    }
    
    return null; // Return null for unknown blob URLs
  }
  
  // Check for API endpoints first (most specific)
  if (imagePath.startsWith('/api/')) {
    return `${getBaseUrl()}${imagePath}`;
  }
  
  // For local development images
  if (imagePath.startsWith('http://localhost:')) {
    // Already a shared-images path - return as-is
    return imagePath;
  }
  
  // If it's just a filename, assume it's in the templates folder
  if (!imagePath.startsWith('/') && !imagePath.startsWith('http')) {
    return `/templates/${imagePath}`;
  }
  
  // Otherwise, assume it's a relative path and add base URL
  return `${getBaseUrl()}${imagePath}`;
};

// Helper function to get correct image URL for template display
const getImageUrl = (template: any): string | null => {
  if (!template) return null;
  
  // Use ImageUrl if available, otherwise fallback to File_Path
  let imagePath = template.ImageUrl || template.File_Path;
  
  if (!imagePath) return null;
  
  // Use the same logic as admin panel
  return getLocalImageUrl(imagePath);
};

export default function ProductsPage() {
  const { type } = useParams<{ type: "basic" | "luxury" }>();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const isLuxury = type === "luxury";

  // Fetch categories
  const { data: categoriesData } = useApi(
    () => apiService.cards.getCategories(),
    []
  );

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all templates from API Gateway
      const result = await apiService.cards.getTemplates();
      
      if (result.success && result.data) {
        // Transform template data to match expected structure (same as admin panel)
        const rawTemplates = (result.data as unknown[]).map((template: unknown) => {
          const templateObj = template as Record<string, unknown>;
          const filePath = (templateObj.filePath as string) || (templateObj.templateData as string) || '';
          
          console.log('Template data - filePath:', filePath, 'templateData:', templateObj.templateData);
          
          // For Supabase images, use the filename directly (no templates/ prefix)
          // Images are stored at root level in Supabase, not in templates/ folder
          let imageUrl = filePath;
          
          // Remove templates/ prefix if it exists (for Supabase images)
          if (filePath && filePath.startsWith('templates/')) {
            imageUrl = filePath.replace('templates/', '');
            console.log('Removed templates/ prefix for Supabase file:', imageUrl);
          }
          // Only add templates/ prefix for old local files (not Supabase UUIDs, default template, or uploaded images)
          else if (filePath && !filePath.includes('-') && filePath !== 'default-template.png' && !filePath.match(/^[a-zA-Z0-9_]+\.jpeg$/) && !filePath.startsWith('http')) {
            imageUrl = `templates/${filePath}`;
            console.log('Added templates/ prefix for local file:', imageUrl);
          } else {
            console.log('Using original path for Supabase file (stored at root):', imageUrl);
          }
          
          return {
            Template_Id: (templateObj.id as number) || 0,
            Category_Id: (templateObj.categoryId as number) || 0,
            Title: (templateObj.title as string) || (templateObj.name as string) || '',
            Card_Template_Description: (templateObj.description as string) || '',
            File_Path: filePath,
            ImageUrl: imageUrl, // Use the corrected path for Supabase images
            Is_premium: (templateObj.isPremium as boolean) || false,
            Created_at: (templateObj.createdAt as string) || '',
            Updated_at: (templateObj.updatedAt as string) || ''
          };
        });
        
        // Filter templates based on type and premium status
        const filteredTemplates = rawTemplates.filter((template: any) => {
          if (isLuxury) {
            // Show only premium templates for luxury
            return template.Is_premium === true;
          } else {
            // Show only free templates for basic
            return template.Is_premium === false;
          }
        });
        setTemplates(filteredTemplates);
      } else {
        console.error('Failed to fetch templates:', result.message);
        setTemplates([]);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, [isLuxury]);

  // Filter and sort templates
  const filteredAndSortedTemplates = templates
    .filter(template => {
      const matchesSearch = template.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.Card_Template_Description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || 
                             template.Category_Id?.toString() === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.Created_at).getTime() - new Date(a.Created_at).getTime();
        case "oldest":
          return new Date(a.Created_at).getTime() - new Date(b.Created_at).getTime();
        case "name":
          return a.Title.localeCompare(b.Title);
        default:
          return 0;
      }
    });

  useEffect(() => {
    // Check if user has premium payment
    const paymentCompleted = localStorage.getItem('premiumPaymentCompleted') === 'true';
    setIsPremiumUser(paymentCompleted);
    
    // Fetch templates from API
    fetchTemplates();
  }, [type, fetchTemplates]);

  useEffect(() => {
    // Set categories when data is available
    if (categoriesData && Array.isArray(categoriesData)) {
      const transformedCategories = (categoriesData as unknown[]).map((cat: unknown) => {
        const catObj = cat as Record<string, unknown>;
        return {
          category_Id: (catObj.category_Id as number) || 0,
          category_Name: (catObj.category_Name as string) || '',
          templateCount: 0 // Default value, can be updated later
        };
      });
      setCategories(transformedCategories);
    }
  }, [categoriesData]);

  
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {isLuxury ? "Luxury" : "Basic"} Business Cards
            </h1>
            <motion.p 
              className="text-base sm:text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {isLuxury
                ? "Premium templates with image backgrounds and advanced features"
                : "Simple and professional designs with customizable colors"}
            </motion.p>
          </motion.div>

          
          {/* Premium Status Banner */}
          {isLuxury && !isPremiumUser && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="mb-8 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 text-foreground">Premium Feature</h3>
                    <p className="text-muted-foreground">
                      Luxury cards require a premium subscription. Upgrade now to unlock advanced customization.
                    </p>
                  </div>
                  <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <Link to="/upgrade">Upgrade</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isLuxury && isPremiumUser && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="mb-8 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 text-green-800 dark:text-green-200">Premium Unlocked</h3>
                    <p className="text-green-700 dark:text-green-300">
                      You have full access to all luxury card templates and premium features!
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Filters and Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="mb-8 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-2 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="w-full lg:w-48">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.category_Id} value={category.category_Id.toString()}>
                            {category.category_Name} ({category.templateCount || 0})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort */}
                  <div className="w-full lg:w-48">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode */}
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || selectedCategory !== "all") && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {searchTerm && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {searchTerm}
                      <button
                        onClick={() => setSearchTerm("")}
                        className="ml-1 hover:bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Category: {categories.find(c => c.category_Id.toString() === selectedCategory)?.category_Name}
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className="ml-1 hover:bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          </motion.div>

          {/* Templates Grid/List */}
          {loading ? (
            <motion.div 
              className="flex items-center justify-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-2 border-t-transparent"></div>
                <span className="text-muted-foreground animate-pulse">Loading beautiful templates...</span>
              </div>
            </motion.div>
          ) : filteredAndSortedTemplates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {searchTerm || selectedCategory !== "all" ? "No templates found" : "No templates available"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {searchTerm || selectedCategory !== "all" 
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : (isLuxury 
                          ? "No premium templates available. Upgrade to unlock luxury designs!" 
                          : "No free templates available.")
                    }
                  </p>
                  {(searchTerm || selectedCategory !== "all") && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                      }}
                      className="border-2 hover:bg-accent transition-all duration-200"
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              className={viewMode === "grid" 
                ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-4"
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {filteredAndSortedTemplates.map((template: any, index: number) => (
                <motion.div
                  key={template.Template_Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                >
                  <Card3D className="group">
                    {viewMode === "grid" ? (
                    <>
                      <CardHeader className="p-4">
                        <div className="aspect-[3.5/2] rounded-xl mb-4 overflow-hidden bg-muted relative">
                          {getImageUrl(template) ? (
                            <img 
                              src={getImageUrl(template) || undefined} 
                              alt={template.Title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.className = `aspect-[3.5/2] rounded-xl mb-4 ${
                                    template.Is_premium 
                                      ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                                      : 'bg-gradient-to-br from-primary to-blue-600'
                                  }`;
                                }
                              }}
                            />
                          ) : (
                            <div className={`w-full h-full ${
                              template.Is_premium 
                                ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                                : 'bg-gradient-to-br from-primary to-blue-600'
                            }`} />
                          )}
                          {template.Is_premium && (
                            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-none shadow-lg">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{template.Title}</CardTitle>
                        <CardDescription className="line-clamp-2 text-muted-foreground">
                          {template.Card_Template_Description || 'Professional design'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="text-xs border-muted-foreground/20">
                            {categories.find(c => c.category_Id === template.Category_Id)?.category_Name || 'Uncategorized'}
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(template.Created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Button asChild className="w-full shadow-md hover:shadow-lg transition-all duration-200">
                          <Link to={`/customize/${type}/${template.Template_Id}`}>
                            {template.Is_premium ? (
                              <>
                                <Crown className="w-4 h-4 mr-2" />
                                Customize Premium
                              </>
                            ) : (
                              'Customize This Card'
                            )}
                          </Link>
                        </Button>
                      </CardContent>
                    </>
                  ) : (
                    // List View
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                          {getImageUrl(template) ? (
                            <img 
                              src={getImageUrl(template) || undefined} 
                              alt={template.Title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.className = `w-24 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 ${
                                    template.Is_premium 
                                      ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                                      : 'bg-gradient-to-br from-primary to-blue-600'
                                  }`;
                                }
                              }}
                            />
                          ) : (
                            <div className={`w-full h-full ${
                              template.Is_premium 
                                ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                                : 'bg-gradient-to-br from-primary to-blue-600'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{template.Title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {template.Card_Template_Description || 'Professional design'}
                              </p>
                            </div>
                            {template.Is_premium && (
                              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-none shadow-lg ml-2">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs border-muted-foreground/20">
                                {categories.find(c => c.category_Id === template.Category_Id)?.category_Name || 'Uncategorized'}
                              </Badge>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(template.Created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <Button asChild size="sm" className="shadow-md hover:shadow-lg transition-all duration-200">
                              <Link to={`/customize/${type}/${template.Template_Id}`}>
                                {template.Is_premium ? (
                                  <>
                                    <Crown className="w-3 h-3 mr-1" />
                                    Customize
                                  </>
                                ) : (
                                  'Customize'
                                )}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                  </Card3D>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
