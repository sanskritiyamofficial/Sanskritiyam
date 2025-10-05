import React from 'react';

const TempleDescription = ({ templeData }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {templeData.name} Description
      </h2>
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          {templeData.description}
        </p>
        
        {templeData.templeInfo && (
          <div className="bg-orange-50 p-6 rounded-lg">
            <p className="text-gray-700 italic">
              (Located in the spiritual heart of Varanasi, {templeData.name} is a powerful Shaktipeeth where Maa Gauri is worshipped for centuries. This temple is believed to fulfill heartfelt desires related to marriage, family unity, and marital bliss.)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TempleDescription;
