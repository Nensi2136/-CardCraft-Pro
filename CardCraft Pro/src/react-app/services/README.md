# Payment Service Integration

## Overview
The payment service is now connected to the API at `https://localhost:7130/api/payments`. This service handles payment processing, status checking, and payment history for the CardCraft Pro application.

## API Configuration
- **Base URL**: `https://localhost:7130/api`
- **Payment Endpoint**: `/api/payments`
- **Authentication**: Bearer token (stored in localStorage as 'authToken')

## Available Services

### PaymentService (`paymentService.ts`)
A dedicated service class that provides methods for:

1. **Create Payment**: `createPayment(paymentData: PaymentRequest)`
2. **Get Payment Status**: `getPaymentStatus(paymentId: string)`
3. **Get User Payments**: `getUserPayments()`
4. **Process Stripe Payment**: `processStripePayment(paymentIntentId: string)`
5. **Refund Payment**: `refundPayment(paymentId: string, reason?: string)`

### API Service (`api.ts`)
The main API service includes payment endpoints under `apiService.payments`:

1. **Create Payment**: `apiService.payments.createPayment()`
2. **Get Payment Status**: `apiService.payments.getPaymentStatus()`
3. **Get User Payments**: `apiService.payments.getUserPayments()`

## Type Definitions

### PaymentRequest
```typescript
interface PaymentRequest {
  amount: number;
  currency?: string; // defaults to 'USD'
  paymentMethod: string;
  cardDetails?: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardholderName: string;
  };
  description?: string;
}
```

### PaymentResponse
```typescript
interface PaymentResponse {
  paymentId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt?: string;
  clientSecret?: string; // For Stripe payment intent
  redirectUrl?: string; // For external payment gateways
}
```

## Usage Examples

### Basic Payment Creation
```typescript
import { paymentService, PaymentRequest } from '../services';

const paymentData: PaymentRequest = {
  amount: 9.99,
  currency: 'USD',
  paymentMethod: 'credit_card',
  cardDetails: {
    cardNumber: '4242424242424242',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123',
    cardholderName: 'John Doe'
  }
};

const response = await paymentService.createPayment(paymentData);

if (response.success) {
  console.log('Payment created:', response.data);
} else {
  console.error('Payment failed:', response.message);
}
```

### Check Payment Status
```typescript
const statusResponse = await paymentService.getPaymentStatus('payment-id-here');

if (statusResponse.success) {
  console.log('Payment status:', statusResponse.data.status);
}
```

### Get User Payment History
```typescript
const paymentsResponse = await paymentService.getUserPayments();

if (paymentsResponse.success) {
  console.log('User payments:', paymentsResponse.data);
}
```

## Error Handling
All payment service methods return an `ApiResponse<T>` object with the following structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}
```

Always check the `success` property before accessing the `data`.

## Integration Notes

1. **Authentication**: The service automatically includes the Bearer token from localStorage in all requests.
2. **Error Logging**: All errors are logged to the console for debugging purposes.
3. **Type Safety**: Full TypeScript support with proper type definitions.
4. **API Compatibility**: Compatible with the existing .NET Core API Gateway structure.

## Testing
Use the `PaymentExample.tsx` component to test the payment integration:

1. Import the component in your app
2. Render it to see the payment interface
3. Test payment creation and status checking

## Next Steps
1. Integrate with actual payment gateway (Stripe, PayPal, etc.)
2. Add webhook handling for payment notifications
3. Implement proper error recovery mechanisms
4. Add payment analytics and reporting
