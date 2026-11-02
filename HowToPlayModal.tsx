import React from 'react';
import { X, Heart, Lightbulb, MapPin, Trophy, ShieldCheck, Compass } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-amber-950 via-slate-900 to-black border-2 border-amber-600/70 rounded-3xl p-6 sm:p-8 shadow-2xl text-amber-50">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-amber-900/60 hover:bg-amber-800 text-amber-200 hover:text-white flex items-center justify-center border border-amber-700/50 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-amber-800/60 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-amber-100">
              Expedition Field Guide
            </h2>
            <p className="text-xs text-amber-300/80">
              How to navigate and solve Code Quest: The Treasure Hunt
            </p>
          </div>
        </div>

        {/* Guide Steps */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-200">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-900/20 border border-amber-800/40">
            <div className="w-7 h-7 rounded-lg bg-amber-500/30 text-amber-300 flex items-center justify-center font-bold shrink-0 text-xs">
              1
            </div>
            <div>
              <h3 className="font-semibold text-amber-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>6 Mystical Island Locations</span>
              </h3>
              <p className="text-slate-300 mt-1">
                Begin at the <strong>Beach</strong> and journey through the <strong>Jungle</strong>,{' '}
                <strong>Cave</strong>, <strong>Waterfall</strong>, <strong>Ancient Temple</strong>, and
                finally the <strong>Treasure Chamber</strong>. Each location is locked until you solve
                the prior clue.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-900/20 border border-amber-800/40">
            <div className="w-7 h-7 rounded-lg bg-amber-500/30 text-amber-300 flex items-center justify-center font-bold shrink-0 text-xs">
              2
            </div>
            <div>
              <h3 className="font-semibold text-amber-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>C Programming & Logic Puzzles</span>
              </h3>
              <p className="text-slate-300 mt-1">
                You will solve riddles about formatted I/O (<code className="text-amber-300 font-mono">printf</code>),
                predict loop outputs, click lines to identify syntax bugs, complete binary power
                sequences, and drag or tap arrows to assemble C programs.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-900/20 border border-amber-800/40">
            <div className="w-7 h-7 rounded-lg bg-amber-500/30 text-amber-300 flex items-center justify-center font-bold shrink-0 text-xs">
              3
            </div>
            <div>
              <h3 className="font-semibold text-amber-200 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>3 Lives (Hearts)</span>
              </h3>
              <p className="text-slate-300 mt-1">
                You begin with 3 hearts. Submitting an incorrect answer shakes the screen and costs
                1 heart. If you lose all 3 hearts, you will face the Try Again screen to restart
                the hunt!
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-900/20 border border-amber-800/40">
            <div className="w-7 h-7 rounded-lg bg-amber-500/30 text-amber-300 flex items-center justify-center font-bold shrink-0 text-xs">
              4
            </div>
            <div>
              <h3 className="font-semibold text-amber-200 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Hints, Relics & The Final Vault</span>
              </h3>
              <p className="text-slate-300 mt-1">
                Stuck? Hit the <strong>Hint</strong> button for advice (-50 points). Each solved clue
                awards a relic with a <strong>Secret Digit</strong>. At the Chamber, the game reminds
                you of all 4 digits so you can crack the final combination lock!
              </p>
            </div>
          </div>
        </div>

        {/* Start / Close Button */}
        <div className="mt-6 pt-4 border-t border-amber-800/60 flex justify-end">
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-display font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-amber-950 transition-colors shadow-md active:scale-95"
          >
            Ready to Explore!
          </button>
        </div>
      </div>
    </div>
  );
};
