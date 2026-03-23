import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Eye, Download, RotateCcw, Upload, Sparkles, Save, FolderOpen, Loader2 } from "lucide-react";
import { cardTemplateService } from "@/react-app/services/cardTemplateService";
import { getImageUrl } from "@/react-app/lib/supabase";
import html2canvas from 'html2canvas';

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

interface LuxuryCardData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  backgroundImage: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  template: "premium-gradient" | "nature-inspired" | "gold-elegant" | "dark-luxury";
  logoUrl: string;
  qrCode: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    instagram: string;
  };
}

const defaultLuxuryCardData: LuxuryCardData = {
  name: "Alexander Sterling",
  title: "Chief Executive Officer",
  company: "Sterling Enterprises",
  email: "alexander@sterling.com",
  phone: "+1 555 0123 4567",
  website: "www.sterling.com",
  address: "1 Platinum Plaza, Manhattan, NY 10022",
  backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  backgroundColor: "#1a1a1a",
  textColor: "#ffffff",
  accentColor: "#d4af37",
  template: "premium-gradient",
  logoUrl: "",
  qrCode: "",
  socialLinks: {
    linkedin: "",
    twitter: "",
    instagram: ""
  }
};

interface LuxuryCardEditorProps {
  template?: any;
}

export default function LuxuryCardEditor({ template }: LuxuryCardEditorProps = {}) {
  const [cardData, setCardData] = useState<LuxuryCardData>(
    template ? {
      name: template.name || defaultLuxuryCardData.name,
      title: template.title || defaultLuxuryCardData.title,
      company: template.company || defaultLuxuryCardData.company,
      email: template.email || defaultLuxuryCardData.email,
      phone: template.phone || defaultLuxuryCardData.phone,
      website: template.website || defaultLuxuryCardData.website,
      address: template.address || defaultLuxuryCardData.address,
      backgroundImage: getLocalImageUrl(template.backgroundImage || template.ImageUrl || template.File_Path || '') || defaultLuxuryCardData.backgroundImage,
      backgroundColor: template.backgroundColor || defaultLuxuryCardData.backgroundColor,
      textColor: template.textColor || defaultLuxuryCardData.textColor,
      accentColor: template.accentColor || defaultLuxuryCardData.accentColor,
      template: template.template || defaultLuxuryCardData.template,
      logoUrl: template.logoUrl || defaultLuxuryCardData.logoUrl,
      qrCode: template.qrCode || defaultLuxuryCardData.qrCode,
      socialLinks: {
        linkedin: template.socialLinks?.linkedin || defaultLuxuryCardData.socialLinks.linkedin,
        twitter: template.socialLinks?.twitter || defaultLuxuryCardData.socialLinks.twitter,
        instagram: template.socialLinks?.instagram || defaultLuxuryCardData.socialLinks.instagram
      }
    } : defaultLuxuryCardData
  );
  const [isPreview, setIsPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Debug: Log when template prop changes and background image is processed
  useEffect(() => {
    if (template) {
      console.log('=== LUXURY TEMPLATE PROP CHANGED ===');
      console.log('Template data:', template);
      console.log('Template backgroundImage:', template.backgroundImage);
      console.log('Template ImageUrl:', template.ImageUrl);
      console.log('Template File_Path:', template.File_Path);
      
      const processedImage = getLocalImageUrl(template.backgroundImage || template.ImageUrl || template.File_Path || '');
      console.log('Processed luxury background image:', processedImage);
      
      // Update cardData with the processed background image
      if (processedImage && processedImage !== cardData.backgroundImage) {
        setCardData(prev => ({ ...prev, backgroundImage: processedImage }));
      }
      
      // Set loading state for Supabase images
      if (processedImage && processedImage.includes('supabase')) {
        setIsImageLoading(true);
        setImageError(false);
        
        const img = new Image();
        img.onload = () => {
          setIsImageLoading(false);
        };
        img.onerror = () => {
          setIsImageLoading(false);
          setImageError(true);
          console.error('Failed to load Supabase image:', processedImage);
        };
        img.src = processedImage;
      }
    }
  }, [template]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [savedCards, setSavedCards] = useState<Array<{id: number, name: string, description: string}>>([]);
  const [showSavedCards, setShowSavedCards] = useState(false);

  const handleInputChange = (field: keyof LuxuryCardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (platform: keyof typeof cardData.socialLinks, value: string) => {
    setCardData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  // API integration functions
  const saveCardToServer = async () => {
    setIsLoading(true);
    setSaveStatus('saving');
    setErrorMessage('');

    try {
      const response = await cardTemplateService.saveLuxuryCard(cardData as unknown as { name: string; [key: string]: unknown });
      if (response.message) {
        setSaveStatus('error');
        setErrorMessage(response.message);
      } else {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch {
      setSaveStatus('error');
      setErrorMessage('Failed to save card');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedCards = async () => {
    setIsLoading(true);
    try {
      const response = await cardTemplateService.getTemplates();
      if (response.data) {
        setSavedCards(response.data.data || []);
      }
    } catch {
      setErrorMessage('Failed to load saved cards');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCardFromServer = async (templateId: number) => {
    setIsLoading(true);
    try {
      const response = await cardTemplateService.loadLuxuryCard(templateId);
      if (response.data) {
        setCardData(response.data as LuxuryCardData);
        setShowSavedCards(false);
      } else {
        setErrorMessage(response.message || 'Failed to load card');
      }
    } catch {
      setErrorMessage('Failed to load card');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSavedCards();
  }, []);

  const resetCard = () => {
    setCardData(defaultLuxuryCardData);
  };

  const handleImageUpload = (type: 'background' | 'logo') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (type === 'background') {
            handleInputChange('backgroundImage', result);
          } else {
            handleInputChange('logoUrl', result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const downloadCard = async () => {
    if (isDownloading) return; // Prevent multiple clicks
    
    setIsDownloading(true);
    const element = document.getElementById('luxury-card-preview');
    if (element) {
      try {
        console.log('Starting luxury card download capture...');
        
        // Preload Supabase images before capturing
        const backgroundImage = cardData.backgroundImage;
        if (backgroundImage && backgroundImage.includes('supabase')) {
          console.log('Preloading Supabase image for download...');
          await new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = resolve;
            img.onerror = reject;
            img.src = backgroundImage;
          });
        }
        
        // Use html2canvas to capture the exact DOM element with all styles and images
        const canvas = await html2canvas(element, {
          backgroundColor: null, // Preserve transparent backgrounds
          scale: 2, // Higher resolution for better quality
          useCORS: true, // Allow cross-origin images (for Supabase images)
          allowTaint: true, // Allow tainted canvas (may be needed for some images)
          logging: false, // Disable console logging for cleaner output
          width: 400,
          height: 300,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc) => {
            // Ensure images are loaded in the cloned document
            const clonedElement = clonedDoc.getElementById('luxury-card-preview');
            if (clonedElement) {
              const images = clonedElement.querySelectorAll('img');
              images.forEach(img => {
                if (img.src.includes('supabase')) {
                  img.crossOrigin = 'anonymous';
                }
              });
            }
          }
        });
        
        if (canvas) {
          console.log('Luxury canvas captured successfully, triggering download...');
          
          // Convert canvas to blob and download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.download = `luxury-card-${cardData.name.replace(/\s+/g, '-').toLowerCase()}.png`;
              link.href = url;
              link.click();
              URL.revokeObjectURL(url); // Clean up
              console.log('Luxury download completed successfully!');
            } else {
              throw new Error('Failed to create blob from canvas');
            }
          }, 'image/png', 1.0);
          
          return;
        }
        
        throw new Error('Canvas capture returned null');
        
      } catch (error) {
        console.error('html2canvas capture failed for luxury card:', error);
        console.log('Falling back to manual rendering...');
        
        // Fallback to manual rendering if html2canvas fails
        fallbackDownload();
      } finally {
        setIsDownloading(false);
      }
    } else {
      console.error('Luxury card preview element not found');
      alert('Could not find luxury card preview. Please try again.');
      setIsDownloading(false);
    }
  };

  const fallbackDownload = () => {
    const element = document.getElementById('luxury-card-preview');
    if (element) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 400;
        canvas.height = 300;
        
        // Use the processed background image directly
        const backgroundImage = cardData.backgroundImage;
        const hasCustomBackground = backgroundImage && !backgroundImage.includes('gradient');
        
        if (hasCustomBackground) {
          // Draw custom background image
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            drawCardContent(ctx);
          };
          img.src = backgroundImage;
        } else {
          // Create gradient background
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, '#667eea');
          gradient.addColorStop(1, '#764ba2');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          drawCardContent(ctx);
        }
        
        function drawCardContent(ctx: CanvasRenderingContext2D) {
          // Add gold accent
          ctx.fillStyle = '#d4af37';
          ctx.fillRect(0, 0, canvas.width, 4);
          ctx.fillRect(0, canvas.height - 4, canvas.width, 4);
          
          // Add text with custom colors
          ctx.fillStyle = cardData.textColor;
          ctx.font = 'bold 20px Georgia';
          ctx.fillText(cardData.name, 30, 50);
          ctx.font = '14px Georgia';
          ctx.fillText(cardData.title, 30, 75);
          ctx.fillStyle = cardData.accentColor;
          ctx.fillText(cardData.company, 30, 100);
          ctx.fillStyle = cardData.textColor;
          ctx.font = '12px Arial';
          ctx.fillText(cardData.email, 30, 140);
          ctx.fillText(cardData.phone, 30, 160);
          ctx.fillText(cardData.website, 30, 180);
          ctx.fillText(cardData.address, 30, 220);
          
          const link = document.createElement('a');
          link.download = 'luxury-business-card.png';
          link.href = canvas.toDataURL();
          link.click();
        }
      }
    }
  };

  const renderLuxuryCardPreview = () => {
    const baseClasses = "w-full h-full rounded-lg relative overflow-hidden shadow-2xl";
    
    // Use the processed background image directly (already processed by getLocalImageUrl)
    const backgroundImage = cardData.backgroundImage;
    const hasCustomBackground = backgroundImage && !backgroundImage.includes('gradient');
    
    console.log('=== LUXURY PREVIEW RENDER ===');
    console.log('Background image:', backgroundImage);
    console.log('Has custom background:', hasCustomBackground);
    
    switch (cardData.template) {
      case "premium-gradient":
        return (
          <div 
            className={baseClasses}
            style={{ 
              background: hasCustomBackground 
                ? `url(${backgroundImage})` 
                : backgroundImage,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!hasCustomBackground && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-pink-900/80" />
            )}
            <div className="absolute inset-0 flex flex-col justify-between p-8" style={{ color: cardData.textColor }}>
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{cardData.name}</h3>
                    <p className="text-sm opacity-90">{cardData.title}</p>
                  </div>
                  {cardData.logoUrl && (
                    <img src={cardData.logoUrl} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
                  )}
                </div>
                <p className="text-lg font-semibold" style={{ color: cardData.accentColor }}>
                  {cardData.company}
                </p>
              </div>
              <div className="space-y-1 text-xs">
                <p>{cardData.email}</p>
                <p>{cardData.phone}</p>
                <p>{cardData.website}</p>
                <p>{cardData.address}</p>
              </div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: cardData.accentColor }} />
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: cardData.accentColor }} />
          </div>
        );
      case "nature-inspired":
        return (
          <div 
            className={baseClasses}
            style={{ 
              background: hasCustomBackground 
                ? `url(${backgroundImage})` 
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!hasCustomBackground && (
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent" />
            )}
            <div className="absolute inset-0 flex flex-col justify-between p-8" style={{ color: cardData.textColor }}>
              <div className="text-center">
                <h3 className="text-2xl font-light mb-2">{cardData.name}</h3>
                <p className="text-sm opacity-90 mb-3">{cardData.title}</p>
                <p className="text-lg font-medium">{cardData.company}</p>
              </div>
              <div className="text-center space-y-1 text-xs">
                <p>{cardData.email}</p>
                <p>{cardData.phone}</p>
                <p>{cardData.website}</p>
              </div>
            </div>
            <div className="absolute inset-0 border-2 border-emerald-400/30 rounded-lg" />
          </div>
        );
      case "gold-elegant":
        return (
          <div 
            className={baseClasses}
            style={{ 
              background: hasCustomBackground 
                ? `url(${backgroundImage})` 
                : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!hasCustomBackground && (
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-transparent" />
            )}
            <div className="absolute inset-0 flex flex-col justify-between p-8" style={{ color: cardData.textColor }}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full" style={{ backgroundColor: cardData.accentColor }} />
                  <div>
                    <h3 className="text-2xl font-bold">{cardData.name}</h3>
                    <p className="text-sm opacity-90">{cardData.title}</p>
                  </div>
                </div>
                <p className="text-lg font-semibold" style={{ color: cardData.accentColor }}>
                  {cardData.company}
                </p>
              </div>
              <div className="space-y-1 text-xs">
                <p>{cardData.email}</p>
                <p>{cardData.phone}</p>
                <p>{cardData.website}</p>
              </div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-2" style={{ 
              background: `linear-gradient(90deg, transparent, ${cardData.accentColor}, transparent)` 
            }} />
            <div className="absolute bottom-0 left-0 right-0 h-2" style={{ 
              background: `linear-gradient(90deg, transparent, ${cardData.accentColor}, transparent)` 
            }} />
          </div>
        );
      case "dark-luxury":
        return (
          <div 
            className={baseClasses}
            style={{ 
              background: hasCustomBackground 
                ? `url(${backgroundImage})` 
                : 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!hasCustomBackground && (
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 to-transparent" />
            )}
            <div className="absolute inset-0 flex flex-col justify-between p-8" style={{ color: cardData.textColor }}>
              <div className="text-center">
                <h3 className="text-2xl font-light mb-2 tracking-wide">{cardData.name}</h3>
                <p className="text-sm opacity-90 mb-3">{cardData.title}</p>
                <p className="text-lg font-medium" style={{ color: cardData.accentColor }}>{cardData.company}</p>
              </div>
              <div className="text-center space-y-1 text-xs">
                <p>{cardData.email}</p>
                <p>{cardData.phone}</p>
                <p>{cardData.website}</p>
              </div>
            </div>
            <div className="absolute inset-0 border border-gray-800 rounded-lg" />
            <div className="absolute inset-0 border border-blue-900/30 rounded-lg m-1" />
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
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Luxury Card Preview
            </h2>
            <div className="flex gap-2">
              <Button onClick={() => setIsPreview(false)} variant="outline">
                Back to Editor
              </Button>
              <Button onClick={downloadCard} disabled={isDownloading} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download HD
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div id="luxury-card-preview" className="w-[400px] h-[300px] mx-auto">
              {renderLuxuryCardPreview()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8" />
          Luxury Card Editor
        </h1>
        <p className="text-gray-600 mt-2">Create premium business cards with advanced customization</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Editor Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Editor Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 max-h-[800px] overflow-y-auto">
            {/* Template Selection */}
            <div className="space-y-2">
              <Label>Premium Template</Label>
              <Select value={cardData.template} onValueChange={(value) => handleInputChange('template', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium-gradient">Premium Gradient</SelectItem>
                  <SelectItem value="nature-inspired">Nature Inspired</SelectItem>
                  <SelectItem value="gold-elegant">Gold Elegant</SelectItem>
                  <SelectItem value="dark-luxury">Dark Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Media Upload */}
            <div className="space-y-4">
              <h3 className="font-semibold">Media Assets</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Background Image</Label>
                  <Button 
                    onClick={() => handleImageUpload('background')} 
                    variant="outline" 
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <Button 
                    onClick={() => handleImageUpload('logo')} 
                    variant="outline" 
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Personal Information</h3>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={cardData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label>Professional Title</Label>
                <Input
                  value={cardData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Your professional title"
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
                  placeholder="email@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={cardData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 555 0123 4567"
                />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  value={cardData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="www.company.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  value={cardData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Business Ave, Suite 100, City, State 12345"
                  rows={2}
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="font-semibold">Social Media</h3>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input
                  value={cardData.socialLinks.linkedin}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/yourprofile"
                />
              </div>
              <div className="space-y-2">
                <Label>Twitter</Label>
                <Input
                  value={cardData.socialLinks.twitter}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  placeholder="@yourhandle"
                />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input
                  value={cardData.socialLinks.instagram}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  placeholder="@yourhandle"
                />
              </div>
            </div>

            {/* Color Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold">Color Scheme</h3>
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
                    placeholder="#ffffff"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <Label className="w-24">Accent</Label>
                  <Input
                    type="color"
                    value={cardData.accentColor}
                    onChange={(e) => handleInputChange('accentColor', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={cardData.accentColor}
                    onChange={(e) => handleInputChange('accentColor', e.target.value)}
                    placeholder="#d4af37"
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
              <Button onClick={downloadCard} disabled={isDownloading} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            {/* Saved Cards List */}
            {showSavedCards && (
              <div className="space-y-2">
                <h3 className="font-semibold">Saved Cards</h3>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {savedCards.length === 0 ? (
                    <p className="text-gray-500 text-sm">No saved cards found</p>
                  ) : (
                    savedCards.map((card) => (
                      <div 
                        key={card.id} 
                        className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                        onClick={() => loadCardFromServer(card.id)}
                      >
                        <div>
                          <p className="font-medium text-sm">{card.name}</p>
                          <p className="text-xs text-gray-500">{card.description}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Load
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div id="luxury-card-preview" className="w-[400px] h-[300px] mx-auto border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg relative">
                {isImageLoading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
                      <p className="text-sm text-gray-600 mt-2">Loading image...</p>
                    </div>
                  </div>
                )}
                {imageError && (
                  <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
                    <div className="text-center">
                      <p className="text-red-600 text-sm">Failed to load image</p>
                      <p className="text-red-500 text-xs">Using default background</p>
                    </div>
                  </div>
                )}
                {renderLuxuryCardPreview()}
              </div>
              <div className="text-center text-sm text-gray-600">
                Luxury Business Card Preview (400x300px)
              </div>
              <div className="text-center text-xs text-gray-500">
                Premium features include custom backgrounds, logos, and social media integration
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
