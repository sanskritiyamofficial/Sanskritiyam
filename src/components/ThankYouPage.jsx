import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UpsellCrosssell } from "./index";
import { FaEnvelope, FaWhatsapp, FaCheckCircle, FaGift } from "react-icons/fa";

const ThankYouPage = ({ orderData, paymentData }) => {
  const navigate = useNavigate();
  const [showUpsell, setShowUpsell] = useState(false);
  const [bookedPuja, setBookedPuja] = useState(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isDonation, setIsDonation] = useState(false);

  useEffect(() => {
    // Check if user has valid order data
    if (!orderData || !paymentData) {
      // Redirect to puja booking page if no valid order
      navigate("/pooja-booking");
      return;
    }

    // Check if this is a donation
    const donationCheck = orderData?.type || orderData?.typeName || orderData?.templeId;
    if (donationCheck) {
      setIsDonation(true);
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

    // Show upsell after a short delay (only for non-donations)
    if (!donationCheck) {
      const upsellTimer = setTimeout(() => {
        setShowUpsell(true);
      }, 2000);

      return () => {
        clearTimeout(upsellTimer);
      };
    }
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
                {isDonation ? (
                  <FaGift className="h-8 w-8 text-green-600" />
                ) : (
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
                )}
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold text-green-600 mb-4">
                {isDonation ? "Donation Successful!" : "Payment Successful!"}
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                {isDonation 
                  ? "Thank you for your generous donation. Your offering has been confirmed."
                  : "Thank you for your booking. Your puja has been confirmed."
                }
              </p>

              {/* Order/Donation Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {isDonation ? "Donation Details" : "Order Details"}
                </h2>

                <div className="space-y-2">
                  {isDonation && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Donation Type:</span>
                        <span className="font-medium">
                          {orderData?.typeName || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Temple:</span>
                        <span className="font-medium">
                          {orderData?.templeName || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Offering Date:</span>
                        <span className="font-medium">
                          {orderData?.offeringDate || "N/A"}
                        </span>
                      </div>
                    </>
                  )}

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
                      ₹{orderData?.amount || orderData?.totalAmount || "N/A"}
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

              {/* Email and WhatsApp Confirmation */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    📧 Check Your Email & WhatsApp
                  </h3>
                  <p className="text-gray-600">
                    {isDonation 
                      ? "Your donation confirmation and booking details have been sent to:"
                      : "Your booking confirmation and details have been sent to:"
                    }
                  </p>
                  {(orderData?.donorEmail || orderData?.customerEmail) && (
                    <div className="mt-2 text-sm text-gray-700">
                      <p><strong>Email:</strong> {orderData?.donorEmail || orderData?.customerEmail}</p>
                      {(orderData?.donorPhone || orderData?.customerPhone) && (
                        <p><strong>Phone:</strong> {orderData?.donorPhone || orderData?.customerPhone}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email Confirmation */}
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-3">
                      <FaEnvelope className="text-blue-600 text-xl mr-3" />
                      <h4 className="font-semibold text-gray-800">Email Confirmation</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        <span>Detailed booking information</span>
                      </div>
                      <div className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        <span>Payment receipt</span>
                      </div>
                      <div className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        <span>{isDonation ? "Donation details" : "Puja schedule"}</span>
                      </div>
                      <div className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        <span>Contact information</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Check your inbox and spam folder
                    </p>
                  </div>

                  {/* WhatsApp Confirmation */}
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center mb-3">
                      <FaWhatsapp className="text-green-600 text-xl mr-3" />
                      <h4 className="font-semibold text-gray-800">WhatsApp Message</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        <span>Quick confirmation</span>
                      </div>
                      <div className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        <span>Important updates</span>
                      </div>
                      <div className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        <span>Support contact</span>
                      </div>
                      <div className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        <span>Status notifications</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Check your WhatsApp messages
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> If you don't receive the confirmation within 5 minutes, 
                    please check your spam folder or contact us at {import.meta.env.VITE_NUMBER ? `+91 ${import.meta.env.VITE_NUMBER.slice(2)}` : '+91 8810733829'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {!isDonation && (
                    <button
                      onClick={() => setShowUpsell(true)}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                    >
                      🙏 Explore More Pujas
                    </button>
                  )}
                  {isDonation && (
                    <button
                      onClick={() => navigate("/chadhawa/donation")}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                    >
                      🙏 Make Another Donation
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/")}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                  >
                    Go to Home Page
                  </button>
                  <button
                    onClick={() => navigate("/chadhawa")}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                  >
                    View All Temples
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
