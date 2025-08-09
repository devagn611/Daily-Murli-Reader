import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, Download, ZoomIn, ZoomOut, RefreshCw,FileAudio } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import DateSelector from './DateSelector';
import OptimizedAudioPlayer from './AudioPlayer';


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
    const texturl = `${import.meta.env.VITE_API_URL}/${language}/html/murli-${date}.html`;
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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const selectedLanguage = languageOptions.find(opt => opt.value === language)?.label;
    const formattedDate = new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Daily Murli - ${formattedDate}</title>
          <style>
            body {
              font-family: Georgia, serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              color: #000;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #ccc;
              padding-bottom: 20px;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              margin: 0 0 10px 0;
            }
            .date {
              font-size: 18px;
              margin: 5px 0;
            }
            .language {
              font-size: 14px;
              color: #666;
              margin: 5px 0;
            }
            .content {
              font-size: ${fontSize}px;
              text-align: justify;
            }
            .content h1, .content h2, .content h3 {
              color: #333;
              margin-top: 25px;
              margin-bottom: 15px;
            }
            .content p {
              margin-bottom: 15px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ccc;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body { margin: 0; padding: 15px; }
              .header { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="content">
            ${murliContent}
          </div>
          <div class="footer">
            <p>© Brahma Kumaris World Spiritual University</p>
            <p>Source: madhubanmurli.org</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const downloadUrl = useMemo(
    () => `${import.meta.env.VITE_API_URL}/${language}/pdf/murli-${date}.pdf`,
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

  const audioSrc = useMemo(
    () => `${import.meta.env.VITE_API_URL}/${language}/mp3/murli-${date}.mp3`,
    [language, date]
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden transition-colors duration-300">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Date and Language Selectors */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <DateSelector date={date} onDateChange={handleDateChange} />
            <Select onValueChange={handleLanguageChange} defaultValue={language}>
              <SelectTrigger className="w-full sm:w-[180px]">
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

          {/* Audio Player */}
          <div className="w-full lg:flex-1 lg:max-w-md lg:mx-4">
           {audioSrc && <OptimizedAudioPlayer src={audioSrc} />}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2 sm:justify-start lg:justify-end">
            <button 
              onClick={handlePrint}
              disabled={isLoading || error || !murliContent}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              title="Print Murli"
            >
              <Download className="h-4 w-4" />
              Print
            </button>
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