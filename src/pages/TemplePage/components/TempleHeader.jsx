import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';

const TempleHeader = ({ templeData, onSelectPackage }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Image Section */}
        <div className="rounded-lg overflow-hidden shadow-xl">
          <img
            src={templeData.image}
            alt={templeData.name}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {templeData.name}
          </h1>

          <div className="flex items-center space-x-2 text-gray-700">
            <FaMapMarkerAlt className="text-orange-500" />
            <strong>Location:</strong>
            <span className="text-orange-600 text-[15px]">
              {templeData.location}
            </span>
          </div>

          <div className="countdown bg-orange-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-orange-500" />
              <span className="text-orange-600 font-semibold">
                Next Puja: Today at 6:00 PM
              </span>
            </div>
          </div>

          <p className="devotee-count text-green-600 font-medium">
            {templeData.devotees}
          </p>

          {/* Select Puja Package Button */}
          <button
            onClick={onSelectPackage}
            className="bg-orange-500 text-center text-white px-16 py-3 rounded-lg hover:bg-orange-600 transition transform hover:scale-105"
          >
            Select Puja Package
          </button>
        </div>
      </div>
    </div>
  );
};

export default TempleHeader;
