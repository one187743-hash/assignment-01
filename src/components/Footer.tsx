import React from 'react';
import { PageView } from '../types';
import { SeedlingLogo } from './SeedlingLogo';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-leaf-900 text-leaf-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <p className="font-display text-xl font-bold text-white flex items-center gap-2">
            <SeedlingLogo className="w-7 h-7 rounded-md" />
            <span>Seedling</span>
          </p>
          <p className="mt-3 max-w-sm text-leaf-100/80 text-sm leading-relaxed">
            A weekly garden planner that tells you what to sow, water and harvest, week by week. Powered by local frost dates, custom bed management, and live weather alerts.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-sun-400 font-semibold">
            <span>Assignment 03 · JavaScript CRUD, LocalStorage & Axios API</span>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h2 className="font-display font-semibold text-white mb-3">Explore</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <button
                onClick={() => handleNavClick('home')}
                className="hover:text-sun-400 transition cursor-pointer"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('planner')}
                className="hover:text-sun-400 transition cursor-pointer"
              >
                Garden Planner
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('weather')}
                className="hover:text-sun-400 transition cursor-pointer"
              >
                Weather
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('tips')}
                className="hover:text-sun-400 transition cursor-pointer"
              >
                Seasonal Tips
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('about')}
                className="hover:text-sun-400 transition cursor-pointer"
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('contact')}
                className="hover:text-sun-400 transition cursor-pointer"
              >
                Contact
              </button>
            </li>
          </ul>
        </div>

        {/* Account Links */}
        <div>
          <h2 className="font-display font-semibold text-white mb-3">Account</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <button
                onClick={() => handleNavClick('signin')}
                className="hover:text-sun-400 transition cursor-pointer"
              >
                Sign in
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('signup')}
                className="hover:text-sun-400 transition cursor-pointer"
              >
                Create account
              </button>
            </li>
            <li className="pt-2">
              <span className="inline-block px-2 py-0.5 rounded-sm bg-white/10 text-xs text-sun-400">
                Local Storage Active
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-leaf-100/70">
        © <span id="yr">{currentYear}</span> Seedling Garden Co. All rights reserved.
      </div>
    </footer>
  );
};
