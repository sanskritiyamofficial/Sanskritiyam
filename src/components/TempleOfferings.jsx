import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const TempleOfferings = ({ templeData, selectedPackage }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [showReadMore, setShowReadMore] = useState({});

  // Initialize items from temple data
  useEffect(() => {
    if (templeData?.offerings) {
      const initialItems = {};
      templeData.offerings.forEach((offering) => {
        initialItems[offering.id] = {
          ...offering,
          quantity: 0,
        };
      });
      setItems(initialItems);
    }
  }, [templeData]);

  // Calculate total amount
  useEffect(() => {
    let total = selectedPackage?.price || 0;
    Object.values(items).forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalAmount(total);
  }, [items, selectedPackage]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("cartItems")) || {};
    if (Object.keys(savedItems).length > 0) {
      setItems((prevItems) => {
        const updatedItems = { ...prevItems };
        Object.keys(savedItems).forEach((key) => {
          if (updatedItems[key]) {
            // Update quantity from saved data
            updatedItems[key].quantity = savedItems[key].quantity || 0;
          }
        });
        return updatedItems;
      });
    }
  }, []);

  // Save cart to localStorage
  const saveItemsToLocalStorage = () => {
    const cartData = {};
    Object.keys(items).forEach((key) => {
      if (items[key].quantity > 0) {
        cartData[key] = {
          quantity: items[key].quantity,
          name: items[key].name
        };
      }
    });
    localStorage.setItem("cartItems", JSON.stringify(cartData));
    localStorage.setItem("totalAmount", totalAmount.toString());
  };

  const updateItemQuantity = useCallback((itemId, change, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log(`Updating ${itemId} by ${change}`);
    
    // Use a more direct approach to prevent double updates
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      if (updatedItems[itemId]) {
        const currentQuantity = updatedItems[itemId].quantity || 0;
        const newQuantity = Math.max(0, currentQuantity + change);
        console.log(`Current: ${currentQuantity}, New: ${newQuantity}`);
        
        // Create a completely new object to ensure React detects the change
        updatedItems[itemId] = {
          ...updatedItems[itemId],
          quantity: newQuantity
        };
      }
      return updatedItems;
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      if (updatedItems[itemId]) {
        updatedItems[itemId] = {
          ...updatedItems[itemId],
          quantity: 0
        };
      }
      return updatedItems;
    });
  }, []);

  const toggleReadMore = (itemId) => {
    setShowReadMore((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handlePayment = () => {
    // Set flag to prevent clearing on unload
    localStorage.setItem("navigatingToPayment", "true");

    // Save current state
    saveItemsToLocalStorage();

    // Set event name for payment
    const eventName = `${templeData?.name} - ${selectedPackage?.name}`;
    localStorage.setItem("eventName", eventName);
    localStorage.setItem(
      "pujaAmount",
      selectedPackage?.price?.toString() || "0"
    );
    localStorage.setItem("pujaPackageName", selectedPackage?.name || "");

    // Navigate to payment page
    navigate("/payment");
  };

  // Clear cart on component unmount (but not on payment navigation)
  useEffect(() => {
    return () => {
      if (!localStorage.getItem("navigatingToPayment")) {
        localStorage.removeItem("cartItems");
        localStorage.removeItem("totalAmount");
      } else {
        localStorage.removeItem("navigatingToPayment");
      }
    };
  }, []);

  if (!templeData?.offerings) {
    return <div>No offerings available for this temple.</div>;
  }

  return (
    <div className="bg-amber-50 min-h-screen pt-16">
      {/* Progress Bar for Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-1">
          <div className="flex justify-center items-center">
            <div className="w-full flex justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-200 -z-10">
                <div className="h-full bg-orange-500 w-[55%] transition-all duration-1000"></div>
              </div>
              {["Puja", "Package", "Register", "Payment"].map((step, index) => (
                <div key={step} className="text-center relative">
                  <div className="process-icon-container relative z-10 bg-white p-2 rounded-full inline-block">
                    <img
                      src={`/assets/img/landing-page/icon${index + 1}.png`}
                      alt={step}
                      className="w-8 h-8 process-icon transition-all duration-500"
                    />
                  </div>
                  <span
                    className={`text-[10px] mt-1 ${
                      index === 1
                        ? "text-orange-500 font-medium"
                        : index < 1
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className=" flex justify-center items-center mx-auto mt-16 lg:mt-0 px-4 py-8 md:px-8 mb-24">
        <div className="flex items-start gap-8">
          {/* Left Section: Temple Details */}
          <div
            className="hidden lg:block bg-white rounded-lg shadow-lg p-4 md:p-6 sticky top-4"
            style={{ height: "fit-content" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-orange-800 mb-4">
              {templeData.name}
            </h2>
            <img
              src={templeData.image}
              alt="Temple Image"
              className="w-full h-[400px] object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Right Section: Cart */}
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full h-[90vh] flex flex-col">
            {/* Current Package Header */}
            <div className="md:p-4 p-2 border-b">
              <div className="flex justify-between items-center">
                <h2 className="md:text-xl text-lg font-semibold text-gray-800">
                  Current Package:
                </h2>
                <div className="flex items-center gap-2">
                  <span className="md:text-lg text-base font-semibold text-orange-600">
                    {selectedPackage?.name}
                  </span>
                  <span className="md:text-lg text-base font-semibold text-orange-600">
                    ₹{selectedPackage?.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Items (Scrollable) */}
            <div className="flex-1 overflow-y-auto md:p-4 p-2 space-y-4">
              {templeData.offerings.map((offering) => (
                <div
                  key={offering.id}
                  className="w-full bg-white rounded-lg shadow-md md:p-4 p-2"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="md:text-lg text-base font-semibold text-gray-800 flex items-center gap-2">
                      <i className={`${offering.icon} text-orange-500`}></i>
                      {offering.name}
                    </h3>
                    {!items[offering.id] || items[offering.id].quantity === 0 ? (
                      <button
                        onClick={(e) => updateItemQuantity(offering.id, 1, e)}
                        className="bg-orange-500 text-white md:px-4 px-3 md:py-2 py-1 rounded-lg hover:bg-orange-600 md:text-base text-sm"
                      >
                        Add
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => updateItemQuantity(offering.id, -1, e)}
                          className="bg-gray-200 text-gray-600 md:w-8 md:h-8 w-6 h-6 rounded-lg"
                        >
                          −
                        </button>
                        <span className="md:text-lg text-base">
                          {items[offering.id]?.quantity}
                        </span>
                        <button
                          onClick={(e) => updateItemQuantity(offering.id, 1, e)}
                          className="bg-gray-200 text-gray-600 md:w-8 md:h-8 w-6 h-6 rounded-lg"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(offering.id)}
                          className="bg-red-500 text-white md:px-3 px-2 md:py-1 py-0.5 rounded-md hover:bg-red-600 md:text-sm text-xs flex items-center gap-1"
                        >
                          <i className="fas fa-trash-alt"></i> Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="md:text-sm text-xs text-gray-600">
                    {offering.description}
                  </p>
                  <p className="md:text-sm text-xs font-semibold text-orange-600 mt-1">
                    ₹{offering.price}
                  </p>
                  <button
                    onClick={() => toggleReadMore(offering.id)}
                    className="md:text-sm text-xs text-blue-600 hover:underline block mt-1"
                  >
                    {showReadMore[offering.id] ? "Read Less" : "Read More"}
                  </button>
                  {showReadMore[offering.id] && (
                    <p className="md:text-sm text-xs text-gray-700 mt-2 p-2 bg-gray-50 rounded">
                      {offering.readMore}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Fixed Pay Button */}
            <div className="md:p-4 p-2 bg-white border-t sticky bottom-0">
              <button
                onClick={handlePayment}
                className="w-full bg-orange-500 text-white md:px-6 px-4 md:py-3 py-2 rounded-lg hover:bg-orange-600 md:text-lg text-base font-semibold"
              >
                ₹{totalAmount} Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleOfferings;
