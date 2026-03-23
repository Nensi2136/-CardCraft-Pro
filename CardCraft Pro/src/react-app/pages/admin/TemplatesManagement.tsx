import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import AdminLayout from "@/react-app/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { Badge } from "@/react-app/components/ui/badge";
import { Plus, Edit, Trash2, ArrowLeft, Save, X, Upload, Image as ImageIcon } from "lucide-react";
import { apiService } from "@/react-app/services/api";
import { uploadImage, getImageUrl } from "@/react-app/lib/supabase";

// Get base URL for image serving
const getBaseUrl = () => {
  const isDevelopment = import.meta.env.DEV;
  return isDevelopment ? 'http://localhost:5021' : '';
};

// Function to get correct image URL
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
    
    const supabaseUrl = getImageUrl(filename);
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
    
    const supabaseUrl = getImageUrl(filename);
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

interface Template {
  Template_Id: number;
  Category_Id: number;
  Title: string;
  Card_Template_Description: string;
  File_Path: string;
  ImageUrl: string;
  Is_premium: boolean;
  Created_at: string;
  Updated_at: string;
}

interface Category {
  id: string;
  name: string;
  category_Id: number; // Add numeric ID for validation
}

export default function TemplatesManagement() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [uploading, setUploading] = useState(false);
  const [blobUrls, setBlobUrls] = useState<string[]>([]); // Track blob URLs for cleanup
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    isPremium: false,
    imageUrl: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchData();
  }, []);

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      blobUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [blobUrls]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('=== FETCHING DATA START ===');
      
      // Fetch real data from API Gateway
      const [categoriesResult, templatesResult] = await Promise.all([
        apiService.cards.getCategories(),
        apiService.cards.getTemplates()
      ]);
      
      console.log('Categories API result:', categoriesResult);
      console.log('Templates API result:', templatesResult);
      
      if (categoriesResult.success && categoriesResult.data) {
        console.log('Raw categories data from API:', categoriesResult.data);
        console.log('Categories data type:', typeof categoriesResult.data);
        console.log('Categories data length:', Array.isArray(categoriesResult.data) ? categoriesResult.data.length : 'Not an array');
        
        // Log each category to see the structure
        if (Array.isArray(categoriesResult.data)) {
          categoriesResult.data.forEach((cat, index) => {
            console.log(`Raw category ${index}:`, cat);
          });
        }
        
        const transformedCategories = (categoriesResult.data as unknown[]).map((cat: unknown) => {
          const catObj = cat as Record<string, unknown>;
          const category_Id = (catObj.category_Id as number) || 0;
          const transformed = {
            id: category_Id.toString(), // String version for Select component
            name: (catObj.category_Name as string) || '',
            category_Id: category_Id // Numeric version for API
          };
          console.log('Transforming category:', catObj, '->', transformed);
          return transformed;
        });
        console.log('Final transformed categories:', transformedCategories);
        console.log('=== CATEGORY ANALYSIS ===');
        console.log('Total categories loaded:', transformedCategories.length);
        transformedCategories.forEach((cat, index) => {
          console.log(`Category ${index + 1}:`, {
            id: cat.id,
            category_Id: cat.category_Id,
            name: cat.name
          });
        });
        setCategories(transformedCategories);
      } else {
        console.error('Categories API failed:', categoriesResult);
        console.log('Categories result details:', categoriesResult);
      }
      
      if (templatesResult.success && templatesResult.data) {
        const transformedTemplates = (templatesResult.data as unknown[]).map((template: unknown) => {
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
        console.log('Templates loaded:', templates.length);
        console.log('Sample template data:', templates[0]);
        
        setTemplates(transformedTemplates);
      } else {
        console.error('Templates API failed:', templatesResult);
      }
      
      if (!categoriesResult.success || !templatesResult.success) {
        console.error('Failed to fetch data:', {
          categories: categoriesResult.message,
          templates: templatesResult.message
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setCategories([]);
      setTemplates([]);
    } finally {
      setLoading(false);
      console.log('=== FETCHING DATA END ===');
      console.log('Final state:', {
        categoriesCount: categories.length,
        templatesCount: templates.length,
        loading: false
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    console.log('=== VALIDATION DEBUG START ===');
    console.log('Form data for validation:', formData);
    console.log('Available categories:', categories);
    
    // Check if categories are loaded
    if (categories.length === 0) {
      newErrors.categoryId = "No categories available. Please refresh the page or add a category first.";
      console.log('❌ Categories validation failed: no categories loaded');
      setErrors(newErrors);
      return false;
    }
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Template name is required";
      console.log('❌ Name validation failed: empty');
    } else {
      console.log('✅ Name validation passed:', formData.name);
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      console.log('❌ Description validation failed: empty');
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters long";
      console.log('❌ Description validation failed: too short', formData.description.length);
    } else {
      console.log('✅ Description validation passed:', formData.description.length, 'characters');
    }
    
    // Category validation
    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
      console.log('❌ Category validation failed: no category selected');
    } else {
      const parsedId = parseInt(formData.categoryId);
      const categoryExists = categories.some(cat => cat.category_Id === parsedId);
      
      console.log('Category validation details:', {
        selectedId: formData.categoryId,
        parsedId: parsedId,
        availableCategories: categories.map(cat => ({ id: cat.id, category_Id: cat.category_Id, name: cat.name })),
        categoryExists: categoryExists
      });
      
      if (!categoryExists || isNaN(parsedId)) {
        newErrors.categoryId = "Selected category is invalid";
        console.log('❌ Category validation failed: category not found or invalid ID');
      } else {
        console.log('✅ Category validation passed');
      }
    }
    
    // Image validation (only for new templates)
    if (!formData.imageUrl && !editingTemplate) {
      newErrors.imageUrl = "Template image is required";
      console.log('❌ Image validation failed: no image for new template');
    } else {
      console.log('✅ Image validation passed:', formData.imageUrl ? 'has image' : 'editing existing template');
    }
    
    console.log('Final validation errors:', newErrors);
    console.log('=== VALIDATION DEBUG END ===');
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Validation result:', isValid ? '✅ PASSED' : '❌ FAILED');
    
    return isValid;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    
    try {
      // Clean up existing blob URLs
      blobUrls.forEach(url => URL.revokeObjectURL(url));
      setBlobUrls([]);
      
      // Upload to Supabase (store at root level, not in templates folder)
      const { data, error } = await uploadImage(file, '');
      
      if (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload image. Please try again.');
        return;
      }
      
      if (data) {
        const supabaseUrl = getImageUrl(data.path);
        console.log('📤 Image uploaded to Supabase:');
        console.log('- Original filename:', file.name);
        console.log('- Supabase path:', data.path);
        console.log('- Full URL:', supabaseUrl);
        console.log('- Setting formData.imageUrl to:', data.path);
        
        setFormData({ ...formData, imageUrl: data.path });
        
        // Create preview URL for immediate display
        const previewUrl = URL.createObjectURL(file);
        setBlobUrls([previewUrl]);
      }
      
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== HANDLE SUBMIT STARTED ===');
    console.log('Form data:', formData);
    console.log('Editing template:', editingTemplate);
    console.log('=== END HANDLE SUBMIT START ===');
    
    if (!validateForm()) {
      console.log('VALIDATION FAILED');
      return;
    }
    
    console.log('VALIDATION PASSED');

    try {
      if (editingTemplate) {
        console.log('=== UPDATE DEBUG START ===');
        console.log('Editing template ID:', editingTemplate.Template_Id);
        console.log('Editing template data:', editingTemplate);
        console.log('Current template Category_Id:', editingTemplate.Category_Id);
        
        // Check if the current template has an invalid Category_Id
        const currentCategoryExists = categories.some(cat => cat.category_Id === editingTemplate.Category_Id);
        console.log('Current template category exists:', currentCategoryExists);
        console.log('Available category IDs:', categories.map(cat => cat.category_Id));
        
        // CRITICAL FIX: Always use a valid category ID
        let finalCategoryId: number;
        
        if (formData.categoryId) {
          const parsedId = parseInt(formData.categoryId);
          const selectedCategory = categories.find(cat => cat.category_Id === parsedId);
          
          if (selectedCategory) {
            finalCategoryId = selectedCategory.category_Id;
            console.log('✅ Using selected category:', finalCategoryId);
          } else {
            // Fallback to existing template's category or first available category
            finalCategoryId = editingTemplate.Category_Id || categories[0]?.category_Id || 1;
            console.warn('⚠️ Selected category invalid, using fallback:', finalCategoryId);
          }
        } else {
          // No category selected, use existing or first available
          finalCategoryId = editingTemplate.Category_Id || categories[0]?.category_Id || 1;
          console.warn('⚠️ No category selected, using fallback:', finalCategoryId);
        }
        
        console.log('Final category ID to use:', finalCategoryId);
        console.log('Available categories:', categories.map(cat => ({ id: cat.id, category_Id: cat.category_Id, name: cat.name })));
        
        // CRITICAL: Double-check the final category ID exists
        const categoryExists = categories.some(cat => cat.category_Id === finalCategoryId);
        console.log('Does final category ID exist in database?', categoryExists);
        
        if (!categoryExists) {
          console.error('❌ CRITICAL ERROR: Final category ID does not exist in database!');
          console.error('This will cause the foreign key constraint error!');
          console.error('Available category IDs:', categories.map(cat => cat.category_Id));
          console.error('Attempting to use ID:', finalCategoryId);
          
          // Try to find any valid category ID
          if (categories.length > 0) {
            finalCategoryId = categories[0].category_Id;
            console.warn('🚨 Emergency fallback to first available category:', finalCategoryId);
          } else {
            console.error('🚨 No categories available! This will definitely fail.');
            alert('Error: No categories available. Please add a category first.');
            return;
          }
        }
        
        // Prepare update data with proper database field names
        // Use CategoryId (camelCase) to match backend DTO
        const updateData = {
          Title: formData.name,
          Card_Template_Description: formData.description,
          CategoryId: categories.length > 0 ? categories[0].category_Id : 1, // Use camelCase CategoryId
          Is_premium: formData.isPremium,
          File_Path: formData.imageUrl // Always include the uploaded image path
        };
        
        console.log('🔧 FIXED: Using CategoryId (camelCase) to match backend DTO');
        console.log('🔧 Available categories:', categories.map(cat => ({ id: cat.id, category_Id: cat.category_Id, name: cat.name })));
        
        console.log('📤 FINAL UPDATE DATA (WITH CATEGORY):', updateData);
        console.log('� formData.imageUrl:', formData.imageUrl);
        console.log('🔍 updateData.File_Path:', updateData.File_Path);
        console.log('�� Making API call to:', `cards/templates/${editingTemplate.Template_Id}`);
        console.log('🔍 FINAL CATEGORY ID DEBUG:');
        console.log('- Final category ID:', finalCategoryId);
        console.log('- Type of finalCategoryId:', typeof finalCategoryId);
        console.log('- Categories available:', categories);
        console.log('- Category exists check:', categories.some(cat => cat.category_Id === finalCategoryId));
        
        // Additional validation before API call
        if (!finalCategoryId || isNaN(finalCategoryId)) {
          console.error('❌ INVALID CATEGORY ID:', finalCategoryId);
          alert('Error: Invalid category ID. Please select a valid category.');
          return;
        }
        
        // Make the API call
        const response = await apiService.cards.updateTemplate(editingTemplate.Template_Id.toString(), updateData);
        
        console.log('📥 API Response received:', response);
        console.log('Response details:', {
          success: response.success,
          message: response.message,
          errors: response.errors,
          data: response.data
        });
        
        if (response.success) {
          console.log('✅ Update successful! Refreshing data...');
          await fetchData(); // Refresh the list
          
          // Force a small delay to ensure Supabase URLs are properly processed
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Trigger a re-render to update image URLs with new cache-busting timestamps
          setTemplates([...templates]);
          
          resetForm(); // Reset form after successful update
        } else {
          console.error('❌ Update failed with response:', response);
          
          // Detailed error analysis
          if (response.errors && Array.isArray(response.errors)) {
            console.error('Validation errors:', response.errors);
          }
          if (response.message) {
            console.error('Error message:', response.message);
          }
          
          throw new Error(response.message || response.errors?.join(', ') || 'Failed to update template');
        }
      } else {
        // Create new template via API - send correct field names
        const getImageFilename = (imageUrl: string): string => {
          if (imageUrl.startsWith('blob:')) {
            return 'default-template.png';
          }
          
          // If it's already a filename, return as-is
          if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
            return imageUrl;
          }
          
          // Extract filename from URL
          try {
            const url = new URL(imageUrl.startsWith('/') ? getBaseUrl() + imageUrl : imageUrl);
            return url.pathname.split('/').pop() || 'default-template.png';
          } catch {
            return imageUrl.split('/').pop() || 'default-template.png';
          }
        };
        
        const templateData = {
          name: formData.name,
          description: formData.description,
          templateData: getImageFilename(formData.imageUrl),
          categoryId: parseInt(formData.categoryId),
          isPremium: formData.isPremium
        };
        
        console.log('=== TEMPLATE CREATION DEBUG ===');
        console.log('Form data:', formData);
        console.log('Categories available:', categories);
        console.log('Selected category ID:', formData.categoryId);
        console.log('Parsed categoryId:', parseInt(formData.categoryId));
        console.log('Template data to send:', templateData);
        console.log('Template data JSON:', JSON.stringify(templateData, null, 2));
        console.log('=== END DEBUG ===');
        
        const response = await apiService.cards.createTemplate(templateData);
        
        if (response.success) {
          await fetchData(); // Refresh the list
        } else {
          console.error('Template creation failed:', response);
          console.error('Validation errors:', response.errors);
          throw new Error(response.message || response.errors?.join(', ') || 'Failed to create template');
        }
      }

      resetForm();
    } catch (error) {
      console.error('Failed to save template:', error);
      alert(error instanceof Error ? error.message : 'Failed to save template. Please try again.');
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.Title,
      description: template.Card_Template_Description,
      categoryId: template.Category_Id.toString(),
      isPremium: template.Is_premium,
      imageUrl: template.ImageUrl || template.File_Path // Use ImageUrl first, then fallback to File_Path
    });
    setShowAddForm(true);
  };

  const handleDelete = async (templateId: number | undefined) => {
    if (!templateId) {
      console.error('Template ID is undefined');
      alert('Cannot delete template: Invalid template ID');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        const response = await apiService.cards.deleteTemplate(templateId.toString());
        
        if (response.success) {
          await fetchData(); // Refresh the list
        } else {
          throw new Error(response.message || 'Failed to delete template');
        }
      } catch (error) {
        console.error('Failed to delete template:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete template. Please try again.');
      }
    }
  };

  const resetForm = () => {
    // Clean up existing blob URLs
    blobUrls.forEach(url => URL.revokeObjectURL(url));
    setBlobUrls([]);
    
    setFormData({
      name: "",
      description: "",
      categoryId: "",
      isPremium: false,
      imageUrl: ""
    });
    setEditingTemplate(null);
    setShowAddForm(false);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Templates Management</h1>
              <p className="text-muted-foreground mt-1">Manage card templates and designs</p>
            </div>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingTemplate ? 'Edit Template' : 'Add New Template'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter template name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category *</Label>
                    <Select value={formData.categoryId || ""} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                      <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.category_Id} value={category.category_Id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter template description (minimum 20 characters)"
                    rows={3}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isPremium">Template Type</Label>
                  <Select 
                    value={formData.isPremium ? "premium" : "free"} 
                    onValueChange={(value) => setFormData({ ...formData, isPremium: value === "premium" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="free" value="free">Free</SelectItem>
                      <SelectItem key="premium" value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Template Image *</Label>
                  <div className="flex items-center gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Choose File'}
                    </Button>
                    {formData.imageUrl && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <ImageIcon className="w-4 h-4" />
                        Image selected
                      </div>
                    )}
                  </div>
                  {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl}</p>}
                  
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={getLocalImageUrl(formData.imageUrl, true) || undefined}
                        alt="Template preview"
                        className="h-32 w-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    {editingTemplate ? 'Update Template' : 'Save Template'}
                  </Button>
                  {editingTemplate && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={async () => {
                        console.log('=== MINIMAL TEST - NAME ONLY ===');
                        try {
                          const testResponse = await apiService.cards.updateTemplate(editingTemplate.Template_Id.toString(), {
                            Title: "Minimal Test - " + new Date().toISOString()
                            // ONLY update title, nothing else
                          });
                          console.log('Minimal test response:', testResponse);
                          if (testResponse.success) {
                            alert('✅ Minimal Test Successful! The issue is with other fields.');
                            await fetchData();
                          } else {
                            alert('❌ Minimal Test Failed: ' + (testResponse.message || 'Unknown error'));
                          }
                        } catch (error) {
                          console.error('Minimal test error:', error);
                          alert('❌ Minimal Test Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      🧪 Minimal Test (Name Only)
                    </Button>
                  )}
                  {editingTemplate && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={async () => {
                        console.log('=== DEBUG API TEST ===');
                        try {
                          // Use safe category logic
                          const safeCategoryId = editingTemplate.Category_Id || categories[0]?.category_Id || 1;
                          
                          const testResponse = await apiService.cards.updateTemplate(editingTemplate.Template_Id.toString(), {
                            Title: "Test Update - " + new Date().toISOString(),
                            Card_Template_Description: "Test description for debugging",
                            Category_Id: safeCategoryId,
                            Is_premium: false
                          });
                          console.log('Debug API response:', testResponse);
                          if (testResponse.success) {
                            alert('✅ API Test Successful! Check console for details.');
                            await fetchData();
                          } else {
                            alert('❌ API Test Failed: ' + (testResponse.message || 'Unknown error'));
                          }
                        } catch (error) {
                          console.error('Debug API error:', error);
                          alert('❌ API Test Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
                        }
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      🔧 Debug API Test
                    </Button>
                  )}
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Templates List */}
        <div className="grid gap-6">
          {templates.map((template, index) => (
            <Card key={template.Template_Id || `template-${index}`} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {(() => {
                      const finalUrl = getLocalImageUrl(template.ImageUrl, false);
                      console.log(`Template: ${template.Title}, ImageUrl: ${template.ImageUrl}, File_Path: ${template.File_Path}, Final URL: ${finalUrl}`);
                      
                      // If template has no image, show placeholder directly
                      if (!template.ImageUrl || template.ImageUrl.trim() === '') {
                        return (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        );
                      }
                      
                      if (finalUrl) {
                        return (
                          <img 
                            src={finalUrl} 
                            alt={template.Title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error(`Image failed to load - Template: ${template.Title}, URL: ${finalUrl}`);
                              const target = e.target as HTMLImageElement;
                              
                              // Show SVG placeholder directly (no fallback attempts)
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA5NiA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zOCAyNEMzOCAyMS43OTA5IDM5Ljc5MDkgMjAgNDIgMjBDNDQuMjA5MSAyMCA0NiAyMS43OTA5IDQ2IDI0QzQ2IDI2LjIwOTEgNDQuMjA5MSAyOCA0MiAyOEMzOS43OTA5IDI4IDM4IDI2LjIwOTEgMzggMjRaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0zOCAzMkMzOCAzMC4zNDMxIDM4LjY1NjkgMjkgNDAgMjlINDJDNDEuMzQzMSAyOSA0MiAzMC4zNDMxIDQyIDMyQzQyIDMzLjY1NjkgNDEuMzQzMSAzNSA0MCAzNUMzOC42NTY5IDM1IDM4IDMzLjY1NjkgMzggMzJaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjQ4IiB5PSIzOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
                            }}
                          />
                        );
                      } else {
                        return (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        );
                      }
                    })()}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{template.Title}</h3>
                      <Badge variant={template.Is_premium ? "default" : "secondary"}>
                        {template.Is_premium ? "Premium" : "Free"}
                      </Badge>
                      <Badge variant="default">
                        Active
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3 line-clamp-2">{template.Card_Template_Description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Category: {template.Category_Id}</span>
                      <span>Created: {new Date(template.Created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(template.Template_Id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {templates.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <h3 className="text-lg font-medium mb-2">No templates found</h3>
                <p>Get started by adding your first template.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
