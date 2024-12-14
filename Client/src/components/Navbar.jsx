import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  UserCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { CartContext } from "../context/CartContext";

const Navbar = ({ onMenuToggle }) => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);

  const menuItems = ["Home", "Features", "About", "Contact", "New Article"];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    setLoggedInUser(user);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleSearchInput = () => {
    setSearchVisible((prev) => !prev);
    if (isMenuOpen) setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    if (isSearchVisible) setSearchVisible(false);
    if (isDropdownOpen) setDropdownOpen(false);
    if (onMenuToggle) {
      onMenuToggle(!isMenuOpen);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      alert("Please enter a search term.");
      return;
    }
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const elements = document.querySelectorAll("body *");
    let matchFound = false;

    elements.forEach((element) => {
      if (
        element.textContent.toLowerCase().includes(normalizedSearchTerm) &&
        element.offsetParent !== null
      ) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.style.outline = "2px solid purple";
        setTimeout(() => (element.style.outline = "none"), 2000);
        matchFound = true;
      }
    });

    if (!matchFound) {
      alert("No matching content found!");
    }
    setSearchVisible(false);
    setMenuOpen(false);
  };

  const handleUserIconClick = () => {
    if (!loggedInUser) {
      navigate("/auth");
    } else {
      setDropdownOpen(!isDropdownOpen);
      if (isMenuOpen) setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate(`/profile/${loggedInUser.email}`);
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo - Left Side */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-l md:text-2xl font-bold text-gray-800 transition-all duration-300 hover:text-purple-600"
            >
              <span className="transition-transform duration-300 hover:text-purple-700">
                Commencement
              </span>
              <span className="ml-1 transition-transform duration-300 hover:text-purple-700">
                Depot
              </span>
            </Link>
          </div>

          {/* Desktop Menu - Middle */}
          <div className="hidden md:flex justify-center flex-1 px-8">
            <div className="flex space-x-6 text-gray-600">
              {menuItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={`/`}
                  className="transition-all duration-300 hover:text-purple-600 hover:underline underline-offset-4"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Icons - Right Side */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center">
              {isSearchVisible && (
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-48 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-purple-400 transition-all duration-300"
                    autoFocus
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onBlur={() => setSearchVisible(false)}
                  />
                </form>
              )}
              <button
                onClick={toggleSearchInput}
                className="text-gray-600 hover:text-purple-600 transition-colors duration-300"
              >
                <Search size={20} />
              </button>
            </div>

            <button
              onClick={() => navigate("/cart")}
              className="relative text-gray-600 hover:text-purple-600 transition-colors duration-300"
            >
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={handleUserIconClick}
                className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors duration-300"
              >
                <User size={20} />
                {loggedInUser && (
                  <ChevronDown
                    size={16}
                    className={`hidden md:block transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {isDropdownOpen && loggedInUser && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-purple-50 transition-colors duration-300"
                  >
                    <UserCircle size={18} />
                    <span>Your Account</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-purple-50 transition-colors duration-300"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            <button
              className="md:hidden text-gray-600 hover:text-purple-600 transition-colors duration-300"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
        fixed inset-0 bg-gray-800/50 backdrop-blur-sm transform transition-opacity duration-300 md:hidden
        ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
      >
        <div
          className={`
          fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
        >
          <div className="flex flex-col h-full">
            <div className="p-4">
              <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-purple-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="text-gray-600 hover:text-purple-600"
                >
                  <Search size={20} />
                </button>
              </form>

              <div className="flex flex-col space-y-4">
                {menuItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {loggedInUser && (
              <div className="mt-auto p-4 border-t">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-purple-50 transition-colors duration-300"
                >
                  <UserCircle size={18} />
                  <span>Your Account</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-purple-50 transition-colors duration-300"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
