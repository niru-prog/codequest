/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LocationId, GameStatus } from './types/game';
import { LOCATIONS } from './data/locations';
import { TopBar } from './components/TopBar';
import { IslandMap } from './components/IslandMap';
import { InventoryBar } from './components/InventoryBar';
import { StartScreen } from './components/StartScreen';
import { BeachClue } from './components/clues/BeachClue';
import { JungleClue } from './components/clues/JungleClue';
import { CaveClue } from './components/clues/CaveClue';
import { WaterfallClue } from './components/clues/WaterfallClue';
import { TempleClue } from './components/clues/TempleClue';
import { ChamberClue } from './components/clues/ChamberClue';
import { CelebrationBanner } from './components/CelebrationBanner';
import { VictoryScreen } from './components/VictoryScreen';
import { HowToPlayModal } from './components/HowToPlayModal';
import { GameOverModal } from './components/GameOverModal';
import { JournalModal } from './components/JournalModal';
import { soundEffects } from './utils/audio';
import {
  getStoredBestScore,
  saveBestScore,
  getStoredAudioMuted,
  saveAudioMuted,
} from './utils/storage';

export default function App() {
  // Game State
  const [gameStatus, setGameStatus] = useState<GameStatus>('START_SCREEN');
  const [currentLocationId, setCurrentLocationId] = useState<LocationId>('beach');
  const [solvedLocations, setSolvedLocations] = useState<LocationId[]>([]);
  const [hearts, setHearts] = useState<number>(3);
  const [score, setScore] = useState<number>(1000);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // UI Modals & Interaction States
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize best score and muted preference from localStorage
  useEffect(() => {
    const savedBest = getStoredBestScore();
    setBestScore(savedBest);

    const savedMuted = getStoredAudioMuted();
    setIsMuted(savedMuted);
    soundEffects.setMuted(savedMuted);
  }, []);

  // Timer management
  useEffect(() => {
    if (gameStatus === 'PLAYING' || gameStatus === 'LOCATION_SOLVED') {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus]);

  // Audio mute toggle
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
    saveAudioMuted(nextMuted);
  };

  // Start new game
  const handleStartGame = () => {
    setGameStatus('PLAYING');
    setCurrentLocationId('beach');
    setSolvedLocations([]);
    setHearts(3);
    setScore(1000);
    setTimeElapsed(0);
    setHintsUsed(0);
    setWrongAttempts(0);
    setIsNewRecord(false);
    setShowCelebration(false);
  };

  // Trigger shake animation & heart decrement on wrong answer
  const handleWrongAnswer = () => {
    setIsShaking(true);
    setWrongAttempts((prev) => prev + 1);
    setScore((prev) => Math.max(0, prev - 30));

    setTimeout(() => {
      setIsShaking(false);
    }, 500);

    setHearts((prevHearts) => {
      const nextHearts = prevHearts - 1;
      if (nextHearts <= 0) {
        setGameStatus('GAME_OVER');
        setIsGameOverOpen(true);
        return 0;
      }
      return nextHearts;
    });
  };

  // Use a hint
  const handleUseHint = () => {
    setHintsUsed((prev) => prev + 1);
    setScore((prev) => Math.max(0, prev - 50));
  };

  // When a location's clue is solved
  const handleLocationSolved = () => {
    if (!solvedLocations.includes(currentLocationId)) {
      setSolvedLocations((prev) => [...prev, currentLocationId]);
      setScore((prev) => prev + 200);
    }

    if (currentLocationId === 'chamber') {
      // Final chamber solved -> Victory!
      const heartBonus = hearts * 100;
      const finalScore = score + 300 + heartBonus;
      setScore(finalScore);

      const saved = saveBestScore(finalScore);
      if (finalScore > bestScore) {
        setIsNewRecord(true);
        setBestScore(finalScore);
      } else {
        setBestScore(saved);
      }

      setGameStatus('VICTORY');
    } else {
      setShowCelebration(true);
      setGameStatus('LOCATION_SOLVED');
    }
  };

  // Advance to next location after reading the educational explanation
  const handleAdvanceNextLocation = () => {
    setShowCelebration(false);
    setGameStatus('PLAYING');

    const currentIndex = LOCATIONS.findIndex((loc) => loc.id === currentLocationId);
    if (currentIndex >= 0 && currentIndex < LOCATIONS.length - 1) {
      const nextLoc = LOCATIONS[currentIndex + 1];
      setCurrentLocationId(nextLoc.id);
      soundEffects.playClick();
    }
  };

  // Retry from checkpoint when lives run out
  const handleRetryCheckpoint = () => {
    setIsGameOverOpen(false);
    setHearts(3);
    setScore((prev) => Math.max(200, prev - 50));
    setGameStatus('PLAYING');
  };

  // Full restart
  const handleRestartAll = () => {
    setIsGameOverOpen(false);
    handleStartGame();
  };

  const currentLocation =
    LOCATIONS.find((l) => l.id === currentLocationId) || LOCATIONS[0];
  const isCurrentSolved = solvedLocations.includes(currentLocationId);

  // Learning explanations for celebration
  const EXPLANATIONS: Record<LocationId, { headline: string; concept: string }> = {
    beach: {
      headline: 'C Formatted Output Mastered!',
      concept:
        'printf() from <stdio.h> prints formatted strings to console using format specifiers like %d and %s. Option 4 held the key!',
    },
    jungle: {
      headline: 'Loop Iteration Count Unlocked!',
      concept:
        'The loop variable step incremented from 1 to 7 inclusive (step <= 7), running total = total + 1 exactly 7 times to output 7!',
    },
    cave: {
      headline: 'Missing Semicolon Bug Neutralized!',
      concept:
        'Line 3 omitted a semicolon (;) on the variable declaration. In C, every statement and declaration must conclude with a semicolon!',
    },
    waterfall: {
      headline: 'Binary Bit Weighting Decoded!',
      concept:
        'The powers of two (1, 2, 4, 8, 16, 32) govern computer architecture and binary bits. 8 represents 2³ and is the number of bits in 1 byte!',
    },
    temple: {
      headline: 'C Program Architecture Assembled!',
      concept:
        'C compilation starts with #include headers, continues to the main() entry function, executes statements, and concludes with return 0!',
    },
    chamber: {
      headline: 'The Master Vault Unlocked!',
      concept:
        'You combined the 4 secret clues (4-7-3-8) discovered across your expedition into the master engineering combination!',
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50 text-slate-900 selection:bg-amber-300 selection:text-amber-950">
      {/* Top Bar Contract compliant navigation */}
      <TopBar
        hearts={hearts}
        maxHearts={3}
        score={score}
        timeElapsed={timeElapsed}
        bestScore={bestScore}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col items-center">
        {gameStatus === 'START_SCREEN' ? (
          <StartScreen
            onStartGame={handleStartGame}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            bestScore={bestScore}
          />
        ) : gameStatus === 'VICTORY' ? (
          <VictoryScreen
            score={score}
            timeElapsed={timeElapsed}
            hintsUsed={hintsUsed}
            heartsRemaining={hearts}
            bestScore={bestScore}
            isNewRecord={isNewRecord}
            onPlayAgain={handleStartGame}
          />
        ) : (
          /* Active Playing / Puzzle Layout */
          <div className="w-full space-y-6">
            {/* Top row: Island Map & Explorer Inventory Bar */}
            <div className="space-y-4">
              <IslandMap
                currentLocationId={currentLocationId}
                solvedLocations={solvedLocations}
                onSelectLocation={(locId) => {
                  soundEffects.playClick();
                  setCurrentLocationId(locId);
                }}
              />

              <InventoryBar
                solvedLocations={solvedLocations}
                onOpenJournal={() => setIsJournalOpen(true)}
              />
            </div>

            {/* Celebration Banner after solving a clue */}
            {showCelebration && (
              <CelebrationBanner
                location={currentLocation}
                explanation={EXPLANATIONS[currentLocationId]}
                isLastLocation={currentLocationId === 'temple'}
                onContinue={handleAdvanceNextLocation}
              />
            )}

            {/* Active Clue Card with Shake Animation on Wrong Answer */}
            <div
              className={`w-full max-w-4xl mx-auto transition-transform ${
                isShaking ? 'animate-shake' : ''
              }`}
            >
              {currentLocationId === 'beach' && (
                <BeachClue
                  onSolved={handleLocationSolved}
                  onWrongAnswer={handleWrongAnswer}
                  onUseHint={handleUseHint}
                  isSolved={isCurrentSolved}
                />
              )}

              {currentLocationId === 'jungle' && (
                <JungleClue
                  onSolved={handleLocationSolved}
                  onWrongAnswer={handleWrongAnswer}
                  onUseHint={handleUseHint}
                  isSolved={isCurrentSolved}
                />
              )}

              {currentLocationId === 'cave' && (
                <CaveClue
                  onSolved={handleLocationSolved}
                  onWrongAnswer={handleWrongAnswer}
                  onUseHint={handleUseHint}
                  isSolved={isCurrentSolved}
                />
              )}

              {currentLocationId === 'waterfall' && (
                <WaterfallClue
                  onSolved={handleLocationSolved}
                  onWrongAnswer={handleWrongAnswer}
                  onUseHint={handleUseHint}
                  isSolved={isCurrentSolved}
                />
              )}

              {currentLocationId === 'temple' && (
                <TempleClue
                  onSolved={handleLocationSolved}
                  onWrongAnswer={handleWrongAnswer}
                  onUseHint={handleUseHint}
                  isSolved={isCurrentSolved}
                />
              )}

              {currentLocationId === 'chamber' && (
                <ChamberClue
                  onSolved={handleLocationSolved}
                  onWrongAnswer={handleWrongAnswer}
                  onUseHint={handleUseHint}
                  isSolved={isCurrentSolved}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-amber-900/20 py-4 px-4 text-center text-xs text-amber-900/60 font-medium">
        <p>Code Quest: The Treasure Hunt · Designed for First-Year Computer Engineering Explorers</p>
      </footer>

      {/* Modals */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <JournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        solvedLocations={solvedLocations}
      />

      {isGameOverOpen && (
        <GameOverModal
          score={score}
          solvedCount={solvedLocations.length}
          onRestartAll={handleRestartAll}
          onRetryCheckpoint={handleRetryCheckpoint}
        />
      )}
    </div>
  );
}
