import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaGift } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('nav')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
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
                Home
              </Link>
              <Link
                to="/pooja-booking"
                className={`transition ${
                  isActive("/pooja-booking")
                    ? "text-orange-500 font-semibold"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                Pujas
              </Link>
              <Link
                to="/mala-jaap"
                className={`transition ${
                  isActive("/mala-jaap")
                    ? "text-orange-500 font-semibold"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                Mala Jaap
              </Link>
              <Link
                to="/chadhawa"
                className={`transition ${
                  isActive("/chadhawa")
                    ? "text-orange-500 font-semibold"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                Chadhavas
              </Link>
              <Link
                to="/blogs"
                className={`transition ${
                  isActive("/blogs")
                    ? "text-orange-500 font-semibold"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                Blogs
              </Link>
              <Link to="/pooja-booking">
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition">
                  Book Pujas
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                id="mobileMenuBtn"
                className="text-gray-700 p-2"
                onClick={toggleMenu}
              >
                <i
                  className={`${
                    isMenuOpen ? "fa-times" : "fa-bars"
                  } text-xl`}
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
            <Link
              to="/"
              className={`transition ${
                isActive("/")
                  ? "text-orange-500 font-semibold"
                  : "text-gray-700 hover:text-orange-500"
              }`}
              onClick={closeMenu}
            >
              Home
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
              Pujas
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
              Mala Jaap
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
              Chadhavas
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
              Blogs
            </Link>
            <Link to="/pooja-booking" onClick={closeMenu}>
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition">
                Book Pujas
              </button>
            </Link>
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
              <span className="text-[10px] mt-0.5">Home</span>
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
              <span className="text-[10px] mt-0.5">Pujas</span>
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
              <span className="text-[10px] mt-0.5">Chadhavas</span>
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
              <span className="text-[10px] mt-0.5">Mala Jaap</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
