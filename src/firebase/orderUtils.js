/**
 * Utility functions for order and payment data formatting
 */

/**
 * Remove undefined values from an object recursively
 * @param {Object} obj - Object to clean
 * @returns {Object} - Cleaned object
 */
export const removeUndefinedValues = (obj) => {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedValues).filter(item => item !== null && item !== undefined);
  }
  
  if (typeof obj === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        const cleanedValue = removeUndefinedValues(value);
        if (cleanedValue !== null && cleanedValue !== undefined) {
          cleaned[key] = cleanedValue;
        }
      }
    }
    return cleaned;
  }
  
  return obj;
};

/**
 * Format order data for Firebase storage
 * @param {Object} formData - Form data from payment page
 * @param {Object} selectedPackage - Selected puja package
 * @param {Object} templeData - Temple information
 * @param {Object} cartItems - Cart items with quantities
 * @param {number} totalAmount - Total amount
 * @returns {Object} - Formatted order data
 */
export const formatOrderData = (formData, selectedPackage, templeData, cartItems, totalAmount) => {
  const orderItems = [];
  
  // Add main package
  orderItems.push({
    type: 'package',
    name: selectedPackage.name,
    price: selectedPackage.price,
    quantity: 1,
    description: selectedPackage.description
  });
  
  // Add cart items
  Object.entries(cartItems).forEach(([itemId, item]) => {
    if (item.quantity > 0) {
      // Find the full item details from temple offerings
      const fullItem = templeData.offerings?.find(offering => offering.id === itemId);
      if (fullItem) {
        orderItems.push({
          type: 'offering',
          id: itemId,
          name: item.name || fullItem.name,
          price: fullItem.price,
          quantity: item.quantity,
          description: fullItem.description
        });
      }
    }
  });
  
  const orderData = {
    // Customer information
    customer: {
      name: formData.name || '',
      gotra: formData.gotra || '',
      email: formData.email || '',
      phone: formData.phone || '',
      address: {
        street: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        pincode: formData.pincode || ''
      }
    },
    
    // Temple and package information
    temple: {
      id: templeData.id || '',
      name: templeData.name || '',
      location: templeData.location || '',
      image: templeData.image || ''
    },
    
    // Order details
    package: {
      id: selectedPackage.id || '',
      name: selectedPackage.name || '',
      price: selectedPackage.price || 0,
      description: selectedPackage.description || ''
    },
    
    // Items and pricing
    items: orderItems || [],
    totalAmount: totalAmount || 0,
    
    // Order metadata
    orderNumber: generateOrderNumber(),
    eventName: `${templeData.name || ''} - ${selectedPackage.name || ''}`,
    
    // Additional information
    notes: formData.notes || '',
    specialInstructions: formData.specialInstructions || '',
    
    // Family member information
    familyMembers: formData.familyMembers || [],
    additionalNames: formData.additionalNames || ''
  };

  // Clean undefined values before returning
  return removeUndefinedValues(orderData);
};

/**
 * Format payment data for Firebase storage
 * @param {Object} orderData - Formatted order data
 * @param {string} orderId - Order document ID
 * @param {Object} paymentDetails - Payment gateway details
 * @returns {Object} - Formatted payment data
 */
export const formatPaymentData = (orderData, orderId, paymentDetails = {}) => {
  const paymentData = {
    orderId: orderId || '',
    
    // Payment amount
    amount: orderData.totalAmount || 0,
    currency: 'INR',
    
    // Payment method
    paymentMethod: paymentDetails.method || 'online',
    paymentGateway: paymentDetails.gateway || 'razorpay',
    
    // Payment gateway details
    gatewayDetails: {
      transactionId: paymentDetails.transactionId || '',
      paymentId: paymentDetails.paymentId || '',
      signature: paymentDetails.signature || '',
      gatewayOrderId: paymentDetails.gatewayOrderId || 'direct_payment'
    },
    
    // Customer reference
    customerEmail: orderData.customer?.email || '',
    customerPhone: orderData.customer?.phone || '',
    
    // Order reference
    orderNumber: orderData.orderNumber || '',
    eventName: orderData.eventName || ''
  };

  // Clean undefined values before returning
  return removeUndefinedValues(paymentData);
};

/**
 * Generate a unique order number
 * @returns {string} - Order number
 */
export const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SKT${timestamp.slice(-6)}${random}`;
};

/**
 * Format order for display
 * @param {Object} order - Order data from Firebase
 * @returns {Object} - Formatted order for display
 */
export const formatOrderForDisplay = (order) => {
  const createdAt = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
  
  return {
    ...order,
    createdAt: createdAt.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    formattedAmount: `₹${order.totalAmount?.toLocaleString('en-IN')}`,
    statusText: getStatusText(order.status),
    itemsCount: order.items?.length || 0
  };
};

/**
 * Get human-readable status text
 * @param {string} status - Status code
 * @returns {string} - Human-readable status
 */
export const getStatusText = (status) => {
  const statusMap = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  
  return statusMap[status] || status;
};

/**
 * Validate order data before saving
 * @param {Object} orderData - Order data to validate
 * @returns {Object} - Validation result
 */
export const validateOrderData = (orderData) => {
  const errors = [];
  
  // Required fields
  if (!orderData.customer?.name) errors.push('Customer name is required');
  if (!orderData.customer?.email) errors.push('Customer email is required');
  if (!orderData.customer?.phone) errors.push('Customer phone is required');
  if (!orderData.temple?.id) errors.push('Temple information is required');
  if (!orderData.package?.id) errors.push('Package information is required');
  if (!orderData.totalAmount || orderData.totalAmount <= 0) errors.push('Valid total amount is required');
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (orderData.customer?.email && !emailRegex.test(orderData.customer.email)) {
    errors.push('Valid email address is required');
  }
  
  // Phone validation (basic)
  const phoneRegex = /^[6-9]\d{9}$/;
  if (orderData.customer?.phone && !phoneRegex.test(orderData.customer.phone.replace(/\D/g, ''))) {
    errors.push('Valid 10-digit phone number is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
