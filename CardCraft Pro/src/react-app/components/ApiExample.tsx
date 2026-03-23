import { useAuth, useCardTemplates, usePayment, useFileUpload } from '../hooks/useApi';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function ApiExample() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { data: templates, loading, error } = useCardTemplates();
  const { processPayment, processing, error: paymentError } = usePayment();
  const { uploadFile, uploading } = useFileUpload();

  const handleLogin = async () => {
    const result = await login({
      email: 'user@example.com',
      password: 'password123'
    });
    
    if (result.success) {
      console.log('Login successful');
    } else {
      console.error('Login failed:', result.message);
    }
  };

  const handlePayment = async () => {
    const result = await processPayment({
      amount: 19.00,
      paymentMethod: 'credit_card',
      cardDetails: {
        number: '4242424242424242',
        exp_month: 12,
        exp_year: 25,
        cvc: '123'
      }
    });

    if (result.success) {
      console.log('Payment successful:', result.payment);
    } else {
      console.error('Payment failed:', result.message);
    }
  };

  const handleFileUpload = async (file: File) => {
    const result = await uploadFile(file, 'background', { templateId: '123' });
    
    if (result.success) {
      console.log('Upload successful:', result.data);
    } else {
      console.error('Upload failed:', result.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            <div className="space-y-4">
              <p>Welcome, {user?.name}!</p>
              <Button onClick={() => logout()}>Logout</Button>
            </div>
          ) : (
            <Button onClick={handleLogin}>Login</Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Card Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading templates...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {templates && (
            <div className="space-y-2">
              {templates.map((template: any) => (
                <div key={template.id} className="p-2 border rounded">
                  <h3>{template.name}</h3>
                  <p>{template.category}</p>
                  <p>Premium: {template.isPremium ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handlePayment} 
            disabled={processing}
            className="w-full"
          >
            {processing ? 'Processing...' : 'Process Payment ($19.00)'}
          </Button>
          {paymentError && (
            <p className="text-red-500 mt-2">Error: {paymentError}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            disabled={uploading}
          />
          {uploading && <p>Uploading...</p>}
        </CardContent>
      </Card>
    </div>
  );
}
