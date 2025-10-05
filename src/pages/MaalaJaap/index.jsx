import React, { useState, useMemo } from "react";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { MantraCard, JapModal, JapHistory, AudioUpload } from "./components";
import { mantras, categories } from "./Data/mantraData";

const MaalaJaap = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMantra, setSelectedMantra] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customAudioFile, setCustomAudioFile] = useState(null);
  const [japHistory, setJapHistory] = useState([]);

  // Filter mantras based on search and category
  const filteredMantras = useMemo(() => {
    let filtered = mantras;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (mantra) => mantra.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (mantra) =>
          mantra.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mantra.mantra.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mantra.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm]);

  const handleStartJap = (mantra) => {
    setSelectedMantra(mantra);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMantra(null);
  };

  const handleJapComplete = (japData) => {
    setJapHistory((prev) => [japData, ...prev]);
    alert("🙏 धन्यवाद! आपका जाप रिकॉर्ड हो गया है।");
  };

  const handleFileSelect = (file) => {
    setCustomAudioFile(file);
  };

  const handleClearFile = () => {
    setCustomAudioFile(null);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all jap history?")) {
      setJapHistory([]);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="/assets/img/icons/rudraksh.png"
              alt="Rudraksh"
              className="w-8 h-8 md:w-12 md:h-12"
            />
            <h1 className="text-3xl md:text-5xl font-bold text-orange-600">
              Digital Naam Jap
            </h1>
            <img
              src="/assets/img/icons/rudraksh.png"
              alt="Rudraksh"
              className="w-8 h-8 md:w-12 md:h-12"
            />
          </div>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Experience the divine power of mantra chanting with our digital jap
            system. Choose your mantra and begin your spiritual journey.
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
                placeholder="Search mantras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-gray-700 font-medium">Category:</span>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </button>
                ))}
                {(searchTerm || selectedCategory !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTimes />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredMantras.length} of {mantras.length} mantras
          </p>
        </div>

        {/* Mantra Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredMantras.map((mantra) => (
            <MantraCard
              key={mantra.id}
              mantra={mantra}
              onStartJap={handleStartJap}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredMantras.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🕉️</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No mantras found
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

        {/* Audio Upload Section */}
        <AudioUpload
          onFileSelect={handleFileSelect}
          selectedFile={customAudioFile}
          onClear={handleClearFile}
        />

        {/* Jap History */}
        <JapHistory history={japHistory} onClearHistory={handleClearHistory} />

        {/* Jap Modal */}
        <JapModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          mantra={selectedMantra}
          onComplete={handleJapComplete}
          customAudioFile={customAudioFile}
        />
      </div>
    </div>
  );
};

export default MaalaJaap;
