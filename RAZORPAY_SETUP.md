# Razorpay Integration Setup Guide

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Razorpay Configuration
# Get these from your Razorpay Dashboard: https://dashboard.razorpay.com/app/keys
REACT_APP_RAZORPAY_KEY_ID=rzp_test_1234567890
REACT_APP_RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Razorpay Dashboard Setup

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings > API Keys
3. Generate API Keys for your application
4. Copy the Key ID and Key Secret
5. Add them to your `.env` file

## Backend Integration Required

The current implementation uses mock functions for order creation and payment verification. For production, you need to:

### 1. Create Razorpay Order (Backend API)

Create an API endpoint to create Razorpay orders:

```javascript
// Example backend endpoint
app.post('/api/create-razorpay-order', async (req, res) => {
  const { amount, currency = 'INR' } = req.body;
  
  const options = {
    amount: amount * 100, // Convert to paise
    currency,
    receipt: `receipt_${Date.now()}`,
  };
  
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. Verify Payment (Backend API)

Create an API endpoint to verify payments:

```javascript
// Example backend endpoint
app.post('/api/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');
  
  const isAuthentic = generated_signature === razorpay_signature;
  
  if (isAuthentic) {
    res.json({ verified: true });
  } else {
    res.status(400).json({ verified: false });
  }
});
```

### 3. Update Frontend Service

Update the `razorpayService.js` to call your backend APIs:

```javascript
// Replace mock functions with actual API calls
export const createRazorpayOrder = async (amount) => {
  const response = await fetch('/api/create-razorpay-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount })
  });
  
  return await response.json();
};

export const verifyRazorpayPayment = async (paymentData) => {
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData)
  });
  
  return await response.json();
};
```

## Payment Flow

1. **User fills form** → Form validation
2. **Create order in Firebase** → Order created with 'pending' status
3. **Create Razorpay order** → Backend creates order with Razorpay
4. **Open Razorpay modal** → User completes payment
5. **Payment success** → Verify payment with backend
6. **Update Firebase** → Order status to 'confirmed', payment to 'success'
7. **Redirect user** → Success page or home

## Error Handling

The integration includes comprehensive error handling:

- **Form validation errors** → User-friendly messages
- **Razorpay loading errors** → Display loading state
- **Payment failures** → Update Firebase with failed status
- **Network errors** → Retry mechanism and user feedback

## Testing

For testing, use Razorpay's test mode with test cards:

- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Security Notes

1. **Never expose Key Secret** in frontend code
2. **Always verify payments** on backend
3. **Use HTTPS** in production
4. **Validate amounts** on backend before creating orders
5. **Log all payment attempts** for audit

## Production Checklist

- [ ] Replace mock functions with real API calls
- [ ] Set up proper error logging
- [ ] Configure webhook for payment notifications
- [ ] Test with real Razorpay test environment
- [ ] Set up monitoring and alerts
- [ ] Configure proper CORS settings
- [ ] Implement rate limiting
- [ ] Set up backup payment methods
