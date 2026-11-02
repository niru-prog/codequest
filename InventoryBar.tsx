import React from 'react';
import { LOCATIONS } from '../data/locations';
import { Sparkles, Lock, BookOpen } from 'lucide-react';

interface InventoryBarProps {
  solvedLocations: string[];
  onOpenJournal?: () => void;
}

export const InventoryBar: React.FC<InventoryBarProps> = ({
  solvedLocations,
  onOpenJournal,
}) => {
  // Only the 5 clue locations reward physical lock relics
  const relicLocations = LOCATIONS.slice(0, 5);

  return (
    <div className="w-full bg-amber-900/40 border border-amber-800/60 rounded-2xl p-3 sm:p-4 backdrop-blur-sm shadow-inner">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-amber-200">
            Explorer's Inventory & Relics
          </h2>
          <span className="text-xs text-amber-300/70 font-mono">
            ({solvedLocations.length}/5 Found)
          </span>
        </div>

        {onOpenJournal && (
          <button
            onClick={onOpenJournal}
            className="self-start sm:self-auto flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-200 hover:text-white bg-amber-800/40 hover:bg-amber-800/80 border border-amber-700/50 rounded-lg transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>View Clue Journal</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {relicLocations.map((loc) => {
          const isCollected = solvedLocations.includes(loc.id);
          const { itemReward } = loc;

          return (
            <div
              key={loc.id}
              className={`relative group rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center transition-all duration-300 border ${
                isCollected
                  ? 'bg-gradient-to-b from-amber-500/20 to-amber-700/20 border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-black/20 border-dashed border-amber-900/60 opacity-60'
              }`}
            >
              {/* Item Icon */}
              <div className="text-2xl sm:text-3xl my-1 relative transition-transform group-hover:scale-110">
                {isCollected ? (
                  itemReward.icon
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-950/40 flex items-center justify-center text-amber-500/50">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Item Label */}
              <span className="text-[10px] sm:text-xs font-semibold text-amber-100 truncate max-w-full">
                {isCollected ? itemReward.name.split(' ')[0] : 'Locked'}
              </span>

              {/* Digit Badge if collected */}
              {isCollected && itemReward.digitValue !== undefined && (
                <div className="mt-1 px-1.5 py-0.5 rounded bg-amber-500 text-amber-950 text-[10px] sm:text-xs font-mono font-bold">
                  Digit: {itemReward.digitValue}
                </div>
              )}

              {isCollected && itemReward.digitValue === undefined && (
                <div className="mt-1 px-1.5 py-0.5 rounded bg-emerald-500/80 text-emerald-950 text-[10px] sm:text-xs font-mono font-bold">
                  Key Gem
                </div>
              )}

              {/* Hover tooltip for clue detail */}
              {isCollected && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-slate-900 text-slate-100 text-[11px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 border border-amber-500/40">
                  <p className="font-semibold text-amber-300">{itemReward.name}</p>
                  <p className="text-slate-300 mt-0.5">{itemReward.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
