// File: src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Bot, BookOpen, ClipboardCheck, ChevronDown, LogOut, Flower } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);  

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${API_URL}/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsProfileDropdownOpen(false);
      setIsMenuOpen(false);
      navigate('/auth');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                InnerCalm
              </span>
            </Link>
          </div>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            <Link
              to="/mood-tracking"
              className={`group flex items-center px-6 py-2.5 text-sm font-medium rounded-2xl transition-all duration-300 border ${
                location.pathname === '/mood-tracking'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-200 border-emerald-400'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 hover:text-emerald-600 border-gray-200 hover:border-emerald-200'
              }`}
            >
              <div className="relative flex items-center">
                <ClipboardCheck size={18} className={`mr-2 transition-transform duration-300 group-hover:scale-110 ${
                  location.pathname === '/mood-tracking' ? 'text-white' : 'text-emerald-500'
                }`} />
                <span className="relative">
                  Daily Survey
                </span>
              </div>
            </Link>

            <Link
              to="/Chatbot"
              className={`group flex items-center px-6 py-2.5 text-sm font-medium rounded-2xl transition-all duration-300 border ${
                location.pathname === '/Chatbot'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-200 border-emerald-400'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 hover:text-emerald-600 border-gray-200 hover:border-emerald-200'
              }`}
            >
              <div className="relative flex items-center">
                <Bot size={18} className={`mr-2 transition-transform duration-300 group-hover:scale-110 ${
                  location.pathname === '/Chatbot' ? 'text-white' : 'text-emerald-500'
                }`} />
                <span className="relative">
                  InnerCalm Bot
                </span>
              </div>
            </Link>

            <Link
              to="/selfhelpResources"
              className={`group flex items-center px-6 py-2.5 text-sm font-medium rounded-2xl transition-all duration-300 border ${
                location.pathname === '/selfhelpResources'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-200 border-emerald-400'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 hover:text-emerald-600 border-gray-200 hover:border-emerald-200'
              }`}
            >
              <div className="relative flex items-center">
                <BookOpen size={18} className={`mr-2 transition-transform duration-300 group-hover:scale-110 ${
                  location.pathname === '/selfhelpResources' ? 'text-white' : 'text-emerald-500'
                }`} />
                <span className="relative">
                  Self Help Resources
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Profile and Garden Buttons */}
          <div className="flex items-center space-x-4" ref={profileRef}>
            {/* Garden Button */}
            <Link
              to="/garden"
              className="hidden md:flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ease-in-out text-gray-700 hover:bg-gray-100"
            >
              <Flower size={18} className="mr-2" />
              Garden
            </Link>

            {/* Profile Button */}
            <button
              type="button"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className={`hidden md:flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ease-in-out ${
                isProfileDropdownOpen
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User size={18} className="mr-2" />
              Profile
              <ChevronDown size={16} className={`ml-1.5 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-4 mt-16 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                <div className="p-2 space-y-1">
                  <Link
                    to="/profile"
                    className="flex w-full items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <User size={16} className="mr-2" /> View Profile
                  </Link>
                  <Link
                    to="/history"
                    className="flex w-full items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <ClipboardCheck size={16} className="mr-2" /> User History
                  </Link>
                  <hr className="my-1 border-gray-200" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg z-40">
          <div className="p-3 space-y-1.5">
            <Link
              to="/mood-tracking"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-xl text-base text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <ClipboardCheck size={18} className="mr-2.5" /> Daily Survey
            </Link>
            <Link
              to="/Chatbot"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-xl text-base text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <Bot size={18} className="mr-2.5" /> InnerCalm Bot
            </Link>
            <Link
              to="/selfhelpResources"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-xl text-base text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <BookOpen size={18} className="mr-2.5" /> Self Help Resources
            </Link>
            <Link
              to="/garden"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-xl text-base text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <Flower size={18} className="mr-2.5" /> Garden
            </Link>
            <div className="h-px bg-gray-200 my-2"></div>
            <Link
              to="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-xl text-base text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <User size={18} className="mr-2.5" /> View Profile
            </Link>
            <Link
              to="/history"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-xl text-base text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <ClipboardCheck size={18} className="mr-2.5" /> User History
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2.5 rounded-xl text-base text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} className="mr-2.5" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
