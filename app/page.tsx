"use client";

import { useState } from "react";
import MemoryGame from "./MemoryGame";

type Difficulty = "easy" | "medium" | "hard";
type Theme = "nature" | "animals" | "space";

export default function MemoryGamePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [theme, setTheme] = useState<Theme>("nature");

  if (gameStarted) {
    return (
      <MemoryGame
        difficulty={difficulty}
        theme={theme}
        onBack={() => setGameStarted(false)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-2">TrailMatch</h1>
        <p className="text-white/50 mb-10">Test your memory with nature-inspired cards</p>

        {/* Difficulty */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-white/70 mb-3 uppercase tracking-wider">Difficulty</h2>
          <div className="flex gap-3 justify-center">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${
                  difficulty === d
                    ? "bg-white text-black"
                    : "bg-white/[0.06] text-white/60 hover:bg-white/[0.1] border border-white/[0.08]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-2">
            {difficulty === "easy" && "4 pairs (8 cards)"}
            {difficulty === "medium" && "6 pairs (12 cards)"}
            {difficulty === "hard" && "8 pairs (16 cards)"}
          </p>
        </div>

        {/* Theme */}
        <div className="mb-10">
          <h2 className="text-sm font-medium text-white/70 mb-3 uppercase tracking-wider">Theme</h2>
          <div className="flex gap-3 justify-center">
            {(["nature", "animals", "space"] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${
                  theme === t
                    ? "bg-white text-black"
                    : "bg-white/[0.06] text-white/60 hover:bg-white/[0.1] border border-white/[0.08]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Start */}
        <button
          onClick={() => setGameStarted(true)}
          className="w-full py-3.5 rounded-lg bg-white text-black font-bold text-lg hover:bg-white/90 transition-colors"
        >
          Start Game
        </button>
      </div>
    </main>
  );
}
