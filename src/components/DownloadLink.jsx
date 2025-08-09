import React from 'react';
import { Download } from 'lucide-react';

const DownloadLink = React.memo(({ downloadUrl }) => (
  <a
    href={downloadUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
    title="Download PDF"
  >
    <Download className="h-5 w-5" />
  </a>
));

export default DownloadLink;