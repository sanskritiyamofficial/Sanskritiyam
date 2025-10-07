import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { temples, chadhawas } from "../pages/Home/Data/TempleData";

const UpsellCrosssell = ({ bookedPuja, onClose }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(true);

  const getComplementaryCategories = useCallback((category) => {
    const complementaryMap = {
      marriage: ["prosperity", "divine-mother"],
      healing: ["protection", "rudrabhishek"],
      protection: ["healing", "wisdom"],
      prosperity: ["marriage", "divine-mother"],
      rudrabhishek: ["healing", "protection"],
      "divine-mother": ["marriage", "prosperity"],
      wisdom: ["protection", "prosperity"],
    };
    return complementaryMap[category] || ["prosperity", "protection"];
  }, []);

  const generateRecommendations = useCallback(() => {
    setLoading(true);

    // Combine all temples
    const allTemples = [
      ...temples.map((t) => ({ ...t, source: "temples" })),
      ...chadhawas.map((t) => ({ ...t, source: "chadhawas" })),
    ];

    // Filter out the booked puja
    const availableTemples = allTemples.filter(
      (temple) =>
        temple.id !== bookedPuja?.id && temple.name !== bookedPuja?.name
    );

    // Generate recommendations based on different strategies
    const recommendations = [];

    // 1. Same category recommendations (cross-sell)
    if (bookedPuja?.pujaCategory) {
      const sameCategory = availableTemples
        .filter((temple) => temple.pujaCategory === bookedPuja.pujaCategory)
        .slice(0, 2);
      recommendations.push(...sameCategory);
    }

    // 2. Complementary categories (upsell)
    const complementaryCategories = getComplementaryCategories(
      bookedPuja?.pujaCategory
    );
    const complementary = availableTemples
      .filter((temple) => complementaryCategories.includes(temple.pujaCategory))
      .slice(0, 2);
    recommendations.push(...complementary);

    // 3. Popular/high-rated temples (upsell)
    const popular = availableTemples
      .filter(
        (temple) =>
          temple.devotees &&
          parseInt(temple.devotees.replace(/[^\d]/g, "")) > 1000
      )
      .slice(0, 2);
    recommendations.push(...popular);

    // 4. Fill remaining slots with random temples
    const remaining = availableTemples
      .filter((temple) => !recommendations.some((rec) => rec.id === temple.id))
      .slice(0, 6 - recommendations.length);
    recommendations.push(...remaining);

    // Remove duplicates and limit to 6
    const uniqueRecommendations = recommendations
      .filter(
        (temple, index, self) =>
          index === self.findIndex((t) => t.id === temple.id)
      )
      .slice(0, 6);

    setRecommendations(uniqueRecommendations);
    setLoading(false);
  }, [bookedPuja, getComplementaryCategories]);

  useEffect(() => {
    // Check if user has valid booked puja data
    if (!bookedPuja) {
      // Redirect to puja booking page if no valid booking
      navigate("/pooja-booking");
      return;
    }

    setIsValidating(false);
    // Generate recommendations based on booked puja
    generateRecommendations();
  }, [generateRecommendations, bookedPuja, navigate]);

  const handleBookNow = (temple) => {
    // Store temple data for booking
    localStorage.setItem("selectedTemple", JSON.stringify(temple));
    localStorage.setItem("navigatingToPayment", "true");

    // Navigate to temple page or payment
    if (temple.link && temple.link.startsWith("/temple/")) {
      navigate(temple.link);
    } else {
      navigate("/pooja-booking");
    }
  };

  const getCategoryIcon =useCallback( (category) => {
    const icons = {
      marriage: "💒",
      rudrabhishek: "🔥",
      healing: "🩺",
      protection: "🛡️",
      prosperity: "💰",
      "divine-mother": "🕉️",
      wisdom: "🧠",
    };
    return icons[category] || "🙏";
  }, []);

  const getCategoryName = useCallback((category) => {
    const names = {
      marriage: "Marriage",
      rudrabhishek: "Rudrabhishek",
      healing: "Healing",
      protection: "Protection",
      prosperity: "Prosperity",
      "divine-mother": "Divine Mother",
      wisdom: "Wisdom",
    };
    return names[category] || "Spiritual";
  }, []);

  if (isValidating) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Validating booking...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center mt-40">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Finding perfect recommendations for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-white rounded-2xl">
        {/* Header */}
        <div className=" bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="mx-auto mt-20">
              <h2 className="text-2xl font-bold text-orange-600 mb-2">
                🙏 Complete Your Spiritual Journey
              </h2>
              <p className="text-gray-600">
                Enhance your blessings with these recommended pujas
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Booked Puja Summary */}
          {bookedPuja && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl">✅</div>
                <div>
                  <h3 className="font-semibold text-orange-800">
                    Successfully Booked: {bookedPuja.name}
                  </h3>
                  <p className="text-orange-600 text-sm">
                    {getCategoryIcon(bookedPuja.pujaCategory)}{" "}
                    {getCategoryName(bookedPuja.pujaCategory)} Puja
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((temple) => (
              <div
                key={`${temple.source}-${temple.id}`}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Image */}
                <div className=" h-48 overflow-hidden">
                  <img
                    src={temple.image}
                    alt={temple.name}
                    className="w-full h-full object-cover"
                  />
                  <div className=" top-3 left-3">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {getCategoryIcon(temple.pujaCategory)}{" "}
                      {getCategoryName(temple.pujaCategory)}
                    </span>
                  </div>
                  {temple.originalPrice &&
                    temple.price < temple.originalPrice && (
                      <div className=" top-3 right-3">
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                          {Math.round(
                            ((temple.originalPrice - temple.price) /
                              temple.originalPrice) *
                              100
                          )}
                          % OFF
                        </span>
                      </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">
                    {temple.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {temple.description}
                  </p>

                  {/* Benefits */}
                  {temple.benefits && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Benefits:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {temple.benefits.slice(0, 2).map((benefit, idx) => (
                          <span
                            key={idx}
                            className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                          >
                            {benefit}
                          </span>
                        ))}
                        {temple.benefits.length > 2 && (
                          <span className="text-gray-500 text-xs">
                            +{temple.benefits.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price and Duration */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-orange-600">
                          ₹{temple.price?.toLocaleString()}
                        </span>
                        {temple.originalPrice && (
                          <span className="text-gray-500 line-through text-sm">
                            ₹{temple.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {temple.duration && (
                        <p className="text-gray-500 text-sm">
                          ⏱️ {temple.duration}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 text-sm">{temple.devotees}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleBookNow(temple)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Continue to Home
            </button>
            <button
              onClick={() => navigate("/pooja-booking")}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Browse All Pujas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpsellCrosssell;
