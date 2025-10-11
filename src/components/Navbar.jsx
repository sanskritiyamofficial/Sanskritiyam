import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaGift, FaLanguage } from "react-icons/fa";
import { useGetAuth } from "../contexts/useGetAuth";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslations } from "../data/translations";  

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useGetAuth();
  const { language, toggleLanguage, isHindi } = useLanguage();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Get translations
  const t = getTranslations(language);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest("nav")) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed w-full h-16 md:h-20 z-[9999] bg-white shadow-md">
        <div className="mx-auto px-4 md:px-6 h-full">
          <div className="flex items-center justify-between h-full">
            <Link to="/" onClick={closeMenu}>
              <div className="flex items-center gap-2 md:gap-4">
                <img
                  src="/assets/img/sanskritiyam.png"
                  alt="sanskritiyam logo"
                  className="h-10 md:h-12"
                />
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-orange-600">
                    Sanskritiyam
                  </h1>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`transition ${
                  isActive("/")
                    ? "text-orange-500 font-semibold"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                {t.home}
              </Link>
              <Link
                to="/pooja-booking"
                className={`transition ${
                  isActive("/pooja-booking")
                    ? "text-orange-500 font-semibold"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                {t.pujas}
              </Link>
              <Link
                to="/mala-jaap"
                className={`transition ${
                  isActive("/mala-jaap")
                    ? "text-orange-500 font-semibold"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                {t.malaJaap}
              </Link>
              <Link
                to="/chadhawa"
                className={`transition ${
                  isActive("/chadhawa")
                    ? "text-orange-500 font-semibold"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                {t.chadhavas}
              </Link>
              <Link
                to="/blogs"
                className={`transition ${
                  isActive("/blogs")
                    ? "text-orange-500 font-semibold"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                {t.blogs}
              </Link>
              <Link
                to="/calendar"
                className={`transition ${
                  isActive("/calendar")
                    ? "text-orange-500 font-semibold"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                {t.calendar}
              </Link>
              
              {/* Language Toggle Button */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 cursor-pointer px-3 py-1.5 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition"
                title={isHindi ? t.switchToEnglish : t.switchToHindi}
              >
                <FaLanguage className="text-sm" />
                <span className="text-sm font-medium">{isHindi ? "EN" : "हि"}</span>
              </button>
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition bg-orange-100 px-4 py-2 rounded-full"
                  >
                    <i className="fas fa-user"></i>
                    <span>{currentUser.displayName || currentUser.email}</span>
                    <i
                      className={`fas fa-chevron-down transition-transform ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    ></i>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        to="/my-account"
                        className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i className="fas fa-user mr-2"></i>
                        {t.myAccount}
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <i className="fas fa-cog mr-2"></i>
                          {t.adminPanel}
                        </Link>
                      )}
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        {t.logout}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-orange-500 transition"
                  >
                    {t.login}
                  </Link>
                  <Link to="/pooja-booking">
                    <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition">
                      {t.bookPujas}
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                id="mobileMenuBtn"
                className="text-gray-700 p-2"
                onClick={toggleMenu}
              >
                <i
                  className={`${isMenuOpen ? "fa-times" : "fa-bars"} text-xl`}
                ></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Positioned outside the container */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-40`}
        >
          <div className="flex flex-col space-y-4 p-4">
            {/* Language Toggle in Mobile Menu */}
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition w-full"
            >
              <FaLanguage className="text-lg" />
              <span className="font-medium">{isHindi ? t.switchToEnglish : t.switchToHindi}</span>
            </button>
            
            <Link
              to="/"
              className={`transition ${
                isActive("/")
                  ? "text-orange-500 font-semibold"
                  : "text-gray-700 hover:text-orange-500"
              }`}
              onClick={closeMenu}
            >
              {t.home}
            </Link>
            <Link
              to="/pooja-booking"
              className={`transition ${
                isActive("/pooja-booking")
                  ? "text-orange-500 font-semibold"
                  : "text-gray-700 hover:text-orange-500"
              }`}
              onClick={closeMenu}
            >
              {t.pujas}
            </Link>
            <Link
              to="/mala-jaap"
              className={`transition ${
                isActive("/mala-jaap")
                  ? "text-orange-500 font-semibold"
                  : "text-gray-700 hover:text-orange-500"
              }`}
              onClick={closeMenu}
            >
              {t.malaJaap}
            </Link>
            <Link
              to="/chadhawa"
              className={`transition ${
                isActive("/chadhawa")
                  ? "text-orange-500 font-semibold"
                  : "text-gray-700 hover:text-orange-500"
              }`}
              onClick={closeMenu}
            >
              {t.chadhavas}
            </Link>
            <Link
              to="/blogs"
              className={`transition ${
                isActive("/blogs")
                  ? "text-orange-500 font-semibold"
                  : "text-gray-700 hover:text-orange-500"
              }`}
              onClick={closeMenu}
            >
              {t.blogs}
            </Link>
            <Link
              to="/calendar"
              className={`transition ${
                isActive("/calendar")
                  ? "text-orange-500 font-semibold"
                  : "text-gray-700 hover:text-orange-500"
              }`}
              onClick={closeMenu}
            >
              {t.calendar}
            </Link>
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-700 mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-orange-600"></i>
                  </div>
                  <span>{currentUser.displayName || currentUser.email}</span>
                </div>
                <Link
                  to="/my-account"
                  className="block text-gray-700 hover:text-orange-500 transition"
                  onClick={closeMenu}
                >
                  <i className="fas fa-user mr-2"></i>
                  {t.myAccount}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="block text-gray-700 hover:text-orange-500 transition"
                    onClick={closeMenu}
                  >
                    <i className="fas fa-cog mr-2"></i>
                    {t.adminPanel}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-700 hover:text-orange-500 transition"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  {t.logout}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-orange-500 transition"
                  onClick={closeMenu}
                >
                  {t.login}
                </Link>
                <Link to="/pooja-booking" onClick={closeMenu}>
                  <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition">
                    {t.bookPujas}
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-orange-100 z-40">
        <div className="container mx-auto px-4 py-1 md:hidden">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className={`flex flex-col items-center transition ${
                isActive("/")
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              <FaHome className="text-md" />
              <span className="text-[10px] mt-0.5">{t.home}</span>
            </Link>
            <Link
              to="/pooja-booking"
              className={`flex flex-col items-center transition ${
                isActive("/pooja-booking")
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              <img
                src="/assets/img/icons/om.png"
                className="w-6 h-6 text-cyan-500"
                alt="Om"
              />
              <span className="text-[10px] mt-0.5">{t.pujas}</span>
            </Link>
            <Link
              to="/chadhawa"
              className={`flex flex-col items-center transition ${
                isActive("/chadhawa")
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              <FaGift />
              <span className="text-[10px] mt-0.5">{t.chadhavas}</span>
            </Link>
            <Link
              to="/mala-jaap"
              className={`flex flex-col items-center transition ${
                isActive("/mala-jaap")
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              <img
                src="/assets/img/icons/rudraksh.png"
                className="w-8 h-8 text-cyan-500 animate-spin duration-[5s] drop-shadow-md"
                alt="Rudraksh"
              />
              <span className="text-[10px] mt-0.5">{t.malaJaap}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
