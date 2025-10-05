import React, { useEffect, useRef, useState } from "react";
import { processSteps } from "./Data/Data";

const ProcessSection = () => {
  const sectionRef = useRef(null);
  const progressLineRef = useRef(null);
  const mobileProgressLineRef = useRef(null);
  const iconsRef = useRef([]);
  const cardsRef = useRef([]);
  const [isVisible, setIsVisible] = useState(false);
  const [setAnimatedSteps] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      const triggerPoint = window.innerHeight * 0.8;

      if (sectionTop <= triggerPoint && !isVisible) {
        setIsVisible(true);

        // Animate section appearance with stagger effect
        sectionRef.current.style.opacity = "1";
        sectionRef.current.style.transform = "translateY(0)";

        // Animate progress lines with delay
        setTimeout(() => {
          if (progressLineRef.current) {
            progressLineRef.current.style.width = "100%";
          }
          if (mobileProgressLineRef.current) {
            mobileProgressLineRef.current.style.width = "100%";
          }
        }, 300);

        // Staggered card animations
        cardsRef.current.forEach((card, index) => {
          if (card) {
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0) scale(1)";
              setAnimatedSteps((prev) => new Set([...prev, index]));
            }, 500 + index * 200);
          }
        });

        // Icon pulse animations with delay
        iconsRef.current.forEach((icon, index) => {
          if (icon) {
            setTimeout(() => {
              icon.classList.add("animate-pulse-scale");
            }, 800 + index * 200);
          }
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isVisible, setAnimatedSteps]);

  return (
    <>
      <style jsx>{`
        @keyframes pulse-scale {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(251, 146, 60, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(251, 146, 60, 0.6);
          }
        }

        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .process-card {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(50px) scale(0.9);
        }

        .process-card:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .progress-line {
          background: linear-gradient(90deg, #f97316, #fb923c, #fdba74);
          box-shadow: 0 2px 10px rgba(249, 115, 22, 0.3);
        }

        .icon-container {
          background: linear-gradient(135deg, #fff 0%, #fef3e2 100%);
          border: 3px solid #fed7aa;
          transition: all 0.3s ease;
        }

        .icon-container:hover {
          border-color: #fb923c;
          transform: rotate(5deg) scale(1.1);
        }

        .step-number {
          background: linear-gradient(135deg, #f97316, #fb923c);
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          position: absolute;
          top: -10px;
          right: -10px;
          z-index: 20;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
        }
      `}</style>

      <section
        ref={sectionRef}
        className="py-16 md:py-20 bg-gradient-to-br from-orange-50 via-white to-orange-50 opacity-0 transform translate-y-10 transition-all duration-1000"
        id="pujaProcessSection"
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-6">
              <img
                src="https://cdn-icons-png.freepik.com/512/17729/17729027.png"
                alt="Swastik"
                className="h-10 md:h-14 animate-float"
              />
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                Puja Process
              </h2>
              <img
                src="https://cdn-icons-png.freepik.com/512/17729/17729027.png"
                alt="Swastik"
                className="h-10 md:h-14 animate-float"
                style={{ animationDelay: "1s" }}
              />
            </div>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
              Experience the divine journey through our carefully crafted puja
              process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative">
            {/* Enhanced Progress Line (visible only on desktop) */}
            <div className="hidden lg:block absolute top-20 left-0 right-0 h-2 bg-gray-200 rounded-full mx-16">
              <div
                ref={progressLineRef}
                className="h-full progress-line w-0 transition-all duration-2000 ease-out rounded-full animate-glow"
              ></div>
            </div>

            {/* Enhanced Mobile Progress Line */}
            <div className="block lg:hidden absolute top-1/2 left-8 right-8 h-2 bg-gray-200 rounded-full">
              <div
                ref={mobileProgressLineRef}
                className="h-full progress-line w-0 transition-all duration-2000 ease-out rounded-full"
              ></div>
            </div>

            {processSteps.map((step, index) => (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className="process-card text-center relative group"
              >
                {/* Step Number */}
                <div className="step-number">{index + 1}</div>

                {/* Enhanced Icon Container */}
                <div className="icon-container relative z-10 p-6 rounded-2xl inline-block mb-6 shadow-lg">
                  <img
                    ref={(el) => (iconsRef.current[index] = el)}
                    src={step.icon}
                    alt={step.title}
                    className="h-16 md:h-20 mx-auto transition-all duration-500 group-hover:scale-110"
                  />

                  {/* Animated Ring */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-orange-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
                </div>

                {/* Enhanced Description */}
                <div className="bg-white rounded-xl p-4 shadow-md group-hover:shadow-xl transition-all duration-300">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                    {step.description.split(" ").map((word, i, arr) => (
                      <React.Fragment key={i}>
                        {word}
                        {i < arr.length - 1 && i % 3 === 2 && <br />}
                        {i < arr.length - 1 && i % 3 !== 2 && " "}
                      </React.Fragment>
                    ))}
                  </p>
                </div>

                {/* Connection Line for Mobile */}
                {index < processSteps.length - 1 && (
                  <div className="block lg:hidden absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-orange-400 to-transparent"></div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <span className="font-semibold">
                Start Your Spiritual Journey
              </span>
              <svg
                className="w-5 h-5 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProcessSection;
