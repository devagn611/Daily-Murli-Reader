import React, { useState, useEffect } from "react";
import headerLogo from "../assets/brahmakumaris_logo.png";
import { Sun, Moon, Github } from 'lucide-react';

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('color-theme') === 'dark' || 
    (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300" role="banner">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16" role="navigation" aria-label="Main navigation">
          {/* Logo and Title */}
          <div className="flex items-center">
            <a
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
              aria-label="Daily Murli Reader - Home"
            >
              <img src={headerLogo} className="h-8 w-auto" alt="Brahma Kumaris World Spiritual University Logo" width="32" height="32" />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-800 dark:text-white">
                Daily Murli
              </span>
            </a>
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center space-x-4" role="toolbar" aria-label="Header actions">
            <a
              href="https://github.com/devagn611/Daily-Murli-Reader"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              aria-label="View source code on GitHub"
            >
              <Github className="h-6 w-6" aria-hidden="true" />
            </a>
            <button
              onClick={toggleDarkMode}
              type="button"
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-6 w-6" aria-hidden="true" /> : <Moon className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}