// Payment Example Component
import React, { useState } from 'react';
import { paymentService, CreatePaymentDto, PaymentDto } from '../services';

const PaymentExample: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    setPaymentResult(null);

    try {
      const paymentData: CreatePaymentDto = {
        userId: 1, // TODO: Get from auth context
        amount: 9.99,
        currency: 'USD',
        paymentMethod: 'credit_card',
        paymentDetails: {
          cardNumber: '4242424242424242',
          expiryMonth: '12',
          expiryYear: '2025',
          cvv: '123',
          cardholderName: 'John Doe'
        },
        description: 'Premium template purchase'
      };

      const response = await paymentService.createPayment(paymentData);

      if (response.success && response.data) {
        setPaymentResult(response.data);
        console.log('Payment successful:', response.data);
      } else {
        setError(response.message || 'Payment failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (paymentId: string) => {
    try {
      const response = await paymentService.getPaymentStatus(paymentId);
      
      if (response.success && response.data) {
        console.log('Payment status:', response.data);
        alert(`Payment status: ${response.data.status}`);
      } else {
        setError(response.message || 'Failed to check payment status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check payment status');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Payment Example</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handlePayment} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Processing...' : 'Create Payment ($9.99)'}
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          Error: {error}
        </div>
      )}

      {paymentResult && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3>Payment Successful!</h3>
          <p><strong>Payment ID:</strong> {paymentResult.id}</p>
          <p><strong>Status:</strong> {paymentResult.status}</p>
          <p><strong>Amount:</strong> ${paymentResult.amount} {paymentResult.currency}</p>
          <p><strong>Payment Method:</strong> {paymentResult.paymentMethod}</p>
          <p><strong>Created At:</strong> {new Date(paymentResult.paymentDate).toLocaleString()}</p>
          
          <button 
            onClick={() => checkPaymentStatus(paymentResult.id.toString())}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Check Payment Status
          </button>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>API Integration Details</h3>
        <p><strong>Base URL:</strong> https://localhost:7130/api</p>
        <p><strong>Payment Endpoint:</strong> /api/payments</p>
        <p><strong>Service:</strong> PaymentService</p>
        <p><strong>Authentication:</strong> Bearer token from localStorage</p>
      </div>
    </div>
  );
};

export default PaymentExample;
