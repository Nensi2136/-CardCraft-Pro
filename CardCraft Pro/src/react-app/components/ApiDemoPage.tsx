import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/react-app/components/ui/select';
import { Badge } from '@/react-app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/react-app/components/ui/tabs';
import ApiDataDisplay from './ApiDataDisplay';
import { Database, Settings, Globe, Shield, BarChart } from 'lucide-react';

export default function ApiDemoPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('templates');
  const [limit, setLimit] = useState('10');

  const endpoints = [
    { value: 'templates', label: 'Card Templates', description: 'Fetch business card templates' },
    { value: 'categories', label: 'Template Categories', description: 'Get template categories' },
    { value: 'users', label: 'User Profile', description: 'Get current user profile' },
    { value: 'payments', label: 'Payment History', description: 'View payment records' },
    { value: 'reviews', label: 'Reviews', description: 'Show template reviews' },
  ];

  const getApiUrl = () => {
    const baseUrl = 'https://localhost:7130';
    switch (selectedEndpoint) {
      case 'templates': return `${baseUrl}/api/cards/templates`;
      case 'categories': return `${baseUrl}/api/cards/categories`;
      case 'users': return `${baseUrl}/api/users/profile`;
      case 'payments': return `${baseUrl}/api/payments/user`;
      case 'reviews': return `${baseUrl}/api/reviews`;
      default: return baseUrl;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API Data Display Demo</h1>
        <p className="text-gray-600">
          This page demonstrates how to fetch and display data from various API endpoints
        </p>
      </div>

      {/* Configuration Panel */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Endpoint</label>
              <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {endpoints.map((endpoint) => (
                    <SelectItem key={endpoint.value} value={endpoint.value}>
                      <div>
                        <div className="font-medium">{endpoint.label}</div>
                        <div className="text-xs text-gray-500">{endpoint.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Result Limit</label>
              <Select value={limit} onValueChange={setLimit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 items</SelectItem>
                  <SelectItem value="10">10 items</SelectItem>
                  <SelectItem value="20">20 items</SelectItem>
                  <SelectItem value="50">50 items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">API Endpoint</div>
                <div className="text-xs text-gray-600 font-mono">{getApiUrl()}</div>
              </div>
              <Badge variant="outline" className="text-xs">
                GET Request
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Display Tabs */}
      <Tabs defaultValue="single" className="mb-8">
        <TabsList>
          <TabsTrigger value="single">Single Endpoint</TabsTrigger>
          <TabsTrigger value="multiple">Multiple Endpoints</TabsTrigger>
          <TabsTrigger value="stats">API Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <ApiDataDisplay 
            dataType={selectedEndpoint as any} 
            limit={parseInt(limit)}
          />
        </TabsContent>

        <TabsContent value="multiple">
          <div className="grid lg:grid-cols-2 gap-6">
            <ApiDataDisplay dataType="templates" limit={5} />
            <ApiDataDisplay dataType="categories" limit={5} />
            <ApiDataDisplay dataType="reviews" limit={5} />
            <ApiDataDisplay dataType="payments" limit={5} />
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <ApiDataDisplay dataType="templates" limit={1} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <ApiDataDisplay dataType="categories" limit={1} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Reviews</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <ApiDataDisplay dataType="reviews" limit={1} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* API Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            API Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Base URL Configuration</h4>
              <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                https://localhost:7130
              </div>
              <p className="text-xs text-gray-600 mt-1">
                This is configured in <code className="bg-gray-100 px-1 rounded">src/react-app/services/api.ts</code>
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Authentication</h4>
              <p className="text-sm text-gray-600">
                Some endpoints require authentication. The API client automatically includes 
                the JWT token from localStorage in the Authorization header.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Error Handling</h4>
              <p className="text-sm text-gray-600">
                All API responses are wrapped in a standardized format with success status, 
                data, and error messages. The component handles loading states and errors gracefully.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
