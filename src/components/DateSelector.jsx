import React from 'react';

const DateSelector = React.memo(({ date, onDateChange }) => (
  <input
    type="date"
    value={date}
    onChange={onDateChange}
    className="murli-input p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
));

export default DateSelector;