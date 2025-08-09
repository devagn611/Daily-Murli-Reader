import React, { useState, useRef, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const OptimizedAudioPlayer = ({ src }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef(null);

  if (!src) {
    return null;
  }

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">
          Audio not available for this date
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg z-10">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Loading audio...</span>
          </div>
        </div>
      )}
      
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-2 border border-gray-200 dark:border-gray-600">
        <AudioPlayer
          ref={audioRef}
          src={src}
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onError={handleError}
          showJumpControls={false}
          showDownloadProgress={true}
          showFilledProgress={true}
          customProgressBarSection={[
            "CURRENT_TIME",
            "PROGRESS_BAR", 
            "DURATION",
          ]}
          customControlsSection={[
            "MAIN_CONTROLS",
            "VOLUME_CONTROLS",
          ]}
          autoPlayAfterSrcChange={false}
          preload="metadata"
          className="!bg-transparent !shadow-none"
          style={{
            backgroundColor: 'transparent',
            boxShadow: 'none',
            '--rhap-theme-color': '#3b82f6',
            '--rhap-background-color': 'transparent',
            '--rhap-bar-color': 'rgba(156, 163, 175, 0.3)',
            '--rhap-time-color': '#374151',
            '--rhap-font-family': 'inherit',
          }}
        />
      </div>
    </div>
  );
};

export default OptimizedAudioPlayer;

