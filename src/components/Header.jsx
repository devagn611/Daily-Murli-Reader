import React from "react";
import headerLogo from "../assets/brahmakumaris_logo.png";

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <a
              href="/" // You can adjust the home link
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <img src={headerLogo} className="h-8 w-auto" alt="Brahma Kumaris Logo" />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Daily Murli
              </span>
            </a>
          </div>

          {/* Navigation (for larger screens) */}
          <nav className="hidden md:flex items-center space-x-4">
            {/* Add your navigation links here */}
            {/* <a href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium">About</a>
            <a href="/archive" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium">Archive</a>
            <a href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium">Contact</a> */}
            <a
              href="https://github.com/devagn611"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              GitHub
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false" // You'll need to manage this state with JavaScript
              aria-controls="mobile-menu" // Link to the mobile menu div
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Hidden by default) */}
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* Mobile navigation links */}
          {/* <a href="/about" className="block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 px-3 rounded-md font-medium">About</a>
          <a href="/archive" className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-3 rounded-md font-medium">Archive</a>
          <a href="/contact" className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-3 rounded-md font-medium">Contact</a> */}
          <a
            href="https://github.com/devagn611"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}