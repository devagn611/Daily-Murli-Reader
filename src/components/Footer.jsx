import React, { useState, useEffect } from 'react';


function Footer() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <footer className="w-full p-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-center md:text-left">
          Made with Baba's blessing &<span className="text-red-500"> ❤️</span> by a kumar of BK Gariyadhar
        </p>
        <p className="text-sm font-mono">{time.toLocaleTimeString()}</p>
        <p className="text-xs">
          Om Shanti
        </p>
      </div>
    </footer>
  );
}

export default Footer;