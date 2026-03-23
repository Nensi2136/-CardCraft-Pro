import React, { useState } from 'react';
import { paymentService, CreatePaymentDto } from '@/react-app/services';
import { Button } from '@/react-app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const PaymentTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testPayment = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Get user ID from localStorage (you might need to adjust this based on your auth system)
      const userId = parseInt(localStorage.getItem('userId') || '1');
      
      const paymentData: CreatePaymentDto = {
        userId: userId,
        amount: 9.99,
        currency: 'USD',
        description: 'Test payment - CardCraft Pro',
        paymentMethod: 'credit_card',
        paymentDetails: {
          cardNumber: '4242424242424242',
          expiryMonth: '12',
          expiryYear: '2025',
          cvv: '123',
          cardholderName: 'Test User'
        }
      };

      const response = await paymentService.createPayment(paymentData);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Payment API Test</CardTitle>
          <p className="text-sm text-gray-600">
            Test the connection to https://localhost:7130/api/payments
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testPayment} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing Payment...
              </>
            ) : (
              'Test Payment ($9.99)'
            )}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="text-red-800">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={result.success ? "default" : "destructive"}>
                  {result.success ? 'Success' : 'Failed'}
                </Badge>
                {result.success && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
              
              {/* Payment Details Display */}
              {result.data && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold">Payment Details:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Payment ID:</span>
                      <p className="font-mono text-xs bg-white p-2 rounded border">
                        {result.data.id}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">User ID:</span>
                      <p className="font-semibold">{result.data.userId}</p>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge 
                        variant={
                          result.data.status === 'Completed' ? 'default' :
                          result.data.status === 'Pending' ? 'secondary' :
                          result.data.status === 'Failed' ? 'destructive' : 'outline'
                        }
                        className="ml-2"
                      >
                        {result.data.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span>
                      <p>${result.data.amount} {result.data.currency}</p>
                    </div>
                    <div>
                      <span className="font-medium">Payment Method:</span>
                      <p>{result.data.paymentMethod}</p>
                    </div>
                    <div>
                      <span className="font-medium">Currency:</span>
                      <p>{result.data.currency}</p>
                    </div>
                    {result.data.transactionId && (
                      <div>
                        <span className="font-medium">Transaction ID:</span>
                        <p className="font-mono text-xs">{result.data.transactionId}</p>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Payment Date:</span>
                      <p className="text-xs">{new Date(result.data.paymentDate).toLocaleString()}</p>
                    </div>
                    {result.data.processedDate && (
                      <div>
                        <span className="font-medium">Processed Date:</span>
                        <p className="text-xs">{new Date(result.data.processedDate).toLocaleString()}</p>
                      </div>
                    )}
                    {result.data.description && (
                      <div className="col-span-2">
                        <span className="font-medium">Description:</span>
                        <p className="text-xs">{result.data.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Full Response */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Full API Response:</h4>
                <pre className="text-xs overflow-auto bg-white p-3 rounded border">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>

              {result.data?.id && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(result.data.id.toString());
                      alert('Payment ID copied to clipboard!');
                    }}
                  >
                    Copy Payment ID
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                      alert('Full response copied to clipboard!');
                    }}
                  >
                    Copy Full Response
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg text-sm">
            <h4 className="font-semibold text-blue-900 mb-2">API Details:</h4>
            <ul className="text-blue-800 space-y-1">
              <li>• Base URL: https://localhost:7130/api</li>
              <li>• Endpoint: /payments</li>
              <li>• Method: POST</li>
              <li>• Authentication: Bearer token from localStorage</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTest;
