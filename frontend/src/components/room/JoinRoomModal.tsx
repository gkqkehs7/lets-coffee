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
          {/* 카페 로고 */}
          {cafeInfo ? (
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: `${cafeInfo.color}18`,
              border: `2px solid ${cafeInfo.color}33`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px",
              overflow: "hidden",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cafeInfo.logoPath}
                alt={cafeInfo.name}
                width={48}
                height={48}
                style={{ objectFit: "contain" }}
              />
            </div>
          ) : (
            <div style={{ fontSize: 48, marginBottom: 12 }}>☕</div>
          )}

          {/* 카페 이름 뱃지 */}
          {cafeInfo && (
            <div style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: 20,
              background: `${cafeInfo.color}15`,
              border: `1px solid ${cafeInfo.color}40`,
              fontSize: 12, fontWeight: 700,
              color: cafeInfo.color,
              marginBottom: 10,
            }}>
              {cafeInfo.name}
            </div>
          )}

          <h2
            style={{
              fontFamily: "'Gowun Dodum', sans-serif",
              fontSize: 20,
              color: "#3E2723",
              display: "block",
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
            {submitting ? "입장 중..." : "입장하기 ✨"}
          </button>
        </form>
      </div>
    </div>
  );
}
