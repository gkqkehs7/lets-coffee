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
    <div style={{
      position: "fixed",
      bottom: 100,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 9000,
    }}>
      <div
        className="animate-slide-in"
        style={{
          background: "#1C1C1A",
          color: "#F5F3EE",
          padding: "10px 20px",
          borderRadius: 4,
          fontSize: 13,
          fontWeight: 600,
          border: "1.5px solid #1C1C1A",
          boxShadow: "3px 3px 0 #6B6762",
          whiteSpace: "nowrap",
          pointerEvents: "auto",
          fontFamily: "inherit",
        }}
      >
        {message}
      </div>
    </div>
  );
}
