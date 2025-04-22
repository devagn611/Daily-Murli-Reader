import React from 'react';

const FontSizeControls = React.memo(({ onIncrease, onDecrease, onReset }) => (
  <div className="flex space-x-2">
    <button
      type="button"
      onClick={onIncrease}
      className="murli-button p-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
    >
      A+
    </button>
    <button
      type="button"
      onClick={onDecrease}
      className="murli-button p-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
    >
      A-
    </button>
    <button
      type="button"
      onClick={onReset}
      className="murli-button p-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600"
    >
      Reset
    </button>
  </div>
));

export default FontSizeControls;