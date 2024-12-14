import React from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

const ElegantFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-gray-400 px-10 py-16 mt-10 font-sans md:px-20">
      <div className="flex justify-between pb-8 border-b border-gray-700">
        <div className="flex-1">
          <h3 className="text-white mb-4 font-bold text-lg">CATEGORIES</h3>
          <ul className="list-none p-0 space-y-2">
            <li className="hover:text-white cursor-pointer transition-colors duration-300">
              Bachelors
            </li>
            <li className="hover:text-white cursor-pointer transition-colors duration-300">
              Masters
            </li>
            <li className="hover:text-white cursor-pointer transition-colors duration-300">
              PHD
            </li>
          </ul>
        </div>
        <div className="flex-1">
          <h3 className="text-white mb-4 font-bold text-lg">HELP</h3>
          <ul className="list-none p-0 space-y-2">
            <li className="hover:text-white cursor-pointer transition-colors duration-300">
              Track Order
            </li>
            <li className="hover:text-white cursor-pointer transition-colors duration-300">
              Returns
            </li>
            <li className="hover:text-white cursor-pointer transition-colors duration-300">
              FAQs
            </li>
          </ul>
        </div>
        <div className="flex-1">
          <h3 className="text-white mb-4 font-bold text-lg">GET IN TOUCH</h3>
          <p className="leading-6">
            Any questions? Let us know in store at location or call us on (+00)
            00000000
          </p>
          <div className="flex space-x-4 mt-6 text-2xl justify-center">
            <FaFacebook className="hover:text-blue-500 cursor-pointer transition-colors duration-300" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer transition-colors duration-300" />
            <FaYoutube className="hover:text-red-600 cursor-pointer transition-colors duration-300" />
            <FaLinkedin className="hover:text-blue-700 cursor-pointer transition-colors duration-300" />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-6 mt-6">
        <p className="text-sm">© 2024 All rights reserved</p>
        <button
          className="footer_btn bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded transition-colors duration-300"
          onClick={scrollToTop}
        >
          ↑
        </button>
      </div>
    </footer>
  );
};

export default ElegantFooter;
