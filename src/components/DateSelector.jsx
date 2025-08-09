import React from 'react';

const DateSelector = React.memo(({ date, onDateChange }) => (
  <div className="relative flex items-center">
    <input
      type="date"
      value={date}
      onChange={onDateChange}
      className="murli-input p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
  />
  </div>
));

export default DateSelector;