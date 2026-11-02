import React, { useState } from 'react';
import { Lightbulb, Send, CheckCircle2, AlertCircle, Bug } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface CaveClueProps {
  onSolved: () => void;
  onWrongAnswer: () => void;
  onUseHint: () => void;
  isSolved: boolean;
}

interface CodeLine {
  lineNum: number;
  content: string;
  hasBug: boolean;
  indent: string;
}

export const CaveClue: React.FC<CaveClueProps> = ({
  onSolved,
  onWrongAnswer,
  onUseHint,
  isSolved,
}) => {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(
    null
  );

  const codeLines: CodeLine[] = [
    { lineNum: 1, content: '#include <stdio.h>', hasBug: false, indent: '' },
    { lineNum: 2, content: 'int main(void) {', hasBug: false, indent: '' },
    { lineNum: 3, content: '    int torches = 3', hasBug: true, indent: 'pl-4' },
    { lineNum: 4, content: '    printf("Torches lit: %d\\n", torches);', hasBug: false, indent: 'pl-4' },
    { lineNum: 5, content: '    return 0;', hasBug: false, indent: 'pl-4' },
    { lineNum: 6, content: '}', hasBug: false, indent: '' },
  ];

  const handleLineClick = (lineNum: number) => {
    if (isSolved) return;
    soundEffects.playClick();
    setSelectedLine(lineNum);
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
    if (isSolved || selectedLine === null) return;

    if (selectedLine === 3) {
      soundEffects.playSuccess();
      setFeedback({
        type: 'success',
        message: 'Bingo! Line 3 is missing a semicolon (;) at the end of the declaration!',
      });
      onSolved();
    } else {
      soundEffects.playError();
      const reasons: Record<number, string> = {
        1: 'Line 1 is a valid preprocessor header directive.',
        2: 'Line 2 correctly defines main() returning an int.',
        4: 'Line 4 correctly uses printf with the %d format specifier.',
        5: 'Line 5 correctly returns status code 0.',
        6: 'Line 6 properly closes the function body.',
      };
      setFeedback({
        type: 'error',
        message: reasons[selectedLine] || `Line ${selectedLine} has no syntax error. Look closer at punctuation!`,
      });
      onWrongAnswer();
    }
  };

  return (
    <div className="bg-slate-950/50 border border-slate-700/60 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl text-slate-100">
      {/* Clue Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-4 mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">
            Clue 3 of 6 · Find The Bug
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
            The Crystal Cavern Debugger
          </h2>
        </div>

        <button
          type="button"
          onClick={handleHintClick}
          disabled={showHint}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
            showHint
              ? 'bg-slate-900/40 text-slate-400 border-slate-700 cursor-default'
              : 'bg-sky-500/20 text-sky-200 hover:bg-sky-500/30 border-sky-500/40'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-sky-400" />
          <span>{showHint ? 'Hint Revealed (-50 pts)' : 'Need a Hint? (-50 pts)'}</span>
        </button>
      </div>

      <p className="text-sm text-slate-300 mb-4">
        Shadows dance across stalactites in the cave. A glowing inscription is riddled with a fatal
        syntax error. <strong>Click the line containing the bug</strong> to debug the program:
      </p>

      {/* Interactive Code Line Selector */}
      <div className="rounded-xl overflow-hidden border border-slate-700 bg-[#0b0f19] shadow-inner mb-5">
        <div className="flex items-center justify-between px-4 py-2 bg-[#131c2e] border-b border-slate-800 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <Bug className="w-3.5 h-3.5 text-rose-400" />
            <span>cave_debug.c</span>
          </div>
          <span className="text-[11px] text-slate-400">Click a line to flag error</span>
        </div>

        <div className="p-2 divide-y divide-slate-800/40 font-mono text-xs sm:text-sm">
          {codeLines.map((line) => {
            const isSelected = selectedLine === line.lineNum;
            return (
              <button
                key={line.lineNum}
                type="button"
                onClick={() => handleLineClick(line.lineNum)}
                disabled={isSolved}
                className={`w-full text-left py-2 px-3 rounded-lg flex items-center gap-3 transition-colors ${
                  isSelected
                    ? 'bg-rose-500/25 border border-rose-400/80 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                    : 'hover:bg-slate-800/50 text-slate-200 border border-transparent'
                }`}
              >
                <span
                  className={`w-6 shrink-0 text-center text-xs font-bold font-mono ${
                    isSelected ? 'text-rose-400' : 'text-slate-500'
                  }`}
                >
                  {line.lineNum}
                </span>

                <span className="flex-1 whitespace-pre">{line.content}</span>

                {isSelected && (
                  <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded bg-rose-500 text-white flex items-center gap-1 shrink-0">
                    <Bug className="w-3 h-3" />
                    <span>Bug Flagged</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hint Alert if opened */}
      {showHint && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Professor's Tip:</strong> Inspect the end of each line very carefully. In C,
            what essential punctuation character terminates variable definitions and statements?
          </p>
        </div>
      )}

      {/* Submit Section */}
      <form onSubmit={handleSubmit}>
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

        {!isSolved && (
          <button
            type="submit"
            disabled={selectedLine === null}
            className="w-full py-3 px-6 rounded-xl font-display font-semibold text-sm sm:text-base bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>Confirm Buggy Line {selectedLine !== null ? `(${selectedLine})` : ''}</span>
            <Send className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
};
