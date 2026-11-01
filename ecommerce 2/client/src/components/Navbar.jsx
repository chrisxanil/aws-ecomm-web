import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Cpu,
  ShoppingCart,
  User,
  LogOut,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
  Server,
  Cloud
} from 'lucide-react';

export default function Navbar({ onOpenAIModal, onOpenCloudModal }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyber-purple via-indigo-600 to-cyber-cyan p-0.5 shadow-lg group-hover:shadow-cyber-purple/50 transition-all duration-300">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-cyber-neonCyan group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyber-neonCyan bg-clip-text text-transparent">
                NexaCart<span className="text-cyber-purple font-mono ml-0.5">.AI</span>
              </span>
              <div className="flex items-center space-x-1.5 -mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Neural Systems</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link to="/" className="text-slate-300 hover:text-white hover:text-cyber-neonCyan transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-slate-300 hover:text-white hover:text-cyber-neonCyan transition-colors">
              Hardware Catalogue
            </Link>
            <Link to="/products?category=neural-processors" className="text-slate-300 hover:text-white hover:text-cyber-neonCyan transition-colors">
              Neural Cores
            </Link>
            <button
              onClick={onOpenCloudModal}
              className="flex items-center space-x-1.5 text-xs font-mono px-2.5 py-1 rounded-md bg-navy-800/80 border border-slate-700/60 text-slate-300 hover:border-cyber-cyan/50 hover:text-cyber-cyan transition-all"
            >
              <Cloud className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>AWS Cloud Hub</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-4">
            
            {/* Ask Nexa AI Button */}
            <button
              onClick={onOpenAIModal}
              className="relative inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyber-purple/20 via-indigo-600/30 to-cyber-cyan/20 border border-cyber-purple/40 hover:border-cyber-cyan hover:shadow-lg hover:shadow-cyber-purple/20 transition-all text-white group"
            >
              <Sparkles className="w-4 h-4 text-cyber-neonCyan group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Ask Nexa AI</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-navy-850 border border-slate-700/60 hover:border-slate-500 text-slate-200 hover:text-white transition-colors"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-cyber-purple to-cyber-cyan rounded-full shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Dropdown / Auth CTA */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-xl bg-navy-850 border border-slate-700/60 hover:border-cyber-purple/50 transition-all"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={user?.name}
                    className="w-7 h-7 rounded-lg object-cover border border-cyber-purple/30"
                  />
                  <span className="hidden lg:inline text-xs font-medium text-slate-200 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-card py-2 shadow-2xl z-50 border border-white/10 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                      <p className="text-[11px] font-mono text-slate-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-slate-200 hover:bg-white/5 hover:text-cyber-cyan transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile & Orders</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-cyber-neonCyan hover:bg-white/5 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-cyber-neonCyan" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-white/5 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyber-purple to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-cyber-purple/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-t border-white/5 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-200"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-200"
          >
            Hardware Catalogue
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCloudModal();
            }}
            className="block w-full text-left py-2 text-sm text-cyber-cyan"
          >
            AWS Cloud Architecture
          </button>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-cyber-purple font-medium"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

