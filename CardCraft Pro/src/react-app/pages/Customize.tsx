import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import Layout from "@/react-app/components/Layout";
import { Button } from "@/react-app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BasicCardEditor from "@/react-app/components/BasicCardEditor";
import LuxuryCardEditor from "@/react-app/components/LuxuryCardEditor";
import { apiService } from "@/react-app/services/api";
import { getImageUrl } from "@/react-app/lib/supabase";
import { motion } from "framer-motion";

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
  
  // If it's already a full URL (including Supabase URLs), return as-is
  if (imagePath.startsWith('https://') || imagePath.startsWith('http://')) {
    return imagePath;
  }
  
  // Otherwise, assume it's a relative path and add base URL
  return `${getBaseUrl()}${imagePath}`;
};

interface Template {
  id: number;
  name: string;
  title?: string;
  description: string;
  templateData: string;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
  updatedAt?: string;
  filePath?: string;
  isPremium?: boolean;
  // Additional properties for backward compatibility
  Template_Id?: number;
  Category_Id?: number;
  Title?: string;
  Card_Template_Description?: string;
  File_Path?: string;
  ImageUrl?: string;
  Is_premium?: boolean;
  Created_at?: string;
  Updated_at?: string;
}

export default function CustomizePage() {
  const { type, templateId } = useParams<{ type: "basic" | "luxury"; templateId: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const isLuxury = type === "luxury";

  const fetchTemplate = useCallback(async () => {
      if (templateId) {
        console.log('=== CUSTOMIZE PAGE FETCH ===');
        console.log('Fetching template for ID:', templateId);
        console.log('Template ID type:', typeof templateId);
        
        try {
          // Fetch specific template by ID
          const result = await apiService.cards.getTemplateById(templateId);
          
          console.log('API Result:', result);
          
          if (result.success && result.data) {
            console.log('Raw template data received:', result.data);
            
            // Type assertion to treat result.data as any to avoid type conflicts
            const apiData = result.data as any;
            
            // Transform raw API data to Template format
            const transformedTemplate: Template = {
              // API response properties (camelCase)
              id: (apiData.id as number) || parseInt(templateId) || 0,
              name: (apiData.name as string) || (apiData.title as string) || '',
              title: (apiData.title as string) || (apiData.name as string) || '',
              description: (apiData.description as string) || '',
              templateData: (apiData.templateData as string) || '',
              categoryId: (apiData.categoryId as number) || 0,
              categoryName: (apiData.categoryName as string) || '',
              createdAt: (apiData.createdAt as string) || '',
              updatedAt: (apiData.updatedAt as string) || '',
              filePath: (apiData.filePath as string) || '',
              isPremium: (apiData.isPremium as boolean) || false,
              // Backward compatibility properties (snake_case)
              Template_Id: (apiData.Template_Id as number) || (apiData.id as number) || parseInt(templateId) || 0,
              Category_Id: (apiData.Category_Id as number) || (apiData.categoryId as number) || 0,
              Title: (apiData.Title as string) || (apiData.title as string) || (apiData.name as string) || '',
              Card_Template_Description: (apiData.Card_Template_Description as string) || (apiData.description as string) || '',
              File_Path: (apiData.File_Path as string) || (apiData.filePath as string) || '',
              ImageUrl: (apiData.ImageUrl as string) || (apiData.filePath as string) || '',
              Is_premium: (apiData.Is_premium as boolean) || (apiData.isPremium as boolean) || false,
              Created_at: (apiData.Created_at as string) || (apiData.createdAt as string) || '',
              Updated_at: (apiData.Updated_at as string) || (apiData.updatedAt as string) || ''
            };
            
            // Process image URLs using the same logic as admin panel
            const processImageUrls = async (templateData: Template) => {
              const updatedTemplate = { ...templateData };
              
              console.log('=== PROCESS IMAGE URLS ===');
              console.log('Template data keys:', Object.keys(updatedTemplate));
              console.log('filePath:', updatedTemplate.filePath);
              console.log('ImageUrl:', updatedTemplate.ImageUrl);
              console.log('File_Path:', updatedTemplate.File_Path);
              console.log('backgroundImage:', (updatedTemplate as any).backgroundImage);
              
              // For Supabase images, use the filename directly (no templates/ prefix)
              // Images are stored at root level in Supabase, not in templates/ folder
              let imageUrl = updatedTemplate.ImageUrl || updatedTemplate.File_Path || updatedTemplate.filePath || '';
              
              console.log('Initial imageUrl:', imageUrl);
              
              // Remove templates/ prefix if it exists (for Supabase images)
              if (imageUrl && imageUrl.startsWith('templates/')) {
                imageUrl = imageUrl.replace('templates/', '');
                console.log('Removed templates/ prefix for Supabase file:', imageUrl);
              }
              // If it's already a full Supabase URL, use it as-is
              else if (imageUrl && imageUrl.includes('supabase.co')) {
                console.log('Using full Supabase URL:', imageUrl);
              }
              // Only add templates/ prefix for old local files (not Supabase UUIDs, default template, or uploaded images)
              else if (imageUrl && !imageUrl.includes('-') && imageUrl !== 'default-template.png' && !imageUrl.match(/^[a-zA-Z0-9_]+\.jpeg$/) && !imageUrl.startsWith('http')) {
                imageUrl = `templates/${imageUrl}`;
                console.log('Added templates/ prefix for local file:', imageUrl);
              } else {
                console.log('Using original path for Supabase file (stored at root):', imageUrl);
              }
              
              // Update both ImageUrl and File_Path with the corrected path
              updatedTemplate.ImageUrl = imageUrl;
              updatedTemplate.File_Path = imageUrl;
              
              // Use the getLocalImageUrl function to get the final URL (only for non-full URLs)
              let finalImageUrl = imageUrl;
              if (imageUrl && !imageUrl.includes('supabase.co')) {
                const processedUrl = getLocalImageUrl(imageUrl);
                if (processedUrl) {
                  finalImageUrl = processedUrl;
                }
              }
              if (finalImageUrl) {
                updatedTemplate.ImageUrl = finalImageUrl;
                updatedTemplate.File_Path = finalImageUrl;
              }
              
              console.log('Final imageUrl:', finalImageUrl);
              
              return updatedTemplate;
            };
            
            // Process image URLs asynchronously
            const finalTemplate = await processImageUrls(transformedTemplate);
            
            console.log('Transformed template data:', finalTemplate);
            console.log('=== PASSING TO LUXURY EDITOR ===');
            console.log('Template type:', type);
            console.log('Template ImageUrl:', finalTemplate.ImageUrl);
            console.log('Template File_Path:', finalTemplate.File_Path);
            
            setTemplate(finalTemplate);
          } else {
            console.error('Failed to fetch template:', result.message);
            console.error('Full API response:', result);
          }
        } catch (error) {
          console.error('Error fetching template:', error);
        }
      }
  }, [type, templateId]);

  useEffect(() => {
    // Fetch template data if ID is provided
    if (type && templateId) {
      fetchTemplate();
    }
  }, [type, templateId, fetchTemplate]);

  
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <motion.div 
          className="bg-white border-b"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-6 py-6">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/products/${type}`)}
              className="flex items-center gap-2 hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Button>
          </div>
        </motion.div>

        {/* Editor */}
        <motion.div 
          className="py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isLuxury ? <LuxuryCardEditor template={template} /> : <BasicCardEditor template={template} />}
        </motion.div>
      </div>
    </Layout>
  );
}
