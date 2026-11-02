import React from 'react';
import { X, BookOpen, Key, Check } from 'lucide-react';
import { LOCATIONS } from '../data/locations';
import { soundEffects } from '../utils/audio';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  solvedLocations: string[];
}

export const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  onClose,
  solvedLocations,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-gradient-to-b from-amber-950 via-slate-900 to-black border-2 border-amber-600/70 rounded-3xl p-6 shadow-2xl text-amber-50">
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

        <div className="flex items-center gap-3 mb-5 border-b border-amber-800/60 pb-3">
          <BookOpen className="w-6 h-6 text-amber-400" />
          <div>
            <h2 className="font-display text-xl font-bold text-amber-100">
              Explorer's Clue Journal
            </h2>
            <p className="text-xs text-amber-300/80">
              Secrets and digits gathered for the 4-digit Chamber lock
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {LOCATIONS.slice(0, 5).map((loc) => {
            const isSolved = solvedLocations.includes(loc.id);
            return (
              <div
                key={loc.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                  isSolved
                    ? 'bg-amber-900/30 border-amber-500/50 text-amber-100'
                    : 'bg-black/30 border-dashed border-amber-900/50 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl shrink-0">
                    {isSolved ? loc.itemReward.icon : '❓'}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-amber-200">
                      {loc.name} {isSolved ? `(${loc.itemReward.name})` : '(Undiscovered)'}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {isSolved
                        ? loc.itemReward.digitClue
                        : 'Explore this location to decipher its secret.'}
                    </p>
                  </div>
                </div>

                {isSolved && loc.itemReward.digitValue !== undefined && (
                  <div className="px-2.5 py-1 rounded-lg bg-amber-500 text-amber-950 font-mono font-extrabold text-sm shrink-0">
                    {loc.itemReward.digitValue}
                  </div>
                )}
                {isSolved && loc.itemReward.digitValue === undefined && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/30 border border-emerald-400 text-emerald-300 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 p-3 rounded-xl bg-amber-900/20 border border-amber-800/40 text-xs text-amber-200/90 text-center">
          Assemble the 4 secret digits in order at the final Treasure Chamber to open the vault!
        </div>
      </div>
    </div>
  );
};
