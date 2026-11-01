import { useState, useEffect } from "react";
import headerLogo from "../assets/brahmakumaris_logo.png";
import { Sun, Moon, Github } from 'lucide-react';
import IconButton from "./ui/IconButton";

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
    <header
      className="glass-bar fixed top-[14px] left-[14px] right-[14px] z-50 h-auto"
      role="banner"
    >
      <nav
        className="grid w-full grid-cols-[1fr_auto] items-center gap-x-2 gap-y-2 sm:flex sm:flex-nowrap"
        role="navigation"
        aria-label="Main navigation"
      >
        <a
          href="/"
          className="flex items-center gap-2 min-w-0 pl-1 shrink-0"
          aria-label="Daily Murli Reader home"
        >
          <img src={headerLogo} className="h-8 w-8 rounded-full object-contain" alt="Brahma Kumaris World Spiritual University Logo" width="32" height="32" />
          <span className="hidden sm:inline text-[14px] font-semibold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
            Daily Murli
          </span>
        </a>

        <span className="glass-sep hidden sm:inline" aria-hidden="true">|</span>

        <div
          id="reader-toolbar-controls"
          className="col-span-2 m-1.2 flex min-w-0 flex-wrap items-center gap-2 sm:col-auto sm:flex-1 sm:flex-nowrap"
        />

        <div className="col-start-2 row-start-1 flex items-center gap-2 shrink-0 sm:ml-auto sm:pl-2" role="toolbar" aria-label="Header actions">
          <span className="glass-sep hidden sm:inline" aria-hidden="true">|</span>
          <IconButton
            href="https://github.com/devagn611/Daily-Murli-Reader"
            target="_blank"
            rel="noopener noreferrer"
            label="View source code on GitHub"
          >
            <Github className="h-5 w-5" aria-hidden="true" />
          </IconButton>
          <IconButton
            onClick={toggleDarkMode}
            label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
          </IconButton>
        </div>
      </nav>
    </header>
  );
}
