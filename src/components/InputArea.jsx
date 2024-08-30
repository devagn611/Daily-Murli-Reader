import React, { useState, useEffect, useCallback, useMemo } from 'react';

const FONT_SIZE_STEP = 1;
const DEFAULT_FONT_SIZE = 16;

function MurliContainer() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [language, setLanguage] = useState('gu');
  const [murliContent, setMurliContent] = useState('');
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

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

//   const localStorage =localStorage.setItem('murliContent', [murliContent]);


  const handleDateChange = useCallback((e) => setDate(e.target.value), []);
  const handleLanguageChange = useCallback((e) => setLanguage(e.target.value), []);

  const increaseFontSize = useCallback(() => 
    setFontSize(prevSize => prevSize + FONT_SIZE_STEP), []);
  const decreaseFontSize = useCallback(() => 
    setFontSize(prevSize => Math.max(prevSize - FONT_SIZE_STEP, 1)), []);
  const resetFontSize = useCallback(() => 
    setFontSize(DEFAULT_FONT_SIZE), []);

  const downloadUrl = useMemo(() => 
    `https://madhubanmurli.org/murlis/${language}/pdf/murli-${date}.pdf`, 
    [language, date]
  );

  const languageOptions = useMemo(() => [
    { value: 'gu', label: 'ગુજરાતી' },
    { value: 'hi', label: 'Hindi' },
    { value: 'en', label: 'English' }
  ], []);

  return (
    <div className="murli-container max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="entry_point mb-6">
        <h2 className="murli-title text-2xl font-bold mb-4 text-center text-gray-700">Daily Murli</h2>
        <form className="murli-form flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <input 
            type="date" 
            value={date} 
            onChange={handleDateChange} 
            className="murli-input p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select 
            value={language} 
            onChange={handleLanguageChange} 
            className="murli-select p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="flex space-x-2">
            <button 
              type="button" 
              onClick={increaseFontSize} 
              className="murli-button p-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
            >
              A+
            </button>
            <button 
              type="button" 
              onClick={decreaseFontSize} 
              className="murli-button p-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
            >
              A-
            </button>
            <button 
              type="button" 
              onClick={resetFontSize} 
              className="murli-button p-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
          <a 
            href={downloadUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="murli-link p-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600"
          >
            Download
          </a>
        </form>
      </div>
      <div 
        id="murli" 
        className="murli-content prose max-w-none p-4 bg-gray-50 rounded-md shadow-inner"
        style={{ fontSize: `${fontSize}px` }}
        dangerouslySetInnerHTML={{ __html: murliContent }} 
      />
    </div>
  );
}

export default React.memo(MurliContainer);
