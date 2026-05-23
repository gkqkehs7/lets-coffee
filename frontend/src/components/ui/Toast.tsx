"use client";

import { useEffect } from "react";

interface Props {
  message: string;
  onDone: () => void;
}

export function Toast({ message, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 100,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 9000,
      }}
    >
      <div
        className="animate-pop-in"
        style={{
          background: "#3E2723",
          color: "#FFF8F0",
          padding: "12px 24px",
          borderRadius: 999,
          fontSize: 14,
          fontWeight: 600,
          boxShadow: "0 4px 20px rgba(62,39,35,0.35)",
          whiteSpace: "nowrap",
          pointerEvents: "auto",
        }}
      >
        {message}
      </div>
    </div>
  );
}
