import React from 'react';
import { Volume2, VolumeX, HelpCircle, Heart, Trophy, Clock, Compass } from 'lucide-react';

interface TopBarProps {
  hearts: number;
  maxHearts: number;
  score: number;
  timeElapsed: number;
  bestScore: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHowToPlay: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  hearts,
  maxHearts,
  score,
  timeElapsed,
  bestScore,
  isMuted,
  onToggleMute,
  onOpenHowToPlay,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-amber-950/90 text-amber-50 backdrop-blur-md border-b border-amber-800/60 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '24s' }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-base sm:text-lg tracking-tight text-amber-100 whitespace-nowrap">
              Code Quest
            </h1>
            <span className="hidden sm:inline-block text-[11px] text-amber-300/80 uppercase tracking-wider font-mono">
              The Treasure Hunt
            </span>
          </div>
        </div>

        {/* Zone 2: Game HUD Stats */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium">
          {/* Hearts */}
          <div className="flex items-center gap-1 bg-amber-900/60 border border-amber-700/50 rounded-lg px-2.5 py-1">
            <span className="text-xs text-amber-200/70 hidden md:inline mr-1">Lives:</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: maxHearts }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 transition-all duration-300 ${
                    i < hearts
                      ? 'text-rose-500 fill-rose-500 scale-100 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                      : 'text-amber-700/40 fill-transparent scale-90'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 bg-amber-900/60 border border-amber-700/50 rounded-lg px-2.5 py-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono tabular-nums font-semibold text-amber-200">
              {score}
            </span>
            <span className="text-[11px] text-amber-300/70 hidden sm:inline">pts</span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1.5 bg-amber-900/60 border border-amber-700/50 rounded-lg px-2.5 py-1">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono tabular-nums text-amber-100">
              {formatTime(timeElapsed)}
            </span>
          </div>

          {/* Best Score */}
          {bestScore > 0 && (
            <div className="hidden lg:flex items-center gap-1.5 text-amber-300/70 text-xs">
              <span>Best:</span>
              <span className="font-mono tabular-nums font-medium text-amber-200">
                {bestScore}
              </span>
            </div>
          )}
        </div>

        {/* Zone 3: Interactive Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-8 h-8 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 hover:text-white border border-amber-700/50 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-lg transition-all shadow-sm hover:shadow active:scale-95 focus-visible:outline-2 focus-visible:outline-amber-300 whitespace-nowrap"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">How to Play</span>
          </button>
        </div>
      </div>
    </header>
  );
};
