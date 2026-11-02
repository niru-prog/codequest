import React, { useState } from 'react';
import { Lightbulb, KeyRound, CheckCircle2, AlertCircle, ChevronUp, ChevronDown, BookOpen } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface ChamberClueProps {
  onSolved: () => void;
  onWrongAnswer: () => void;
  onUseHint: () => void;
  isSolved: boolean;
}

export const ChamberClue: React.FC<ChamberClueProps> = ({
  onSolved,
  onWrongAnswer,
  onUseHint,
  isSolved,
}) => {
  // 4 digits: 4 - 7 - 3 - 8
  const [digits, setDigits] = useState<number[]>([0, 0, 0, 0]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(
    null
  );

  const clueReminders = [
    {
      pos: '1st Digit',
      location: 'Beach',
      icon: '🐚',
      item: 'Sea Shell',
      desc: 'Option number of printf()',
      correctDigit: 4,
    },
    {
      pos: '2nd Digit',
      location: 'Jungle',
      icon: '🗺️',
      item: 'Map Piece',
      desc: 'Loop iteration output count',
      correctDigit: 7,
    },
    {
      pos: '3rd Digit',
      location: 'Cave',
      icon: '🔥',
      item: 'Torch',
      desc: 'Line number missing a semicolon',
      correctDigit: 3,
    },
    {
      pos: '4th Digit',
      location: 'Waterfall',
      icon: '🗝️',
      item: 'Key',
      desc: 'Missing binary power (2³)',
      correctDigit: 8,
    },
  ];

  const handleAdjustDigit = (index: number, delta: number) => {
    if (isSolved) return;
    soundEffects.playClick();
    setDigits((prev) => {
      const next = [...prev];
      next[index] = (next[index] + delta + 10) % 10;
      return next;
    });
    setFeedback(null);
  };

  const handleSetDirect = (index: number, val: string) => {
    if (isSolved) return;
    const num = parseInt(val.slice(-1), 10);
    if (!isNaN(num)) {
      soundEffects.playClick();
      setDigits((prev) => {
        const next = [...prev];
        next[index] = num;
        return next;
      });
      setFeedback(null);
    }
  };

  const handleHintClick = () => {
    if (!showHint) {
      soundEffects.playHint();
      setShowHint(true);
      onUseHint();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSolved) return;

    const enteredCode = digits.join('');
    if (enteredCode === '4738') {
      soundEffects.playUnlock();
      setFeedback({
        type: 'success',
        message: 'The mechanical tumblers align! The Vault of Knowledge opens!',
      });
      onSolved();
    } else {
      soundEffects.playError();
      setFeedback({
        type: 'error',
        message: `Combination ${digits.join(' ')} failed to turn the gears. Check your journal notes!`,
      });
      onWrongAnswer();
    }
  };

  return (
    <div className="bg-amber-950/60 border border-amber-600/60 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-2xl text-amber-50">
      {/* Clue Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-800/60 pb-4 mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
            Final Clue 6 of 6 · The Vault Combination Lock
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-amber-100 flex items-center gap-2">
            <span>The Master Engineer's Chamber</span>
            <KeyRound className="w-5 h-5 text-amber-400" />
          </h2>
        </div>

        <button
          type="button"
          onClick={handleHintClick}
          disabled={showHint}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
            showHint
              ? 'bg-amber-900/40 text-amber-400/60 border-amber-800/40 cursor-default'
              : 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border-amber-500/40'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>{showHint ? 'Hint Revealed (-50 pts)' : 'Need a Hint? (-50 pts)'}</span>
        </button>
      </div>

      <p className="text-sm text-amber-200/90 mb-5">
        Before you stands the grand vault door secured with a 4-digit code lock. The lock requires
        the 4 secret digits you discovered on your voyage across the island!
      </p>

      {/* Clue Reminders / Explorer Journal Card */}
      <div className="mb-6 p-4 rounded-xl bg-black/40 border border-amber-700/50 shadow-inner">
        <div className="flex items-center gap-2 mb-3 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Explorer's Journal: Recovered Clues</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {clueReminders.map((rem, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-amber-900/30 border border-amber-800/60 flex items-start gap-2.5"
            >
              <span className="text-xl shrink-0">{rem.icon}</span>
              <div>
                <span className="text-[11px] font-bold text-amber-300 block">{rem.pos}</span>
                <p className="text-xs font-medium text-amber-100">{rem.location}: {rem.item}</p>
                <p className="text-[11px] text-amber-200/70 mt-0.5">{rem.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hint Alert if opened */}
      {showHint && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Professor's Tip:</strong> Re-examine the 4 answers you unlocked:
            <br />
            Digit 1: Beach riddle printf was Option <strong>4</strong>
            <br />
            Digit 2: Jungle loop ran 7 times = <strong>7</strong>
            <br />
            Digit 3: Cave syntax error was on Line <strong>3</strong>
            <br />
            Digit 4: Waterfall binary power missing was <strong>8</strong>
          </p>
        </div>
      )}

      {/* 4-Digit Mechanical Tumbler Dials */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="bg-black/50 border-2 border-amber-600/70 p-4 sm:p-6 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.2)] mb-6">
          <div className="text-center text-xs font-mono font-bold tracking-widest text-amber-400 uppercase mb-4">
            Combination Lock Dial
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-6">
            {digits.map((digit, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {/* Up button */}
                <button
                  type="button"
                  onClick={() => handleAdjustDigit(idx, 1)}
                  disabled={isSolved}
                  aria-label={`Increment digit ${idx + 1}`}
                  className="w-10 h-8 sm:w-12 sm:h-9 rounded-t-lg bg-amber-800/60 hover:bg-amber-700 text-amber-200 border border-amber-600/60 flex items-center justify-center transition-colors active:scale-95 disabled:opacity-40"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>

                {/* Digit Display / Input Box */}
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleSetDirect(idx, e.target.value)}
                  disabled={isSolved}
                  aria-label={`Digit ${idx + 1}`}
                  className="w-12 h-16 sm:w-16 sm:h-20 text-center font-mono text-3xl sm:text-4xl font-extrabold bg-gradient-to-b from-slate-900 to-black text-amber-300 border-x-2 border-y border-amber-500/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400 select-all"
                />

                {/* Down button */}
                <button
                  type="button"
                  onClick={() => handleAdjustDigit(idx, -1)}
                  disabled={isSolved}
                  aria-label={`Decrement digit ${idx + 1}`}
                  className="w-10 h-8 sm:w-12 sm:h-9 rounded-b-lg bg-amber-800/60 hover:bg-amber-700 text-amber-200 border border-amber-600/60 flex items-center justify-center transition-colors active:scale-95 disabled:opacity-40"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`w-full max-w-md mb-5 p-3.5 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/60 border border-rose-500/40 text-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {!isSolved && (
          <button
            type="submit"
            className="w-full max-w-md py-3.5 px-6 rounded-xl font-display font-bold text-base sm:text-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <KeyRound className="w-5 h-5" />
            <span>Turn Combination Lock</span>
          </button>
        )}
      </form>
    </div>
  );
};
