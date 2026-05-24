"use client";

import { useState } from "react";
import type { CafeInfo } from "@/lib/menu-data";

interface Props {
  roomName: string;
  cafeInfo: CafeInfo | null;
  onJoin: (name: string) => Promise<void>;
}

export function JoinRoomModal({ roomName, cafeInfo, onJoin }: Props) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onJoin(name.trim());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-sheet animate-pop-in" style={{ maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {/* 캐릭터 이미지 */}
          <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }} className="animate-float">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/character.png"
              alt="캐릭터"
              width={80}
              height={80}
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* 방 이름 */}
          <h2 style={{
            fontFamily: "'Gowun Dodum', sans-serif",
            fontSize: 22, color: "#3E2723",
            marginBottom: 6,
          }}>
            {roomName}
          </h2>
          <p style={{ color: "#8D6E63", fontSize: 13 }}>
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
              내 이름
            </label>
            <input
              className="input-field"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => {
                const v = e.target.value;
                const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(v);
                setName(v.slice(0, hasKorean ? 4 : 10));
              }}
              autoFocus
              maxLength={10}
            />
          </div>

          <button
            type="submit"
            className="btn-hover"
            disabled={!name.trim() || submitting}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 18,
              background: name.trim() && !submitting
                ? "linear-gradient(135deg, #C9A57B, #6F4E37)"
                : "#F5E6D3",
              color: name.trim() && !submitting ? "#FFF8F0" : "#C9A57B",
              border: "none",
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "'Gowun Dodum', sans-serif",
              cursor: name.trim() && !submitting ? "pointer" : "not-allowed",
            }}
          >
            {submitting ? "입장 중..." : "입장하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
