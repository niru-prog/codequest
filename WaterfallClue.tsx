import React, { useState } from 'react';
import { Lightbulb, Send, CheckCircle2, AlertCircle, Binary, Waves } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface WaterfallClueProps {
  onSolved: () => void;
  onWrongAnswer: () => void;
  onUseHint: () => void;
  isSolved: boolean;
}

export const WaterfallClue: React.FC<WaterfallClueProps> = ({
  onSolved,
  onWrongAnswer,
  onUseHint,
  isSolved,
}) => {
  const [userGuess, setUserGuess] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(
    null
  );

  const handleHintClick = () => {
    if (!showHint) {
      soundEffects.playHint();
      setShowHint(true);
      onUseHint();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSolved || !userGuess.trim()) return;

    const trimmed = userGuess.trim();
    if (trimmed === '8') {
      soundEffects.playSuccess();
      setFeedback({
        type: 'success',
        message: 'Brilliant! 8 completes the binary sequence (2³ = 8)!',
      });
      onSolved();
    } else {
      soundEffects.playError();
      setFeedback({
        type: 'error',
        message: `Value "${trimmed}" does not fit the sequence. Notice how each number doubles!`,
      });
      onWrongAnswer();
    }
  };

  const sequence = [
    { val: '1', note: '2⁰' },
    { val: '2', note: '2¹' },
    { val: '4', note: '2²' },
    { val: '?', note: '2³', isMissing: true },
    { val: '16', note: '2⁴' },
    { val: '32', note: '2⁵' },
  ];

  return (
    <div className="bg-sky-950/40 border border-sky-800/60 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl text-sky-50">
      {/* Clue Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-800/50 pb-4 mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">
            Clue 4 of 6 · Binary Logic Pattern
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-sky-100">
            The Cascading Bit Stream
          </h2>
        </div>

        <button
          type="button"
          onClick={handleHintClick}
          disabled={showHint}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
            showHint
              ? 'bg-sky-900/30 text-sky-400/60 border-sky-800/40 cursor-default'
              : 'bg-sky-500/20 text-sky-200 hover:bg-sky-500/30 border-sky-500/40'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-sky-400" />
          <span>{showHint ? 'Hint Revealed (-50 pts)' : 'Need a Hint? (-50 pts)'}</span>
        </button>
      </div>

      <p className="text-sm text-sky-200/90 mb-5">
        The crystal river plunges over the cliff in harmonic droplets. Engraved on the wet bedrock is
        a sequence of binary powers:
      </p>

      {/* Visual Pattern Stepping Stones */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3 mb-6">
        {sequence.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-3 flex flex-col items-center justify-center text-center border transition-all ${
              item.isMissing
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse'
                : 'bg-sky-900/40 border-sky-700/50 text-sky-100'
            }`}
          >
            <Waves className="w-4 h-4 text-sky-400/70 mb-1" />
            <span
              className={`font-mono text-xl sm:text-2xl font-extrabold ${
                item.isMissing ? 'text-amber-300' : 'text-sky-100'
              }`}
            >
              {item.isMissing && isSolved ? '8' : item.val}
            </span>
            <span className="text-[10px] font-mono text-sky-300/60 mt-1">{item.note}</span>
          </div>
        ))}
      </div>

      {/* Hint Alert if opened */}
      {showHint && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Professor's Tip:</strong> Notice how each number doubles the one before it:{' '}
            <code className="text-amber-300 font-mono">1 × 2 = 2</code>,{' '}
            <code className="text-amber-300 font-mono">2 × 2 = 4</code>. What is{' '}
            <code className="text-amber-300 font-mono">4 × 2</code>?
          </p>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="waterfall-pattern-input" className="block text-xs font-semibold text-sky-300 uppercase tracking-wider mb-2">
            Complete The Missing Number [ ? ]
          </label>
          <div className="flex gap-2">
            <input
              id="waterfall-pattern-input"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={userGuess}
              onChange={(e) => {
                setUserGuess(e.target.value);
                setFeedback(null);
              }}
              disabled={isSolved}
              placeholder="Enter missing number..."
              className="flex-1 bg-black/40 border border-sky-700/60 rounded-xl px-4 py-3 font-mono text-lg text-sky-100 placeholder:text-sky-700 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
            {!isSolved && (
              <button
                type="submit"
                disabled={!userGuess.trim()}
                className="px-5 py-3 rounded-xl font-display font-semibold text-sm bg-sky-500 hover:bg-sky-400 text-sky-950 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
              >
                <span>Submit</span>
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Choice Buttons */}
          {!isSolved && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              <span className="text-[11px] text-sky-300/70 whitespace-nowrap">Options:</span>
              {[6, 8, 10, 12, 14].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setUserGuess(num.toString());
                    setFeedback(null);
                  }}
                  className="px-3.5 py-1 bg-sky-900/60 hover:bg-sky-800 text-sky-200 border border-sky-700/50 rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`mb-5 p-3.5 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium ${
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
      </form>
    </div>
  );
};
