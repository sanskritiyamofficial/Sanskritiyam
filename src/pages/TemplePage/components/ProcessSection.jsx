import React, { useEffect, useRef } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";

const ProcessSection = () => {
  const { language } = useLanguage();
  const sectionRef = useRef(null);
  const progressLineRef = useRef(null);
  const mobileProgressLineRef = useRef(null);
  const iconsRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      const triggerPoint = window.innerHeight * 0.7;

      if (sectionTop <= triggerPoint) {
        // Animate section appearance
        sectionRef.current.style.opacity = "1";

        // Start icon animations
        iconsRef.current.forEach((icon, index) => {
          if (icon) {
            setTimeout(() => {
              icon.style.transform = "scale(1.5)";
              icon.style.filter = "brightness(1.2)";
            }, index * 500);
          }
        });

        // Animate progress lines
        if (progressLineRef.current) {
          progressLineRef.current.style.width = "100%";
        }
        if (mobileProgressLineRef.current) {
          mobileProgressLineRef.current.style.width = "100%";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const processSteps = {
    en: [
      {
        icon: "/assets/img/landing-page/icon1.png",
        title: "Select from Packages",
        description: "Select from Packages",
      },
      {
        icon: "/assets/img/landing-page/icon2.png",
        title: "Enter Name and Gotra",
        description: "Enter Name and Gotra",
      },
      {
        icon: "/assets/img/landing-page/icon3.png",
        title: "Watch Your Sankalp on Sanskritiyam Platforms",
        description: "Watch Your Sankalp on Sanskritiyam Platforms",
      },
      {
        icon: "/assets/img/landing-page/icon4.png",
        title: "Puja Video and Prashad Delivery",
        description: "Puja Video and Prashad Delivery",
      },
    ],
    hi: [
      {
        icon: "/assets/img/landing-page/icon1.png",
        title: "पैकेज से चुनें",
        description: "पैकेज से चुनें",
      },
      {
        icon: "/assets/img/landing-page/icon2.png",
        title: "नाम और गोत्र दर्ज करें",
        description: "नाम और गोत्र दर्ज करें",
      },
      {
        icon: "/assets/img/landing-page/icon3.png",
        title: "संस्कृतियम प्लेटफॉर्म पर अपना संकल्प देखें",
        description: "संस्कृतियम प्लेटफॉर्म पर अपना संकल्प देखें",
      },
      {
        icon: "/assets/img/landing-page/icon4.png",
        title: "पूजा वीडियो और प्रसाद डिलीवरी",
        description: "पूजा वीडियो और प्रसाद डिलीवरी",
      },
    ],
  };

  const sectionTitle = {
    en: "Puja Process",
    hi: "पूजा प्रक्रिया",
  };

  return (
    <section
      ref={sectionRef}
      className="py-5 md:py-5 bg-white opacity-0 transition-opacity duration-700"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-12">
          <img
            src="https://cdn-icons-png.freepik.com/512/17729/17729027.png"
            alt="Swastik"
            className="h-8 md:h-12"
          />
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-600">
            {sectionTitle[language]}
          </h2>
          <img
            src="https://cdn-icons-png.freepik.com/512/17729/17729027.png"
            alt="Swastik"
            className="h-8 md:h-12"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative">
          {/* Progress Line (visible only on desktop) */}
          <div className="hidden md:block absolute top-8 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gray-200">
            <div
              ref={progressLineRef}
              className="h-full bg-orange-500 w-0 transition-all duration-1000"
            ></div>
          </div>

          {/* Mobile Progress Line (between rows) */}
          <div className="block md:hidden absolute top-1/2 left-1/4 right-1/4 h-1 bg-gray-200">
            <div
              ref={mobileProgressLineRef}
              className="h-full bg-orange-500 w-0 transition-all duration-1000"
            ></div>
          </div>

          {processSteps[language].map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="process-icon-container relative z-10 bg-white p-2 rounded-full inline-block">
                <img
                  ref={(el) => (iconsRef.current[index] = el)}
                  src={step.icon}
                  alt={step.title}
                  className="h-16 mx-auto mb-4 process-icon transition-all duration-500"
                />
              </div>
              <p className="text-gray-700 text-sm md:text-base">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
