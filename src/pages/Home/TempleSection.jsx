import React, { useState, useCallback } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import TempleCard from "../../components/TempleCard";

const TempleSection = ({ title, data }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const cardsPerPage = 3;

  const totalPages = Math.ceil(data.length / cardsPerPage);

  const showCards = useCallback(
    (pageIndex) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(pageIndex);
        setIsTransitioning(false);
      }, 150);
    },
    [isTransitioning]
  );

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
      setIsTransitioning(false);
    }, 150);
  }, [totalPages, isTransitioning]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
      setIsTransitioning(false);
    }, 150);
  }, [totalPages, isTransitioning]);

  const trackEvent = useCallback((templeName) => {
    console.log("Event tracked:", templeName);
  }, []);

  return (
    <section className="py-5 md:py-5 bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-12 md:mb-16">
          <img
            src="/assets/img/temple.jpg"
            alt="Temple Icon"
            className="h-8 md:h-12"
          />
          <h2 className="text-2xl md:text-4xl font-bold text-orange-600 text-center">
            {title}
          </h2>
          <img
            src="/assets/img/temple.jpg"
            alt="Temple Icon"
            className="h-8 md:h-12"
          />
        </div>
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            disabled={isTransitioning}
            className="absolute -left-6 top-50 transform -translate-y-1/2 z-20 bg-white hover:bg-orange-50 text-orange-500 hover:text-orange-600 p-3 md:p-4 rounded-full shadow-xl border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 hidden md:flex items-center justify-center hover:scale-110 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaArrowLeft />
          </button>

          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className="absolute -right-6 top-50 transform -translate-y-1/2 z-20 bg-white hover:bg-orange-50 text-orange-500 hover:text-orange-600 p-3 md:p-4 rounded-full shadow-xl border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 hidden md:flex items-center justify-center hover:scale-110 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaArrowRight />
          </button>

          <div
            className={`temple-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-all duration-300 ${
              isTransitioning
                ? "opacity-0 transform scale-95"
                : "opacity-100 transform scale-100"
            }`}
          >
            {data.map((temple, index) => {
              const isVisible =
                index >= currentPage * cardsPerPage &&
                index < (currentPage + 1) * cardsPerPage;

              return (
                <TempleCard
                  key={temple.id}
                  temple={temple}
                  isVisible={isVisible}
                  animationDelay={(index % cardsPerPage) * 100}
                  onTrackEvent={trackEvent}
                />
              );
            })}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8 cursor-pointer">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-125 ${
                  index === currentPage
                    ? "bg-orange-500 shadow-lg"
                    : "bg-orange-200 hover:bg-orange-300"
                }`}
                onClick={() => showCards(index)}
              ></button>
            ))}
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-800 mt-8">
            Click for more temples
          </h2>
        </div>
      </div>
    </section>
  );
};

export default TempleSection;
