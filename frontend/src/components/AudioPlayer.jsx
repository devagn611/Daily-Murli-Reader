import { useState, useRef, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const OptimizedAudioPlayer = ({ src }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (src) {
      setHasError(false);
      setIsLoading(true);
    }
  }, [src]);

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
      <div className="glass-player flex items-center justify-center px-4 py-3">
        <p className="text-sm text-gray-600 dark:text-zinc-300">
          Audio not available for this date
        </p>
      </div>
    );
  }

  return (
    <div className="glass-player relative w-full">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[20px] bg-white/25 dark:bg-zinc-900/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600 dark:text-zinc-300">Loading audio...</span>
          </div>
        </div>
      )}

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
          '--rhap-time-color': 'inherit',
          '--rhap-font-family': 'inherit',
        }}
      />
    </div>
  );
};

export default OptimizedAudioPlayer;
