import React, { useState } from 'react';
import { ShoppingBag, Heart, Menu, X, User, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const { state } = useCart();
  const { state: authState, logout } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'rituals', label: 'Rituals' },
    { id: 'about', label: 'About' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-sage-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
<<<<<<< HEAD
          <div 
=======
          <div
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
            className="text-2xl font-bold text-sage-800 cursor-pointer"
            onClick={() => onPageChange('home')}
          >
            Nushka
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'text-sage-800 border-b-2 border-sage-600'
                    : 'text-sage-600 hover:text-sage-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 text-sage-600 hover:text-sage-800 cursor-pointer transition-colors" />
<<<<<<< HEAD
            
            <div className="relative group">
              <User 
                className="h-5 w-5 text-sage-600 hover:text-sage-800 cursor-pointer transition-colors" 
=======

            <div className="relative group">
              <User
                className="h-5 w-5 text-sage-600 hover:text-sage-800 cursor-pointer transition-colors"
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
                onClick={() => {
                  if (!authState.isAuthenticated) {
                    setAuthMode('signin');
                    setIsAuthModalOpen(true);
                  }
                }}
              />
<<<<<<< HEAD
              
              {/* User Dropdown */}
              <div className="absolute right-0 top-8 w-48 bg-white border border-sage-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {authState.isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-sm text-sage-800 font-medium border-b border-sage-200">
=======

              {/* User Dropdown */}
              <div className="absolute right-0 top-8 w-52 bg-white border border-sage-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-3 px-3">
                  {authState.isAuthenticated ? (
                    <>
                      <div className="px-3 py-2 text-sm text-sage-800 font-medium border-b border-sage-200">
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
                        {authState.user?.name}
                      </div>
                      <button
                        onClick={() => onPageChange('dashboard')}
<<<<<<< HEAD
                        className="block w-full text-left px-4 py-2 text-sm text-sage-700 hover:bg-sage-50 transition-colors"
=======
                        className="block w-full text-left px-4 py-2 text-sm text-sage-700 hover:bg-sage-50 rounded-md transition-colors"
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
                      >
                        My Dashboard
                      </button>
                      <button
                        onClick={() => onPageChange('orders')}
<<<<<<< HEAD
                        className="block w-full text-left px-4 py-2 text-sm text-sage-700 hover:bg-sage-50 transition-colors"
                      >
                        My Orders
                      </button>
                      <div className="border-t border-sage-200 my-1"></div>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
=======
                        className="block w-full text-left px-4 py-2 text-sm text-sage-700 hover:bg-sage-50 rounded-md transition-colors"
                      >
                        My Orders
                      </button>
                      <div className="border-t border-sage-200 my-2"></div>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
<<<<<<< HEAD
                    <>
=======
                    <div className="space-y-2">
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
                      <button
                        onClick={() => {
                          setAuthMode('signin');
                          setIsAuthModalOpen(true);
                        }}
<<<<<<< HEAD
                        className="block w-full text-left px-4 py-2 text-sm text-sage-700 hover:bg-sage-50 transition-colors"
=======
                        className="w-full px-4 py-2 text-sm font-medium rounded-lg 
                                   text-white bg-sage-600 hover:bg-sage-700 
                                   shadow-sm transition-all duration-200"
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setAuthMode('register');
                          setIsAuthModalOpen(true);
                        }}
<<<<<<< HEAD
                        className="block w-full text-left px-4 py-2 text-sm text-sage-700 hover:bg-sage-50 transition-colors"
                      >
                        Create Account
                      </button>
                    </>
=======
                        className="w-full px-4 py-2 text-sm font-medium rounded-lg 
                                   text-sage-700 border border-sage-300 
                                   hover:bg-sage-50 shadow-sm transition-all duration-200"
                      >
                        Create Account
                      </button>
                    </div>
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
                  )}
                </div>
              </div>
            </div>
<<<<<<< HEAD
            
            <button 
=======

            <button
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
              onClick={() => onPageChange('wishlist')}
              className="relative p-1 text-sage-600 hover:text-sage-800 transition-colors"
            >
              <Heart className="h-5 w-5" />
              {state.wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.wishlist.length}
                </span>
              )}
            </button>
<<<<<<< HEAD
            
            <button 
=======

            <button
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
              onClick={() => onPageChange('cart')}
              className="relative p-1 text-sage-600 hover:text-sage-800 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-1 text-sage-600 hover:text-sage-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-sage-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'text-sage-800 bg-sage-50'
                    : 'text-sage-600 hover:text-sage-800 hover:bg-sage-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
<<<<<<< HEAD
      
      {/* Auth Modal */}
      <AuthModal 
=======

      {/* Auth Modal */}
      <AuthModal
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
};

export default Header;
