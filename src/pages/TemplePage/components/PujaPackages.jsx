import React, { useState } from 'react';
import { FaCheckCircle, FaPray } from 'react-icons/fa';

const PujaPackages = ({ packages, onPackageSelect }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handlePackageSelect = (pkg) => {
    onPackageSelect(pkg);
  };

  return (
    <>
      {/* Desktop Packages */}
      <div className="bg-white py-12 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {pkg.name}
                  </h3>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-orange-600">
                      ₹{pkg.price}
                    </p>
                    {pkg.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        ₹{pkg.originalPrice}
                      </p>
                    )}
                  </div>
                </div>
                <hr className="border-t-2 border-orange-500 my-4" />
                <ul className="space-y-3 mb-6 text-gray-600">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm md:text-base lg:text-lg">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePackageSelect(pkg)}
                  className="w-full bg-orange-500 mt-4 md:mt-8 lg:mt-12 text-white py-3 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
                >
                  <FaPray />
                  Participate Now
                </button>
                <h2 className="text-center text-gray-600 text-sm md:text-base lg:text-lg mt-4">
                  {pkg.devotees}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Packages */}
      <div className="md:hidden block pt-12">
        <div className="container mx-auto px-4">
          {/* Package Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`relative puja-tab cursor-pointer transition-all duration-300 ${
                  activeTab === index ? 'active' : ''
                }`}
                onClick={() => setActiveTab(index)}
              >
                <h4 className="text-center text-[10px] font-bold text-gray-600">
                  {pkg.name.split(' ')[0]}
                </h4>
                <div
                  className={`bg-gradient-to-r from-orange-50 to-white rounded-lg p-2 h-[85px] flex items-center justify-center transition-all duration-300 ${
                    activeTab === index ? 'border-2 border-orange-500 shadow-lg' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">🕉️</div>
                    <span className="text-[14px] font-bold text-gray-600">
                      ₹{pkg.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Package Details */}
          <div className="border border-orange-500 rounded-lg pb-3">
            <div className="puja-slider overflow-hidden">
              <div 
                className="puja-slider-wrapper flex transition-transform duration-300"
                style={{ transform: `translateX(-${activeTab * 100}%)` }}
              >
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="puja-details w-full flex-shrink-0"
                  >
                    <div className="rounded-t-lg bg-gradient-to-b from-orange-50 to-white py-3">
                      <div className="text-center px-3 mt-2">
                        <h3 className="text-[18px] font-semibold text-orange-600 mb-[2px]">
                          {pkg.name}
                        </h3>
                        <span className="text-[16px] font-semibold text-gray-800">
                          {pkg.description}
                        </span>
                      </div>
                    </div>

                    <hr className="mx-3" />

                    <div className="px-4">
                      <div className="space-y-4 mt-4">
                        {pkg.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <hr className="mx-4 mt-3" />

                    <div className="px-4 pt-3">
                      <button
                        onClick={() => handlePackageSelect(pkg)}
                        className="w-full h-11 bg-orange-500 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
                      >
                        <span className="text-white text-sm font-bold pr-2">
                          PARTICIPATE
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Slider Pagination Dots */}
            <div className="slider-pagination flex justify-center gap-2 mt-4">
              {packages.map((_, index) => (
                <span
                  key={index}
                  className={`pagination-dot cursor-pointer transition-all duration-300 ${
                    activeTab === index ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .puja-tab.active div {
          border: 2px solid #f97316;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .pagination-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #D1D5DB;
          transition: width 0.3s ease, background 0.3s ease;
        }

        .pagination-dot.active {
          width: 24px;
          background: #f97316;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};

export default PujaPackages;
