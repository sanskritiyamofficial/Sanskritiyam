import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUpcomingFestivals, FESTIVAL_TYPES } from "../../data/festivalData";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaStar,
  FaMoon,
  FaSun,
  FaPray,
  FaGift,
  FaFire,
  FaClock,
  FaMapMarkerAlt,
  FaBookOpen,
} from "react-icons/fa";

const FestivalDetailPage = () => {
  const { festivalId } = useParams();
  const navigate = useNavigate();
  const [festival, setFestival] = useState(null);
  const [relatedFestivals, setRelatedFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch festival by ID
    // For now, we'll find it from the upcoming festivals
    const upcoming = getUpcomingFestivals(50);
    const foundFestival = upcoming.find((f) => f.date === festivalId);

    if (foundFestival) {
      setFestival(foundFestival);

      // Find related festivals (same type or nearby dates)
      const related = upcoming
        .filter((f) => f.type === foundFestival.type && f.date !== festivalId)
        .slice(0, 3);
      setRelatedFestivals(related);
    }

    setLoading(false);
  }, [festivalId]);

  const handleBookPuja = () => {
    if (festival) {
      localStorage.setItem("selectedFestival", JSON.stringify(festival));
      navigate("/pooja-booking");
    }
  };

  const getFestivalIcon = (type) => {
    switch (type) {
      case FESTIVAL_TYPES.MAJOR_FESTIVAL:
        return <FaStar className="text-yellow-500 text-2xl" />;
      case FESTIVAL_TYPES.AMAVASYA:
        return <FaMoon className="text-blue-500 text-2xl" />;
      case FESTIVAL_TYPES.PURNIMA:
        return <FaSun className="text-orange-500 text-2xl" />;
      case FESTIVAL_TYPES.AUSPICIOUS:
        return <FaGift className="text-green-500 text-2xl" />;
      case FESTIVAL_TYPES.FASTING:
        return <FaPray className="text-purple-500 text-2xl" />;
      default:
        return <FaCalendarAlt className="text-gray-500 text-2xl" />;
    }
  };

  const getFestivalColor = (type) => {
    switch (type) {
      case FESTIVAL_TYPES.MAJOR_FESTIVAL:
        return "from-yellow-500 to-orange-500";
      case FESTIVAL_TYPES.AMAVASYA:
        return "from-blue-500 to-indigo-500";
      case FESTIVAL_TYPES.PURNIMA:
        return "from-orange-500 to-red-500";
      case FESTIVAL_TYPES.AUSPICIOUS:
        return "from-green-500 to-emerald-500";
      case FESTIVAL_TYPES.FASTING:
        return "from-purple-500 to-pink-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading festival details...</p>
        </div>
      </div>
    );
  }

  if (!festival) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaCalendarAlt className="text-6xl text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Festival Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The festival you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/calendar")}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Calendar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className={`bg-gradient-to-r ${getFestivalColor(
          festival.type
        )} text-white py-16`}
      >
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate("/calendar")}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <FaArrowLeft />
            Back to Calendar
          </button>

          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {getFestivalIcon(festival.type)}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {festival.festival}
              </h1>
              <div className="flex items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>
                    {new Date(festival.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock />
                  <span>{festival.tithi}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Festival Overview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaBookOpen className="text-orange-500" />
                About This Festival
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                {festival.description}
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">
                  Significance
                </h3>
                <p className="text-orange-700">{festival.significance}</p>
              </div>
            </div>

            {/* Puja Information */}
            {festival.pujaAvailable && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaPray className="text-orange-500" />
                  Available Pujas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {festival.pujaTypes.map((puja, index) => (
                    <div
                      key={index}
                      className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                    >
                      <h3 className="font-semibold text-orange-800 mb-2">
                        {puja}
                      </h3>
                      <p className="text-orange-700 text-sm">
                        Special puja for {festival.festival} celebration
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleBookPuja}
                  className="w-full bg-orange-500 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FaPray />
                  Book Puja for {festival.festival}
                </button>
              </div>
            )}

            {/* Festival Traditions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaFire className="text-orange-500" />
                Traditions & Celebrations
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rituals</h3>
                  <p className="text-gray-700">
                    Traditional rituals and ceremonies associated with this
                    festival, including prayers, offerings, and community
                    celebrations.
                  </p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Food & Offerings
                  </h3>
                  <p className="text-gray-700">
                    Special foods and offerings prepared during this festival,
                    including traditional sweets and prasad.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Community
                  </h3>
                  <p className="text-gray-700">
                    Community gatherings, cultural programs, and social
                    celebrations that bring people together during this
                    auspicious time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Festival Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Festival Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date(festival.date).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tithi:</span>
                  <span className="font-medium">{festival.tithi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">
                    {festival.type.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Puja Available:</span>
                  <span
                    className={`font-medium ${
                      festival.pujaAvailable ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {festival.pujaAvailable ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Related Festivals */}
            {relatedFestivals.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Related Festivals
                </h3>
                <div className="space-y-3">
                  {relatedFestivals.map((relatedFestival, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() =>
                        navigate(`/calendar/festival/${relatedFestival.date}`)
                      }
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {relatedFestival.festival}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(relatedFestival.date).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/calendar")}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View Full Calendar
                </button>
                <button
                  onClick={() => navigate("/pooja-booking")}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Book Any Puja
                </button>
                <button
                  onClick={() => navigate("/chadhawa")}
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Temple Offerings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalDetailPage;
