import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Shield, Package, LogOut, LogIn, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useCart } from '../context/CartContext.js';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onNavigate: (view: 'catalog' | 'checkout' | 'orders' | 'admin') => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onNavigate, currentView }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalCount, openCart } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('catalog')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Shoppy
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full">
                  Learning Store
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('catalog')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'catalog'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Browse Catalog
            </button>

            {isAuthenticated && (
              <button
                onClick={() => onNavigate('orders')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentView === 'orders'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  currentView === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                }`}
              >
                <Shield className="w-4 h-4 text-purple-600" />
                <span>Admin Panel</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3">
            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {totalCount > 99 ? '99+' : totalCount}
                </span>
              )}
            </button>

            {/* Auth Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm font-medium text-slate-700"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">{user?.name}</span>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                          ADMIN
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('orders');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>Order History</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4 text-purple-500" />
                        <span>Admin Management</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1">
            <button
              onClick={() => {
                onNavigate('catalog');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Browse Catalog
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  onNavigate('orders');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                My Orders
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-lg text-base font-semibold text-purple-700 bg-purple-50"
              >
                Admin Panel
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
