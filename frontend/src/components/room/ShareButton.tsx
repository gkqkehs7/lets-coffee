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
      // fallback for older browsers
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
      className="btn-hover"
      onClick={handleCopy}
      style={{
        padding: "3px 9px",
        borderRadius: 8,
        background: copied ? "#A8C09A" : "#F5E6D3",
        color: copied ? "#FFF8F0" : "#8D6E63",
        border: "none",
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "background 0.2s",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      {copied ? "✓ 복사됨" : "링크 복사"}
    </button>
  );
}
