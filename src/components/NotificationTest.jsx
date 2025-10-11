import React, { useState } from 'react';
import { sendDonationEmail, sendOrderEmail } from '../firebase/emailService';
import { sendDonationWhatsApp, sendOrderWhatsApp, testWhatsAppConnection } from '../firebase/whatsappService';
import { sendDonationConfirmation, sendOrderConfirmation } from '../firebase/notificationService';

const NotificationTest = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState({});

  const testDonationData = {
    donorName: 'Test User',
    donorEmail: 'test@example.com',
    donorPhone: '918810733829',
    typeName: 'Phool (Flowers)',
    templeName: 'Kashi Vishwanath Temple',
    amount: 1000,
    offeringDate: '2024-10-07'
  };

  const testPaymentData = {
    paymentId: 'test_payment_123',
    orderId: 'test_order_123',
    signature: 'test_signature'
  };

  const testOrderData = {
    customerName: 'Test Customer',
    customerEmail: 'customer@example.com',
    customerPhone: '918810733829',
    eventName: 'Ganesh Puja',
    totalAmount: 2500
  };

  const testNotifications = async () => {
    setTesting(true);
    setResults({});

    try {
      // Test WhatsApp connection
      console.log('Testing WhatsApp connection...');
      const whatsappTest = await testWhatsAppConnection();
      setResults(prev => ({ ...prev, whatsappTest }));

      // Test donation email
      console.log('Testing donation email...');
      const donationEmail = await sendDonationEmail(testDonationData, testPaymentData);
      setResults(prev => ({ ...prev, donationEmail }));

      // Test donation WhatsApp
      console.log('Testing donation WhatsApp...');
      const donationWhatsApp = await sendDonationWhatsApp(testDonationData, testPaymentData);
      setResults(prev => ({ ...prev, donationWhatsApp }));

      // Test order email
      console.log('Testing order email...');
      const orderEmail = await sendOrderEmail(testOrderData, testPaymentData);
      setResults(prev => ({ ...prev, orderEmail }));

      // Test order WhatsApp
      console.log('Testing order WhatsApp...');
      const orderWhatsApp = await sendOrderWhatsApp(testOrderData, testPaymentData);
      setResults(prev => ({ ...prev, orderWhatsApp }));

      // Test full notification services
      console.log('Testing full donation notification...');
      const fullDonation = await sendDonationConfirmation(testDonationData, testPaymentData);
      setResults(prev => ({ ...prev, fullDonation }));

      console.log('Testing full order notification...');
      const fullOrder = await sendOrderConfirmation(testOrderData, testPaymentData);
      setResults(prev => ({ ...prev, fullOrder }));

    } catch (error) {
      console.error('Test error:', error);
      setResults(prev => ({ ...prev, error: error.message }));
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">🔔 Notification Test Center</h2>
      
      <div className="mb-6">
        <button
          onClick={testNotifications}
          disabled={testing}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition duration-200 ${
            testing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {testing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Testing Notifications...
            </div>
          ) : (
            'Test All Notifications'
          )}
        </button>
      </div>

      {Object.keys(results).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Test Results:</h3>
          
          {results.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {results.error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(results).map(([key, value]) => {
              if (key === 'error') return null;
              
              const isSuccess = value === true;
              const isObject = typeof value === 'object';
              
              return (
                <div
                  key={key}
                  className={`p-4 rounded-lg border ${
                    isSuccess
                      ? 'bg-green-100 border-green-400 text-green-700'
                      : isObject
                      ? 'bg-blue-100 border-blue-400 text-blue-700'
                      : 'bg-red-100 border-red-400 text-red-700'
                  }`}
                >
                  <div className="font-semibold capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </div>
                  <div className="mt-1">
                    {isObject ? (
                      <pre className="text-sm">{JSON.stringify(value, null, 2)}</pre>
                    ) : (
                      <span className={isSuccess ? 'text-green-600' : 'text-red-600'}>
                        {isSuccess ? '✅ Success' : '❌ Failed'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">📝 Test Instructions:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• <strong>Email:</strong> Check if email client opens or EmailJS sends email</li>
          <li>• <strong>WhatsApp:</strong> Check if WhatsApp Web/App opens with pre-filled message</li>
          <li>• <strong>Console:</strong> Check browser console for detailed logs</li>
          <li>• <strong>Environment:</strong> Make sure VITE_NUMBER and VITE_ADMIN_EMAIL are set</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationTest;
