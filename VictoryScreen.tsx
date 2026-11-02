import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Lightbulb, Heart, RotateCcw, Award, CheckCircle } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface VictoryScreenProps {
  score: number;
  timeElapsed: number;
  hintsUsed: number;
  heartsRemaining: number;
  bestScore: number;
  isNewRecord: boolean;
  onPlayAgain: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  score,
  timeElapsed,
  hintsUsed,
  heartsRemaining,
  bestScore,
  isNewRecord,
  onPlayAgain,
}) => {
  useEffect(() => {
    soundEffects.playVictoryFanfare();

    // Trigger colorful confetti celebration
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#f43f5e', '#fbbf24'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#f43f5e', '#fbbf24'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-amber-950/95 via-amber-900/90 to-black/95 border-2 border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.3)] backdrop-blur-xl text-center text-amber-50">
      {/* Radiant Glow Burst */}
      <div className="relative mb-6">
        {/* Animated Treasure Chest SVG */}
        <div className="relative w-64 h-56 mx-auto flex items-center justify-center">
          {/* Light Rays */}
          <div className="absolute inset-0 bg-radial from-amber-400/40 via-amber-500/10 to-transparent blur-2xl animate-pulse" />

          <svg
            viewBox="0 0 240 200"
            className="w-full h-full relative z-10 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          >
            {/* Treasure Glow Rays from Inside */}
            <g opacity="0.8">
              <polygon points="120,110 30,20 60,15" fill="#fef08a" opacity="0.6" />
              <polygon points="120,110 90,5 120,0" fill="#fde047" opacity="0.7" />
              <polygon points="120,110 150,5 180,20" fill="#fef08a" opacity="0.6" />
              <polygon points="120,110 200,45 220,70" fill="#facc15" opacity="0.5" />
              <polygon points="120,110 20,70 40,45" fill="#facc15" opacity="0.5" />
            </g>

            {/* Floating Gold Coins */}
            <g className="animate-float">
              <circle cx="120" cy="70" r="12" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
              <text x="120" y="74" textAnchor="middle" fill="#78350f" fontSize="11" fontWeight="bold">C</text>
              <circle cx="90" cy="85" r="9" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="150" cy="80" r="10" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              <polygon points="105,60 110,68 100,68" fill="#38bdf8" />
              <polygon points="135,55 140,65 130,65" fill="#f43f5e" />
            </g>

            {/* Chest Body (Base) */}
            <rect x="35" y="105" width="170" height="80" rx="8" fill="#78350f" stroke="#451a03" strokeWidth="3" />
            {/* Bronze Metal Bands */}
            <rect x="55" y="105" width="18" height="80" fill="#ca8a04" stroke="#78350f" strokeWidth="1" />
            <rect x="167" y="105" width="18" height="80" fill="#ca8a04" stroke="#78350f" strokeWidth="1" />
            {/* Golden Lock & Keyhole */}
            <rect x="108" y="112" width="24" height="26" rx="4" fill="#facc15" stroke="#b45309" strokeWidth="1.5" />
            <circle cx="120" cy="122" r="3" fill="#451a03" />
            <polygon points="118,122 122,122 121,130 119,130" fill="#451a03" />

            {/* Opened Lid Swung Backwards */}
            <path
              d="M 30 105 
                 C 30 55, 210 55, 210 105 
                 L 200 105 
                 C 200 65, 40 65, 40 105 Z"
              fill="#92400e"
              stroke="#451a03"
              strokeWidth="3"
            />
            {/* Lid Metal Ribs */}
            <path d="M 55 68 C 55 60, 73 60, 73 68 L 73 105 L 55 105 Z" fill="#eab308" />
            <path d="M 167 68 C 167 60, 185 60, 185 68 L 185 105 L 167 105 Z" fill="#eab308" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-3">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Quest Completed · Master Engineer</span>
        </div>

        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-100">
          The Hidden Treasure is Yours!
        </h2>
        <p className="max-w-xl mx-auto mt-3 text-sm sm:text-base text-amber-200/90 leading-relaxed">
          You cracked every C programming enigma, braved the wild island, and unlocked the legendary
          Chamber of Isla de C!
        </p>
      </div>

      {/* New High Score Badge */}
      {isNewRecord && (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-bold text-sm shadow-lg animate-pulse">
          <Trophy className="w-4 h-4" />
          <span>NEW PERSONAL RECORD!</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8 text-left">
        {/* Score */}
        <div className="bg-black/40 border border-amber-700/50 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-amber-300/80 mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Final Score</span>
          </div>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-200 tabular-nums">
            {score}
          </span>
          <span className="text-[11px] text-amber-400/60 mt-1">Best: {bestScore} pts</span>
        </div>

        {/* Time */}
        <div className="bg-black/40 border border-amber-700/50 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-amber-300/80 mb-1">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Time Taken</span>
          </div>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-sky-200 tabular-nums">
            {formatTime(timeElapsed)}
          </span>
          <span className="text-[11px] text-sky-400/60 mt-1">Total Expedition</span>
        </div>

        {/* Hints */}
        <div className="bg-black/40 border border-amber-700/50 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-amber-300/80 mb-1">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Hints Used</span>
          </div>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-100 tabular-nums">
            {hintsUsed}
          </span>
          <span className="text-[11px] text-amber-400/60 mt-1">
            {hintsUsed === 0 ? 'Flawless logic!' : `-${hintsUsed * 50} pts`}
          </span>
        </div>

        {/* Hearts Remaining */}
        <div className="bg-black/40 border border-amber-700/50 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-amber-300/80 mb-1">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Lives Left</span>
          </div>
          <div className="flex items-center gap-1 my-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 ${
                  i < heartsRemaining
                    ? 'text-rose-500 fill-rose-500'
                    : 'text-amber-800/40 fill-transparent'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-rose-400/60 mt-1">
            +{heartsRemaining * 100} bonus pts
          </span>
        </div>
      </div>

      {/* Relics Summary */}
      <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-amber-900/30 border border-amber-800/50 mb-8">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-3 flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Island Relics Collected (Code: 4-7-3-8)</span>
        </h3>
        <div className="flex items-center justify-center gap-4 sm:gap-6 text-2xl sm:text-3xl">
          <span title="Beach Shell: Digit 4">🐚</span>
          <span title="Jungle Map: Digit 7">🗺️</span>
          <span title="Cave Torch: Digit 3">🔥</span>
          <span title="Waterfall Key: Digit 8">🗝️</span>
          <span title="Temple Gem">💎</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onPlayAgain}
        className="px-8 py-4 rounded-2xl font-display font-bold text-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 shadow-[0_0_25px_rgba(245,158,11,0.5)] active:scale-95 transition-all inline-flex items-center gap-2.5"
      >
        <RotateCcw className="w-5 h-5" />
        <span>Play Quest Again</span>
      </button>
    </div>
  );
};
