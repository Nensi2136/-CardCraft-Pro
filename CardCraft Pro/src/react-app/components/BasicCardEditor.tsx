import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Download, RotateCcw } from "lucide-react";
import { getImageUrl } from "@/react-app/lib/supabase";
import html2canvas from 'html2canvas';

interface BasicCardData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  textColor: string;
  backgroundImage: string;
  template: "professional" | "modern" | "minimal";
}

const defaultCardData: BasicCardData = {
  name: "John Doe",
  title: "Software Engineer",
  company: "Tech Company",
  email: "john.doe@company.com",
  phone: "+1 234 567 8900",
  website: "www.company.com",
  address: "123 Business St, City, State 12345",
  textColor: "#FFFFFF",
  backgroundImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MCkiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwIiB4MT0iMCIgeTE9IjAiIHgyPSI0MDAiIHkyPSIyNTAiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMzMzNjZCIgLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNjY2NkZmIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==",
  template: "professional"
};

interface BasicCardEditorProps {
  template?: any;
}

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

export default function BasicCardEditor({ template }: BasicCardEditorProps = {}) {
  console.log('=== BASIC CARD EDITOR ===');
  console.log('Template prop received:', template);
  
  const [cardData, setCardData] = useState<BasicCardData>(
    template ? {
      name: template.name || defaultCardData.name,
      title: template.title || defaultCardData.title,
      company: template.company || defaultCardData.company,
      email: template.email || defaultCardData.email,
      phone: template.phone || defaultCardData.phone,
      website: template.website || defaultCardData.website,
      address: template.address || defaultCardData.address,
      textColor: template.textColor || defaultCardData.textColor,
      backgroundImage: getLocalImageUrl(template.backgroundImage || template.ImageUrl || template.File_Path || '') || defaultCardData.backgroundImage,
      template: template.template || defaultCardData.template
    } : defaultCardData
  );
  const [isPreview, setIsPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Debug: Log when template prop changes and background image is processed
  useEffect(() => {
    if (template) {
      console.log('=== TEMPLATE PROP CHANGED ===');
      console.log('Template data:', template);
      console.log('Template backgroundImage:', template.backgroundImage);
      console.log('Template ImageUrl:', template.ImageUrl);
      console.log('Template File_Path:', template.File_Path);
      
      const processedImage = getLocalImageUrl(template.backgroundImage || template.ImageUrl || template.File_Path || '');
      console.log('Processed background image:', processedImage);
    }
  }, [template]);

  // Helper function to validate URLs
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Fetch background image from API if templateId is provided
  useEffect(() => {
    const fetchBackgroundImage = async () => {
      if (template) {
        try {
          console.log('=== PROCESSING TEMPLATE FOR BASIC CARD EDITOR ===');
          console.log('Template object:', template);
          console.log('Template ID:', template.Template_Id);
          console.log('Template ImageUrl:', template.ImageUrl);
          console.log('Template File_Path:', template.File_Path);
          
          // Use the ImageUrl from the template data
          if (template.ImageUrl && template.ImageUrl.trim() !== '') {
            console.log('Using ImageUrl from template:', template.ImageUrl); // Debug log
            
            let imageUrl = template.ImageUrl;
            
            // Only handle legacy API endpoints, Supabase URLs are already full URLs
            if (imageUrl.startsWith('/api/')) {
              // Already an API endpoint URL
              const getBaseUrl = () => {
                const isDevelopment = import.meta.env.DEV;
                return isDevelopment ? 'http://localhost:5021' : '';
              };
              imageUrl = `${getBaseUrl()}${imageUrl}`;
            } else if (imageUrl.startsWith('/templates/')) {
              // This should now be handled by Supabase in Customize.tsx
              // But if we get here, use Supabase URL
              imageUrl = getImageUrl(imageUrl);
            } else if (imageUrl.startsWith('/shared-images/')) {
              // Legacy shared-images path - convert to API endpoint
              const getBaseUrl = () => {
                const isDevelopment = import.meta.env.DEV;
                return isDevelopment ? 'http://localhost:5021' : '';
              };
              const fileName = imageUrl.split('/').pop();
              imageUrl = `${getBaseUrl()}/api/templates/images/${fileName}`;
            } else if (!imageUrl.startsWith('http')) {
              // Relative path, assume it's a filename and convert to API endpoint
              const getBaseUrl = () => {
                const isDevelopment = import.meta.env.DEV;
                return isDevelopment ? 'http://localhost:5021' : '';
              };
              imageUrl = `${getBaseUrl()}/api/templates/images/${imageUrl}`;
            }
            
            console.log('Final image URL:', imageUrl); // Debug log
            
            // Validate the URL before using it
            if (isValidUrl(imageUrl)) {
              // Update the background image with the one from API
              setCardData(prev => ({
                ...prev,
                backgroundImage: imageUrl
              }));
            } else {
              console.error('Invalid image URL constructed:', imageUrl);
              // Use fallback
              setCardData(prev => ({
                ...prev,
                backgroundImage: defaultCardData.backgroundImage
              }));
            }
          } else if (template.File_Path && template.File_Path.trim() !== '') {
            // Fallback to File_Path if ImageUrl is not available
            console.log('Using File_Path fallback:', template.File_Path); // Debug log
            
            let imagePath = template.File_Path;
            
            // Handle different URL formats
            if (imagePath.startsWith('/templates/')) {
              // This should now be handled by Supabase in Customize.tsx
              // But if we get here, use Supabase URL
              imagePath = getImageUrl(imagePath);
            } else if (imagePath.startsWith('/shared-images/')) {
              // Legacy shared-images path - convert to API endpoint
              const getBaseUrl = () => {
                const isDevelopment = import.meta.env.DEV;
                return isDevelopment ? 'http://localhost:5021' : '';
              };
              const fileName = imagePath.split('/').pop();
              imagePath = `${getBaseUrl()}/api/templates/images/${fileName}`;
            } else if (!imagePath.startsWith('http')) {
              // Relative path - assume it's a filename and convert to API endpoint
              const getBaseUrl = () => {
                const isDevelopment = import.meta.env.DEV;
                return isDevelopment ? 'http://localhost:5021' : '';
              };
              imagePath = `${getBaseUrl()}/api/templates/images/${imagePath}`;
            }
            
            console.log('Final File_Path URL:', imagePath); // Debug log
            
            // Validate the URL before using it
            if (isValidUrl(imagePath)) {
              setCardData(prev => ({
                ...prev,
                backgroundImage: imagePath
              }));
            } else {
              console.error('Invalid File_Path URL constructed:', imagePath);
              // Use fallback
              setCardData(prev => ({
                ...prev,
                backgroundImage: defaultCardData.backgroundImage
              }));
            }
          } else {
            console.log('No image found in template, using fallback');
            // Use fallback if no image path
            setCardData(prev => ({
              ...prev,
              backgroundImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MCkiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwIiB4MT0iMCIgeTE9IjAiIHgyPSI0MDAiIHkyPSIyNTAiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMzMzNjZCIgLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNjY2NkZmIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg=="
            }));
          }
        } catch (error) {
          console.error('Failed to fetch background image:', error);
        }
      }
    };

    fetchBackgroundImage();
  }, [template]);

  const handleInputChange = (field: keyof BasicCardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const resetCard = () => {
    setCardData(defaultCardData);
  };

  const downloadCard = async () => {
    if (isDownloading) return; // Prevent multiple clicks
    
    setIsDownloading(true);
    const element = document.getElementById('card-preview');
    if (element) {
      try {
        console.log('Starting download capture...');
        
        // Use html2canvas to capture the exact DOM element with all styles and images
        const canvas = await html2canvas(element, {
          backgroundColor: null, // Preserve transparent backgrounds
          scale: 2, // Higher resolution for better quality
          useCORS: true, // Allow cross-origin images (for Supabase images)
          allowTaint: true, // Allow tainted canvas (may be needed for some images)
          logging: false, // Disable console logging for cleaner output
          width: 350,
          height: 250,
          scrollX: 0,
          scrollY: 0
        });
        
        if (canvas) {
          console.log('Canvas captured successfully, triggering download...');
          
          // Convert canvas to blob and download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.download = `business-card-${cardData.name.replace(/\s+/g, '-').toLowerCase()}.png`;
              link.href = url;
              link.click();
              URL.revokeObjectURL(url); // Clean up
              console.log('Download completed successfully!');
            } else {
              throw new Error('Failed to create blob from canvas');
            }
          }, 'image/png', 1.0);
          
          return;
        }
        
        throw new Error('Canvas capture returned null');
        
      } catch (error) {
        console.error('html2canvas capture failed:', error);
        console.log('Falling back to manual rendering...');
        
        // Fallback to manual rendering if html2canvas fails
        await fallbackDownload();
      } finally {
        setIsDownloading(false);
      }
    } else {
      console.error('Card preview element not found');
      alert('Could not find card preview. Please try again.');
      setIsDownloading(false);
    }
  };

  const fallbackDownload = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 350;
      canvas.height = 250;
      
      // Always use gradient fallback to prevent tainted canvas issues
      console.log('Using gradient fallback to prevent tainted canvas');
      drawFallbackBackground(ctx);
      drawCardText(ctx);
      triggerDownload(canvas);
    }
  };

  const triggerDownload = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = 'business-card.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const drawCardText = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = cardData.textColor;
    
    switch (cardData.template) {
      case "professional":
        // Professional template layout - matches live preview
        ctx.font = 'bold 16px Arial';
        ctx.fillText(cardData.name, 20, 40);
        ctx.font = '12px Arial';
        ctx.fillText(cardData.title, 20, 60);
        ctx.font = 'bold 12px Arial';
        ctx.fillText(cardData.company, 20, 80);
        ctx.font = '10px Arial';
        ctx.fillText(cardData.email, 20, 110);
        ctx.fillText(cardData.phone, 20, 130);
        ctx.fillText(cardData.website, 20, 150);
        ctx.fillText(cardData.address, 20, 190);
        break;
        
      case "modern":
        // Modern template layout - matches live preview
        ctx.font = 'bold 20px Arial';
        ctx.fillText(cardData.name, 20, 40);
        ctx.font = '12px Arial';
        ctx.fillText(cardData.title, 20, 65);
        ctx.font = 'bold 16px Arial';
        ctx.fillText(cardData.company, 20, 90);
        ctx.font = '10px Arial';
        ctx.fillText(cardData.email, 20, 200);
        ctx.fillText(cardData.phone, 20, 220);
        ctx.fillText(cardData.website, 20, 240);
        break;
        
      case "minimal":
        // Minimal template layout - matches live preview (centered)
        ctx.textAlign = 'center';
        ctx.font = '16px Arial';
        ctx.fillText(cardData.name, 175, 100);
        ctx.font = '12px Arial';
        ctx.fillText(cardData.title, 175, 125);
        ctx.fillText(cardData.email, 175, 150);
        ctx.fillText(cardData.phone, 175, 170);
        ctx.textAlign = 'left'; // Reset alignment
        break;
        
      default:
        // Fallback to original layout
        ctx.font = 'bold 16px Arial';
        ctx.fillText(cardData.name, 20, 40);
        ctx.font = '12px Arial';
        ctx.fillText(cardData.title, 20, 60);
        ctx.fillText(cardData.company, 20, 80);
        ctx.fillText(cardData.email, 20, 110);
        ctx.fillText(cardData.phone, 20, 130);
        ctx.fillText(cardData.website, 20, 150);
        ctx.fillText(cardData.address, 20, 190);
        break;
    }
    
    // Trigger download
    const link = document.createElement('a');
    link.download = 'business-card.png';
    link.href = ctx.canvas.toDataURL();
    link.click();
  };

  const drawFallbackBackground = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, ctx.canvas.height);
    gradient.addColorStop(0, '#33366D');
    gradient.addColorStop(1, '#666FFF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const renderCardPreview = () => {
    const baseClasses = "w-full h-full rounded-lg p-6 text-white relative overflow-hidden";
    
    // Use the processed background image directly (already processed by getLocalImageUrl)
    const backgroundImage = cardData.backgroundImage;
    
    console.log('=== BASIC PREVIEW RENDER ===');
    console.log('Background image:', backgroundImage);
    console.log('Template type:', cardData.template);
    
    // Handle cases where background image might be a gradient or invalid
    const isGradient = backgroundImage && backgroundImage.includes('gradient');
    const isValidImage = backgroundImage && !isGradient && !backgroundImage.startsWith('data:');
    
    const backgroundStyle = { 
      backgroundImage: isValidImage ? `url(${backgroundImage})` : backgroundImage,
      backgroundSize: isValidImage ? 'cover' : 'auto',
      backgroundPosition: 'center',
      color: cardData.textColor 
    };
    
    switch (cardData.template) {
      case "professional":
        return (
          <div 
            className={baseClasses}
            style={backgroundStyle}
          >
            {!isValidImage && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600" />
            )}
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 space-y-2">
              <h3 className="text-xl font-bold">{cardData.name}</h3>
              <p className="text-sm opacity-90">{cardData.title}</p>
              <p className="text-sm font-semibold">{cardData.company}</p>
              <div className="pt-3 space-y-1 text-xs">
                <p>{cardData.email}</p>
                <p>{cardData.phone}</p>
                <p>{cardData.website}</p>
                <p>{cardData.address}</p>
              </div>
            </div>
          </div>
        );
      case "modern":
        return (
          <div 
            className={`${baseClasses} bg-gradient-to-br`}
            style={backgroundStyle}
          >
            {!isValidImage && (
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-600" />
            )}
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold mb-1">{cardData.name}</h3>
                <p className="text-sm opacity-90 mb-3">{cardData.title}</p>
                <p className="text-lg font-semibold">{cardData.company}</p>
              </div>
              <div className="space-y-1 text-xs">
                <p>{cardData.email}</p>
                <p>{cardData.phone}</p>
                <p>{cardData.website}</p>
              </div>
            </div>
          </div>
        );
      case "minimal":
        return (
          <div 
            className={`${baseClasses} flex items-center justify-center`}
            style={backgroundStyle}
          >
            {!isValidImage && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 text-center space-y-3">
              <h3 className="text-xl font-light">{cardData.name}</h3>
              <p className="text-sm opacity-80">{cardData.title}</p>
              <p className="text-xs opacity-70">{cardData.email}</p>
              <p className="text-xs opacity-70">{cardData.phone}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };


  if (isPreview) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Card Preview</h2>
            <div className="flex gap-2">
              <Button onClick={() => setIsPreview(false)} variant="outline">
                Back to Editor
              </Button>
              <Button onClick={downloadCard} disabled={isDownloading}>
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div id="card-preview" className="w-[350px] h-[250px] mx-auto">
              {renderCardPreview()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Card Editor</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
            {/* Editor Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Basic Card Editor</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Template Selection */}
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select value={cardData.template} onValueChange={(value) => handleInputChange('template', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Personal Information</h3>
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={cardData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={cardData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Your job title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={cardData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Contact Information</h3>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={cardData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={cardData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      value={cardData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="www.example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea
                      value={cardData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Business St, City, State 12345"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Color Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Color Settings</h3>
                  <div className="space-y-3">
                    <div className="flex gap-2 items-center">
                      <Label className="w-24">Text Color</Label>
                      <Input
                        type="color"
                        value={cardData.textColor}
                        onChange={(e) => handleInputChange('textColor', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={cardData.textColor}
                        onChange={(e) => handleInputChange('textColor', e.target.value)}
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={resetCard} variant="outline" className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button onClick={downloadCard} disabled={isDownloading} className="flex-1">
                    {isDownloading ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div id="card-preview" className="w-[350px] h-[250px] mx-auto border-2 border-gray-200 rounded-lg overflow-hidden">
                    {renderCardPreview()}
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    Business Card Preview (350x250px)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
    </div>
  );
}
