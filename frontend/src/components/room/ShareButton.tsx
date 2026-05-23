"use client";

import { useState } from "react";

interface Props {
  roomId: string;
}

export function ShareButton({ roomId }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/room/${roomId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        width: 38,
        height: 38,
        borderRadius: 4,
        background: copied ? "#1C1C1A" : "transparent",
        color: copied ? "#F5F3EE" : "#1C1C1A",
        border: "1.5px solid #1C1C1A",
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "background 0.15s, color 0.15s",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: "0.02em",
      }}
    >
      {copied ? "✓" : "공유"}
    </button>
  );
}
