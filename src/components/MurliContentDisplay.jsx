import React from 'react';

const MurliContentDisplay = React.memo(({ content, fontSize }) => (
  <div
    id="murli"
    className="murli-content prose max-w-none p-4 bg-gray-50 rounded-md shadow-inner"
    style={{ fontSize: `${fontSize}px` }}
    dangerouslySetInnerHTML={{ __html: content }}
  />
));

export default MurliContentDisplay;