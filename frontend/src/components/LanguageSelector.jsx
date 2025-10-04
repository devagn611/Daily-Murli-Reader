import React from 'react';

const LanguageSelector = React.memo(({ language, onLanguageChange, options }) => (
  <select
    value={language}
    onChange={onLanguageChange}
    className="murli-select p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
));

export default LanguageSelector;