import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/react-app/components/ui/tabs";
import { Eye, Download, RotateCcw } from "lucide-react";
import ApiDataDisplay from "./ApiDataDisplay";

interface BasicCardData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  textColor: string;
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
  template: "professional"
};

export default function CardEditorWithApi() {
  const [cardData, setCardData] = useState<BasicCardData>(defaultCardData);
  const [isPreview, setIsPreview] = useState(false);

  const handleInputChange = (field: keyof BasicCardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const resetCard = () => {
    setCardData(defaultCardData);
  };

  const downloadCard = () => {
    const element = document.getElementById('card-preview');
    if (element) {
      // Create a canvas and convert the card to image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 350;
        canvas.height = 250;
        
        // Set default background based on template
        const backgrounds = {
          professional: "#3B82F6",
          modern: "#8B5CF6", 
          minimal: "#6B7280"
        };
        
        ctx.fillStyle = backgrounds[cardData.template];
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = cardData.textColor;
        ctx.font = 'bold 16px Arial';
        ctx.fillText(cardData.name, 20, 40);
        ctx.font = '12px Arial';
        ctx.fillText(cardData.title, 20, 60);
        ctx.fillText(cardData.company, 20, 80);
        ctx.fillText(cardData.email, 20, 110);
        ctx.fillText(cardData.phone, 20, 130);
        ctx.fillText(cardData.website, 20, 150);
        ctx.fillText(cardData.address, 20, 190);
        
        const link = document.createElement('a');
        link.download = 'business-card.png';
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  };

  const renderCardPreview = () => {
    const baseClasses = "w-full h-full rounded-lg p-6 text-white relative overflow-hidden";
    
    switch (cardData.template) {
      case "professional":
        return (
          <div 
            className={baseClasses}
            style={{ backgroundColor: "#3B82F6", color: cardData.textColor }}
          >
            <div className="space-y-2">
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
            style={{ 
              background: "linear-gradient(135deg, #8B5CF6 0%, #8B5CF6DD 100%)",
              color: cardData.textColor 
            }}
          >
            <div className="flex flex-col justify-between h-full">
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
            style={{ backgroundColor: "#6B7280", color: cardData.textColor }}
          >
            <div className="text-center space-y-3">
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
              <Button onClick={downloadCard}>
                <Download className="w-4 h-4 mr-2" />
                Download
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
        <h1 className="text-3xl font-bold mb-2">Card Editor with API Integration</h1>
        <p className="text-gray-600">
          Create business cards and view API data in one place
        </p>
      </div>

      <Tabs defaultValue="editor" className="mb-8">
        <TabsList>
          <TabsTrigger value="editor">Card Editor</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="api-data">API Data</TabsTrigger>
        </TabsList>

        <TabsContent value="editor">
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
                  <h3 className="font-semibold">Text Color</h3>
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
                  <Button onClick={() => setIsPreview(true)} className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
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
                  <div className="w-[350px] h-[250px] mx-auto border-2 border-gray-200 rounded-lg overflow-hidden">
                    {renderCardPreview()}
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    Business Card Preview (350x250px)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <ApiDataDisplay dataType="templates" limit={20} />
        </TabsContent>

        <TabsContent value="api-data">
          <div className="grid lg:grid-cols-2 gap-6">
            <ApiDataDisplay dataType="categories" limit={10} />
            <ApiDataDisplay dataType="reviews" limit={10} />
            <ApiDataDisplay dataType="payments" limit={5} />
            <ApiDataDisplay dataType="users" limit={1} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
