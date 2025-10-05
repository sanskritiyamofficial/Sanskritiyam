import React from 'react';

const RazorpayDebug = () => {
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
      <h3 className="font-bold">Razorpay Debug Info:</h3>
      <p><strong>Key Status:</strong> {razorpayKey ? '✅ Set' : '❌ Not Set'}</p>
      <p><strong>Key Value:</strong> {razorpayKey ? `${razorpayKey.substring(0, 8)}...` : 'Not configured'}</p>
      <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
      {!razorpayKey && (
        <div className="mt-2">
          <p className="text-sm">
            <strong>To fix:</strong> Create a <code>.env</code> file in your project root with:
          </p>
          <code className="block bg-gray-200 p-2 mt-1 text-xs">
            VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here
          </code>
        </div>
      )}
    </div>
  );
};

export default RazorpayDebug;
