import React from 'react';
import { FaPlay } from 'react-icons/fa';

const MantraCard = ({ mantra, onStartJap, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-all duration-300 hover:scale-105 ${className}`}>
      <div className="w-24 h-24 mb-4 flex items-center justify-center">
        <img 
          src={mantra.icon} 
          alt={mantra.name} 
          className="w-full h-full object-cover rounded-full border-4 border-orange-100" 
        />
      </div>
      
      <h3 className="text-xl font-bold text-orange-700 mb-2 text-center">
        {mantra.name}
      </h3>
      
      <p className="text-gray-600 text-center mb-2 text-sm">
        {mantra.description}
      </p>
      
      <div className="bg-orange-50 rounded-lg p-3 mb-4 w-full">
        <p className="text-gray-700 text-center text-sm font-medium">
          "{mantra.mantra}"
        </p>
      </div>
      
      <button 
        onClick={() => onStartJap(mantra)}
        className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
      >
        <FaPlay className="w-4 h-4" />
        Start {mantra.targetCount} Jap
      </button>
    </div>
  );
};

export default MantraCard;
