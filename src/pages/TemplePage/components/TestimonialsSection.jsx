import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const TestimonialsSection = () => {
  const { language } = useLanguage();

  const testimonials = [
    {
      id: 1,
      title: {
        en: "Mahamrityunjaya Yantra",
        hi: "महामृत्युंजय यंत्र"
      },
      description: {
        en: "My father's health was deteriorating until we placed the Sanskritiyam Mahamrityunjaya Yantra near his bed, which helped stabilize his condition.",
        hi: "मेरे पिता की तबीयत बिगड़ती जा रही थी जब तक हमने संस्कृतियम महामृत्युंजय यंत्र को उनके बिस्तर के पास नहीं रखा, जिससे उनकी स्थिति स्थिर हो गई।"
      },
      author: "Nisha Kothari",
      platform: "WhatsApp",
      rating: "⭐⭐⭐⭐⭐",
      authorImage: "/assets/img/testimonials/testimonials-1.jpg"
    },
    {
      id: 2,
      title: {
        en: "Prasad Delivery",
        hi: "प्रसाद डिलीवरी"
      },
      description: {
        en: "The prasad delivery service is amazing. I received the sacred prasad from Kashi Vishwanath temple within 3 days. Very satisfied with the service.",
        hi: "प्रसाद डिलीवरी सेवा अद्भुत है। मुझे काशी विश्वनाथ मंदिर से पवित्र प्रसाद 3 दिनों में मिल गया। सेवा से बहुत संतुष्ट हूं।"
      },
      author: "Rajesh Kumar",
      platform: "Google",
      rating: "⭐⭐⭐⭐⭐",
      authorImage: "/assets/img/testimonials/testimonials-2.jpg"
    },
    {
      id: 3,
      title: {
        en: "Online Puja",
        hi: "ऑनलाइन पूजा"
      },
      description: {
        en: "Being away from India, the online puja service helped me stay connected with our traditions. The live streaming was crystal clear.",
        hi: "भारत से दूर होने के कारण, ऑनलाइन पूजा सेवा ने मुझे हमारी परंपराओं से जुड़े रहने में मदद की। लाइव स्ट्रीमिंग बिल्कुल साफ थी।"
      },
      author: "Priya Sharma",
      platform: "Facebook",
      rating: "⭐⭐⭐⭐⭐",
      authorImage: "/assets/img/testimonials/testimonials-3.jpg"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
          <img
            src="/assets/img/lotus2.png"
            alt="Devotees Icon"
            className="h-6 sm:h-8 md:h-12"
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600">
            {language === "hi" ? "खुश भक्तों का कोना" : "Happy Devotees Corner"}
          </h2>
          <img
            src="/assets/img/lotus.png"
            alt="Right Icon"
            className="h-6 sm:h-8 md:h-12"
          />
        </div>

        <div className="relative overflow-hidden">
          <div className="testimonial-slider flex flex-nowrap p-2 sm:p-4 animate-scroll">
            {/* Original testimonials */}
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 min-w-[280px] sm:min-w-[300px] md:min-w-[350px] mx-2 sm:mx-4"
              >
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                    {testimonial.title[language]}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {testimonial.description[language]}
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
                    <p className="text-xs sm:text-sm text-gray-500">
                      {language === "hi" ? "द्वारा @" : "Via @"} {testimonial.platform}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Duplicate testimonials for continuous scroll */}
            {testimonials.map((testimonial) => (
              <div
                key={`duplicate-${testimonial.id}`}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 min-w-[280px] sm:min-w-[300px] md:min-w-[350px] mx-2 sm:mx-4"
              >
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                    {testimonial.title[language]}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {testimonial.description[language]}
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
                    <p className="text-xs sm:text-sm text-gray-500">
                      {language === "hi" ? "द्वारा @" : "Via @"} {testimonial.platform}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-scroll {
            animation: scroll 30s linear infinite;
          }

          @media (max-width: 640px) {
            .animate-scroll {
              animation-duration: 20s;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default TestimonialsSection;
