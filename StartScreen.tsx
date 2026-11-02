import React from 'react';
import { Compass, Play, HelpCircle, Trophy, Sparkles, MapPin, Code2 } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface StartScreenProps {
  onStartGame: () => void;
  onOpenHowToPlay: () => void;
  bestScore: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  onOpenHowToPlay,
  bestScore,
}) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto my-4 sm:my-8 rounded-3xl overflow-hidden bg-gradient-to-b from-amber-950 via-slate-900 to-black border-2 border-amber-600/70 shadow-2xl p-6 sm:p-12 text-center text-amber-50">
      {/* Decorative Adventure Compass Icon */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-1 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
          <div className="w-full h-full rounded-full bg-amber-950 flex items-center justify-center text-amber-300">
            <Compass className="w-14 h-14 sm:w-16 sm:h-16 animate-spin" style={{ animationDuration: '30s' }} />
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>For 1st-Year Computer Engineering Students</span>
      </div>

      {/* Main Title */}
      <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-300 tracking-tight mb-4">
        Code Quest
      </h1>
      <p className="font-display text-lg sm:text-2xl font-bold text-amber-400 tracking-wide uppercase mb-6">
        The Treasure Hunt
      </p>

      {/* Lore Description */}
      <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
        You have washed ashore on the enigmatic <strong>Isla de C</strong>. To claim the legendary
        vault of the Master Engineer, journey through 6 island regions, decipher C programming
        riddles, trace loops, debug syntax errors, and collect the 4 secret digits to crack the
        final vault lock!
      </p>

      {/* Features preview strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8 text-left">
        <div className="p-3.5 rounded-2xl bg-amber-900/20 border border-amber-800/40 flex items-center gap-3">
          <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h2 className="text-xs font-bold text-amber-200 uppercase">6 Island Realms</h2>
            <p className="text-[11px] text-slate-400">Beach to Ancient Vault</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-900/20 border border-amber-800/40 flex items-center gap-3">
          <Code2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h2 className="text-xs font-bold text-emerald-200 uppercase">C Coding & Logic</h2>
            <p className="text-[11px] text-slate-400">Loops, I/O, Debugging & Bits</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-900/20 border border-amber-800/40 flex items-center gap-3">
          <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h2 className="text-xs font-bold text-amber-200 uppercase">Personal Best</h2>
            <p className="text-[11px] font-mono text-amber-300">
              {bestScore > 0 ? `${bestScore} points` : 'No score yet'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <button
          onClick={() => {
            soundEffects.playClick();
            onStartGame();
          }}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl font-display font-bold text-base sm:text-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2.5"
        >
          <Play className="w-5 h-5 fill-amber-950" />
          <span>Embark on Quest</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenHowToPlay();
          }}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl font-display font-semibold text-sm sm:text-base text-amber-200 hover:text-white bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/60 transition-colors flex items-center justify-center gap-2"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>How to Play</span>
        </button>
      </div>
    </div>
  );
};
