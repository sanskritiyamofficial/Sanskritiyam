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
const DONATIONS_COLLECTION = 'donations';
const USERS_COLLECTION = 'users';

// Donation status constants
export const DONATION_STATUS = {
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
 * Create a new donation with dual storage (global + user-specific)
 * @param {Object} donationData - Donation data
 * @returns {Promise<string>} - Document ID
 */
export const createDonation = async (donationData) => {
  try {
    const donation = {
      ...donationData,
      status: DONATION_STATUS.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Clean undefined values before sending to Firestore
    const cleanedDonation = removeUndefinedValues(donation);

    // Save to global donations collection
    const docRef = await addDoc(collection(db, DONATIONS_COLLECTION), cleanedDonation);
    console.log('Donation created with ID:', docRef.id);

    // If donation has userId, also save to user's donations subcollection
    if (donationData.userId) {
      try {
        const userDonationsRef = collection(db, USERS_COLLECTION, donationData.userId, 'donations');
        await addDoc(userDonationsRef, {
          ...cleanedDonation,
          globalDonationId: docRef.id // Reference to global donation
        });
        console.log('Donation also saved to user collection');
      } catch (userError) {
        console.warn('Failed to save to user collection:', userError);
        // Don't fail the main donation creation if user collection fails
      }
    }

    return docRef.id;
  } catch (error) {
    console.error('Error creating donation:', error);
    throw error;
  }
};

/**
 * Update donation status
 * @param {string} donationId - Donation document ID
 * @param {string} status - New status
 * @param {Object} additionalData - Additional data to update
 */
export const updateDonationStatus = async (donationId, status, additionalData = {}) => {
  try {
    const donationRef = doc(db, DONATIONS_COLLECTION, donationId);
    await updateDoc(donationRef, {
      status,
      ...additionalData,
      updatedAt: serverTimestamp()
    });
    console.log('Donation status updated:', donationId, status);
  } catch (error) {
    console.error('Error updating donation status:', error);
    throw error;
  }
};

/**
 * Get user donations from user's subcollection
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of user donations
 */
export const getUserDonations = async (userId) => {
  try {
    const userDonationsRef = collection(db, USERS_COLLECTION, userId, 'donations');
    const q = query(userDonationsRef);
    const querySnapshot = await getDocs(q);
    
    const donations = [];
    querySnapshot.forEach((doc) => {
      const donationData = doc.data();
      donations.push({
        id: doc.id,
        globalDonationId: donationData.globalDonationId,
        ...donationData
      });
    });
    
    // Sort by creation date (newest first)
    donations.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    });
    
    return donations;
  } catch (error) {
    console.error('Error getting user donations:', error);
    throw error;
  }
};

/**
 * Get all donations
 * @param {number} limitCount - Number of donations to fetch
 * @returns {Promise<Array>} - Array of donations
 */
export const getAllDonations = async (limitCount = 50) => {
  try {
    const q = query(
      collection(db, DONATIONS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const donations = [];
    
    querySnapshot.forEach((doc) => {
      donations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return donations;
  } catch (error) {
    console.error('Error getting donations:', error);
    throw error;
  }
};

/**
 * Get donations by status
 * @param {string} status - Donation status
 * @returns {Promise<Array>} - Array of donations
 */
export const getDonationsByStatus = async (status) => {
  try {
    const q = query(
      collection(db, DONATIONS_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const donations = [];
    
    querySnapshot.forEach((doc) => {
      donations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return donations;
  } catch (error) {
    console.error('Error getting donations by status:', error);
    throw error;
  }
};

/**
 * Get donation by ID
 * @param {string} donationId - Donation document ID
 * @returns {Promise<Object|null>} - Donation data or null
 */
export const getDonationById = async (donationId) => {
  try {
    const donationRef = doc(db, DONATIONS_COLLECTION, donationId);
    const donationDoc = await getDoc(donationRef);
    
    if (donationDoc.exists()) {
      return {
        id: donationDoc.id,
        ...donationDoc.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting donation by ID:', error);
    throw error;
  }
};

/**
 * Get donation statistics
 * @returns {Promise<Object>} - Donation statistics
 */
export const getDonationStatistics = async () => {
  try {
    const allDonations = await getAllDonations(1000); // Get more donations for stats
    
    const stats = {
      total: allDonations.length,
      pending: allDonations.filter(donation => donation.status === DONATION_STATUS.PENDING).length,
      confirmed: allDonations.filter(donation => donation.status === DONATION_STATUS.CONFIRMED).length,
      inProgress: allDonations.filter(donation => donation.status === DONATION_STATUS.IN_PROGRESS).length,
      completed: allDonations.filter(donation => donation.status === DONATION_STATUS.COMPLETED).length,
      cancelled: allDonations.filter(donation => donation.status === DONATION_STATUS.CANCELLED).length,
      totalAmount: allDonations.reduce((sum, donation) => sum + (donation.amount || 0), 0)
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting donation statistics:', error);
    throw error;
  }
};

/**
 * Format donation data for storage
 * @param {Object} formData - Form data
 * @param {Object} donationType - Selected donation type
 * @param {Object} temple - Selected temple
 * @param {number} amount - Donation amount
 * @returns {Object} - Formatted donation data
 */
export const formatDonationData = (formData, donationType, temple, amount) => {
  return {
    type: donationType.id,
    typeName: donationType.name,
    templeId: temple.id,
    templeName: temple.name,
    templeLocation: temple.location,
    offeringDate: temple.date,
    amount: amount,
    donorName: formData.name,
    donorPhone: formData.phone,
    donorEmail: formData.email,
    donorMessage: formData.message || '',
    paymentMethod: 'online',
    paymentGateway: 'razorpay'
  };
};

/**
 * Send donation confirmation email/WhatsApp
 * @param {Object} donationData - Donation data
 * @param {Object} paymentData - Payment data
 * @returns {Promise<void>}
 */
export const sendDonationConfirmation = async (donationData, paymentData) => {
  try {
    // Import notification service
    const { sendDonationConfirmation: sendNotification } = await import('./notificationService');
    
    // Send notifications
    const results = await sendNotification(donationData, paymentData);
    
    console.log('Donation confirmation sent:', results);
    return results;
  } catch (error) {
    console.error('Error sending donation confirmation:', error);
    throw error;
  }
};
