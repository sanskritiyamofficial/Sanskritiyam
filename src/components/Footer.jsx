import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaMeta } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-[#FEF7ED] text-black pt-16 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <p className="text-gray-900">
              <strong className="text-orange-600">Sanskritiyam </strong> is a sacred
              platform devoted to reconnecting devotee with Bharat's spiritual
              roots. We help you easily connect with Temples, Trusted Pandits,
              and Holy Tirth Kshetras for authentic online and offline puja
              services. Bringing tradition to your fingertips with Shraddha,
              Seva, and Sanskriti.
            </p>
            <p className="text-gray-900">Made with 🙏 in Bharat</p>
          </div>

          <div>
            <h3 className="text-orange-600 font-bold mb-4">Our Services</h3>
            <div className="space-y-2">
              <Link
                to="/pooja-booking"
                className="block text-gray-900 hover:text-black transition"
              >
                Pooja
              </Link>
              <Link
                to="/chadhawa"
                className="block text-gray-900 hover:text-black transition"
              >
                Chadhawa
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-orange-600 font-bold mb-4">Legal</h3>
            <div className="space-y-2">
              <Link
                to="/privacy-policy"
                className="block text-gray-900 hover:text-black transition"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-and-conditions"
                className="block text-gray-900 hover:text-black transition"
              >
                Terms and Conditions
              </Link>
              <Link
                to="/return-policy"
                className="block text-gray-900 hover:text-black transition"
              >
                Return and Refund Policy
              </Link>
              <Link
                to="/shipping-policy"
                className="block text-gray-900 hover:text-black transition"
              >
                Shipping Policy
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-orange-600 font-bold mb-4">Follow us on</h3>
            <div className="flex gap-4 mb-6">
              <a
                href="https://www.youtube.com/@Sanskritiyam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-black transition"
              >
                <FaYoutube />
              </a>
              <a
                href="https://www.facebook.com/sanskritiyam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-black transition"
              >
                <FaMeta />
              </a>
              <a
                href="https://www.instagram.com/sanskritiyam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-black transition"
              >
                <FaInstagram />
              </a>
            </div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-900">
              <p>Varanasi U.P 221001</p>
              <p>Mobile number 9621242775</p>
              <p>📧 sanskritiyamofficial@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-900">
          © Copyright 2025, All Rights Reserved by Sanskritiyam
        </div>
      </div>
    </footer>
  );
};

export default Footer;
