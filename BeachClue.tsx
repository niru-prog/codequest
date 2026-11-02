import React, { useState } from 'react';
import { Lightbulb, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface BeachClueProps {
  onSolved: () => void;
  onWrongAnswer: () => void;
  onUseHint: () => void;
  isSolved: boolean;
}

export const BeachClue: React.FC<BeachClueProps> = ({
  onSolved,
  onWrongAnswer,
  onUseHint,
  isSolved,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(
    null
  );

  const options = [
    {
      id: 1,
      label: 'print("Hello, Explorer!");',
      desc: 'Used in Python and scripting languages.',
    },
    {
      id: 2,
      label: 'cout << "Hello, Explorer!" << endl;',
      desc: 'Used in C++ stream output.',
    },
    {
      id: 3,
      label: 'System.out.println("Hello, Explorer!");',
      desc: 'Used in Java standard console output.',
    },
    {
      id: 4,
      label: 'printf("Hello, Explorer!\\n");',
      desc: 'Standard C function from <stdio.h>.',
    },
  ];

  const handleSelect = (id: number) => {
    if (isSolved) return;
    soundEffects.playClick();
    setSelectedOption(id);
    setFeedback(null);
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
    if (isSolved || selectedOption === null) return;

    if (selectedOption === 4) {
      soundEffects.playSuccess();
      setFeedback({
        type: 'success',
        message: 'Correct! Option 4 is the iconic C printf() function!',
      });
      onSolved();
    } else {
      soundEffects.playError();
      setFeedback({
        type: 'error',
        message: 'Not quite! That function belongs to a different programming language.',
      });
      onWrongAnswer();
    }
  };

  return (
    <div className="bg-amber-950/40 border border-amber-800/60 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl text-amber-50">
      {/* Clue Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-800/50 pb-4 mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
            Clue 1 of 6 · Riddle of C Basics
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-amber-100">
            The Shoreline Inscription
          </h2>
        </div>

        <button
          type="button"
          onClick={handleHintClick}
          disabled={showHint}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
            showHint
              ? 'bg-amber-900/30 text-amber-400/60 border-amber-800/40 cursor-default'
              : 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border-amber-500/40'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>{showHint ? 'Hint Revealed (-50 pts)' : 'Need a Hint? (-50 pts)'}</span>
        </button>
      </div>

      {/* Riddle Poem Box */}
      <div className="bg-amber-900/30 border border-amber-700/40 rounded-xl p-4 mb-5 text-amber-100/90 italic text-sm sm:text-base leading-relaxed">
        <p className="font-serif">
          "I print your thoughts upon the screen,<br />
          The first true function you have seen.<br />
          With formatted strings I make things clear—<br />
          Which C function brings your output here?"
        </p>
      </div>

      {/* Hint Alert if opened */}
      {showHint && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Professor's Tip:</strong> Look closely at the standard I/O library{' '}
            <code className="text-amber-300 font-mono">&lt;stdio.h&gt;</code>. In C, we don't have
            bare <code className="text-amber-300 font-mono">print</code> like Python or{' '}
            <code className="text-amber-300 font-mono">cout</code> like C++; we use 'print
            formatted' ending with an <strong>'f'</strong>!
          </p>
        </div>
      )}

      {/* Options Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-3 mb-6">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                disabled={isSolved}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-amber-500/30 border-amber-400 text-white shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-black/20 hover:bg-black/30 border-amber-800/40 text-amber-100 hover:border-amber-600/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                      isSelected
                        ? 'bg-amber-400 text-amber-950'
                        : 'bg-amber-900/60 text-amber-200 border border-amber-700/50'
                    }`}
                  >
                    {opt.id}
                  </span>
                  <div>
                    <code className="text-sm sm:text-base font-mono font-semibold text-amber-100">
                      {opt.label}
                    </code>
                    <p className="text-xs text-amber-300/70 mt-0.5">{opt.desc}</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400 text-amber-950'
                      : 'border-amber-700/60'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-amber-950" />}
                </div>
              </button>
            );
          })}
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

        {/* Action Button */}
        {!isSolved && (
          <button
            type="submit"
            disabled={selectedOption === null}
            className="w-full py-3 px-6 rounded-xl font-display font-semibold text-sm sm:text-base bg-amber-500 hover:bg-amber-400 text-amber-950 transition-all shadow-lg hover:shadow-amber-500/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>Submit Beach Clue</span>
            <Send className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
};
