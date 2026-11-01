import { useState, useEffect } from 'react';

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
    <footer className="px-[14px] pb-[14px] pt-2">
      <div className="glass-bar min-h-[52px] w-full">
        <div className="flex w-full flex-col items-center gap-1 px-1 text-sm text-gray-600 dark:text-zinc-300 sm:flex-row sm:justify-between">
          <p className="text-center sm:text-left">
            Made with Baba's blessing &<span className="text-red-500"> ❤️</span> by a kumar of BK Gariyadhar
          </p>
          <div className="flex items-center justify-center gap-2">
            <nav aria-label="Footer">
              <a href="/" className="hover:text-blue-500 dark:hover:text-blue-400">Home</a>
            </nav>
            <span className="glass-sep" aria-hidden="true">|</span>
            <p className="font-mono tabular-nums">{time.toLocaleTimeString()}</p>
            <span className="glass-sep" aria-hidden="true">|</span>
            <p className="text-xs">Om Shanti</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
