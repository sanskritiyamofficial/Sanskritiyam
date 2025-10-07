import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [festivals, setFestivals] = useState([]);

  // Sample festival data
  const festivalData = [
    { date: '2024-01-15', name: 'Makar Sankranti', type: 'festival' },
    { date: '2024-01-26', name: 'Republic Day', type: 'national' },
    { date: '2024-02-14', name: 'Valentine\'s Day', type: 'special' },
    { date: '2024-03-08', name: 'Holi', type: 'festival' },
    { date: '2024-03-25', name: 'Holi', type: 'festival' },
    { date: '2024-04-14', name: 'Baisakhi', type: 'festival' },
    { date: '2024-08-15', name: 'Independence Day', type: 'national' },
    { date: '2024-10-02', name: 'Gandhi Jayanti', type: 'national' },
    { date: '2024-11-14', name: 'Children\'s Day', type: 'special' },
    { date: '2024-12-25', name: 'Christmas', type: 'festival' },
  ];

  useEffect(() => {
    // Filter festivals for current month
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthFestivals = festivalData.filter(festival => {
      const festivalDate = new Date(festival.date);
      return festivalDate.getMonth() === currentMonth && festivalDate.getFullYear() === currentYear;
    });
    
    setFestivals(monthFestivals);
  }, [currentDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isFestivalDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return festivalData.some(festival => festival.date === dateStr);
  };

  const getFestivalForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return festivalData.find(festival => festival.date === dateStr);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-amber-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-4">
            Hindu Calendar & Festivals
          </h1>
          <p className="text-lg text-gray-600">
            Discover important dates, festivals, and auspicious days
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <i className="fas fa-chevron-left text-gray-600"></i>
                </button>
                
                <h2 className="text-2xl font-bold text-gray-800">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <i className="fas fa-chevron-right text-gray-600"></i>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center font-semibold text-gray-600 text-sm">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((day, index) => (
                  <div
                    key={index}
                    className={`p-2 text-center cursor-pointer rounded-lg transition ${
                      day === null
                        ? 'invisible'
                        : isToday(day)
                        ? 'bg-orange-500 text-white font-bold'
                        : isFestivalDay(day)
                        ? 'bg-orange-100 text-orange-800 font-semibold hover:bg-orange-200'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day}
                    {isFestivalDay(day) && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full mx-auto mt-1"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* This Month's Festivals */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                This Month's Festivals
              </h3>
              {festivals.length > 0 ? (
                <div className="space-y-3">
                  {festivals.map((festival, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        festival.type === 'festival' ? 'bg-orange-500' :
                        festival.type === 'national' ? 'bg-blue-500' : 'bg-pink-500'
                      }`}></div>
                      <div>
                        <p className="font-semibold text-gray-800">{festival.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(festival.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No festivals this month</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/pooja-booking"
                  className="block w-full bg-orange-500 text-white text-center py-2 px-4 rounded-lg hover:bg-orange-600 transition"
                >
                  Book Puja
                </Link>
                <Link
                  to="/mala-jaap"
                  className="block w-full bg-blue-500 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                >
                  Mala Jaap
                </Link>
                <Link
                  to="/chadhawa"
                  className="block w-full bg-green-500 text-white text-center py-2 px-4 rounded-lg hover:bg-green-600 transition"
                >
                  Chadhavas
                </Link>
              </div>
            </div>

            {/* Festival Legend */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Legend
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Religious Festivals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">National Holidays</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Special Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Date Info */}
        {selectedDate && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {selectedDate} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            {getFestivalForDay(selectedDate) ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800">
                  {getFestivalForDay(selectedDate).name}
                </h4>
                <p className="text-orange-600">
                  {getFestivalForDay(selectedDate).type === 'festival' ? 'Religious Festival' :
                   getFestivalForDay(selectedDate).type === 'national' ? 'National Holiday' : 'Special Day'}
                </p>
              </div>
            ) : (
              <p className="text-gray-600">No special events on this day</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
