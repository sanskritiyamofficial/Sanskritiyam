import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { removeUndefinedValues } from './orderUtils';

// Collection names
const ORDERS_COLLECTION = 'orders';
const PAYMENTS_COLLECTION = 'payments';
const TEMPLE_OFFERINGS_COLLECTION = 'templeOfferings';
const USERS_COLLECTION = 'users';

// Order status constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

/**
 * Create a new order with dual storage (global + user-specific)
 * @param {Object} orderData - Order data
 * @returns {Promise<string>} - Document ID
 */
export const createOrder = async (orderData) => {
  try {
    const order = {
      ...orderData,
      status: ORDER_STATUS.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Clean undefined values before sending to Firestore
    const cleanedOrder = removeUndefinedValues(order);

    // Save to global orders collection
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), cleanedOrder);
    console.log('Order created with ID:', docRef.id);

    // If order has userId, also save to user's orders subcollection
    if (orderData.userId) {
      try {
        const userOrdersRef = collection(db, USERS_COLLECTION, orderData.userId, 'orders');
        await addDoc(userOrdersRef, {
          ...cleanedOrder,
          globalOrderId: docRef.id // Reference to global order
        });
        console.log('Order also saved to user collection');
      } catch (userError) {
        console.warn('Failed to save to user collection:', userError);
        // Don't fail the main order creation if user collection fails
      }
    }

    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Create a payment record
 * @param {Object} paymentData - Payment data
 * @returns {Promise<string>} - Document ID
 */
export const createPayment = async (paymentData) => {
  try {
    const payment = {
      ...paymentData,
      status: PAYMENT_STATUS.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Clean undefined values before sending to Firestore
    const cleanedPayment = removeUndefinedValues(payment);

    const docRef = await addDoc(collection(db, PAYMENTS_COLLECTION), cleanedPayment);
    console.log('Payment created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

/**
 * Update order status
 * @param {string} orderId - Order document ID
 * @param {string} status - New status
 * @param {Object} additionalData - Additional data to update
 */
export const updateOrderStatus = async (orderId, status, additionalData = {}) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status,
      ...additionalData,
      updatedAt: serverTimestamp()
    });
    console.log('Order status updated:', orderId, status);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Update payment status
 * @param {string} paymentId - Payment document ID
 * @param {string} status - New status
 * @param {Object} additionalData - Additional data to update
 */
export const updatePaymentStatus = async (paymentId, status, additionalData = {}) => {
  try {
    const paymentRef = doc(db, PAYMENTS_COLLECTION, paymentId);
    await updateDoc(paymentRef, {
      status,
      ...additionalData,
      updatedAt: serverTimestamp()
    });
    console.log('Payment status updated:', paymentId, status);
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

/**
 * Get user orders from user's subcollection
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of user orders
 */
export const getUserOrders = async (userId) => {
  try {
    const userOrdersRef = collection(db, USERS_COLLECTION, userId, 'orders');
    const q = query(userOrdersRef);
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      orders.push({
        id: doc.id,
        globalOrderId: orderData.globalOrderId,
        ...orderData
      });
    });
    
    // Sort by creation date (newest first)
    orders.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

/**
 * Get all orders
 * @param {number} limitCount - Number of orders to fetch
 * @returns {Promise<Array>} - Array of orders
 */
export const getAllOrders = async (limitCount = 50) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

/**
 * Get orders by status
 * @param {string} status - Order status
 * @returns {Promise<Array>} - Array of orders
 */
export const getOrdersByStatus = async (status) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting orders by status:', error);
    throw error;
  }
};

/**
 * Get order by ID
 * @param {string} orderId - Order document ID
 * @returns {Promise<Object|null>} - Order data or null
 */
export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (orderDoc.exists()) {
      return {
        id: orderDoc.id,
        ...orderDoc.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting order by ID:', error);
    throw error;
  }
};

/**
 * Get payments by order ID
 * @param {string} orderId - Order document ID
 * @returns {Promise<Array>} - Array of payments
 */
export const getPaymentsByOrderId = async (orderId) => {
  try {
    const q = query(
      collection(db, PAYMENTS_COLLECTION),
      where('orderId', '==', orderId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const payments = [];
    
    querySnapshot.forEach((doc) => {
      payments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return payments;
  } catch (error) {
    console.error('Error getting payments by order ID:', error);
    throw error;
  }
};

/**
 * Create a complete order with payment
 * @param {Object} orderData - Order data
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} - Created order and payment IDs
 */
export const createCompleteOrder = async (orderData, paymentData) => {
  try {
    // Create order first
    const orderId = await createOrder(orderData);
    
    // Create payment with order reference
    const paymentId = await createPayment({
      ...paymentData,
      orderId
    });
    
    return {
      orderId,
      paymentId
    };
  } catch (error) {
    console.error('Error creating complete order:', error);
    throw error;
  }
};

/**
 * Get order statistics
 * @returns {Promise<Object>} - Order statistics
 */
export const getOrderStatistics = async () => {
  try {
    const allOrders = await getAllOrders(1000); // Get more orders for stats
    
    const stats = {
      total: allOrders.length,
      pending: allOrders.filter(order => order.status === ORDER_STATUS.PENDING).length,
      confirmed: allOrders.filter(order => order.status === ORDER_STATUS.CONFIRMED).length,
      inProgress: allOrders.filter(order => order.status === ORDER_STATUS.IN_PROGRESS).length,
      completed: allOrders.filter(order => order.status === ORDER_STATUS.COMPLETED).length,
      cancelled: allOrders.filter(order => order.status === ORDER_STATUS.CANCELLED).length,
      totalRevenue: allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting order statistics:', error);
    throw error;
  }
};
