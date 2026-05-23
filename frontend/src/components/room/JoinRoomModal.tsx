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
      <div className="modal-sheet" style={{ maxWidth: 420 }}>

        {/* 카페 + 방 이름 */}
        <div style={{ marginBottom: 24 }}>
          {cafeInfo && (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px 4px 6px",
              border: `1.5px solid ${cafeInfo.color}`,
              borderRadius: 4,
              marginBottom: 12,
            }}>
              <div style={{
                width: 22,
                height: 22,
                border: `1.5px solid ${cafeInfo.color}`,
                borderRadius: 3,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#FFFFFF",
                flexShrink: 0,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cafeInfo.logoPath}
                  alt={cafeInfo.name}
                  width={20}
                  height={20}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: cafeInfo.color }}>
                {cafeInfo.name}
              </span>
            </div>
          )}

          <h2 style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#1C1C1A",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            marginBottom: 4,
          }}>
            {roomName}
          </h2>
          <p style={{ color: "#6B6762", fontSize: 13 }}>
            이름을 알려주세요
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#6B6762",
              display: "block",
              marginBottom: 8,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              내 이름
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
            className="btn-primary"
            disabled={!name.trim() || submitting}
            style={{ width: "100%", padding: "15px", fontSize: 15 }}
          >
            {submitting ? "입장 중..." : "참여하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
