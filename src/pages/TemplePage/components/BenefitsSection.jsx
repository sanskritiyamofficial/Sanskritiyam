import React from 'react';
import { FaHeart, FaStar, FaHandHoldingHeart, FaRing } from 'react-icons/fa';
import { useLanguage } from '../../../contexts/LanguageContext';

const BenefitsSection = () => {
  const { language } = useLanguage();

  const benefits = {
    en: [
      {
        icon: FaHeart,
        title: "Find Lasting Love in Life",
        description: "Experience a long-lasting, fulfilling love life filled with happiness and mutual understanding."
      },
      {
        icon: FaStar,
        title: "Attraction and Beauty",
        description: "Enhances personal attraction, beauty and brings positive energy into your life."
      },
      {
        icon: FaHandHoldingHeart,
        title: "Removal of Marital Tension",
        description: "Helps in removing conflicts and tension in marriage, bringing harmony to relationships."
      },
      {
        icon: FaRing,
        title: "Fulfillment of Love Marriage",
        description: "Assists in realizing the desire for love marriage and brings blessings for a happy married life."
      }
    ],
    hi: [
      {
        icon: FaHeart,
        title: "जीवन में स्थायी प्रेम पाएं",
        description: "खुशी और आपसी समझ से भरे दीर्घकालिक, संतुष्टिजनक प्रेम जीवन का अनुभव करें।"
      },
      {
        icon: FaStar,
        title: "आकर्षण और सुंदरता",
        description: "व्यक्तिगत आकर्षण, सुंदरता बढ़ाता है और आपके जीवन में सकारात्मक ऊर्जा लाता है।"
      },
      {
        icon: FaHandHoldingHeart,
        title: "वैवाहिक तनाव का निवारण",
        description: "विवाह में संघर्ष और तनाव को दूर करने में मदद करता है, रिश्तों में सामंजस्य लाता है।"
      },
      {
        icon: FaRing,
        title: "प्रेम विवाह की पूर्ति",
        description: "प्रेम विवाह की इच्छा को साकार करने में सहायता करता है और खुशहाल वैवाहिक जीवन के लिए आशीर्वाद लाता है।"
      }
    ]
  };

  const sectionTitle = {
    en: "Benefits of This Puja",
    hi: "इस पूजा के लाभ"
  };

  const currentBenefits = benefits[language] || benefits.en;

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {sectionTitle[language] || sectionTitle.en}
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {currentBenefits.slice(0, Math.ceil(currentBenefits.length / 2)).map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-r from-orange-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <IconComponent className="text-2xl text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {currentBenefits.slice(Math.ceil(currentBenefits.length / 2)).map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index + Math.ceil(currentBenefits.length / 2)}
                className="bg-gradient-to-r from-orange-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <IconComponent className="text-2xl text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
