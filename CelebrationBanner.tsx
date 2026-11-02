import React from 'react';
import { Sparkles, ArrowRight, BookCheck } from 'lucide-react';
import { LocationInfo } from '../types/game';

interface CelebrationBannerProps {
  location: LocationInfo;
  explanation: {
    headline: string;
    concept: string;
  };
  isLastLocation: boolean;
  onContinue: () => void;
}

export const CelebrationBanner: React.FC<CelebrationBannerProps> = ({
  location,
  explanation,
  isLastLocation,
  onContinue,
}) => {
  return (
    <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/80 to-teal-950/80 border-2 border-emerald-500/60 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md text-emerald-50 my-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          {/* Animated Item Badge */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/80 flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0 animate-bounce">
            {location.itemReward.icon}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                Location Cleared · Item Recovered!
              </span>
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-white">
              {explanation.headline}
            </h3>

            {/* Educational takeaway */}
            <div className="mt-2 text-xs sm:text-sm text-emerald-100/90 flex items-start gap-2 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-700/40">
              <BookCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong>Engineering Concept:</strong> {explanation.concept}
              </p>
            </div>

            {location.itemReward.digitValue !== undefined && (
              <p className="mt-2 text-xs font-mono text-amber-300 font-semibold">
                Secret Digit Recovered: [{location.itemReward.digitValue}] — Noted in your journal!
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full md:w-auto px-6 py-3 rounded-xl font-display font-bold text-sm sm:text-base bg-emerald-400 hover:bg-emerald-300 text-emerald-950 transition-all shadow-lg hover:shadow-emerald-400/20 active:scale-95 flex items-center justify-center gap-2 shrink-0"
        >
          <span>{isLastLocation ? 'Open Treasure Vault' : 'Next Island Clue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
