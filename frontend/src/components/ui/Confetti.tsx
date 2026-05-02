"use client";

import { useEffect } from "react";

const EMOJIS = ["☕", "🎉", "✨", "🥛", "💛", "🍮"];

interface Props {
  onDone: () => void;
}

export function Confetti({ onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [onDone]);

  const pieces = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    emoji: EMOJIS[i % EMOJIS.length],
    left: `${10 + Math.random() * 80}%`,
    top: `${40 + Math.random() * 30}%`,
    delay: `${Math.random() * 0.4}s`,
  }));

  return (
    <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 9999 }}>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{ left: p.left, top: p.top, animationDelay: p.delay }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
