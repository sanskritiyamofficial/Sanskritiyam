// Central translations file for the entire website
export const translations = {
  en: {
    // Navbar
    home: "Home",
    pujas: "Pujas",
    malaJaap: "Mala Jaap",
    chadhavas: "Chadhavas",
    blogs: "Blogs",
    calendar: "Calendar",
    login: "Login",
    bookPujas: "Book Pujas",
    myAccount: "My Account",
    adminPanel: "Admin Panel",
    logout: "Logout",
    
    // Common UI Elements
    loading: "Loading...",
    templeNotFound: "Temple Not Found",
    templeNotFoundDesc: "The temple you're looking for doesn't exist.",
    goHome: "Go Home",
    selectPackage: "Select Package",
    bookNow: "Book Now",
    viewDetails: "View Details",
    readMore: "Read More",
    readLess: "Read Less",
    
    // Temple Page Sections
    packages: "Puja Packages",
    offerings: "Additional Offerings",
    aboutTemple: "About the Temple",
    benefits: "Benefits",
    process: "How It Works",
    faqs: "Frequently Asked Questions",
    testimonials: "What Our Devotees Say",
    templeInfo: "Temple Information",
    
    // Package Details
    price: "Price",
    originalPrice: "Original Price",
    features: "Features",
    devotees: "Devotees",
    
    // Footer
    quickLinks: "Quick Links",
    followUs: "Follow Us",
    newsletter: "Newsletter",
    subscribeNewsletter: "Subscribe to our newsletter",
    enterEmail: "Enter your email",
    subscribe: "Subscribe",
    allRightsReserved: "All rights reserved",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
    returnPolicy: "Return Policy",
    shippingPolicy: "Shipping Policy",
    
    // Language Toggle
    switchToHindi: "हिंदी में बदलें",
    switchToEnglish: "Switch to English"
  },
  hi: {
    // Navbar
    home: "होम",
    pujas: "पूजा",
    malaJaap: "माला जाप",
    chadhavas: "चढ़ावा",
    blogs: "ब्लॉग",
    calendar: "कैलेंडर",
    login: "लॉगिन",
    bookPujas: "पूजा बुक करें",
    myAccount: "मेरा खाता",
    adminPanel: "एडमिन पैनल",
    logout: "लॉगआउट",
    
    // Common UI Elements
    loading: "लोड हो रहा है...",
    templeNotFound: "मंदिर नहीं मिला",
    templeNotFoundDesc: "जो मंदिर आप खोज रहे हैं वह मौजूद नहीं है।",
    goHome: "होम पर जाएं",
    selectPackage: "पैकेज चुनें",
    bookNow: "अभी बुक करें",
    viewDetails: "विवरण देखें",
    readMore: "और पढ़ें",
    readLess: "कम पढ़ें",
    
    // Temple Page Sections
    packages: "पूजा पैकेज",
    offerings: "अतिरिक्त प्रसाद",
    aboutTemple: "मंदिर के बारे में",
    benefits: "लाभ",
    process: "यह कैसे काम करता है",
    faqs: "अक्सर पूछे जाने वाले प्रश्न",
    testimonials: "हमारे भक्त क्या कहते हैं",
    templeInfo: "मंदिर की जानकारी",
    
    // Package Details
    price: "मूल्य",
    originalPrice: "मूल मूल्य",
    features: "विशेषताएं",
    devotees: "भक्त",
    
    // Footer
    quickLinks: "त्वरित लिंक",
    followUs: "हमें फॉलो करें",
    newsletter: "न्यूज़लेटर",
    subscribeNewsletter: "हमारे न्यूज़लेटर की सदस्यता लें",
    enterEmail: "अपना ईमेल दर्ज करें",
    subscribe: "सदस्यता लें",
    allRightsReserved: "सर्वाधिकार सुरक्षित",
    privacyPolicy: "गोपनीयता नीति",
    termsConditions: "नियम और शर्तें",
    returnPolicy: "वापसी नीति",
    shippingPolicy: "शिपिंग नीति",
    
    // Language Toggle
    switchToHindi: "हिंदी में बदलें",
    switchToEnglish: "Switch to English"
  }
};

// Helper function to get translations
export const getTranslations = (language) => {
  return translations[language] || translations.en;
};


