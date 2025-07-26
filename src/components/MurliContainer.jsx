import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, Download, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const FONT_SIZE_STEP = 2;
const DEFAULT_FONT_SIZE = 18;
const MAX_FONT_SIZE = 32;
const MIN_FONT_SIZE = 12;

function MurliContainer() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [language, setLanguage] = useState('gu');
  const [murliContent, setMurliContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  const fetchMurli = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const texturl = `https://madhubanmurli.org/murlis/${language}/html/murli-${date}.html`;
    try {
      const response = await fetch(texturl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      setMurliContent(text);
    } catch (e) {
      console.error('Error fetching murli:', e);
      setError('Failed to load Murli. Please check your connection or try a different date.');
      setMurliContent('');
    } finally {
      setIsLoading(false);
    }
  }, [date, language]);

  useEffect(() => {
    fetchMurli();
  }, [fetchMurli]);

  const handleDateChange = (e) => setDate(e.target.value);
  const handleLanguageChange = (value) => setLanguage(value);

  const increaseFontSize = () => setFontSize((size) => Math.min(size + FONT_SIZE_STEP, MAX_FONT_SIZE));
  const decreaseFontSize = () => setFontSize((size) => Math.max(size - FONT_SIZE_STEP, MIN_FONT_SIZE));
  const resetFontSize = () => setFontSize(DEFAULT_FONT_SIZE);

  const downloadUrl = useMemo(
    () => `https://madhubanmurli.org/murlis/${language}/pdf/murli-${date}.pdf`,
    [language, date]
  );

  const languageOptions = useMemo(
    () => [
      { value: 'gu', label: 'Gujarati' },
      { value: 'hi', label: 'Hindi' },
      { value: 'en', label: 'English' },
      { value: 'ne', label: 'Nepali' },
      { value: 'kn', label: 'Kannada' },
      { value: 'ta', label: 'Tamil' },
      { value: 'te', label: 'Telugu' },
      { value: 'ml', label: 'Malayalam' },
      { value: 'bn', label: 'Bengali' },
      { value: 'or', label: 'Oriya' },
    ],
    []
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden transition-colors duration-300">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Date and Language Selectors */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="pl-10 pr-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Select onValueChange={handleLanguageChange} defaultValue={language}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Download PDF"
            >
              <Download className="h-5 w-5" />
            </a>
            <button onClick={increaseFontSize} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="Increase font size">
              <ZoomIn className="h-5 w-5" />
            </button>
            <button onClick={decreaseFontSize} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="Decrease font size">
              <ZoomOut className="h-5 w-5" />
            </button>
            <button onClick={resetFontSize} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="Reset font size">
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div
            style={{ fontSize: `${fontSize}px` }}
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: murliContent }}
          />
        )}
      </div>
    </div>
  );
}

export default MurliContainer;