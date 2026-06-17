"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type Theme = "nature" | "animals" | "space";

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const THEMES: Record<Theme, string[]> = {
  nature: ["🌲", "🌸", "🍄", "🌻", "🌊", "⛰️", "🌿", "🔥"],
  animals: ["🦊", "🐻", "🦉", "🐺", "🦌", "🐿️", "🦅", "🐝"],
  space: ["🌙", "⭐", "🪐", "☄️", "🌍", "🚀", "🛸", "🌌"],
};

const PAIR_COUNTS: Record<Difficulty, number> = {
  easy: 4,
  medium: 6,
  hard: 8,
};

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateCards(difficulty: Difficulty, theme: Theme): Card[] {
  const pairCount = PAIR_COUNTS[difficulty];
  const emojis = THEMES[theme].slice(0, pairCount);
  const pairs = [...emojis, ...emojis];
  const shuffled = shuffleArray(pairs);
  return shuffled.map((emoji, i) => ({
    id: i,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}

interface Props {
  difficulty: Difficulty;
  theme: Theme;
  onBack: () => void;
}

export default function MemoryGame({ difficulty, theme, onBack }: Props) {
  const [cards, setCards] = useState<Card[]>(() => generateCards(difficulty, theme));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const totalPairs = PAIR_COUNTS[difficulty];

  // timer
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  // check for match
  useEffect(() => {
    if (flippedIds.length === 2) {
      setIsChecking(true);
      setMoves((m) => m + 1);
      const [first, second] = flippedIds;
      const firstCard = cards.find((c) => c.id === first);
      const secondCard = cards.find((c) => c.id === second);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second ? { ...c, isMatched: true } : c
            )
          );
          setMatches((m) => m + 1);
          setFlippedIds([]);
          setIsChecking(false);
        }, 500);
      } else {
        // no match, flip back
        setTimeout(() => {
          setFlippedIds([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedIds, cards]);

  // check win
  useEffect(() => {
    if (matches === totalPairs && matches > 0) {
      setGameOver(true);
    }
  }, [matches, totalPairs]);

  const handleCardClick = useCallback(
    (id: number) => {
      if (isChecking) return;
      if (flippedIds.length >= 2) return;
      if (flippedIds.includes(id)) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.isMatched) return;
      setFlippedIds((prev) => [...prev, id]);
    },
    [isChecking, flippedIds, cards]
  );

  const resetGame = () => {
    setCards(generateCards(difficulty, theme));
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setGameOver(false);
    setTimer(0);
    setIsChecking(false);
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const getGridCols = () => {
    if (difficulty === "easy") return "grid-cols-4";
    if (difficulty === "medium") return "grid-cols-4";
    return "grid-cols-4";
  };

  // win screen
  if (gameOver) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">You Win!</h2>
          <p className="text-white/50 mb-6">
            Completed in {moves} moves and {formatTime(timer)}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={resetGame}
              className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-lg bg-white/[0.06] text-white/70 font-medium hover:bg-white/[0.1] border border-white/[0.08] transition-colors"
            >
              Change Settings
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-xl font-bold">TrailMatch</h1>
        <button
          onClick={resetGame}
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
          aria-label="Reset game"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-8 text-sm">
        <div className="text-center">
          <p className="text-white/40">Moves</p>
          <p className="text-lg font-bold">{moves}</p>
        </div>
        <div className="text-center">
          <p className="text-white/40">Matches</p>
          <p className="text-lg font-bold">{matches}/{totalPairs}</p>
        </div>
        <div className="text-center">
          <p className="text-white/40">Time</p>
          <p className="text-lg font-bold">{formatTime(timer)}</p>
        </div>
      </div>

      {/* Card Grid */}
      <div className={`grid ${getGridCols()} gap-3 w-full max-w-sm`}>
        {cards.map((card) => {
          const isFlipped = flippedIds.includes(card.id) || card.isMatched;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-xl text-3xl sm:text-4xl flex items-center justify-center transition-all duration-300 ${
                card.isMatched
                  ? "bg-green-900/30 border-2 border-green-500/40 scale-95"
                  : isFlipped
                  ? "bg-white/[0.08] border-2 border-white/20 rotate-0"
                  : "bg-white/[0.04] border-2 border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] cursor-pointer"
              }`}
              disabled={card.isMatched}
              aria-label={isFlipped ? card.emoji : "Hidden card"}
            >
              {isFlipped ? (
                <span className="animate-in fade-in duration-200">{card.emoji}</span>
              ) : (
                <span className="text-white/20 text-xl">?</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Difficulty label */}
      <p className="mt-6 text-xs text-white/30 capitalize">{difficulty} mode · {theme} theme</p>
    </main>
  );
}
