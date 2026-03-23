import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { apiService } from '@/react-app/services/api';

export default function ApiTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing API connection...');
    
    try {
      // Test the login endpoint
      const response = await apiService.users.login({
        email: 'test@test.com',
        password: 'test123'
      });
      
      console.log('Test Response:', response);
      
      if (response.success) {
        setResult(`✅ API Connection Successful! Response: ${JSON.stringify(response, null, 2)}`);
      } else {
        setResult(`❌ API Connection Failed! Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Test error:', error);
      setResult(`❌ API Connection Failed! Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Test API Connection</h3>
              <p className="text-gray-600 mb-4">
                This will test the connection to your API server
              </p>
              <Button 
                onClick={testConnection} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Testing...' : 'Test API Connection'}
              </Button>
            </div>
            
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2">Test Result</h3>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap break-all">
                    {result}
                  </pre>
                </div>
              </div>
            </>
            <div>
              <strong>Step 3:</strong> Test Connection
              <div className="bg-gray-100 p-2 rounded mt-1">
                API Gateway: https://localhost:7130<br/>
                React App: http://localhost:5173
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
