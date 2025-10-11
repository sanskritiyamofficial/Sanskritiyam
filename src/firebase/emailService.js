import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_123456';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_123456';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key_123456';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

/**
 * Send email using EmailJS
 * @param {string} toEmail - Recipient email
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content
 * @param {Object} templateParams - Additional template parameters
 * @returns {Promise<boolean>} - Success status
 */
export const sendEmail = async (toEmail, subject, htmlContent, templateParams = {}) => {
  try {
    console.log('Sending email via EmailJS...', { toEmail, subject });

    const emailParams = {
      to_email: toEmail,
      subject: subject,
      message: htmlContent,
      from_name: 'Sanskritiyam Team',
      from_email: import.meta.env.VITE_ADMIN_EMAIL || 'sanskritiyamofficial@gmail.com',
      ...templateParams
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      emailParams
    );

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Error sending email via EmailJS:', error);
    
    // Fallback: Try to open email client
    try {
      const mailtoUrl = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(htmlContent.replace(/<[^>]*>/g, ''))}`;
      window.open(mailtoUrl);
      console.log('Opened email client as fallback');
      return true;
    } catch (fallbackError) {
      console.error('Email fallback also failed:', fallbackError);
      return false;
    }
  }
};

/**
 * Send donation confirmation email
 * @param {Object} donationData - Donation data
 * @param {Object} paymentData - Payment data
 * @returns {Promise<boolean>} - Success status
 */
export const sendDonationEmail = async (donationData, paymentData) => {
  const { donorName, donorEmail, typeName, templeName, amount, offeringDate } = donationData;
  const { paymentId } = paymentData;
  const { formattedWhatsapp, formattedEmail } = getContactInfo();

  const subject = `Donation Confirmation - ${typeName} at ${templeName}`;
  
  const htmlContent = `
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
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Donation Type:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${typeName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Temple:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${templeName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Amount:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">₹${amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Offering Date:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${offeringDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Payment ID:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${paymentId}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
          Your donation will be used for temple maintenance, priest services, and spiritual activities. May you receive divine blessings for your generosity!
        </p>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e; font-weight: bold;">
            📧 Check your WhatsApp for a quick confirmation message!
          </p>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
          <p style="font-size: 14px; color: #6b7280; margin: 0;">
            For any queries, contact us at:<br>
            📞 ${formattedWhatsapp}<br>
            📧 ${formattedEmail}
          </p>
          <p style="font-size: 14px; color: #6b7280; margin: 10px 0 0 0;">
            <strong>Sanskritiyam Team</strong><br>
            Connecting Devotees with Sacred Temples
          </p>
        </div>
      </div>
    </div>
  `;

  return await sendEmail(donorEmail, subject, htmlContent, {
    donor_name: donorName,
    donation_type: typeName,
    temple_name: templeName,
    amount: amount,
    payment_id: paymentId
  });
};

/**
 * Send order confirmation email
 * @param {Object} orderData - Order data
 * @param {Object} paymentData - Payment data
 * @returns {Promise<boolean>} - Success status
 */
export const sendOrderEmail = async (orderData, paymentData) => {
  const { customerName, customerEmail, eventName, totalAmount } = orderData;
  const { paymentId } = paymentData;
  const { formattedWhatsapp, formattedEmail } = getContactInfo();

  const subject = `Puja Booking Confirmation - ${eventName}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f97316, #f59e0b); color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🙏 Puja Booking Confirmation</h1>
      </div>
      
      <div style="padding: 30px; background: #f9fafb;">
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
          Dear <strong>${customerName}</strong>,
        </p>
        
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
          Thank you for booking a puja with Sanskritiyam! Your spiritual journey is confirmed and our priests will perform the sacred rituals with full devotion.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
          <h3 style="color: #f97316; margin-top: 0;">Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Puja Name:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${eventName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Amount:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">₹${totalAmount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Payment ID:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${paymentId}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
          Our priests will perform the puja with full devotion. You will receive updates about the completion and any special moments during the ceremony.
        </p>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e; font-weight: bold;">
            📧 Check your WhatsApp for a quick confirmation message!
          </p>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
          <p style="font-size: 14px; color: #6b7280; margin: 0;">
            For any queries, contact us at:<br>
            📞 ${formattedWhatsapp}<br>
            📧 ${formattedEmail}
          </p>
          <p style="font-size: 14px; color: #6b7280; margin: 10px 0 0 0;">
            <strong>Sanskritiyam Team</strong><br>
            Connecting Devotees with Sacred Temples
          </p>
        </div>
      </div>
    </div>
  `;

  return await sendEmail(customerEmail, subject, htmlContent, {
    customer_name: customerName,
    puja_name: eventName,
    amount: totalAmount,
    payment_id: paymentId
  });
};

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
