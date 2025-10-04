import React from 'react';
import MurliContentDisplay from './MurliContentDisplay';
import AudioPlayer from './AudioPlayer';

const MurliReader = ({ murli }) => {
  if (!murli) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-400">Loading Murli...</p>
      </div>
    );
  }

  const { date, title, content, audioUrl } = murli;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-md text-gray-300">{date}</p>
      </div>
      
      {audioUrl && (
        <div className="sticky top-20 z-10">
          <AudioPlayer src={audioUrl} />
        </div>
      )}

      <MurliContentDisplay content={content} />
    </div>
  );
};

export default MurliReader;
