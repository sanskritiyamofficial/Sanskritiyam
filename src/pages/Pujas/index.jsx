import React, { useState, useMemo } from "react";
import { TempleCard } from "../../components";
import { temples, chadhawas } from "../Home/Data/TempleData";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

const Pujas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPujaCategory, setSelectedPujaCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 9;

  // Filter and search logic
  const filteredTemples = useMemo(() => {
    // Combine all temple data
    const allTemples = [
      ...temples.map((temple) => ({ ...temple, category: "temples" })),
      ...chadhawas.map((temple) => ({ ...temple, category: "chadhawas" })),
    ];

    let filtered = allTemples;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (temple) => temple.category === selectedCategory
      );
    }

    // Filter by puja category
    if (selectedPujaCategory !== "all") {
      filtered = filtered.filter(
        (temple) => temple.pujaCategory === selectedPujaCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (temple) =>
          temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          temple.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (temple.description &&
            temple.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [selectedCategory, selectedPujaCategory, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTemples.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentTemples = filteredTemples.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePujaCategoryChange = (pujaCategory) => {
    setSelectedPujaCategory(pujaCategory);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedPujaCategory("all");
    setCurrentPage(1);
  };

  const trackEvent = (templeName) => {
    console.log("Event tracked:", templeName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="/assets/img/temple.jpg"
              alt="Temple Icon"
              className="h-12 md:h-16"
            />
            <h1 className="text-3xl md:text-5xl font-bold text-orange-600">
              Sacred Temples
            </h1>
            <img
              src="/assets/img/temple.jpg"
              alt="Temple Icon"
              className="h-12 md:h-16"
            />
          </div>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Discover and book pujas at our sacred temples across India.
            Experience divine blessings and spiritual fulfillment.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search temples..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              <FaFilter />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
              {/* Temple Category Filter */}
              <div className="flex flex-wrap gap-4 items-center">
                <span className="text-gray-700 font-medium">Temple Type:</span>
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === "all"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Temples
                </button>
                <button
                  onClick={() => handleCategoryChange("temples")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === "temples"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Sacred Temples
                </button>
                <button
                  onClick={() => handleCategoryChange("chadhawas")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === "chadhawas"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Chadhawa
                </button>
              </div>

              {/* Puja Category Filter */}
              <div className="flex flex-wrap gap-4 items-center">
                <span className="text-gray-700 font-medium">Puja Type:</span>
                <button
                  onClick={() => handlePujaCategoryChange("all")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedPujaCategory === "all"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Pujas
                </button>
                <button
                  onClick={() => handlePujaCategoryChange("marriage")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedPujaCategory === "marriage"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Marriage
                </button>
                <button
                  onClick={() => handlePujaCategoryChange("rudrabhishek")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedPujaCategory === "rudrabhishek"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Rudrabhishek
                </button>
                <button
                  onClick={() => handlePujaCategoryChange("healing")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedPujaCategory === "healing"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Healing
                </button>
                <button
                  onClick={() => handlePujaCategoryChange("protection")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedPujaCategory === "protection"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Protection
                </button>
                <button
                  onClick={() => handlePujaCategoryChange("prosperity")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedPujaCategory === "prosperity"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Prosperity
                </button>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm ||
                selectedCategory !== "all" ||
                selectedPujaCategory !== "all") && (
                <div className="flex justify-center">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTimes />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {currentTemples.length} of {filteredTemples.length} temples
          </p>
        </div>

        {/* Temple Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {currentTemples.map((temple, index) => (
            <TempleCard
              key={`${temple.category}-${temple.id}`}
              temple={temple}
              isVisible={true}
              animationDelay={index * 100}
              onTrackEvent={trackEvent}
            />
          ))}
        </div>

        {/* No Results */}
        {currentTemples.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No temples found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              const isCurrentPage = page === currentPage;

              // Show first page, last page, current page, and pages around current page
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isCurrentPage
                        ? "bg-orange-500 text-white"
                        : "bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pujas;
