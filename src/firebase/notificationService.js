import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { sendEmail, sendDonationEmail, sendOrderEmail } from './emailService';
import { sendWhatsAppMessage, sendDonationWhatsApp, sendOrderWhatsApp } from './whatsappService';

// Collection names
const NOTIFICATIONS_COLLECTION = 'notifications';

// Helper function to get contact information from environment variables
const getContactInfo = () => {
  const whatsappNumber = import.meta.env.VITE_NUMBER || '918810733829';
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'sanskritiyamofficial@gmail.com';
  
  return {
    whatsappNumber,
    adminEmail,
    formattedWhatsapp: `+91 ${whatsappNumber.slice(2)}`, // Remove 91 prefix and add +91
    formattedEmail: adminEmail
  };
};

/**
 * Send WhatsApp notification
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} message - Message to send
 * @returns {Promise<boolean>} - Success status
 */
export const sendWhatsAppNotification = async (phoneNumber, message) => {
  try {
    // Get contact information from environment variables
    const { whatsappNumber } = getContactInfo();
    
    // Actually send WhatsApp message
    const success = await sendWhatsAppMessage(phoneNumber, message);
    
    // Log the notification for admin tracking
    await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
      type: 'whatsapp',
      recipient: phoneNumber,
      message: message,
      status: success ? 'sent' : 'failed',
      createdAt: serverTimestamp(),
      sentFrom: whatsappNumber
    });

    console.log('WhatsApp notification result:', {
      phone: phoneNumber,
      success: success,
      message: message.substring(0, 50) + '...'
    });

    return success;
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    
    // Get contact information for error logging
    const { whatsappNumber } = getContactInfo();
    
    // Log failed notification
    try {
      await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
        type: 'whatsapp',
        recipient: phoneNumber,
        message: message,
        status: 'failed',
        error: error.message,
        createdAt: serverTimestamp(),
        sentFrom: whatsappNumber
      });
    } catch (logError) {
      console.error('Error logging failed notification:', logError);
    }
    
    return false;
  }
};

/**
 * Send Email notification
 * @param {string} email - Email address
 * @param {string} subject - Email subject
 * @param {string} message - Email message (HTML)
 * @returns {Promise<boolean>} - Success status
 */
export const sendEmailNotification = async (email, subject, message) => {
  try {
    // Get contact information from environment variables
    const { adminEmail } = getContactInfo();
    
    // Actually send email
    const success = await sendEmail(email, subject, message);
    
    // Log the notification for admin tracking
    await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
      type: 'email',
      recipient: email,
      subject: subject,
      message: message,
      status: success ? 'sent' : 'failed',
      createdAt: serverTimestamp(),
      sentFrom: adminEmail
    });

    console.log('Email notification result:', {
      email: email,
      success: success,
      subject: subject
    });

    return success;
  } catch (error) {
    console.error('Error sending email notification:', error);
    
    // Get contact information for error logging
    const { adminEmail } = getContactInfo();
    
    // Log failed notification
    try {
      await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
        type: 'email',
        recipient: email,
        subject: subject,
        message: message,
        status: 'failed',
        error: error.message,
        createdAt: serverTimestamp(),
        sentFrom: adminEmail
      });
    } catch (logError) {
      console.error('Error logging failed notification:', logError);
    }
    
    return false;
  }
};

/**
 * Send donation confirmation notifications
 * @param {Object} donationData - Donation data
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} - Notification results
 */
export const sendDonationConfirmation = async (donationData, paymentData) => {
  try {
    const { donorEmail, donorPhone } = donationData;

    const results = {
      whatsapp: false,
      email: false
    };

    // Send WhatsApp notification using real service
    if (donorPhone) {
      results.whatsapp = await sendDonationWhatsApp(donationData, paymentData);
    }

    // Send Email notification using real service
    if (donorEmail) {
      results.email = await sendDonationEmail(donationData, paymentData);
    }

    return results;
  } catch (error) {
    console.error('Error sending donation confirmation:', error);
    return {
      whatsapp: false,
      email: false,
      error: error.message
    };
  }
};

/**
 * Send order confirmation notifications
 * @param {Object} orderData - Order data
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} - Notification results
 */
export const sendOrderConfirmation = async (orderData, paymentData) => {
  try {
    const { customerEmail, customerPhone } = orderData;

    const results = {
      whatsapp: false,
      email: false
    };

    // Send WhatsApp notification using real service
    if (customerPhone) {
      results.whatsapp = await sendOrderWhatsApp(orderData, paymentData);
    }

    // Send Email notification using real service
    if (customerEmail) {
      results.email = await sendOrderEmail(orderData, paymentData);
    }

    return results;
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    return {
      whatsapp: false,
      email: false,
      error: error.message
    };
  }
};

/**
 * Send admin notification
 * @param {string} message - Message to send
 * @returns {Promise<Object>} - Notification results
 */
export const sendAdminNotification = async (message) => {
  try {
    const { formattedWhatsapp, formattedEmail } = getContactInfo();
    
    const results = {
      whatsapp: false,
      email: false
    };

    // Send WhatsApp to admin
    try {
      results.whatsapp = await sendWhatsAppMessage(formattedWhatsapp, message);
    } catch (whatsappError) {
      console.error('Error sending admin WhatsApp:', whatsappError);
    }

    // Send email to admin
    try {
      results.email = await sendEmail(formattedEmail, 'Admin Notification', message);
    } catch (emailError) {
      console.error('Error sending admin email:', emailError);
    }

    return results;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return {
      whatsapp: false,
      email: false,
      error: error.message
    };
  }
};

/**
 * Get notification statistics
 * @returns {Promise<Object>} - Statistics
 */
export const getNotificationStats = async () => {
  try {
    // This would typically query the notifications collection
    // For now, return mock data
    const stats = {
      totalSent: 0,
      emailSent: 0,
      whatsappSent: 0,
      failed: 0
    };
    return stats;
  } catch (error) {
    console.error('Error getting notification stats:', error);
    return {
      totalSent: 0,
      emailSent: 0,
      whatsappSent: 0,
      failed: 0,
      error: error.message
    };
  }
};