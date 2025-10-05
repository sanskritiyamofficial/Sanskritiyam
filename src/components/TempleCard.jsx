import React from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaPray,
} from "react-icons/fa";

const TempleCard = ({ 
  temple, 
  isVisible = true, 
  animationDelay = 0,
  onTrackEvent,
  className = "",
  showBookNow = true,
  showHeart = true,
  buttonText = "Participate Now",
  buttonIcon = FaPray
}) => {
  const handleTrackEvent = () => {
    if (onTrackEvent) {
      onTrackEvent(temple.name);
    }
  };

  const ButtonIcon = buttonIcon;

  return (
    <div
      key={temple.id}
      data-mandir-id={temple.id}
      data-mandir={temple.name}
      data-page-url={temple.link}
      className={`temple-card rounded-2xl overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
        !isVisible ? "hidden" : "animate-fadeInUp"
      } ${className}`}
      style={{
        animationDelay: `${animationDelay}ms`,
      }}
    >
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={temple.image}
          alt={temple.name}
          className="w-full h-full object-cover hover:opacity-0 transition-opacity duration-500 absolute top-0 left-0"
        />
        {temple.video && (
          <video className="w-full h-full object-cover" loop muted>
            <source src={temple.video} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {showBookNow && (
          <div className="absolute top-2 right-2 bg-orange-500 px-3 py-1 rounded-full text-white text-sm font-medium animate-pulse">
            Book Now
          </div>
        )}
      </div>
      <div className="p-4 md:p-6 bg-white">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-base md:text-xl font-semibold text-gray-800">
            {temple.name}
          </h3>
          {showHeart && (
            <div className="text-orange-500">
              <FaHeart />
            </div>
          )}
        </div>
        <p className="text-gray-600 mb-2 flex items-center gap-2 text-xs md:text-base">
          <FaMapMarkerAlt className="text-orange-400" />
          {temple.location} • {temple.devotees}
        </p>
        {temple.description && (
          <p className="text-gray-500 text-sm mb-3 italic">
            {temple.description}
          </p>
        )}
        <Link to={temple.link || `/temple/${temple.id}`}>
          <button
            onClick={handleTrackEvent}
            className="w-full bg-orange-500 text-white px-4 md:px-6 py-2 rounded-full hover:bg-orange-600 transition flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer"
          >
            <ButtonIcon />
            {buttonText}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TempleCard;
