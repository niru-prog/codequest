import React, { useState } from 'react';
import { Lightbulb, Send, CheckCircle2, AlertCircle, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface TempleClueProps {
  onSolved: () => void;
  onWrongAnswer: () => void;
  onUseHint: () => void;
  isSolved: boolean;
}

interface ProgramLine {
  id: string;
  code: string;
  correctIndex: number;
}

export const TempleClue: React.FC<TempleClueProps> = ({
  onSolved,
  onWrongAnswer,
  onUseHint,
  isSolved,
}) => {
  // Correct order is:
  // 0: #include <stdio.h>
  // 1: int main(void) {
  // 2:     printf("Temple gate unlocked!\n");
  // 3:     return 0;
  const initialLines: ProgramLine[] = [
    { id: 'c', code: '    printf("Temple gate unlocked!\\n");', correctIndex: 2 },
    { id: 'a', code: '#include <stdio.h>', correctIndex: 0 },
    { id: 'd', code: '    return 0;', correctIndex: 3 },
    { id: 'b', code: 'int main(void) {', correctIndex: 1 },
  ];

  const [lines, setLines] = useState<ProgramLine[]>(initialLines);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
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

  const moveLine = (fromIndex: number, toIndex: number) => {
    if (isSolved || toIndex < 0 || toIndex >= lines.length) return;
    soundEffects.playClick();
    const updated = [...lines];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setLines(updated);
    setFeedback(null);
  };

  // Drag & drop handlers
  const handleDragStart = (index: number) => {
    if (isSolved) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index || isSolved) return;
    moveLine(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSolved) return;

    // Check if lines are in order 0, 1, 2, 3
    const isCorrect = lines.every((line, idx) => line.correctIndex === idx);

    if (isCorrect) {
      soundEffects.playSuccess();
      setFeedback({
        type: 'success',
        message: 'Masterful! The C program structure is perfectly assembled!',
      });
      onSolved();
    } else {
      soundEffects.playError();
      setFeedback({
        type: 'error',
        message:
          'The order is not yet valid. Remember: Headers first, then main(), then statements, then return 0!',
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
            Clue 5 of 6 · C Program Architecture
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-amber-100">
            The Runestone Code Reordering
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

      <p className="text-sm text-amber-200/90 mb-4">
        Carved stone slabs have fallen from the ancient temple doorway. <strong>Drag</strong> or use
        the <strong>▲ / ▼ arrows</strong> to arrange the lines in valid C program order:
      </p>

      {/* Hint Alert if opened */}
      {showHint && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Professor's Tip:</strong> In C, execution follows a clear sequence:
            <br />
            1. Preprocessor headers (<code className="text-amber-300 font-mono">#include &lt;stdio.h&gt;</code>)
            <br />
            2. Program entry point (<code className="text-amber-300 font-mono">int main(void) &#123;</code>)
            <br />
            3. Executable body statements (<code className="text-amber-300 font-mono">printf(...)</code>)
            <br />
            4. Exit code return (<code className="text-amber-300 font-mono">return 0;</code>)
          </p>
        </div>
      )}

      {/* Reorderable Code Lines List */}
      <div className="space-y-2.5 mb-6">
        {lines.map((line, idx) => {
          const isCurrentDragging = draggedIndex === idx;

          return (
            <div
              key={line.id}
              draggable={!isSolved}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                isCurrentDragging
                  ? 'bg-amber-500/30 border-amber-400 scale-[1.02] shadow-xl'
                  : 'bg-black/40 hover:bg-black/50 border-amber-800/50 text-slate-100'
              }`}
            >
              {/* Left Drag Grip & Line Number */}
              <div className="flex items-center gap-2.5">
                <div
                  className="cursor-grab active:cursor-grabbing p-1 text-amber-400/60 hover:text-amber-300 transition-colors"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </div>
                <span className="w-6 h-6 rounded-md bg-amber-900/60 text-amber-300 flex items-center justify-center font-mono text-xs font-bold border border-amber-700/50">
                  {idx + 1}
                </span>
                <code className="font-mono text-xs sm:text-sm font-medium text-amber-100">
                  {line.code}
                </code>
              </div>

              {/* Mobile / Touch-friendly Reordering Buttons */}
              {!isSolved && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveLine(idx, idx - 1)}
                    disabled={idx === 0}
                    title="Move line up"
                    aria-label={`Move line ${idx + 1} up`}
                    className="w-8 h-8 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 disabled:opacity-30 disabled:pointer-events-none border border-amber-700/50 flex items-center justify-center transition-colors"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveLine(idx, idx + 1)}
                    disabled={idx === lines.length - 1}
                    title="Move line down"
                    aria-label={`Move line ${idx + 1} down`}
                    className="w-8 h-8 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 disabled:opacity-30 disabled:pointer-events-none border border-amber-700/50 flex items-center justify-center transition-colors"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Closing brace static element */}
        <div className="p-2.5 rounded-xl border border-dashed border-amber-900/50 bg-black/20 text-slate-400 font-mono text-xs sm:text-sm flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-amber-950/40 text-slate-500 flex items-center justify-center font-mono text-xs">
            5
          </span>
          <span>&#125; <span className="text-[11px] text-amber-400/50 italic">// Closing brace of main()</span></span>
        </div>
      </div>

      {/* Form Submission */}
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
            className="w-full py-3 px-6 rounded-xl font-display font-semibold text-sm sm:text-base bg-amber-500 hover:bg-amber-400 text-amber-950 transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>Lock In Temple Code Order</span>
            <Send className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
};
