// src/components/Footer.jsx
import React, { useEffect, useState } from 'react';


function Footer() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full text-center p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-t border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center md:flex-row md:justify-between">
      <p className="text-sm mb-2 md:mb-0">
        Made with Baba's blessing &<span className="text-red-500"> ❤️</span> by kumar of BK Gariyadhar
      </p>

      
      {/* <nav className="hidden md:flex items-center gap-4 text-sm md:text-base">
       <Navmenu />
      </nav> */}

{/*       
      <div className="flex md:hidden items-center gap-4 text-sm">
      <Navmenu />
      </div> */}

      <p className="text-xs mt-2 md:mt-0">
        {time.toLocaleTimeString()}
      </p>
    </footer>
  );
}

export default Footer;