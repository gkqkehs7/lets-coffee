"use client";

import { useState } from "react";

interface Props {
  roomName: string;
  onJoin: (name: string) => void;
}

export function JoinRoomModal({ roomName, onJoin }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onJoin(name.trim());
  };

  return (
    <div className="modal-overlay">
      <div className="modal-sheet animate-pop-in" style={{ maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>☕</div>
          <h2
            style={{
              fontFamily: "'Gowun Dodum', sans-serif",
              fontSize: 20,
              color: "#3E2723",
            }}
          >
            {roomName}
          </h2>
          <p style={{ color: "#8D6E63", fontSize: 14, marginTop: 4 }}>
            커피 주문에 참여해요!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#6F4E37",
                display: "block",
                marginBottom: 8,
              }}
            >
              👤 내 이름
            </label>
            <input
              className="input-field"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              maxLength={20}
            />
          </div>

          <button
            type="submit"
            className="btn-hover"
            disabled={!name.trim()}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 18,
              background: name.trim()
                ? "linear-gradient(135deg, #C9A57B, #6F4E37)"
                : "#F5E6D3",
              color: name.trim() ? "#FFF8F0" : "#C9A57B",
              border: "none",
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "'Gowun Dodum', sans-serif",
              cursor: name.trim() ? "pointer" : "not-allowed",
            }}
          >
            입장하기 ✨
          </button>
        </form>
      </div>
    </div>
  );
}
