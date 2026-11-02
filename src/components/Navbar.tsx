import React, { useState } from 'react';
import { PageView } from '../types';
import { Menu, X, Sprout, CloudSun, Calendar, Info, Mail, LogIn, UserPlus, Sparkles } from 'lucide-react';

import { SeedlingLogo } from './SeedlingLogo';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageView; label: string; icon: React.ReactNode; isNew?: boolean }[] = [
    { id: 'home', label: 'Home', icon: <Sprout className="w-4 h-4" /> },
    { id: 'planner', label: 'Garden Planner (CRUD)', icon: <Calendar className="w-4 h-4" />, isNew: true },
    { id: 'weather', label: 'Weather & Frost API', icon: <CloudSun className="w-4 h-4" />, isNew: true },
    { id: 'tips', label: 'Seasonal Tips', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  ];

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-leaf-100 shadow-xs">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between" aria-label="Main">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 font-display text-xl font-bold text-leaf-700 hover:text-leaf-600 transition cursor-pointer"
        >
          <SeedlingLogo className="w-8 h-8 shrink-0 rounded-lg shadow-2xs" />
          <span>Seedling</span>
        </button>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`font-semibold text-sm transition pb-1 flex items-center gap-1.5 cursor-pointer relative ${
                    isActive
                      ? 'text-leaf-600 border-b-2 border-sun-400 font-bold'
                      : 'text-slate-600 hover:text-leaf-600'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.isNew && (
                    <span className="bg-sun-400 text-leaf-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      JS
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleNavClick('signin')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition cursor-pointer flex items-center gap-1.5 ${
              currentPage === 'signin'
                ? 'bg-leaf-100 text-leaf-800'
                : 'text-leaf-700 hover:bg-leaf-50'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign in</span>
          </button>
          <button
            onClick={() => handleNavClick('signup')}
            className="px-4 py-2 rounded-lg font-semibold text-sm bg-leaf-700 text-white hover:bg-leaf-600 transition cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign up</span>
          </button>
        </div>

        {/* Mobile menu toggle button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-leaf-50 focus:outline-hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-leaf-100 px-4 pb-4 pt-2 space-y-1 bg-white shadow-lg animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold text-sm transition flex items-center justify-between cursor-pointer ${
                  isActive ? 'bg-leaf-50 text-leaf-700 font-bold' : 'text-slate-700 hover:bg-leaf-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.isNew && (
                  <span className="bg-sun-400 text-leaf-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    JS
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('signin')}
              className="w-full text-center px-3 py-2 rounded-lg font-semibold text-sm text-leaf-700 bg-leaf-50 hover:bg-leaf-100 cursor-pointer"
            >
              Sign in
            </button>
            <button
              onClick={() => handleNavClick('signup')}
              className="w-full text-center px-3 py-2 rounded-lg font-semibold text-sm bg-leaf-700 text-white hover:bg-leaf-600 cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
