import React, { useState, useEffect } from "react";
import {
  createCompleteOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from "../../firebase/orderService";
import {
  formatOrderData,
  formatPaymentData,
  validateOrderData,
} from "../../firebase/orderUtils";
import { useRazorpayPayment } from "../../firebase/razorpayService";
import RazorpayDebug from "../../components/RazorpayDebug";
import ThankYouPage from "../../components/ThankYouPage";

const PaymentPage = () => {
  const {
    initiatePayment,
    isLoading: razorpayLoading,
    error: razorpayError,
  } = useRazorpayPayment();

  const [formData, setFormData] = useState({
    name: "",
    gotra: "Kashyap",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [eventName, setEventName] = useState("");
  const [cartItems, setCartItems] = useState({});
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [templeData, setTempleData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Load data from localStorage
    const savedTotal = localStorage.getItem("totalAmount");
    const savedEventName = localStorage.getItem("eventName");
    const savedCartItems = localStorage.getItem("cartItems");
    const savedPackage = localStorage.getItem("selectedPackage");
    const savedTempleData = localStorage.getItem("templeData");

    if (savedTotal) setTotalAmount(parseInt(savedTotal));
    if (savedEventName) setEventName(savedEventName);
    if (savedCartItems) setCartItems(JSON.parse(savedCartItems));
    if (savedPackage) setSelectedPackage(JSON.parse(savedPackage));
    if (savedTempleData) setTempleData(JSON.parse(savedTempleData));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    if (!selectedPackage || !templeData) {
      alert("Missing package or temple information. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setPaymentError("");

    try {
      // Format order data
      const orderData = formatOrderData(
        formData,
        selectedPackage,
        templeData,
        cartItems,
        totalAmount
      );

      // Validate order data
      const validation = validateOrderData(orderData);
      if (!validation.isValid) {
        alert(
          "Please fix the following errors:\n" + validation.errors.join("\n")
        );
        setIsSubmitting(false);
        return;
      }

      // Create order and payment in Firebase first (with pending status)
      const { orderId, paymentId } = await createCompleteOrder(
        orderData,
        formatPaymentData(orderData, "", {
          method: "online",
          gateway: "razorpay",
          status: "pending",
        })
      );

      // Store order and payment IDs
      setOrderId(orderId);
      setPaymentId(paymentId);

      // Store form data and order ID
      localStorage.setItem("userDetails", JSON.stringify(formData));
      localStorage.setItem("orderId", orderId);
      localStorage.setItem("paymentId", paymentId);

      // Initiate Razorpay payment
      const paymentResult = await initiatePayment(totalAmount, formData);

      if (paymentResult.success) {
        // Payment successful - update Firebase
        await updateOrderStatus(orderId, "confirmed");
        await updatePaymentStatus(paymentId, "success", {
          razorpayPaymentId: paymentResult.paymentId,
          razorpayOrderId: paymentResult.razorpayOrderId,
          razorpaySignature: paymentResult.signature,
        });

        // Track successful payment event
        if (window.dataLayer) {
          window.dataLayer.push({
            event: "purchase",
            eventName: eventName,
            action: "purchase",
            price: totalAmount,
            currency: "INR",
            location: "Temple, Kashi",
            orderId: orderId,
            paymentId: paymentResult.paymentId,
          });
        }

        // Store order and payment data for thank you page
        setOrderData(orderData);
        setPaymentData({
          paymentId: paymentResult.paymentId,
          orderId: paymentResult.orderId,
          signature: paymentResult.signature,
        });

        // Clear cart data
        clearCartData();

        // Show thank you page
        setShowThankYou(true);
        setIsSubmitting(false);
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      console.error("Error processing payment:", error);

      // Update payment status to failed if we have payment ID
      if (paymentId) {
        try {
          await updatePaymentStatus(paymentId, "failed", {
            errorMessage: error.message,
            errorCode: error.code || "UNKNOWN_ERROR",
          });
        } catch (updateError) {
          console.error("Error updating payment status:", updateError);
        }
      }

      // Update order status to cancelled if we have order ID
      if (orderId) {
        try {
          await updateOrderStatus(orderId, "cancelled", {
            cancellationReason: "Payment failed",
            errorMessage: error.message,
            errorCode: error.code || "UNKNOWN_ERROR",
          });
        } catch (updateError) {
          console.error("Error updating order status:", updateError);
        }
      }

      // Set user-friendly error message
      let errorMessage = "Payment failed. Please try again.";

      if (error.message.includes("cancelled")) {
        errorMessage = "Payment was cancelled. Please try again.";
      } else if (error.message.includes("verification")) {
        errorMessage = "Payment verification failed. Please contact support.";
      } else if (error.message.includes("network")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      setPaymentError(errorMessage);
      alert(`Payment failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearCartData = () => {
    // Clear cart data
    localStorage.removeItem("cartItems");
    localStorage.removeItem("totalAmount");
    localStorage.removeItem("eventName");
    localStorage.removeItem("selectedPackage");
    localStorage.removeItem("templeData");
    localStorage.removeItem("navigatingToPayment");
  };

  // Show thank you page if payment was successful
  if (showThankYou) {
    return <ThankYouPage orderData={orderData} paymentData={paymentData} />;
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-orange-800 mb-8 text-center">
            Complete Your Puja Booking
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg text-orange-600">
                    {eventName}
                  </h3>
                  <p className="text-gray-600">Puja Package</p>
                </div>

                {Object.keys(cartItems).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Additional Offerings:
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(cartItems).map(([itemId, item]) => (
                        <div
                          key={itemId}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">{itemId}</span>
                          <span className="font-medium">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total Amount:</span>
                    <span className="text-orange-600">₹{totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gotra
                  </label>
                  <input
                    type="text"
                    name="gotra"
                    value={formData.gotra}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your gotra (default: Kashyap)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Pincode"
                  />
                </div>

                {/* Error Message */}
                {paymentError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Payment Error:</strong> {paymentError}
                  </div>
                )}

                {/* Razorpay Loading Error */}
                {razorpayError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Razorpay Error:</strong> {razorpayError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || razorpayLoading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition duration-200 ${
                    isSubmitting || razorpayLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600"
                  } text-white`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </div>
                  ) : razorpayLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Loading Payment Gateway...
                    </div>
                  ) : (
                    `Pay ₹${totalAmount} & Complete Booking`
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
