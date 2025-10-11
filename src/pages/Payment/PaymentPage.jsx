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
import { useLanguage } from "../../contexts/LanguageContext";
import ThankYouPage from "../../components/ThankYouPage";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useGetAuth();
  const { language } = useLanguage();
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
    familyMembers: [],
    additionalNames: ""
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
  const [packageType, setPackageType] = useState('single'); // single, family, children, wife
  const [showFamilyFields, setShowFamilyFields] = useState(false);

  // Translation object
  const translations = {
    en: {
      completeDonation: "Complete Your Donation",
      completeBooking: "Complete Your Puja Booking",
      donationSummary: "Donation Summary",
      orderSummary: "Order Summary",
      donation: "Donation",
      pujaPackage: "Puja Package",
      additionalOfferings: "Additional Offerings:",
      totalAmount: "Total Amount:",
      yourDetails: "Your Details",
      fullName: "Full Name",
      gotra: "Gotra",
      emailAddress: "Email Address",
      phoneNumber: "Phone Number",
      address: "Address",
      city: "City",
      state: "State",
      pincode: "Pincode",
      familyMembers: "Family Members",
      childrenDetails: "Children Details",
      wifeDetails: "Wife Details",
      familyMember: "Family Member",
      child: "Child",
      wife: "Wife",
      remove: "Remove",
      relation: "Relation",
      selectRelation: "Select Relation",
      father: "Father",
      mother: "Mother",
      brother: "Brother",
      sister: "Sister",
      son: "Son",
      daughter: "Daughter",
      husband: "Husband",
      spouse: "Spouse",
      grandfather: "Grandfather",
      grandmother: "Grandmother",
      uncle: "Uncle",
      aunt: "Aunt",
      cousin: "Cousin",
      other: "Other",
      addFamilyMember: "Add Family Member",
      addChild: "Add Child",
      addWife: "Add Wife",
      additionalNames: "Additional Names (Optional)",
      additionalNamesPlaceholder: "Enter any additional names that should be included in the puja (comma separated)",
      additionalNamesHelp: "Any other names that should be mentioned during the puja ceremony",
      paymentError: "Payment Error:",
      razorpayError: "Razorpay Error:",
      paymentProcessing: "Payment Processing:",
      paymentProcessingHelp: "If this takes too long, you can check your payment status or cancel.",
      checkStatus: "Check Status",
      cancel: "Cancel",
      processingPayment: "Processing Payment...",
      payAndCompleteDonation: "Pay ₹{amount} & Complete Donation",
      payAndCompleteBooking: "Pay ₹{amount} & Complete Booking",
      validatingBooking: "Validating booking...",
      enterFullName: "Enter your full name",
      enterGotra: "Enter your gotra (default: Bhardwaj)",
      enterEmail: "Enter your email",
      enterPhone: "Enter your phone number",
      enterAddress: "Enter your address",
      donationType: "Donation Type:",
      temple: "Temple:",
      offeringDate: "Offering Date:",
      qty: "Qty:"
    },
    hi: {
      completeDonation: "अपना दान पूरा करें",
      completeBooking: "अपनी पूजा बुकिंग पूरी करें",
      donationSummary: "दान सारांश",
      orderSummary: "ऑर्डर सारांश",
      donation: "दान",
      pujaPackage: "पूजा पैकेज",
      additionalOfferings: "अतिरिक्त प्रसाद:",
      totalAmount: "कुल राशि:",
      yourDetails: "आपकी जानकारी",
      fullName: "पूरा नाम",
      gotra: "गोत्र",
      emailAddress: "ईमेल पता",
      phoneNumber: "फोन नंबर",
      address: "पता",
      city: "शहर",
      state: "राज्य",
      pincode: "पिनकोड",
      familyMembers: "परिवारजन",
      childrenDetails: "बच्चों का विवरण",
      wifeDetails: "पत्नी का विवरण",
      familyMember: "परिवारजन",
      child: "बच्चा",
      wife: "पत्नी",
      remove: "हटाएं",
      relation: "रिश्ता",
      selectRelation: "रिश्ता चुनें",
      father: "पिता",
      mother: "माता",
      brother: "भाई",
      sister: "बहन",
      son: "पुत्र",
      daughter: "पुत्री",
      husband: "पति",
      spouse: "जीवनसाथी",
      grandfather: "दादाजी",
      grandmother: "दादीजी",
      uncle: "चाचा",
      aunt: "चाची",
      cousin: "चचेरा भाई/बहन",
      other: "अन्य",
      addFamilyMember: "परिवारजन जोड़ें",
      addChild: "बच्चा जोड़ें",
      addWife: "पत्नी जोड़ें",
      additionalNames: "अतिरिक्त नाम (वैकल्पिक)",
      additionalNamesPlaceholder: "पूजा में शामिल किए जाने वाले अन्य नाम दर्ज करें (कॉमा से अलग करें)",
      additionalNamesHelp: "पूजा समारोह के दौरान उल्लेख किए जाने वाले अन्य नाम",
      paymentError: "भुगतान त्रुटि:",
      razorpayError: "रेज़रपे त्रुटि:",
      paymentProcessing: "भुगतान प्रक्रिया:",
      paymentProcessingHelp: "यदि इसमें बहुत समय लग रहा है, तो आप अपनी भुगतान स्थिति जांच सकते हैं या रद्द कर सकते हैं।",
      checkStatus: "स्थिति जांचें",
      cancel: "रद्द करें",
      processingPayment: "भुगतान प्रक्रिया...",
      payAndCompleteDonation: "₹{amount} भुगतान करें और दान पूरा करें",
      payAndCompleteBooking: "₹{amount} भुगतान करें और बुकिंग पूरी करें",
      validatingBooking: "बुकिंग सत्यापित की जा रही है...",
      enterFullName: "अपना पूरा नाम दर्ज करें",
      enterGotra: "अपना गोत्र दर्ज करें (डिफ़ॉल्ट: भारद्वाज)",
      enterEmail: "अपना ईमेल दर्ज करें",
      enterPhone: "अपना फोन नंबर दर्ज करें",
      enterAddress: "अपना पता दर्ज करें",
      donationType: "दान प्रकार:",
      temple: "मंदिर:",
      offeringDate: "प्रसाद तिथि:",
      qty: "मात्रा:"
    }
  };

  const t = translations[language];

  // Function to detect package type based on package name
  const detectPackageType = (packageName) => {
    if (!packageName) return 'single';
    
    const name = packageName.toLowerCase();
    if (name.includes('family') || name.includes('parivar')) return 'family';
    if (name.includes('child') || name.includes('children') || name.includes('bacche')) return 'children';
    if (name.includes('wife') || name.includes('patni') || name.includes('stri')) return 'wife';
    return 'single';
  };

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
    if (savedPackage) {
      const packageData = JSON.parse(savedPackage);
      setSelectedPackage(packageData);
      
      // Detect package type and show family fields if needed
      const detectedType = detectPackageType(packageData.name);
      setPackageType(detectedType);
      setShowFamilyFields(detectedType !== 'single');
      
      // Add default family member if needed
      if (detectedType !== 'single') {
        setFormData(prev => ({
          ...prev,
          familyMembers: prev.familyMembers.length === 0 ? [{ name: '', relation: '' }] : prev.familyMembers
        }));
      }
    }
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

  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { name: '', relation: '' }]
    }));
  };

  const updateFamilyMember = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const removeFamilyMember = (index) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
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

        try {
          // Create donation record with retry logic
          orderId = await createDonation(formattedDonationData);
          console.log('Donation created successfully:', orderId);
        } catch (donationError) {
          console.error('Failed to create donation:', donationError);
          // Create a temporary order ID for payment processing
          orderId = `temp_donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          console.log('Using temporary order ID:', orderId);
          
          // Store donation data locally as fallback
          try {
            const localDonations = JSON.parse(localStorage.getItem('localDonations') || '[]');
            const donationRecord = {
              id: orderId,
              ...formattedDonationData,
              createdAt: new Date().toISOString(),
              status: 'pending',
              isLocal: true
            };
            localDonations.push(donationRecord);
            localStorage.setItem('localDonations', JSON.stringify(localDonations));
            console.log('Donation data stored locally as fallback');
          } catch (localError) {
            console.error('Failed to store donation locally:', localError);
          }
        }
        
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

        try {
          // Create payment record
          const { createPayment } = await import("../../firebase/orderService");
          paymentId = await createPayment(paymentData);
          console.log('Payment record created successfully:', paymentId);
        } catch (paymentError) {
          console.error('Failed to create payment record:', paymentError);
          // Create a temporary payment ID
          paymentId = `temp_payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          console.log('Using temporary payment ID:', paymentId);
        }

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
        // Payment successful - update Firebase with retry logic
        let firebaseUpdateSuccess = false;
        
        try {
          if (isDonation) {
            // Try to update donation status
            if (orderId.startsWith('temp_donation_')) {
              // This was a temporary ID, try to create the donation now
              try {
                const newOrderId = await createDonation(orderData);
                orderId = newOrderId;
                console.log('Donation created successfully after payment:', newOrderId);
              } catch (createError) {
                console.error('Failed to create donation after payment:', createError);
                // Keep using temporary ID
              }
            }
            
            try {
              await updateDonationStatus(orderId, "confirmed");
              firebaseUpdateSuccess = true;
            } catch (updateError) {
              console.error('Failed to update donation status:', updateError);
            }
          } else {
            try {
              await updateOrderStatus(orderId, "confirmed");
              firebaseUpdateSuccess = true;
            } catch (updateError) {
              console.error('Failed to update order status:', updateError);
            }
          }
          
          try {
            await updatePaymentStatus(paymentId, "success", {
              razorpayPaymentId: paymentResult.paymentId,
              razorpayOrderId: paymentResult.razorpayOrderId || 'direct_payment',
              razorpaySignature: paymentResult.signature || '',
            });
            console.log('Payment status updated to success');
          } catch (paymentUpdateError) {
            console.error('Failed to update payment status:', paymentUpdateError);
          }

          // Send confirmation for donations
          if (isDonation) {
            try {
              await sendDonationConfirmation(orderData, {
                paymentId: paymentResult.paymentId,
                orderId: paymentResult.orderId || 'direct_payment',
                signature: paymentResult.signature || '',
              });
            } catch (notificationError) {
              console.error('Failed to send donation confirmation:', notificationError);
            }
          } else {
            // Send order confirmation for regular orders
            try {
              const { sendOrderConfirmation } = await import("../../firebase/notificationService");
              await sendOrderConfirmation(orderData, {
                paymentId: paymentResult.paymentId,
                orderId: paymentResult.orderId || 'direct_payment',
                signature: paymentResult.signature || '',
              });
            } catch (notificationError) {
              console.error('Failed to send order confirmation:', notificationError);
            }
          }
        } catch (firebaseError) {
          console.error('Firebase update error:', firebaseError);
        }
        
        // Always proceed with success even if Firebase fails
        if (!firebaseUpdateSuccess) {
          console.warn('Payment successful but Firebase update failed - proceeding with success');
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
          <p className="text-gray-600">{t.validatingBooking}</p>
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
            {isDonation ? t.completeDonation : t.completeBooking}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {isDonation ? t.donationSummary : t.orderSummary}
              </h2>
              <div className="space-y-4">
                {isDonation ? (
                  <>
                    <div className="border-b pb-4">
                      <h3 className="font-semibold text-lg text-orange-600">
                        {donationData?.type?.name} {t.donation}
                      </h3>
                      <p className="text-gray-600">{donationData?.temple?.name}</p>
                      <p className="text-sm text-gray-500">{donationData?.temple?.location}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.donationType}</span>
                        <span className="font-medium">{donationData?.type?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.temple}</span>
                        <span className="font-medium">{donationData?.temple?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.offeringDate}</span>
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
                      <p className="text-gray-600">{t.pujaPackage}</p>
                    </div>

                    {Object.keys(cartItems).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {t.additionalOfferings}
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(cartItems).map(([itemId, item]) => (
                            <div
                              key={itemId}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-gray-600">{itemId}</span>
                              <span className="font-medium">
                                {t.qty}: {item.quantity}
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
                    <span>{t.totalAmount}</span>
                    <span className="text-orange-600">₹{totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {t.yourDetails}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={t.enterFullName}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.gotra}
                  </label>
                  <input
                    type="text"
                    name="gotra"
                    value={formData.gotra}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={t.enterGotra}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.emailAddress} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={t.enterEmail}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.phoneNumber} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={t.enterPhone}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.address}
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={t.enterAddress}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.city}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder={t.city}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.state}
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder={t.state}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.pincode}
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={t.pincode}
                  />
                </div>

                {/* Family Member Fields - Show only for family/children/wife packages */}
                {showFamilyFields && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {packageType === 'family' && t.familyMembers}
                      {packageType === 'children' && t.childrenDetails}
                      {packageType === 'wife' && t.wifeDetails}
                    </h3>
                    
                    <div className="space-y-4">
                      {formData.familyMembers.map((member, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-gray-700">
                              {packageType === 'family' && `${t.familyMember} ${index + 1}`}
                              {packageType === 'children' && `${t.child} ${index + 1}`}
                              {packageType === 'wife' && `${t.wife} ${index + 1}`}
                            </h4>
                            {formData.familyMembers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFamilyMember(index)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                {t.remove}
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.fullName} *
                              </label>
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder={t.enterFullName}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.relation} *
                              </label>
                              <select
                                value={member.relation}
                                onChange={(e) => updateFamilyMember(index, 'relation', e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                              >
                                <option value="">{t.selectRelation}</option>
                                {packageType === 'family' && (
                                  <>
                                    <option value="Father">{t.father}</option>
                                    <option value="Mother">{t.mother}</option>
                                    <option value="Brother">{t.brother}</option>
                                    <option value="Sister">{t.sister}</option>
                                    <option value="Son">{t.son}</option>
                                    <option value="Daughter">{t.daughter}</option>
                                    <option value="Husband">{t.husband}</option>
                                    <option value="Wife">{t.wife}</option>
                                    <option value="Grandfather">{t.grandfather}</option>
                                    <option value="Grandmother">{t.grandmother}</option>
                                    <option value="Uncle">{t.uncle}</option>
                                    <option value="Aunt">{t.aunt}</option>
                                    <option value="Cousin">{t.cousin}</option>
                                    <option value="Other">{t.other}</option>
                                  </>
                                )}
                                {packageType === 'children' && (
                                  <>
                                    <option value="Son">{t.son}</option>
                                    <option value="Daughter">{t.daughter}</option>
                                    <option value="Child">{t.child}</option>
                                  </>
                                )}
                                {packageType === 'wife' && (
                                  <>
                                    <option value="Wife">{t.wife}</option>
                                    <option value="Spouse">{t.spouse}</option>
                                  </>
                                )}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={addFamilyMember}
                        className="w-full py-2 px-4 border-2 border-dashed border-orange-300 text-orange-600 rounded-lg hover:border-orange-400 hover:text-orange-700 transition-colors"
                      >
                        + {packageType === 'family' ? t.addFamilyMember : packageType === 'children' ? t.addChild : t.addWife}
                      </button>
                    </div>
                    
                    {/* Additional Names Field */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.additionalNames}
                      </label>
                      <textarea
                        name="additionalNames"
                        value={formData.additionalNames}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder={t.additionalNamesPlaceholder}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {t.additionalNamesHelp}
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {paymentError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>{t.paymentError}</strong> {paymentError}
                  </div>
                )}

                {/* Razorpay Loading Error */}
                {razorpayError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>{t.razorpayError}</strong> {razorpayError}
                  </div>
                )}

                {/* Recovery Mode - Show if stuck in loading */}
                {isSubmitting && orderId && (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <strong>{t.paymentProcessing}</strong> {t.paymentProcessingHelp}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleRecoveryCheck}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                        >
                          {t.checkStatus}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSubmitting(false);
                            setPaymentError('');
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          {t.cancel}
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
                      {t.processingPayment}
                    </div>
                  ) : (
                    isDonation ? t.payAndCompleteDonation.replace('{amount}', totalAmount) : t.payAndCompleteBooking.replace('{amount}', totalAmount)
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
