// Festival and Muhurat Calendar Data
// This includes all major Hindu festivals, Tithis, and auspicious dates

export const FESTIVAL_TYPES = {
  MAJOR_FESTIVAL: 'major_festival',
  MINOR_FESTIVAL: 'minor_festival',
  TITHI: 'tithi',
  AMAVASYA: 'amavasya',
  PURNIMA: 'purnima',
  ECLIPSE: 'eclipse',
  AUSPICIOUS: 'auspicious',
  FASTING: 'fasting'
};

export const TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya/Purnima'
];

export const MONTHS = [
  'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana',
  'Bhadrapada', 'Ashwin', 'Kartika', 'Margashirsha', 'Pausha',
  'Magha', 'Phalguna'
];

// Festival data for 2024-2025
export const FESTIVAL_DATA = {
  '2024': {
    '01': [
      {
        date: '2024-01-15',
        tithi: 'Purnima',
        festival: 'Makar Sankranti',
        type: FESTIVAL_TYPES.MAJOR_FESTIVAL,
        significance: 'Harvest festival marking the sun\'s transition into Capricorn',
        description: 'A major harvest festival celebrated across India with kite flying, bonfires, and traditional sweets.',
        pujaAvailable: true,
        pujaTypes: ['Surya Puja', 'Ganga Snan', 'Kite Flying Puja'],
        color: 'from-orange-500 to-red-500'
      },
      {
        date: '2024-01-26',
        tithi: 'Ashtami',
        festival: 'Republic Day',
        type: FESTIVAL_TYPES.MAJOR_FESTIVAL,
        significance: 'National celebration of India\'s constitution',
        description: 'Celebrated with patriotic fervor and traditional ceremonies.',
        pujaAvailable: true,
        pujaTypes: ['Desh Bhakti Puja', 'Tricolor Puja'],
        color: 'from-saffron-500 to-green-500'
      }
    ],
    '02': [
      {
        date: '2024-02-14',
        tithi: 'Amavasya',
        festival: 'Mauni Amavasya',
        type: FESTIVAL_TYPES.AMAVASYA,
        significance: 'Sacred day for silence and meditation',
        description: 'A day of silence and spiritual reflection, especially auspicious for Ganga snan.',
        pujaAvailable: true,
        pujaTypes: ['Maun Vrat', 'Ganga Snan', 'Pitru Tarpan'],
        color: 'from-blue-500 to-indigo-500'
      },
      {
        date: '2024-02-24',
        tithi: 'Purnima',
        festival: 'Magha Purnima',
        type: FESTIVAL_TYPES.PURNIMA,
        significance: 'Sacred full moon for spiritual practices',
        description: 'Highly auspicious day for charity, fasting, and spiritual activities.',
        pujaAvailable: true,
        pujaTypes: ['Purnima Vrat', 'Daan Puja', 'Satyanarayan Puja'],
        color: 'from-purple-500 to-pink-500'
      }
    ],
    '03': [
      {
        date: '2024-03-08',
        tithi: 'Ashtami',
        festival: 'Maha Shivratri',
        type: FESTIVAL_TYPES.MAJOR_FESTIVAL,
        significance: 'Great night of Lord Shiva',
        description: 'The most important festival dedicated to Lord Shiva, celebrated with fasting and night-long prayers.',
        pujaAvailable: true,
        pujaTypes: ['Shiv Puja', 'Rudra Abhishek', 'Lingam Puja', 'Bilva Puja'],
        color: 'from-gray-800 to-blue-900'
      },
      {
        date: '2024-03-25',
        tithi: 'Purnima',
        festival: 'Holi',
        type: FESTIVAL_TYPES.MAJOR_FESTIVAL,
        significance: 'Festival of colors and spring',
        description: 'Celebration of the victory of good over evil and the arrival of spring.',
        pujaAvailable: true,
        pujaTypes: ['Holika Dahan', 'Color Puja', 'Rangoli Puja'],
        color: 'from-pink-500 to-yellow-500'
      }
    ],
    '04': [
      {
        date: '2024-04-09',
        tithi: 'Navami',
        festival: 'Ram Navami',
        type: FESTIVAL_TYPES.MAJOR_FESTIVAL,
        significance: 'Birth of Lord Rama',
        description: 'Celebration of the birth of Lord Rama, the seventh avatar of Vishnu.',
        pujaAvailable: true,
        pujaTypes: ['Ram Puja', 'Sita Puja', 'Hanuman Puja', 'Ramayan Path'],
        color: 'from-blue-600 to-orange-500'
      },
      {
        date: '2024-04-23',
        tithi: 'Amavasya',
        festival: 'Chaitra Amavasya',
        type: FESTIVAL_TYPES.AMAVASYA,
        significance: 'New moon of the first month',
        description: 'Auspicious day for new beginnings and spiritual practices.',
        pujaAvailable: true,
        pujaTypes: ['Amavasya Vrat', 'Pitru Tarpan', 'Kalash Puja'],
        color: 'from-green-500 to-blue-500'
      }
    ],
    '05': [
      {
        date: '2024-05-12',
        tithi: 'Tritiya',
        festival: 'Akshaya Tritiya',
        type: FESTIVAL_TYPES.AUSPICIOUS,
        significance: 'Most auspicious day for new ventures',
        description: 'Considered the most auspicious day for starting new ventures, buying gold, and making investments.',
        pujaAvailable: true,
        pujaTypes: ['Lakshmi Puja', 'Gold Puja', 'Business Puja', 'Akshaya Tritiya Vrat'],
        color: 'from-yellow-500 to-gold-500'
      },
      {
        date: '2024-05-23',
        tithi: 'Purnima',
        festival: 'Buddha Purnima',
        type: FESTIVAL_TYPES.PURNIMA,
        significance: 'Birth, enlightenment, and death of Buddha',
        description: 'Triple celebration of Buddha\'s birth, enlightenment, and parinirvana.',
        pujaAvailable: true,
        pujaTypes: ['Buddha Puja', 'Meditation Puja', 'Peace Puja'],
        color: 'from-orange-400 to-yellow-400'
      }
    ],
    '06': [
      {
        date: '2024-06-14',
        tithi: 'Ashtami',
        festival: 'Ganga Dussehra',
        type: FESTIVAL_TYPES.MAJOR_FESTIVAL,
        significance: 'Descent of Ganga to Earth',
        description: 'Celebration of the day when Goddess Ganga descended to Earth.',
        pujaAvailable: true,
        pujaTypes: ['Ganga Puja', 'Ganga Snan', 'Water Puja'],
        color: 'from-blue-400 to-cyan-400'
      },
      {
        date: '2024-06-22',
        tithi: 'Amavasya',
        festival: 'Jyeshtha Amavasya',
        type: FESTIVAL_TYPES.AMAVASYA,
        significance: 'Sacred new moon for ancestors',
        description: 'Auspicious day for honoring ancestors and performing pitru tarpan.',
        pujaAvailable: true,
        pujaTypes: ['Pitru Tarpan', 'Amavasya Vrat', 'Ancestor Puja'],
        color: 'from-gray-600 to-blue-600'
      }
    ],
    '07': [
      {
        date: '2024-07-21',
        tithi: 'Purnima',
        festival: 'Guru Purnima',
        type: FESTIVAL_TYPES.PURNIMA,
        significance: 'Honoring spiritual teachers',
        description: 'Day dedicated to honoring and expressing gratitude to spiritual teachers and gurus.',
        pujaAvailable: true,
        pujaTypes: ['Guru Puja', 'Vyas Puja', 'Teacher Puja'],
        color: 'from-purple-600 to-indigo-600'
      },
      {
        date: '2024-07-31',
        tithi: 'Amavasya',
        festival: 'Shravan Amavasya',
        type: FESTIVAL_TYPES.AMAVASYA,
        significance: 'Sacred month of Shravan begins',
        description: 'Beginning of the most sacred month in Hindu calendar.',
        pujaAvailable: true,
        pujaTypes: ['Shravan Vrat', 'Shiv Puja', 'Rudraksha Puja'],
        color: 'from-green-600 to-blue-600'
      }
    ],
    '08': [
      {
        date: '2024-08-19',
        tithi: 'Purnima',
        festival: 'Raksha Bandhan',
        type: FESTIVAL_TYPES.MAJOR_FESTIVAL,
        significance: 'Bond of protection between siblings',
        description: 'Celebration of the sacred bond between brothers and sisters.',
        pujaAvailable: true,
        pujaTypes: ['Rakhi Puja', 'Sibling Puja', 'Protection Puja'],
        color: 'from-red-500 to-pink-500'
      },
      {
        date: '2024-08-26',
        tithi: 'Saptami',
        festival: 'Janmashtami',
        type: FESTIVAL_TYPES.MAJOR_FESTIVAL,
        significance: 'Birth of Lord Krishna',
        description: 'Celebration of the birth of Lord Krishna, the eighth avatar of Vishnu.',
        pujaAvailable: true,
        pujaTypes: ['Krishna Puja', 'Bal Gopal Puja', 'Dahi Handi Puja', 'Krishna Janmashtami Vrat'],
        color: 'from-blue-500 to-purple-500'
      }
    ],
    '09': [
      {
        date: '2024-09-07',
        tithi: 'Purnima',
        festival: 'Ganesh Chaturthi',
        type: FESTIVAL_TYPES.MAJOR_FESTIVAL,
        significance: 'Birth of Lord Ganesha',
        description: 'Celebration of the birth of Lord Ganesha, the remover of obstacles.',
        pujaAvailable: true,
        pujaTypes: ['Ganesh Puja', 'Modak Puja', 'Ganpati Visarjan', 'Ganesh Chaturthi Vrat'],
        color: 'from-orange-500 to-red-500'
      },
      {
        date: '2024-09-17',
        tithi: 'Amavasya',
        festival: 'Bhadrapada Amavasya',
        type: FESTIVAL_TYPES.AMAVASYA,
        significance: 'Sacred new moon for new beginnings',
        description: 'Auspicious day for starting new ventures and spiritual practices.',
        pujaAvailable: true,
        pujaTypes: ['Amavasya Vrat', 'New Beginning Puja', 'Kalash Puja'],
        color: 'from-green-500 to-blue-500'
      }
    ],
    '10': [
      {
        date: '2024-10-02',
        tithi: 'Purnima',
        festival: 'Navratri Begins',
        type: FESTIVAL_TYPES.MAJOR_FESTIVAL,
        significance: 'Nine nights of Goddess worship',
        description: 'Nine-day festival dedicated to the worship of Goddess Durga in her various forms.',
        pujaAvailable: true,
        pujaTypes: ['Durga Puja', 'Navratri Vrat', 'Garba Puja', 'Dandiya Puja'],
        color: 'from-pink-500 to-purple-500'
      },
      {
        date: '2024-10-12',
        tithi: 'Dashami',
        festival: 'Dussehra',
        type: FESTIVAL_TYPES.MAJOR_FESTIVAL,
        significance: 'Victory of good over evil',
        description: 'Celebration of the victory of Lord Rama over Ravana and Goddess Durga over Mahishasura.',
        pujaAvailable: true,
        pujaTypes: ['Ravana Dahan', 'Durga Visarjan', 'Victory Puja'],
        color: 'from-orange-500 to-red-500'
      },
      {
        date: '2024-10-31',
        tithi: 'Amavasya',
        festival: 'Sharad Amavasya',
        type: FESTIVAL_TYPES.AMAVASYA,
        significance: 'Sacred new moon of autumn',
        description: 'Auspicious day for spiritual practices and honoring ancestors.',
        pujaAvailable: true,
        pujaTypes: ['Amavasya Vrat', 'Pitru Tarpan', 'Ancestor Puja'],
        color: 'from-gray-500 to-blue-500'
      }
    ],
    '11': [
      {
        date: '2024-11-01',
        tithi: 'Pratipada',
        festival: 'Diwali',
        type: FESTIVAL_TYPES.MAJOR_FESTIVAL,
        significance: 'Festival of lights',
        description: 'The most important Hindu festival celebrating the victory of light over darkness.',
        pujaAvailable: true,
        pujaTypes: ['Lakshmi Puja', 'Ganesh Puja', 'Diwali Puja', 'Deep Puja'],
        color: 'from-yellow-400 to-orange-400'
      },
      {
        date: '2024-11-15',
        tithi: 'Purnima',
        festival: 'Kartik Purnima',
        type: FESTIVAL_TYPES.PURNIMA,
        significance: 'Sacred full moon of Kartik month',
        description: 'Highly auspicious day for spiritual practices and charity.',
        pujaAvailable: true,
        pujaTypes: ['Kartik Purnima Vrat', 'Daan Puja', 'Tulsi Puja'],
        color: 'from-purple-500 to-pink-500'
      },
      {
        date: '2024-11-30',
        tithi: 'Amavasya',
        festival: 'Kartik Amavasya',
        type: FESTIVAL_TYPES.AMAVASYA,
        significance: 'Sacred new moon of Kartik',
        description: 'Auspicious day for spiritual practices and honoring ancestors.',
        pujaAvailable: true,
        pujaTypes: ['Amavasya Vrat', 'Pitru Tarpan', 'Kartik Vrat'],
        color: 'from-blue-500 to-purple-500'
      }
    ],
    '12': [
      {
        date: '2024-12-25',
        tithi: 'Purnima',
        festival: 'Margashirsha Purnima',
        type: FESTIVAL_TYPES.PURNIMA,
        significance: 'Sacred full moon of Margashirsha',
        description: 'Auspicious day for spiritual practices and charity.',
        pujaAvailable: true,
        pujaTypes: ['Purnima Vrat', 'Daan Puja', 'Satyanarayan Puja'],
        color: 'from-purple-500 to-indigo-500'
      }
    ]
  },
  '2025': {
    '01': [
      {
        date: '2025-01-14',
        tithi: 'Purnima',
        festival: 'Makar Sankranti',
        type: FESTIVAL_TYPES.MAJOR_FESTIVAL,
        significance: 'Harvest festival marking the sun\'s transition into Capricorn',
        description: 'A major harvest festival celebrated across India with kite flying, bonfires, and traditional sweets.',
        pujaAvailable: true,
        pujaTypes: ['Surya Puja', 'Ganga Snan', 'Kite Flying Puja'],
        color: 'from-orange-500 to-red-500'
      }
    ]
  }
};

// Get festivals for a specific month and year
export const getFestivalsForMonth = (year, month) => {
  const monthKey = month.toString().padStart(2, '0');
  return FESTIVAL_DATA[year]?.[monthKey] || [];
};

// Get all festivals for a year
export const getFestivalsForYear = (year) => {
  return FESTIVAL_DATA[year] || {};
};

// Get festivals for a specific date
export const getFestivalsForDate = (date) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear().toString();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  
  const festivals = getFestivalsForMonth(year, month);
  return festivals.filter(festival => festival.date === date);
};

// Get upcoming festivals
export const getUpcomingFestivals = (limit = 10) => {
  const today = new Date();
  const upcoming = [];
  
  // Check current year and next year
  const years = [today.getFullYear().toString(), (today.getFullYear() + 1).toString()];
  
  for (const year of years) {
    const yearFestivals = getFestivalsForYear(year);
    for (const monthKey in yearFestivals) {
      for (const festival of yearFestivals[monthKey]) {
        const festivalDate = new Date(festival.date);
        if (festivalDate >= today) {
          upcoming.push(festival);
        }
      }
    }
  }
  
  return upcoming
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, limit);
};

// Get festivals by type
export const getFestivalsByType = (type) => {
  const allFestivals = [];
  
  for (const year in FESTIVAL_DATA) {
    for (const month in FESTIVAL_DATA[year]) {
      for (const festival of FESTIVAL_DATA[year][month]) {
        if (festival.type === type) {
          allFestivals.push(festival);
        }
      }
    }
  }
  
  return allFestivals;
};

// Get major festivals only
export const getMajorFestivals = () => {
  return getFestivalsByType(FESTIVAL_TYPES.MAJOR_FESTIVAL);
};

// Get Amavasya dates
export const getAmavasyaDates = () => {
  return getFestivalsByType(FESTIVAL_TYPES.AMAVASYA);
};

// Get Purnima dates
export const getPurnimaDates = () => {
  return getFestivalsByType(FESTIVAL_TYPES.PURNIMA);
};
