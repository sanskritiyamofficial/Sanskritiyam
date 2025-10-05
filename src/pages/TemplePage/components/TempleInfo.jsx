import React from 'react';
import { FaMapMarkerAlt, FaClock, FaOm } from 'react-icons/fa';

const TempleInfo = ({ templeData }) => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Temple Information
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {templeData.templeInfo}
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              People from all over come to this temple with prayers in their hearts—some for marriage, some for love, some for family peace, and some for the joy of having a child. Devotees believe that Maa listens quickly and blesses those who pray with true devotion.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              The puja performed at this temple is known for its purity and effectiveness. The puja is done by experienced Vedic priests who take your name and gotra during the sankalp, making the ritual highly personal and spiritually strong.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-500" />
                <span className="text-gray-600">Kashi, Varanasi</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-orange-500" />
                <span className="text-gray-600">Open 24/7</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={templeData.image}
                alt={templeData.name}
                className="w-full h-[400px] object-cover hover:scale-105 transition duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleInfo;
