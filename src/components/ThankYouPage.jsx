import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UpsellCrosssell } from "./index";

const ThankYouPage = ({ orderData, paymentData }) => {
  const navigate = useNavigate();
  const [showUpsell, setShowUpsell] = useState(false);
  const [bookedPuja, setBookedPuja] = useState(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Check if user has valid order data
    if (!orderData || !paymentData) {
      // Redirect to puja booking page if no valid order
      navigate("/pooja-booking");
      return;
    }

    // Extract booked puja information from order data
    if (orderData?.templeData) {
      setBookedPuja(orderData.templeData);
    } else if (orderData?.eventName) {
      // Create a basic puja object from event name
      setBookedPuja({
        name: orderData.eventName,
        pujaCategory: "spiritual",
      });
    }

    setIsValidating(false);

    // Show upsell after a short delay
    const upsellTimer = setTimeout(() => {
      setShowUpsell(true);
    }, 2000);

    return () => {
      clearTimeout(upsellTimer);
    };
  }, [navigate, orderData, paymentData]);

  // Show loading screen while validating
  if (isValidating) {
    return (
      <div className="min-h-screen bg-amber-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-16 flex items-center justify-center">
      {/* Upsell Modal */}
      {showUpsell && (
        <UpsellCrosssell
          bookedPuja={bookedPuja}
          onClose={() => setShowUpsell(false)}
        />
      )}

      {!showUpsell && (
        <>
          {/* Thank You Page */}
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold text-green-600 mb-4">
                Payment Successful!
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                Thank you for your booking. Your puja has been confirmed.
              </p>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Order Details
                </h2>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">
                      {orderData?.orderNumber || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-medium">
                      {paymentData?.paymentId || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-medium text-green-600">
                      ₹{orderData?.totalAmount || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirmation Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800">
                  <strong>Confirmation:</strong> You will receive a confirmation
                  email shortly with all the details about your puja booking.
                </p>
              </div>

              {/* Countdown and Redirect */}
              <div className="text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setShowUpsell(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                  >
                    🙏 Explore More Pujas
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                  >
                    Go to Home Page Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThankYouPage;
