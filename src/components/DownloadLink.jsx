import React from 'react';

const DownloadLink = React.memo(({ downloadUrl }) => (
  <a
    href={downloadUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="murli-link p-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600"
  >
    Download
  </a>
));

export default DownloadLink;