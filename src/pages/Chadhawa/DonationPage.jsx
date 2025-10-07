import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFire,
  FaTshirt,
  FaCandyCane,
  FaPray,
  FaHandHoldingHeart,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { IoMdFlower } from "react-icons/io";    

const DonationPage = () => {
  const navigate = useNavigate();
  const [selectedDonationType, setSelectedDonationType] = useState(null);
  const [selectedTemple, setSelectedTemple] = useState(null);
  const [donationAmount, setDonationAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorMessage, setDonorMessage] = useState("");

  const donationTypes = [
    {
      id: "phool",
      name: "Phool (Flowers)",
      icon: IoMdFlower,
      color: "from-pink-500 to-rose-500",
      description: "Sacred flowers for temple decoration and offerings",
      minAmount: 101,
      popularAmounts: [101, 251, 501, 1001],
    },
    {
      id: "deep",
      name: "Deep (Oil Lamp)",
      icon: FaFire,
      color: "from-yellow-500 to-orange-500",
      description: "Oil lamps for divine light and spiritual illumination",
      minAmount: 151,
      popularAmounts: [151, 351, 751, 1501],
    },
    {
      id: "vastra",
      name: "Vastra (Cloth)",
      icon: FaTshirt,
      color: "from-blue-500 to-indigo-500",
      description: "Sacred cloth for deity adornment and temple rituals",
      minAmount: 201,
      popularAmounts: [201, 501, 1001, 2001],
    },
    {
      id: "mithaai",
      name: "Mithaai (Sweets)",
      icon: FaCandyCane,
      color: "from-green-500 to-emerald-500",
      description: "Sacred sweets and prasad for devotees",
      minAmount: 301,
      popularAmounts: [301, 751, 1501, 3001],
    },
  ];

  const temples = [
    {
      id: "kashi-vishwanath",
      name: "Kashi Vishwanath Temple",
      location: "Varanasi, Uttar Pradesh",
      image: "/assets/img/Mandir-img/KashiVishwanath.webp",
      date: "08 Oct 2025",
    },
    {
      id: "kaal-bhairav",
      name: "Kaal Bhairav Temple",
      location: "Varanasi, Uttar Pradesh",
      image: "/assets/img/Mandir-img/KaalBhairav.webp",
      date: "09 Oct 2025",
    },
    {
      id: "sankat-mochan",
      name: "Sankat Mochan Temple",
      location: "Varanasi, Uttar Pradesh",
      image: "/assets/img/Mandir-img/SankatMochan.webp",
      date: "10 Oct 2025",
    },
    {
      id: "mahalaxmi",
      name: "Mahalaxmi Temple",
      location: "Varanasi, Uttar Pradesh",
      image: "/assets/img/Mandir-img/manglagori.webp",
      date: "11 Oct 2025",
    },
    {
      id: "chintamani",
      name: "Shree Chintamani Temple",
      location: "Varanasi, Uttar Pradesh",
      image: "/assets/img/Mandir-img/Chintamani.webp",
      date: "12 Oct 2025",
    },
    {
      id: "maha-mrityunjay",
      name: "Maha Mrityunjay Mahadev",
      location: "Kashi, Uttar Pradesh",
      image: "/assets/img/Mandir-img/MahamrityunjayaMandir.webp",
      date: "13 Oct 2025",
    },
  ];

  const handleDonationTypeSelect = (type) => {
    setSelectedDonationType(type);
    setDonationAmount(type.minAmount);
    setCustomAmount("");
  };

  const handleAmountSelect = (amount) => {
    setDonationAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value && !isNaN(value) && parseInt(value) >= selectedDonationType?.minAmount) {
      setDonationAmount(parseInt(value));
    }
  };

  const handleTempleSelect = (temple) => {
    setSelectedTemple(temple);
  };

  const handleProceedToPayment = () => {
    if (!selectedDonationType || !selectedTemple || !donorName || !donorPhone || !donorEmail) {
      alert("Please fill in all required fields");
      return;
    }

    if (donationAmount < selectedDonationType.minAmount) {
      alert(`Minimum donation amount is ₹${selectedDonationType.minAmount}`);
      return;
    }

    // Store donation data in localStorage for payment page
    const donationData = {
      type: selectedDonationType,
      temple: selectedTemple,
      amount: donationAmount,
      donor: {
        name: donorName,
        phone: donorPhone,
        email: donorEmail,
        message: donorMessage,
      },
    };

    localStorage.setItem("donationData", JSON.stringify(donationData));
    localStorage.setItem("totalAmount", donationAmount.toString());
    localStorage.setItem("eventName", `${selectedDonationType.name} Donation at ${selectedTemple.name}`);
    
    // Navigate to payment page
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 ">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-16 pt-24">
        <div className="container mx-auto px-4 text-center">
          <button
            onClick={() => navigate("/chadhawa")}
            className="absolute left-4 top-4 text-white hover:text-orange-200 transition-colors"
          >
            <FaArrowLeft className="text-2xl" />
          </button>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Online Chadava
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Make sacred offerings to temples across India. 
            Your donations help maintain temples and support spiritual activities.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Step 1: Select Donation Type */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Select Your Donation Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <div
                  key={type.id}
                  onClick={() => handleDonationTypeSelect(type)}
                  className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                    selectedDonationType?.id === type.id
                      ? "ring-4 ring-orange-500 border-2 border-orange-500"
                      : "border-2 border-transparent"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                    {type.name}
                  </h3>
                  <p className="text-gray-600 text-center text-sm mb-4">
                    {type.description}
                  </p>
                  <div className="text-center">
                    <span className="text-orange-600 font-bold">
                      Min: ₹{type.minAmount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Temple */}
        {selectedDonationType && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Choose Temple for Offering
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {temples.map((temple) => (
                <div
                  key={temple.id}
                  onClick={() => handleTempleSelect(temple)}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                    selectedTemple?.id === temple.id
                      ? "ring-4 ring-orange-500 border-2 border-orange-500"
                      : "border-2 border-transparent"
                  }`}
                >
                  <img
                    src={temple.image}
                    alt={temple.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {temple.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaMapMarkerAlt className="text-orange-500 mr-2" />
                      <span className="text-sm">{temple.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="text-orange-500 mr-2" />
                      <span className="text-sm">{temple.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Amount */}
        {selectedDonationType && selectedTemple && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Select Donation Amount
            </h2>
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {selectedDonationType.popularAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      donationAmount === amount
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500"
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter custom amount (Min: ₹{selectedDonationType.minAmount})
                </label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  min={selectedDonationType.minAmount}
                  placeholder={`Enter amount (min ₹${selectedDonationType.minAmount})`}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Donor Information */}
        {selectedDonationType && selectedTemple && donationAmount > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Your Information
            </h2>
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Message (Optional)
                  </label>
                  <textarea
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Any special prayers or messages for the offering"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Donation Summary and Proceed Button */}
        {selectedDonationType && selectedTemple && donationAmount > 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Donation Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Donation Type:</span>
                  <span className="font-semibold">{selectedDonationType.name}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Temple:</span>
                  <span className="font-semibold">{selectedTemple.name}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-semibold">{selectedTemple.location}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Offering Date:</span>
                  <span className="font-semibold">{selectedTemple.date}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 text-xl font-bold">
                  <span>Total Amount:</span>
                  <span className="text-orange-600">₹{donationAmount}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleProceedToPayment}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-8 rounded-lg font-bold text-xl transition-all duration-200 flex items-center justify-center gap-3"
            >
              <FaHandHoldingHeart />
              Proceed to Payment
            </button>
          </div>
        )}

        {/* How it Works Section */}
        <div className="mt-16 bg-gray-50 py-12 rounded-xl">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              How Online Chadava Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHandHoldingHeart className="text-2xl text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Select Donation</h3>
                <p className="text-gray-600 text-sm">
                  Choose your donation type and temple
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPray className="text-2xl text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Make Payment</h3>
                <p className="text-gray-600 text-sm">
                  Secure online payment via Razorpay
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-2xl text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Confirmation</h3>
                <p className="text-gray-600 text-sm">
                  Get WhatsApp/Email confirmation
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoMdFlower className="text-2xl text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Offering Made</h3>
                <p className="text-gray-600 text-sm">
                  Your offering is made at the temple
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
