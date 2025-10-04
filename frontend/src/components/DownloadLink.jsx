import React from 'react';
import { Download } from 'lucide-react';
import handlePrint from '../utils/printHelper';


const DownloadLink = React.memo((props) => {
  const { isLoading, error, murliContent } = props;
  return (
    <button
      onClick={handlePrint}
      disabled={isLoading || error || !murliContent}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
      title="Print Murli"
    >
      <Download className="h-4 w-4" />
      Print
    </button>
  );
});

export default DownloadLink;