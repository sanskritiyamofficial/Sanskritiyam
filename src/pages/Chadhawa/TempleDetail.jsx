import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaHandHoldingHeart,
  FaUserEdit,
  FaCreditCard,
  FaPray,
  FaCheckCircle,
  FaChevronLeft,
} from "react-icons/fa";
import chadhawaTemples, {
  commonTestimonials,
  commonFAQs,
  commonPrasadPackages,
} from "./ChadhawaData";

const TempleDetail = () => {
  const { templeId } = useParams();

  const temple = chadhawaTemples.find((t) => t.id === templeId);

  if (!temple) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Temple Not Found
          </h1>
          <Link
            to="/chadhawa"
            className="text-orange-600 hover:text-orange-700"
          >
            ← Back to Temples
          </Link>
        </div>
      </div>
    );
  }

  const prasadPackages = commonPrasadPackages;

  const handleBookPrasad = (packageData) => {
    // Handle booking logic here
    console.log(`Booking ${packageData.name} for ${temple.name}`);
    // You can redirect to a booking page or open a modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-32">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          {/* Image Section */}
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src={temple.image}
              alt={temple.name}
              className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              {temple.name}
            </h2>
            <p className="text-gray-600 text-lg">
              {temple.detailedDescription || temple.description}
            </p>

            <div className="flex items-center space-x-2 text-gray-700">
              <FaMapMarkerAlt className="text-orange-500" />
              <strong>Location:</strong> {temple.location}
            </div>

            <p className="devotee-count text-green-600 font-medium text-lg">
              {temple.devoteeCount || "200+"} Devotees already booked this
              Prasad
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("puja-section")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition transform hover:scale-105 flex items-center gap-2"
            >
              <FaHandHoldingHeart />
              Select Prasad Package
            </button>
          </div>
        </div>

        {/* Why Prasad is Powerful Section */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Why {temple.name.split(" ")[0]} Prasad is So Powerful?
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto">
            {temple.powerDescription ||
              "This sacred temple is known for its powerful spiritual energy and divine blessings. Devotees who visit with deep faith in their hearts find relief from fear, negative energy, and obstacles. The offerings made here are considered very powerful and bring peace, strength, and divine protection into your life."}
          </p>
        </div>

        {/* Prasad Packages Section - Exact match to the offering package layout */}
        <div id="puja-section" className="pt-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Select Your Offering Package
            </h2>

            {/* Package Cards Grid - Exact layout from the image */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {prasadPackages.map((pkg, index) => {
                // Define colors for each package like in the image
                const packageColors = {
                  0: { price: "text-orange-600", border: "border-orange-500", button: "bg-orange-500 hover:bg-orange-600" },
                  1: { price: "text-blue-600", border: "border-blue-500", button: "bg-blue-500 hover:bg-blue-600" },
                  2: { price: "text-red-600", border: "border-red-500", button: "bg-red-500 hover:bg-red-600" }
                };
                
                const colors = packageColors[index] || packageColors[0];
                
                return (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-xl flex flex-col gap-4 shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    {/* Package Title and Price */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-800">
                        {pkg.name === "Prasadam" && "Small Offering & Prasadam"}
                        {pkg.name === "Mahaprasadam" && "Medium Offering & Mahaprasadam"}
                        {pkg.name === "Divyaprasadam" && "Large Offering & Divyaprasadam"}
                      </h3>
                      <span className={`text-2xl font-bold ${colors.price}`}>
                        ₹{pkg.price}
                      </span>
                    </div>

                    {/* Separator Line */}
                    <div className={`h-1 w-full border-t-2 border-orange-500`}></div>

                    {/* Package Features */}
                    <ul className="space-y-3  text-gray-600">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Make Offering Button */}
                    <button
                      onClick={() => handleBookPrasad(pkg)}
                      className={`w-full ${colors.button} cursor-pointer text-white py-3 mt-auto rounded-lg transition flex items-center justify-center gap-2 font-medium`}
                    >
                      <FaPray />
                      Make Offering
                    </button>

                    {/* Devotee Count */}
                    <p className="text-center text-gray-500 text-sm mt-3">
                      {pkg.devotees}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* How to Book Prasad */}
        <div className="bg-gray-50 py-12 mt-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                  How to Book Prasad
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaHandHoldingHeart className="text-2xl text-orange-500" />
                    </div>
                    <p className="text-gray-600">
                      Choose the type of Prasad you wish to Book
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaUserEdit className="text-2xl text-orange-500" />
                    </div>
                    <p className="text-gray-600">
                      Provide your name in the form for the Prasad
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaCreditCard className="text-2xl text-orange-500" />
                    </div>
                    <p className="text-gray-600">Pay online easily</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaPray className="text-2xl text-orange-500" />
                    </div>
                    <p className="text-gray-600">
                      Our priests will make the offering in your name with Vedic
                      rituals and prayers
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="/images/indian-family-offering-prayers-together-indian-family-gathered-together-their-home.jpg"
                    alt="Temple Rituals"
                    className="w-full h-[400px] object-cover hover:scale-105 transition duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About the Temple */}
        <div className="bg-white py-12 mt-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <img
                  src={temple.aboutImage || temple.image}
                  alt={temple.name}
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                  About the Temple
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {temple.aboutDescription ||
                    "This sacred temple is a place of immense spiritual power where devotees come seeking blessings, protection, and divine intervention in their lives."}
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  The offerings made here are considered very powerful. People
                  come to seek blessings for health, success in business,
                  solutions to legal issues, and protection from the evil eye.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  Worshipping at this temple brings peace to the mind and
                  positive changes in life, making it a soulful destination for
                  spiritual seekers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
              <img
                src="/assets/img/lotus.png"
                alt="Devotees Icon"
                className="h-6 sm:h-8 md:h-12"
              />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600">
                Happy Devotees Corner
              </h2>
              <img
                src="/assets/img/lotus.png"
                alt="Right Icon"
                className="h-6 sm:h-8 md:h-12"
              />
            </div>

            <div className="relative overflow-hidden">
              <div className="testimonial-slider flex flex-nowrap p-2 sm:p-4 animate-scroll">
                {commonTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-white rounded-xl shadow-lg p-4 sm:p-6 min-w-[280px] sm:min-w-[300px] md:min-w-[350px] mx-2 sm:mx-4"
                  >
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                        {testimonial.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {testimonial.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img
                        src={testimonial.image}
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
                          {testimonial.source}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Duplicate cards for continuous scroll */}
                {commonTestimonials.map((testimonial) => (
                  <div
                    key={`duplicate-${testimonial.id}`}
                    className="bg-white rounded-xl shadow-lg p-4 sm:p-6 min-w-[280px] sm:min-w-[300px] md:min-w-[350px] mx-2 sm:mx-4"
                  >
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                        {testimonial.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {testimonial.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img
                        src={testimonial.image}
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
                          {testimonial.source}
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

        {/* FAQ Section */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {commonFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <button className="w-full px-6 py-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition">
                    {faq.question}
                  </button>
                  <div className="px-6 py-4 bg-gray-50 text-gray-600">
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleDetail;
