import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getUpcomingFestivals, 
  getMajorFestivals,
  getAmavasyaDates,
  getPurnimaDates,
  FESTIVAL_TYPES 
} from '../../data/festivalData';
import { 
  FaCalendarAlt, 
  FaStar, 
  FaMoon, 
  FaSun,
  FaPray,
  FaGift,
  FaFilter,
  FaSearch,
  FaChevronDown
} from 'react-icons/fa';

const CalendarPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFestivals();
  }, [activeTab, filterType]);

  const loadFestivals = () => {
    setLoading(true);
    let data = [];
    
    switch (activeTab) {
      case 'upcoming':
        data = getUpcomingFestivals(20);
        break;
      case 'major':
        data = getMajorFestivals();
        break;
      case 'amavasya':
        data = getAmavasyaDates();
        break;
      case 'purnima':
        data = getPurnimaDates();
        break;
      default:
        data = getUpcomingFestivals(20);
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      data = data.filter(festival => festival.type === filterType);
    }
    
    setFestivals(data);
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFestivals = festivals.filter(festival =>
    festival.festival.toLowerCase().includes(searchTerm.toLowerCase()) ||
    festival.significance.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFestivalIcon = (type) => {
    switch (type) {
      case FESTIVAL_TYPES.MAJOR_FESTIVAL:
        return <FaStar className="text-yellow-500" />;
      case FESTIVAL_TYPES.AMAVASYA:
        return <FaMoon className="text-blue-500" />;
      case FESTIVAL_TYPES.PURNIMA:
        return <FaSun className="text-orange-500" />;
      case FESTIVAL_TYPES.AUSPICIOUS:
        return <FaGift className="text-green-500" />;
      case FESTIVAL_TYPES.FASTING:
        return <FaPray className="text-purple-500" />;
      default:
        return <FaCalendarAlt className="text-gray-500" />;
    }
  };

  const getFestivalColor = (type) => {
    switch (type) {
      case FESTIVAL_TYPES.MAJOR_FESTIVAL:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case FESTIVAL_TYPES.AMAVASYA:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case FESTIVAL_TYPES.PURNIMA:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case FESTIVAL_TYPES.AUSPICIOUS:
        return 'bg-green-100 text-green-800 border-green-200';
      case FESTIVAL_TYPES.FASTING:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleBookPuja = (festival) => {
    localStorage.setItem('selectedFestival', JSON.stringify(festival));
    navigate('/pooja-booking');
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: getUpcomingFestivals(20).length },
    { id: 'major', label: 'Major Festivals', count: getMajorFestivals().length },
    { id: 'amavasya', label: 'Amavasya', count: getAmavasyaDates().length },
    { id: 'purnima', label: 'Purnima', count: getPurnimaDates().length }
  ];

  const filterTypes = [
    { value: 'all', label: 'All Types' },
    { value: FESTIVAL_TYPES.MAJOR_FESTIVAL, label: 'Major Festivals' },
    { value: FESTIVAL_TYPES.AMAVASYA, label: 'Amavasya' },
    { value: FESTIVAL_TYPES.PURNIMA, label: 'Purnima' },
    { value: FESTIVAL_TYPES.AUSPICIOUS, label: 'Auspicious Days' },
    { value: FESTIVAL_TYPES.FASTING, label: 'Fasting Days' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-10">
            🗓️ Festival & Muhurat Calendar
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">
            Discover all Tithis, Amavasya, and Festivals. Book Pujas for auspicious occasions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/calendar/view')}
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-50 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl"
            >
              <FaCalendarAlt />
              View Calendar
            </button>
            <span className="text-orange-200 text-sm">
              Monthly view with Book Puja CTAs
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search festivals..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-64">
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {filterTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Festivals List */}
        <div className="bg-white rounded-lg shadow-lg">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading festivals...</p>
            </div>
          ) : filteredFestivals.length === 0 ? (
            <div className="p-8 text-center">
              <FaCalendarAlt className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Festivals Found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredFestivals.map((festival, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getFestivalIcon(festival.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {festival.festival}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {festival.significance}
                          </p>
                          <p className="text-gray-700 mb-3">
                            {festival.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt />
                              {new Date(festival.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaPray />
                              {festival.tithi}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getFestivalColor(festival.type)}`}>
                              {festival.type.replace('_', ' ')}
                            </span>
                          </div>
                          
                          {festival.pujaAvailable && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-900">
                                Available Pujas:
                              </p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {festival.pujaTypes.map((puja, pujaIndex) => (
                                  <span
                                    key={pujaIndex}
                                    className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
                                  >
                                    {puja}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            onClick={() => navigate(`/calendar/festival/${festival.date}`)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            View Details
                          </button>
                          {festival.pujaAvailable && (
                            <button
                              onClick={() => handleBookPuja(festival)}
                              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                              Book Puja
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
