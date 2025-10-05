import { useRazorpay } from 'react-razorpay';

// Razorpay configuration
const RAZORPAY_CONFIG = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Fallback for testing
  currency: 'INR',
  name: 'Sanskritiyam - Temple Services',
  description: 'Puja Booking and Temple Services',
  theme: {
    color: '#F37254'
  }
};

// Debug: Log the Razorpay key being used
console.log('Razorpay Key:', RAZORPAY_CONFIG.key ? 'Set' : 'Not set');

/**
 * Create Razorpay order using Razorpay API
 * For testing without backend, we'll use direct payment without order_id
 */
export const createRazorpayOrder = async (amount) => {
  try {
    // For testing without backend, we'll return null order_id
    // This allows Razorpay to handle the order creation internally
    const orderResponse = {
      id: null, // No order_id for direct payment
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      status: 'created'
    };

    console.log('Razorpay order created (direct payment):', orderResponse);
    return orderResponse;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
};

/**
 * Verify Razorpay payment signature
 * This should be called from your backend API
 * For testing, we'll simulate verification
 */
export const verifyRazorpayPayment = async (paymentData) => {
  try {
    // In a real implementation, this should call your backend API
    // which will verify the payment signature with Razorpay
    
    // For testing, we'll accept all payments as verified
    // In production, you MUST verify the signature on your backend
    const verificationResponse = {
      verified: true,
      paymentId: paymentData.razorpay_payment_id,
      orderId: paymentData.razorpay_order_id,
      signature: paymentData.razorpay_signature
    };

    console.log('Payment verification result:', verificationResponse);
    console.warn('⚠️ WARNING: Payment verification is mocked for testing. Implement proper verification in production!');
    return verificationResponse;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Payment verification failed');
  }
};

/**
 * Get Razorpay payment options
 */
export const getRazorpayOptions = (orderId, amount, userDetails, onSuccess, onError) => {
  const options = {
    key: RAZORPAY_CONFIG.key,
    amount: amount * 100, // Convert to paise
    currency: RAZORPAY_CONFIG.currency,
    name: RAZORPAY_CONFIG.name,
    description: RAZORPAY_CONFIG.description,
    prefill: {
      name: userDetails.name || '',
      email: userDetails.email || '',
      contact: userDetails.phone || ''
    },
    theme: RAZORPAY_CONFIG.theme,
    notes: {
      address: userDetails.address || '',
      city: userDetails.city || '',
      state: userDetails.state || '',
      pincode: userDetails.pincode || ''
    }
  };

  // Only add order_id if it exists (for backend integration)
  if (orderId) {
    options.order_id = orderId;
  }

  // Only add handler if provided
  if (onSuccess) {
    options.handler = onSuccess;
  }

  // Only add modal dismiss handler if provided
  if (onError) {
    options.modal = {
      ondismiss: () => {
        console.log('Payment modal dismissed');
        onError('Payment cancelled by user');
      }
    };
  }

  return options;
};

/**
 * Custom hook for Razorpay integration
 */
export const useRazorpayPayment = () => {
  const { error, isLoading, Razorpay } = useRazorpay();

  const initiatePayment = async (amount, userDetails) => {
    try {
      console.log('Initiating payment for amount:', amount);
      console.log('User details:', userDetails);
      
      // Create Razorpay order
      const razorpayOrder = await createRazorpayOrder(amount);
      
      // Create Razorpay options
      const razorpayOptions = getRazorpayOptions(
        razorpayOrder.id, // This will be null for direct payment
        amount,
        userDetails,
        null, // We'll handle success in the promise
        null  // We'll handle error in the promise
      );

      console.log('Razorpay options:', razorpayOptions);

      // Return a promise that resolves when payment is completed
      return new Promise((resolve, reject) => {
        const razorpayInstance = new Razorpay(razorpayOptions);
        
        // Handle payment success
        razorpayInstance.on('payment.success', async (response) => {
          try {
            console.log('Payment success response:', response);
            
            // Verify payment
            const verification = await verifyRazorpayPayment(response);
            
            if (verification.verified) {
              resolve({
                success: true,
                paymentId: verification.paymentId,
                orderId: verification.orderId || response.razorpay_order_id,
                signature: verification.signature,
                razorpayOrderId: razorpayOrder.id || response.razorpay_order_id
              });
            } else {
              reject(new Error('Payment verification failed'));
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            reject(error);
          }
        });

        // Handle payment error
        razorpayInstance.on('payment.error', (error) => {
          console.error('Payment error:', error);
          reject(new Error(error.description || 'Payment failed'));
        });

        // Handle modal dismissal
        razorpayInstance.on('payment.modal.close', () => {
          reject(new Error('Payment cancelled by user'));
        });

        // Open the payment modal
        razorpayInstance.open();
      });

    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  };

  return {
    initiatePayment,
    isLoading,
    error
  };
};

export default useRazorpayPayment;
