/**
 * WhatsApp Service - Real WhatsApp message sending
 * This service provides multiple methods to send WhatsApp messages
 */

// Helper function to get contact information
const getContactInfo = () => {
  const whatsappNumber = import.meta.env.VITE_NUMBER || '918810733829';
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'sanskritiyamofficial@gmail.com';
  
  return {
    whatsappNumber,
    adminEmail,
    formattedWhatsapp: `+91 ${whatsappNumber.slice(2)}`,
    formattedEmail: adminEmail
  };
};

/**
 * Send WhatsApp message by opening WhatsApp Web/App
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} message - Message to send
 * @returns {Promise<boolean>} - Success status
 */
export const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    const { formattedWhatsapp } = getContactInfo();
    
    // Format phone number (remove any non-digits and ensure it starts with country code)
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // If number doesn't start with country code, add 91 for India
    if (!cleanNumber.startsWith('91')) {
      cleanNumber = '91' + cleanNumber;
    }
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    
    console.log('Opening WhatsApp with message:', { phoneNumber: cleanNumber, message });
    
    // Open WhatsApp in new tab
    const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    if (newWindow) {
      console.log('WhatsApp opened successfully');
      return true;
    } else {
      console.error('Failed to open WhatsApp window');
      return false;
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
};

/**
 * Send WhatsApp message using WhatsApp Business API (if configured)
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} message - Message to send
 * @returns {Promise<boolean>} - Success status
 */
export const sendWhatsAppAPI = async (phoneNumber, message) => {
  try {
    // This would require WhatsApp Business API setup
    // For now, we'll fall back to the web method
    console.log('WhatsApp API not configured, falling back to web method');
    return await sendWhatsAppMessage(phoneNumber, message);
  } catch (error) {
    console.error('Error sending WhatsApp via API:', error);
    return false;
  }
};

/**
 * Send donation confirmation WhatsApp message
 * @param {Object} donationData - Donation data
 * @param {Object} paymentData - Payment data
 * @returns {Promise<boolean>} - Success status
 */
export const sendDonationWhatsApp = async (donationData, paymentData) => {
  const { donorName, donorPhone, typeName, templeName, amount, offeringDate } = donationData;
  const { paymentId } = paymentData;
  const { formattedWhatsapp, formattedEmail } = getContactInfo();

  const message = `🙏 *Donation Confirmation*

Dear ${donorName},

Thank you for your generous donation to ${templeName}!

*Donation Details:*
• Type: ${typeName}
• Temple: ${templeName}
• Amount: ₹${amount.toLocaleString()}
• Offering Date: ${offeringDate}
• Payment ID: ${paymentId}

Your donation will be used for temple maintenance and spiritual activities. May you receive divine blessings!

For any queries, contact us at ${formattedWhatsapp}

*Sanskritiyam Team*
📞 ${formattedWhatsapp}
📧 ${formattedEmail}`;

  return await sendWhatsAppMessage(donorPhone, message);
};

/**
 * Send order confirmation WhatsApp message
 * @param {Object} orderData - Order data
 * @param {Object} paymentData - Payment data
 * @returns {Promise<boolean>} - Success status
 */
export const sendOrderWhatsApp = async (orderData, paymentData) => {
  const { customerName, customerPhone, eventName, totalAmount } = orderData;
  const { paymentId } = paymentData;
  const { formattedWhatsapp, formattedEmail } = getContactInfo();

  const message = `🙏 *Puja Booking Confirmation*

Dear ${customerName},

Thank you for booking a puja with Sanskritiyam!

*Booking Details:*
• Puja: ${eventName}
• Amount: ₹${totalAmount.toLocaleString()}
• Payment ID: ${paymentId}

Our priests will perform the puja with full devotion. You will receive updates about the completion.

For any queries, contact us at ${formattedWhatsapp}

*Sanskritiyam Team*
📞 ${formattedWhatsapp}
📧 ${formattedEmail}`;

  return await sendWhatsAppMessage(customerPhone, message);
};

/**
 * Send admin notification WhatsApp message
 * @param {string} message - Message to send
 * @returns {Promise<boolean>} - Success status
 */
export const sendAdminWhatsApp = async (message) => {
  const { formattedWhatsapp } = getContactInfo();
  
  const adminMessage = `🔔 *Admin Notification*

${message}

*Sanskritiyam System*`;

  return await sendWhatsAppMessage(formattedWhatsapp, adminMessage);
};

/**
 * Send bulk WhatsApp messages (for admin use)
 * @param {Array} recipients - Array of {phoneNumber, message} objects
 * @returns {Promise<Object>} - Results object
 */
export const sendBulkWhatsApp = async (recipients) => {
  const results = {
    successful: [],
    failed: [],
    total: recipients.length
  };

  for (const recipient of recipients) {
    try {
      const success = await sendWhatsAppMessage(recipient.phoneNumber, recipient.message);
      if (success) {
        results.successful.push(recipient);
      } else {
        results.failed.push(recipient);
      }
      
      // Add delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error sending bulk WhatsApp:', error);
      results.failed.push(recipient);
    }
  }

  return results;
};

/**
 * Test WhatsApp connection
 * @returns {Promise<boolean>} - Success status
 */
export const testWhatsAppConnection = async () => {
  try {
    const testMessage = 'Test message from Sanskritiyam system';
    const testNumber = '918810733829'; // Admin number for testing
    
    console.log('Testing WhatsApp connection...');
    const result = await sendWhatsAppMessage(testNumber, testMessage);
    
    if (result) {
      console.log('WhatsApp connection test successful');
    } else {
      console.log('WhatsApp connection test failed');
    }
    
    return result;
  } catch (error) {
    console.error('WhatsApp connection test error:', error);
    return false;
  }
};
