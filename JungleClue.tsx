import React, { useState } from 'react';
import { Lightbulb, Send, CheckCircle2, AlertCircle, Terminal } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface JungleClueProps {
  onSolved: () => void;
  onWrongAnswer: () => void;
  onUseHint: () => void;
  isSolved: boolean;
}

export const JungleClue: React.FC<JungleClueProps> = ({
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
    if (trimmed === '7') {
      soundEffects.playSuccess();
      setFeedback({
        type: 'success',
        message: 'Spot on! The loop executes exactly 7 times, so total = 7!',
      });
      onSolved();
    } else {
      soundEffects.playError();
      setFeedback({
        type: 'error',
        message: `Output "${trimmed}" is incorrect. Walk through the loop bounds carefully!`,
      });
      onWrongAnswer();
    }
  };

  return (
    <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl text-emerald-50">
      {/* Clue Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/50 pb-4 mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Clue 2 of 6 · Predict The Output
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-emerald-100">
            The Canopy Loop Terminal
          </h2>
        </div>

        <button
          type="button"
          onClick={handleHintClick}
          disabled={showHint}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
            showHint
              ? 'bg-emerald-900/30 text-emerald-400/60 border-emerald-800/40 cursor-default'
              : 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 border-emerald-500/40'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
          <span>{showHint ? 'Hint Revealed (-50 pts)' : 'Need a Hint? (-50 pts)'}</span>
        </button>
      </div>

      <p className="text-sm text-emerald-200/90 mb-4">
        Deep in the foliage, an ancient terminal hums with glowing phosphor. Predict what this C
        loop prints to standard output:
      </p>

      {/* Code Editor Style Box */}
      <div className="rounded-xl overflow-hidden border border-emerald-700/50 bg-[#0d1117] shadow-lg mb-5">
        <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-emerald-800/40 text-xs font-mono text-emerald-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>jungle_loop.c</span>
          </div>
          <span className="text-[11px] text-slate-400">C (GCC 12)</span>
        </div>

        <div className="p-4 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-200">
          <div className="flex">
            <span className="w-6 shrink-0 text-slate-500 select-none">1</span>
            <span><span className="text-purple-400">#include</span> <span className="text-amber-300">&lt;stdio.h&gt;</span></span>
          </div>
          <div className="flex">
            <span className="w-6 shrink-0 text-slate-500 select-none">2</span>
            <span><span className="text-blue-400">int</span> <span className="text-yellow-200">main</span>() &#123;</span>
          </div>
          <div className="flex">
            <span className="w-6 shrink-0 text-slate-500 select-none">3</span>
            <span className="pl-4"><span className="text-blue-400">int</span> total = <span className="text-orange-400">0</span>;</span>
          </div>
          <div className="flex bg-emerald-500/10 -mx-4 px-4 py-0.5 rounded">
            <span className="w-6 shrink-0 text-emerald-400 font-bold select-none">4</span>
            <span className="pl-4"><span className="text-purple-400">for</span> (<span className="text-blue-400">int</span> step = <span className="text-orange-400">1</span>; step &lt;= <span className="text-orange-400">7</span>; step++) &#123;</span>
          </div>
          <div className="flex">
            <span className="w-6 shrink-0 text-slate-500 select-none">5</span>
            <span className="pl-8">total = total + <span className="text-orange-400">1</span>;</span>
          </div>
          <div className="flex">
            <span className="w-6 shrink-0 text-slate-500 select-none">6</span>
            <span className="pl-4">&#125;</span>
          </div>
          <div className="flex">
            <span className="w-6 shrink-0 text-slate-500 select-none">7</span>
            <span className="pl-4"><span className="text-yellow-200">printf</span>(<span className="text-green-300">"%d"</span>, total);</span>
          </div>
          <div className="flex">
            <span className="w-6 shrink-0 text-slate-500 select-none">8</span>
            <span className="pl-4"><span className="text-purple-400">return</span> <span className="text-orange-400">0</span>;</span>
          </div>
          <div className="flex">
            <span className="w-6 shrink-0 text-slate-500 select-none">9</span>
            <span>&#125;</span>
          </div>
        </div>
      </div>

      {/* Hint Alert if opened */}
      {showHint && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Professor's Tip:</strong> Trace the loop values of{' '}
            <code className="text-amber-300 font-mono">step</code>:{' '}
            <code className="text-amber-300 font-mono">1, 2, 3, 4, 5, 6, 7</code>. The condition is{' '}
            <code className="text-amber-300 font-mono">step &lt;= 7</code>. When{' '}
            <code className="text-amber-300 font-mono">step</code> increments to 8, the loop
            stops!
          </p>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="jungle-output-input" className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
            Console Output (What does printf print?)
          </label>
          <div className="flex gap-2">
            <input
              id="jungle-output-input"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={userGuess}
              onChange={(e) => {
                setUserGuess(e.target.value);
                setFeedback(null);
              }}
              disabled={isSolved}
              placeholder="Type printed number..."
              className="flex-1 bg-black/40 border border-emerald-700/60 rounded-xl px-4 py-3 font-mono text-lg text-emerald-100 placeholder:text-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            />
            {!isSolved && (
              <button
                type="submit"
                disabled={!userGuess.trim()}
                className="px-5 py-3 rounded-xl font-display font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 text-emerald-950 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
              >
                <span>Submit</span>
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Digit Selector Buttons for Touch Convenience */}
          {!isSolved && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              <span className="text-[11px] text-emerald-300/70 whitespace-nowrap">Quick Pick:</span>
              {[0, 1, 6, 7, 8, 14].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setUserGuess(num.toString());
                    setFeedback(null);
                  }}
                  className="px-3 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 rounded-lg text-xs font-mono font-bold transition-colors"
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
