import { createDonation, updateDonationStatus } from './donationService';
import { createPayment, updatePaymentStatus } from './orderService';

/**
 * Sync local donations to Firebase
 * This function attempts to sync any locally stored donations to Firebase
 */
export const syncLocalDonations = async () => {
  try {
    const localDonations = JSON.parse(localStorage.getItem('localDonations') || '[]');
    const syncedDonations = [];
    const failedDonations = [];

    console.log(`Found ${localDonations.length} local donations to sync`);

    for (const donation of localDonations) {
      if (donation.isLocal && donation.status === 'pending') {
        try {
          // Try to create the donation in Firebase
          const firebaseId = await createDonation(donation);
          console.log(`Successfully synced donation ${donation.id} to Firebase as ${firebaseId}`);
          
          // Update the local record with Firebase ID
          donation.firebaseId = firebaseId;
          donation.isLocal = false;
          syncedDonations.push(donation);
        } catch (error) {
          console.error(`Failed to sync donation ${donation.id}:`, error);
          failedDonations.push(donation);
        }
      }
    }

    // Update localStorage with synced donations
    if (syncedDonations.length > 0) {
      const remainingDonations = localDonations.filter(d => 
        !syncedDonations.some(s => s.id === d.id)
      );
      localStorage.setItem('localDonations', JSON.stringify(remainingDonations));
      console.log(`Synced ${syncedDonations.length} donations to Firebase`);
    }

    return {
      synced: syncedDonations.length,
      failed: failedDonations.length,
      syncedDonations,
      failedDonations
    };
  } catch (error) {
    console.error('Error syncing local donations:', error);
    return {
      synced: 0,
      failed: 0,
      syncedDonations: [],
      failedDonations: [],
      error: error.message
    };
  }
};

/**
 * Retry failed Firebase operations
 * This function retries any failed Firebase operations that were stored locally
 */
export const retryFailedOperations = async () => {
  try {
    const localDonations = JSON.parse(localStorage.getItem('localDonations') || '[]');
    const retryResults = [];

    for (const donation of localDonations) {
      if (donation.isLocal) {
        try {
          // Retry creating the donation
          const firebaseId = await createDonation(donation);
          console.log(`Retry successful for donation ${donation.id}: ${firebaseId}`);
          
          donation.firebaseId = firebaseId;
          donation.isLocal = false;
          retryResults.push({ success: true, donation });
        } catch (error) {
          console.error(`Retry failed for donation ${donation.id}:`, error);
          retryResults.push({ success: false, donation, error });
        }
      }
    }

    // Update localStorage
    const successfulRetries = retryResults.filter(r => r.success);
    if (successfulRetries.length > 0) {
      const remainingDonations = localDonations.filter(d => 
        !successfulRetries.some(r => r.donation.id === d.id)
      );
      localStorage.setItem('localDonations', JSON.stringify(remainingDonations));
    }

    return retryResults;
  } catch (error) {
    console.error('Error retrying failed operations:', error);
    return [];
  }
};

/**
 * Get local donations count
 */
export const getLocalDonationsCount = () => {
  try {
    const localDonations = JSON.parse(localStorage.getItem('localDonations') || '[]');
    return localDonations.length;
  } catch (error) {
    console.error('Error getting local donations count:', error);
    return 0;
  }
};

/**
 * Clear all local donations (use with caution)
 */
export const clearLocalDonations = () => {
  try {
    localStorage.removeItem('localDonations');
    console.log('Local donations cleared');
    return true;
  } catch (error) {
    console.error('Error clearing local donations:', error);
    return false;
  }
};
