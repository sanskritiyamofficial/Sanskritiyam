import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getFestivalsForMonth, 
  getUpcomingFestivals, 
  FESTIVAL_TYPES,
  TITHIS 
} from '../../data/festivalData';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaCalendarAlt, 
  FaStar, 
  FaMoon, 
  FaSun,
  FaPray,
  FaGift,
  FaFire
} from 'react-icons/fa';

const FestivalCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [festivals, setFestivals] = useState([]);
  const [upcomingFestivals, setUpcomingFestivals] = useState([]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Load festivals for current month
  useEffect(() => {
    const monthFestivals = getFestivalsForMonth(currentYear, currentMonth + 1);
    setFestivals(monthFestivals);
  }, [currentYear, currentMonth]);

  // Load upcoming festivals
  useEffect(() => {
    const upcoming = getUpcomingFestivals(5);
    setUpcomingFestivals(upcoming);
  }, []);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get festivals for a specific date
  const getFestivalsForDate = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const dateString = date.toISOString().split('T')[0];
    return festivals.filter(festival => festival.date === dateString);
  };

  // Get festival icon based on type
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

  // Get festival color based on type
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

  // Handle date selection
  const handleDateClick = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
  };

  // Handle Book Puja
  const handleBookPuja = (festival) => {
    // Store festival data and navigate to puja booking
    localStorage.setItem('selectedFestival', JSON.stringify(festival));
    navigate('/pooja-booking');
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-32 border border-gray-200 bg-gray-50"></div>
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateFestivals = getFestivalsForDate(day);
      const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();
      
      days.push(
        <div
          key={day}
          className={`h-32 border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
            isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
          }`}
          onClick={() => handleDateClick(day)}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
              {day}
            </span>
            {isToday && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
          
          <div className="space-y-1">
            {dateFestivals.slice(0, 2).map((festival, index) => (
              <div
                key={index}
                className={`text-xs px-2 py-1 rounded border ${getFestivalColor(festival.type)}`}
                title={festival.festival}
              >
                <div className="flex items-center gap-1">
                  {getFestivalIcon(festival.type)}
                  <span className="truncate">{festival.festival}</span>
                </div>
              </div>
            ))}
            {dateFestivals.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dateFestivals.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8 mt-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🗓️ Festival & Muhurat Calendar
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover all Tithis, Amavasya, and Festivals. Book Pujas for auspicious occasions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaChevronLeft />
                </button>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold">
                    {monthNames[currentMonth]} {currentYear}
                  </h2>
                  <p className="text-orange-100">
                    Hindu Calendar - {TITHIS[0]} to {TITHIS[TITHIS.length - 1]}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={goToToday}
                    className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
                  >
                    Today
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays()}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Festivals */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-orange-500" />
              Upcoming Festivals
            </h3>
            <div className="space-y-3">
              {upcomingFestivals.map((festival, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {getFestivalIcon(festival.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {festival.festival}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(festival.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {festival.tithi}
                      </p>
                    </div>
                  </div>
                  
                  {festival.pujaAvailable && (
                    <button
                      onClick={() => handleBookPuja(festival)}
                      className="mt-2 w-full bg-orange-500 text-white py-1 px-3 rounded text-sm hover:bg-orange-600 transition-colors"
                    >
                      Book Puja
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Festival Types Legend */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Festival Types
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                <span className="text-sm">Major Festivals</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMoon className="text-blue-500" />
                <span className="text-sm">Amavasya</span>
              </div>
              <div className="flex items-center gap-2">
                <FaSun className="text-orange-500" />
                <span className="text-sm">Purnima</span>
              </div>
              <div className="flex items-center gap-2">
                <FaGift className="text-green-500" />
                <span className="text-sm">Auspicious Days</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPray className="text-purple-500" />
                <span className="text-sm">Fasting Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Date Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedDate.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h3>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {getFestivalsForDate(selectedDate.getDate()).map((festival, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      {getFestivalIcon(festival.type)}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {festival.festival}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {festival.significance}
                        </p>
                        <p className="text-sm text-gray-700 mb-3">
                          {festival.description}
                        </p>
                        
                        {festival.pujaAvailable && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-900">
                              Available Pujas:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {festival.pujaTypes.map((puja, pujaIndex) => (
                                <span
                                  key={pujaIndex}
                                  className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
                                >
                                  {puja}
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={() => handleBookPuja(festival)}
                              className="mt-3 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                              Book Puja for {festival.festival}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {getFestivalsForDate(selectedDate.getDate()).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FaCalendarAlt className="text-4xl mx-auto mb-2" />
                    <p>No festivals on this date</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FestivalCalendar;
