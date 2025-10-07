import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

// Collection names
const NOTIFICATIONS_COLLECTION = 'notifications';

/**
 * Send WhatsApp notification
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} message - Message to send
 * @returns {Promise<boolean>} - Success status
 */
export const sendWhatsAppNotification = async (phoneNumber, message) => {
  try {
    // Format phone number (remove + and ensure it starts with country code)
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    const phoneWithCountryCode = formattedPhone.startsWith('91') ? formattedPhone : `91${formattedPhone}`;
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneWithCountryCode}?text=${encodeURIComponent(message)}`;
    
    // Log the notification for admin tracking
    await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
      type: 'whatsapp',
      recipient: phoneNumber,
      message: message,
      status: 'sent',
      createdAt: serverTimestamp(),
      url: whatsappUrl
    });

    // In a real implementation, you would:
    // 1. Use WhatsApp Business API
    // 2. Use Twilio WhatsApp API
    // 3. Use a service like MessageBird
    // For now, we'll just log it and return success
    
    console.log('WhatsApp notification prepared:', {
      phone: phoneNumber,
      message: message,
      url: whatsappUrl
    });

    return true;
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    
    // Log failed notification
    try {
      await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
        type: 'whatsapp',
        recipient: phoneNumber,
        message: message,
        status: 'failed',
        error: error.message,
        createdAt: serverTimestamp()
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
    // Log the notification for admin tracking
    await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
      type: 'email',
      recipient: email,
      subject: subject,
      message: message,
      status: 'sent',
      createdAt: serverTimestamp()
    });

    // In a real implementation, you would:
    // 1. Use SendGrid
    // 2. Use AWS SES
    // 3. Use Nodemailer with SMTP
    // 4. Use EmailJS for client-side sending
    // For now, we'll just log it and return success
    
    console.log('Email notification prepared:', {
      email: email,
      subject: subject,
      message: message
    });

    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    
    // Log failed notification
    try {
      await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
        type: 'email',
        recipient: email,
        subject: subject,
        message: message,
        status: 'failed',
        error: error.message,
        createdAt: serverTimestamp()
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
    const { donorName, donorEmail, donorPhone, typeName, templeName, amount, offeringDate } = donationData;
    const { paymentId } = paymentData;

    // Create confirmation messages
    const whatsappMessage = `🙏 *Donation Confirmation*

Dear ${donorName},

Thank you for your generous donation to ${templeName}!

*Donation Details:*
• Type: ${typeName}
• Temple: ${templeName}
• Amount: ₹${amount.toLocaleString()}
• Offering Date: ${offeringDate}
• Payment ID: ${paymentId}

Your donation will be used for temple maintenance and spiritual activities. May you receive divine blessings!

For any queries, contact us at +91 90153 67944

*Sanskritiyam Team*`;

    const emailSubject = `Donation Confirmation - ${typeName} at ${templeName}`;
    const emailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #f59e0b); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🙏 Donation Confirmation</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            Dear <strong>${donorName}</strong>,
          </p>
          
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            Thank you for your generous donation to <strong>${templeName}</strong>! Your contribution helps maintain our sacred temples and supports spiritual activities.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
            <h3 style="color: #f97316; margin-top: 0;">Donation Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Donation Type:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">${typeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Temple:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">${templeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Amount:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">₹${amount.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Offering Date:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">${offeringDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Payment ID:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">${paymentId}</td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            Your donation will be used for temple maintenance, daily rituals, and spiritual activities. May you receive divine blessings for your generosity!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 18px; color: #f97316; font-weight: 600; margin: 0;">
              🙏 धन्यवाद - Thank You 🙏
            </p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="font-size: 14px; color: #6b7280; margin: 0;">
              For any queries, contact us at:<br>
              📞 +91 90153 67944<br>
              📧 support@sanskritiyam.com
            </p>
            <p style="font-size: 14px; color: #6b7280; margin: 10px 0 0 0;">
              <strong>Sanskritiyam Team</strong><br>
              Connecting Devotees with Sacred Temples
            </p>
          </div>
        </div>
      </div>
    `;

    // Send notifications
    const results = {
      whatsapp: false,
      email: false
    };

    // Send WhatsApp notification
    if (donorPhone) {
      results.whatsapp = await sendWhatsAppNotification(donorPhone, whatsappMessage);
    }

    // Send Email notification
    if (donorEmail) {
      results.email = await sendEmailNotification(donorEmail, emailSubject, emailMessage);
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
    const { customerName, customerEmail, customerPhone, eventName, totalAmount } = orderData;
    const { paymentId } = paymentData;

    // Create confirmation messages
    const whatsappMessage = `🙏 *Puja Booking Confirmation*

Dear ${customerName},

Your puja booking has been confirmed!

*Booking Details:*
• Event: ${eventName}
• Amount: ₹${totalAmount.toLocaleString()}
• Payment ID: ${paymentId}

Our priests will perform the puja with full devotion. You will receive updates about the completion.

For any queries, contact us at +91 90153 67944

*Sanskritiyam Team*`;

    const emailSubject = `Puja Booking Confirmation - ${eventName}`;
    const emailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #f59e0b); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🙏 Puja Booking Confirmed</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            Dear <strong>${customerName}</strong>,
          </p>
          
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            Your puja booking has been confirmed! Our experienced priests will perform the rituals with full devotion and dedication.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
            <h3 style="color: #f97316; margin-top: 0;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Event:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">${eventName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Amount:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">₹${totalAmount.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Payment ID:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">${paymentId}</td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            You will receive updates about the puja completion. Our team will ensure everything is performed according to Vedic traditions.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 18px; color: #f97316; font-weight: 600; margin: 0;">
              🙏 धन्यवाद - Thank You 🙏
            </p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="font-size: 14px; color: #6b7280; margin: 0;">
              For any queries, contact us at:<br>
              📞 +91 90153 67944<br>
              📧 support@sanskritiyam.com
            </p>
            <p style="font-size: 14px; color: #6b7280; margin: 10px 0 0 0;">
              <strong>Sanskritiyam Team</strong><br>
              Connecting Devotees with Sacred Temples
            </p>
          </div>
        </div>
      </div>
    `;

    // Send notifications
    const results = {
      whatsapp: false,
      email: false
    };

    // Send WhatsApp notification
    if (customerPhone) {
      results.whatsapp = await sendWhatsAppNotification(customerPhone, whatsappMessage);
    }

    // Send Email notification
    if (customerEmail) {
      results.email = await sendEmailNotification(customerEmail, emailSubject, emailMessage);
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
