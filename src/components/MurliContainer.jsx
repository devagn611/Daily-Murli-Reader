import React, { useState, useEffect, useCallback, useMemo } from 'react';

const FONT_SIZE_STEP = 2;
const DEFAULT_FONT_SIZE = 18;

function MurliReader() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [language, setLanguage] = useState('gu');
  const [murliContent, setMurliContent] = useState('');
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [highlightedText, setHighlightedText] = useState('');

  const fetchMurli = useCallback(async () => {
    const texturl = `https://madhubanmurli.org/murlis/${language}/html/murli-${date}.html`;
    try {
      const response = await fetch(texturl);
      const text = await response.text();
      setMurliContent(text);
    } catch (error) {
      console.error('Error fetching murli:', error);
      setMurliContent('Failed to load content. Please try again later.');
    }
  }, [date, language]);

  useEffect(() => {
    fetchMurli();
  }, [fetchMurli]);

  const handleDateChange = useCallback((e) => setDate(e.target.value), []);
  const handleLanguageChange = useCallback((e) => setLanguage(e.target.value), []);

  const increaseFontSize = useCallback(() =>
    setFontSize((prevSize) => prevSize + FONT_SIZE_STEP),
    []
  );
  const decreaseFontSize = useCallback(() =>
    setFontSize((prevSize) => Math.max(prevSize - FONT_SIZE_STEP, 12)),
    []
  );
  const resetFontSize = useCallback(() => setFontSize(DEFAULT_FONT_SIZE), []);
  const toggleDarkMode = useCallback(() => setIsDarkMode((prevMode) => !prevMode), []);

  const downloadUrl = useMemo(
    () => `https://madhubanmurli.org/murlis/${language}/pdf/murli-${date}.pdf`,
    [language, date]
  );

  const languageOptions = useMemo(
    () => [
      { value: 'gu', label: 'ગુજરાતી' },
      { value: 'hi', label: 'Hindi' },
      { value: 'en', label: 'English' },
    ],
    []
  );

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection.toString() && selection.anchorNode.parentNode.closest('#murli')) {
      setHighlightedText(selection.toString());
      console.log("Selected text:", selection.toString());
    } else {
      setHighlightedText('');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, [handleTextSelection]);

  const themeClass = isDarkMode ? 'dark' : 'light';

  return (
    <div className={`max-w-screen mx-auto py-8 px-4 sm:px-6 lg:px-8 ${themeClass === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="date" className={`${themeClass === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={handleDateChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-auto border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="language" className={`${themeClass === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Language:</label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-auto border-gray-300 rounded-md text-sm"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={decreaseFontSize} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-3 rounded text-sm">A-</button>
          <button onClick={increaseFontSize} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-3 rounded text-sm">A+</button>
          <button onClick={resetFontSize} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-3 rounded text-sm">Reset</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleDarkMode} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-3 rounded text-sm">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded text-sm"
          >
            Download
          </a>
        </div>
      </div>
      <div
        id="murli"
        className={`prose max-w-none p-4 rounded-md ${themeClass === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} text-lg leading-relaxed`}
        style={{ fontSize: `${fontSize}px` }}
        dangerouslySetInnerHTML={{ __html: murliContent }}
      />
      {highlightedText && (
        <div className={`mt-4 p-4 rounded-md text-sm ${themeClass === 'dark' ? 'bg-yellow-800 text-yellow-200 border border-yellow-600' : 'bg-yellow-100 text-yellow-800 border border-yellow-300'}`}>
          Selected Text: "{highlightedText}" - (You could add note/highlight actions here)
        </div>
      )}
    </div>
  );
}

export default MurliReader;