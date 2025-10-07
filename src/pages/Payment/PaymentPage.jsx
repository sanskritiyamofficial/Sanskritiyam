import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  createDonation,
  updateDonationStatus,
  formatDonationData,
  sendDonationConfirmation,
} from "../../firebase/donationService";
import { useRazorpayPayment } from "../../firebase/razorpayService";
import { useGetAuth } from "../../contexts/useGetAuth"; 
import RazorpayDebug from "../../components/RazorpayDebug";
import ThankYouPage from "../../components/ThankYouPage";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useGetAuth();
  const {
    initiatePayment,
    error: razorpayError,
  } = useRazorpayPayment();

  const [formData, setFormData] = useState({
    name: "",
    gotra: "",
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
  const [donationData, setDonationData] = useState(null);
  const [isDonation, setIsDonation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isValidating, setIsValidating] = useState(true);
  useEffect(() => {
    // Load data from localStorage
    const savedTotal = localStorage.getItem("totalAmount");
    const savedEventName = localStorage.getItem("eventName");
    const savedCartItems = localStorage.getItem("cartItems");
    const savedPackage = localStorage.getItem("selectedPackage");
    const savedTempleData = localStorage.getItem("templeData");
    const savedDonationData = localStorage.getItem("donationData");
    const savedOrderId = localStorage.getItem("orderId");
    const savedPaymentId = localStorage.getItem("paymentId");

    if (savedTotal) setTotalAmount(parseInt(savedTotal));
    if (savedEventName) setEventName(savedEventName);
    if (savedCartItems) setCartItems(JSON.parse(savedCartItems));
    if (savedPackage) setSelectedPackage(JSON.parse(savedPackage));
    if (savedTempleData) setTempleData(JSON.parse(savedTempleData));
    if (savedDonationData) {
      setDonationData(JSON.parse(savedDonationData));
      setIsDonation(true);
    }
    if (savedOrderId) setOrderId(savedOrderId);
    if (savedPaymentId) setPaymentId(savedPaymentId);
    
    setIsValidating(false);
  }, [navigate]);

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

    if (isDonation) {
      if (!donationData) {
        alert("Missing donation information. Please try again.");
        return;
      }
    } else {
      if (!selectedPackage || !templeData) {
        alert("Missing package or temple information. Please try again.");
        return;
      }
    }

    setIsSubmitting(true);
    setPaymentError("");

    try {
      let orderData, orderId, paymentId;

      if (isDonation) {
        // Handle donation
        const formattedDonationData = formatDonationData(
          formData,
          donationData.type,
          donationData.temple,
          donationData.amount
        );

        // Add user information if user is logged in
        if (currentUser) {
          formattedDonationData.userId = currentUser.uid;
          formattedDonationData.userEmail = currentUser.email;
          formattedDonationData.userName = currentUser.displayName || formData.name;
        }

        // Create donation record
        orderId = await createDonation(formattedDonationData);
        
        // Create payment record for donation
        const paymentData = {
          orderId,
          amount: donationData.amount,
          currency: "INR",
          method: "online",
          gateway: "razorpay",
          status: "pending",
          donorName: formData.name,
          donorEmail: formData.email,
          donorPhone: formData.phone,
        };

        // Create payment record
        const { createPayment } = await import("../../firebase/orderService");
        paymentId = await createPayment(paymentData);

        orderData = formattedDonationData;
      } else {
        // Handle regular order
        orderData = formatOrderData(
          formData,
          selectedPackage,
          templeData,
          cartItems,
          totalAmount
        );

        // Add user information if user is logged in
        if (currentUser) {
          orderData.userId = currentUser.uid;
          orderData.userEmail = currentUser.email;
          orderData.userName = currentUser.displayName || formData.name;
        }

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
        const result = await createCompleteOrder(
          orderData,
          formatPaymentData(orderData, "", {
            method: "online",
            gateway: "razorpay",
            status: "pending",
          })
        );
        orderId = result.orderId;
        paymentId = result.paymentId;
      }

      // Store order and payment IDs
      setOrderId(orderId);
      setPaymentId(paymentId);

      // Store form data and order ID
      localStorage.setItem("userDetails", JSON.stringify(formData));
      localStorage.setItem("orderId", orderId);
      localStorage.setItem("paymentId", paymentId);

      // Initiate Razorpay payment with timeout
      const paymentPromise = initiatePayment(totalAmount, formData);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Payment timeout - please try again')), 60000) // 1 minute timeout
      );
      
      const paymentResult = await Promise.race([paymentPromise, timeoutPromise]);

      if (paymentResult.success) {
        // Payment successful - update Firebase
        try {
          if (isDonation) {
            await updateDonationStatus(orderId, "confirmed");
          } else {
            await updateOrderStatus(orderId, "confirmed");
          }
          
          await updatePaymentStatus(paymentId, "success", {
            razorpayPaymentId: paymentResult.paymentId,
            razorpayOrderId: paymentResult.razorpayOrderId || 'direct_payment',
            razorpaySignature: paymentResult.signature || '',
          });
          console.log('Payment status updated to success');

          // Send confirmation for donations
          if (isDonation) {
            await sendDonationConfirmation(orderData, {
              paymentId: paymentResult.paymentId,
              orderId: paymentResult.orderId || 'direct_payment',
              signature: paymentResult.signature || '',
            });
          } else {
            // Send order confirmation for regular orders
            const { sendOrderConfirmation } = await import("../../firebase/notificationService");
            await sendOrderConfirmation(orderData, {
              paymentId: paymentResult.paymentId,
              orderId: paymentResult.orderId || 'direct_payment',
              signature: paymentResult.signature || '',
            });
          }
        } catch (firebaseError) {
          console.error('Firebase update error:', firebaseError);
          // Don't fail the payment if Firebase update fails
          alert('Payment successful but there was an issue updating the order. Please contact support with your payment ID: ' + paymentResult.paymentId);
        }

        // Track successful payment event
        if (window.dataLayer) {
          window.dataLayer.push({
            event: "purchase",
            eventName: eventName,
            action: "purchase",
            price: totalAmount,
            currency: "INR",
            location: isDonation ? donationData.temple.location : "Temple, Kashi",
            orderId: orderId,
            paymentId: paymentResult.paymentId,
          });
        }

        // Store order and payment data for thank you page
        setOrderData(orderData);
        setPaymentData({
          paymentId: paymentResult.paymentId,
          orderId: paymentResult.orderId || 'direct_payment',
          signature: paymentResult.signature || '',
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

      // Check if this is a timeout or callback issue
      const isTimeout = error.message.includes('timeout');
      const isCancelled = error.message.includes('cancelled');
      
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

      // Update order/donation status to cancelled if we have order ID
      if (orderId) {
        try {
          if (isDonation) {
            await updateDonationStatus(orderId, "cancelled", {
              cancellationReason: "Payment failed",
              errorMessage: error.message,
              errorCode: error.code || "UNKNOWN_ERROR",
            });
          } else {
            await updateOrderStatus(orderId, "cancelled", {
              cancellationReason: "Payment failed",
              errorMessage: error.message,
              errorCode: error.code || "UNKNOWN_ERROR",
            });
          }
        } catch (updateError) {
          console.error("Error updating order status:", updateError);
        }
      }

      // Set user-friendly error message
      let errorMessage = "Payment failed. Please try again.";

      if (isCancelled) {
        errorMessage = "Payment was cancelled. Please try again.";
      } else if (error.message.includes("verification")) {
        errorMessage = "Payment verification failed. Please contact support.";
      } else if (error.message.includes("network")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (isTimeout) {
        errorMessage = "Payment is taking too long. Please check your payment status and try again.";
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
    localStorage.removeItem("donationData");
    localStorage.removeItem("navigatingToPayment");
    localStorage.removeItem("orderId");
    localStorage.removeItem("paymentId");
  };

  const handleRecoveryCheck = async () => {
    if (!orderId || !paymentId) {
      alert("No order information found. Please start a new payment.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Check if payment was successful by checking Firebase
      const { getOrderById, getPaymentsByOrderId } = await import("../../firebase/orderService");
      const order = await getOrderById(orderId);
      const payments = await getPaymentsByOrderId(orderId);
      
      if (order && order.status === "confirmed" && payments.length > 0) {
        const successfulPayment = payments.find(p => p.status === "success");
        if (successfulPayment) {
          // Payment was successful, show thank you page
          setOrderData(order);
          setPaymentData(successfulPayment);
          setShowThankYou(true);
          clearCartData();
          return;
        }
      }
      
      alert("Payment status could not be verified. Please contact support or try again.");
    } catch (error) {
      console.error("Recovery check failed:", error);
      alert("Unable to check payment status. Please contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading screen while validating
  if (isValidating) {
    return (
      <div className="min-h-screen bg-amber-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating booking...</p>
        </div>
      </div>
    );
  }

  // Show thank you page if payment was successful
  if (showThankYou) {
    return <ThankYouPage orderData={orderData} paymentData={paymentData} />;
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-orange-800 mb-8 text-center">
            {isDonation ? "Complete Your Donation" : "Complete Your Puja Booking"}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {isDonation ? "Donation Summary" : "Order Summary"}
              </h2>
              <div className="space-y-4">
                {isDonation ? (
                  <>
                    <div className="border-b pb-4">
                      <h3 className="font-semibold text-lg text-orange-600">
                        {donationData?.type?.name} Donation
                      </h3>
                      <p className="text-gray-600">{donationData?.temple?.name}</p>
                      <p className="text-sm text-gray-500">{donationData?.temple?.location}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Donation Type:</span>
                        <span className="font-medium">{donationData?.type?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Temple:</span>
                        <span className="font-medium">{donationData?.temple?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Offering Date:</span>
                        <span className="font-medium">{donationData?.temple?.date}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
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
                    placeholder="Enter your gotra (default: Bhardwaj)" 
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

                {/* Recovery Mode - Show if stuck in loading */}
                {isSubmitting && orderId && (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <strong>Payment Processing:</strong> If this takes too long, you can check your payment status or cancel.
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleRecoveryCheck}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Check Status
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSubmitting(false);
                            setPaymentError('');
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition duration-200 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600"
                  } text-white`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    isDonation ? `Pay ₹${totalAmount} & Complete Donation` : `Pay ₹${totalAmount} & Complete Booking`
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
