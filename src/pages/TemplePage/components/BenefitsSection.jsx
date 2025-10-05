import React from 'react';
import { FaHeart,FaStar } from 'react-icons/fa';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: "fas fa-heart",
      title: "Find Lasting Love in Life",
      description: "Experience a long-lasting, fulfilling love life filled with happiness and mutual understanding."
    },
    {
      icon: "fas fa-star",
      title: "Attraction and Beauty",
      description: "Enhances personal attraction, beauty and brings positive energy into your life."
    },
    {
      icon: "fas fa-hand-holding-heart",
      title: "Removal of Marital Tension",
      description: "Helps in removing conflicts and tension in marriage, bringing harmony to relationships."
    },
    {
      icon: "fas fa-ring",
      title: "Fulfillment of Love Marriage",
      description: "Assists in realizing the desire for love marriage and brings blessings for a happy married life."
    }
  ];
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Benefits of This Puja
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {benefits.slice(0, Math.ceil(benefits.length / 2)).map((benefit, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-orange-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FaHeart className="text-2xl text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {benefit.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {benefits.slice(Math.ceil(benefits.length / 2)).map((benefit, index) => (
            <div
              key={index + Math.ceil(benefits.length / 2)}
              className="bg-gradient-to-r from-orange-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FaStar className="text-2xl text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {benefit.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
