import React from 'react';
import { HeartCrack, RotateCcw, Compass, ArrowRight } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface GameOverModalProps {
  score: number;
  solvedCount: number;
  onRestartAll: () => void;
  onRetryCheckpoint: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  solvedCount,
  onRestartAll,
  onRetryCheckpoint,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-rose-950 via-slate-900 to-black border-2 border-rose-600/70 rounded-3xl p-6 sm:p-8 shadow-2xl text-center text-amber-50">
        {/* Broken Heart Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/20 border-2 border-rose-500/60 flex items-center justify-center text-rose-500 mb-5 shadow-[0_0_25px_rgba(244,63,94,0.3)] animate-bounce">
          <HeartCrack className="w-10 h-10" />
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Expedition Halted!
        </h2>
        <p className="text-sm text-rose-200/90 mb-5 leading-relaxed">
          You have exhausted all 3 hearts. In engineering, every bug and failed run is just a step
          closer to the solution. Dust off your boots and try again!
        </p>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          <div className="p-3 rounded-xl bg-black/40 border border-rose-800/40">
            <span className="text-[11px] text-rose-300 block">Locations Cleared</span>
            <span className="font-mono text-xl font-bold text-white">{solvedCount} / 6</span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-rose-800/40">
            <span className="text-[11px] text-rose-300 block">Expedition Score</span>
            <span className="font-mono text-xl font-bold text-amber-300">{score} pts</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              onRetryCheckpoint();
            }}
            className="w-full py-3 px-4 rounded-xl font-display font-semibold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Revive at Current Island Checkpoint (+3 Lives)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onRestartAll();
            }}
            className="w-full py-2.5 px-4 rounded-xl font-display font-semibold text-xs text-rose-200 hover:text-white bg-white/5 hover:bg-white/10 border border-rose-800/40 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Expedition From The Beach</span>
          </button>
        </div>
      </div>
    </div>
  );
};
