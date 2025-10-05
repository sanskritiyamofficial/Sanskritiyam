import React, { useEffect, useRef } from "react";
import { testimonials } from "./Data/Data";

const TestimonialsSection = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollAmount = 0;
    const scrollSpeed = 1;
    const cardWidth = 350; // Approximate width of each card including margin

    const scroll = () => {
      scrollAmount += scrollSpeed;

      // Reset scroll when we've scrolled past all original cards
      if (scrollAmount >= cardWidth * testimonials.length) {
        scrollAmount = 0;
      }

      slider.style.transform = `translateX(-${scrollAmount}px)`;
    };

    const intervalId = setInterval(scroll, 20);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto md:px-6">
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
          <img
            src="/assets/img/lotus.png"
            alt="Devotees Icon"
            className="h-6 sm:h-8 md:h-12"
          />
          <h2 className="text-md sm:text-3xl md:text-4xl font-bold text-orange-600">
            Happy Devotees Corner
          </h2>
          <img
            src="/assets/img/lotus.png"
            alt="Right Icon"
            className="h-6 sm:h-8 md:h-12"
          />
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={sliderRef}
            className="testimonial-slider flex flex-nowrap p-2 sm:p-4 transition-transform"
          >
            {/* Render testimonials twice for seamless loop */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-1/2 mx-2 sm:mx-4 flex-shrink-0"
              >
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between items-center gap-2">
                    <h3 className="text-md sm:text-xl md:text-lg font-bold text-gray-800 mb-2 sm:mb-3">
                      {testimonial.title}
                    </h3>
                    <img
                      src={testimonial.platformIcon}
                      alt={`${testimonial.platform} Icon`}
                      className="h-8 sm:h-12 md:h-12"
                    />
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">
                    {testimonial.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={testimonial.authorImage}
                    alt={testimonial.author}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  />
                  <div>
                    <div className="text-orange-500 text-sm sm:text-base">
                      {testimonial.rating}
                    </div>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">
                      {testimonial.author}
                    </p>
                    {testimonial.platform !== "WhatsApp" && (
                      <p className="text-xs sm:text-sm text-gray-500">
                        Via @ {testimonial.platform}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
