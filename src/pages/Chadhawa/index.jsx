import React from "react";
import { Link } from "react-router-dom";
import TempleCard from "../../components/TempleCard";
import { FaHandHoldingHeart } from "react-icons/fa";
import chadhawaTemples from "./ChadhawaData";

const Chadhawa = () => {

  const handleTrackEvent = (templeName) => {
    console.log(`User clicked on ${templeName} temple`);
    // Add analytics tracking here if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Temple Prasad Booking
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Book sacred prasad from the most revered temples in Varanasi. 
            Experience divine blessings through our temple prasad service.
          </p>
        </div>
      </div>

      {/* Temple Cards Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Choose Your Temple
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select from our collection of sacred temples and book prasad for your spiritual journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chadhawaTemples.map((temple, index) => (
            <TempleCard
              key={temple.id}
              temple={{
                ...temple,
                link: `/chadhawa/${temple.id}` // Update link to point to temple detail page
              }}
              isVisible={true}
              animationDelay={index * 100}
              onTrackEvent={handleTrackEvent}
              buttonText="Book Prasad"
              buttonIcon={FaHandHoldingHeart}
              className="hover:scale-105"
            />
          ))}
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              About Our Prasad Service
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHandHoldingHeart className="text-2xl text-orange-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Sacred Prasad
                </h4>
                <p className="text-gray-600">
                  Receive blessed prasad from the most revered temples in Varanasi
                </p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🙏</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Divine Blessings
                </h4>
                <p className="text-gray-600">
                  Experience the spiritual energy and blessings of ancient temples
                </p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Authentic Temples
                </h4>
                <p className="text-gray-600">
                  All prasad comes from authentic and historically significant temples
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chadhawa;
