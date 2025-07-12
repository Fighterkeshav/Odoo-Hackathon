import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Plus, 
  Home, 
  Search, 
  Shield,
  Gift
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Gift className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">ReWear</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/items" 
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <Search className="h-4 w-4" />
              <span>Browse Items</span>
            </Link>

            {user && (
              <>
                <Link 
                  to="/add-item" 
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </Link>
                
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                {user.is_admin && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{user.name}</span>
                  <span className="ml-2 text-primary-600 font-semibold">
                    {user.points} pts
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link 
                to="/" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link 
                to="/items" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Items
              </Link>

              {user && (
                <>
                  <Link 
                    to="/add-item" 
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Add Item
                  </Link>
                  
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  {user.is_admin && (
                    <Link 
                      to="/admin" 
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}

                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="px-3 py-2 text-sm text-gray-700">
                      <span className="font-medium">{user.name}</span>
                      <span className="ml-2 text-primary-600 font-semibold">
                        {user.points} pts
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}

              {!user && (
                <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 