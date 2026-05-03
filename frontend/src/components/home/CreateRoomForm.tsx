"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/session";

const BG_EMOJIS = [
  { e: "☕", size: 44, left: "8%",  top: "10%", dur: 3.0 },
  { e: "🥛", size: 52, left: "75%", top: "5%",  dur: 3.5 },
  { e: "🍵", size: 36, left: "20%", top: "70%", dur: 3.2 },
  { e: "🧋", size: 56, left: "60%", top: "80%", dur: 2.8 },
  { e: "☁️", size: 40, left: "40%", top: "40%", dur: 4.0 },
  { e: "🍫", size: 48, left: "85%", top: "55%", dur: 3.6 },
];

export function CreateRoomForm() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [hostName, setHostName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = roomName.trim().length > 0 && hostName.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.createRoom(roomName.trim(), hostName.trim());
      saveSession({
        user_id:  res.user_id,
        user_name: res.user_name,
        is_host:  true,
        room_id:  res.room_id,
      });
      router.push(`/room/${res.room_id}`);
    } catch {
      setError("방을 만들지 못했어요. 다시 시도해 주세요.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#FFF8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div className="animate-float" style={{ fontSize: 48 }}>☕</div>
        <p style={{ color: "#8D6E63", fontSize: 14 }}>방을 만들고 있어요...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFF8F0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 배경 이모지 */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        {BG_EMOJIS.map((b, i) => (
          <span
            key={i}
            className="animate-float"
            style={{
              position: "absolute",
              fontSize: b.size,
              opacity: 0.07,
              left: b.left,
              top: b.top,
              animationDuration: `${b.dur}s`,
              animationDelay: `${i * 0.6}s`,
            }}
          >
            {b.e}
          </span>
        ))}
      </div>

      {/* 카드 컨테이너 */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
        {/* 로고 */}
        <div className="animate-fade-up" style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            className="animate-float"
            style={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #C9A57B, #6F4E37)",
              borderRadius: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(111,78,55,0.3)",
            }}
          >
            ☕
          </div>
          <h1
            style={{
              fontFamily: "'Gowun Dodum', sans-serif",
              fontSize: 26,
              fontWeight: 700,
              color: "#3E2723",
              lineHeight: 1.3,
            }}
          >
            커피 뭐드실래요?
          </h1>
          <p style={{ color: "#8D6E63", fontSize: 14, marginTop: 6 }}>
            링크 하나로 팀 커피 주문 끝! ✨
          </p>
        </div>

        {/* 폼 카드 */}
        <div
          className="animate-fade-up"
          style={{
            background: "#FFFFFF",
            borderRadius: 28,
            padding: "32px 28px",
            boxShadow: "0 4px 32px rgba(111,78,55,0.12)",
            border: "1.5px solid #F5E6D3",
            animationDelay: "0.1s",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label
                style={{ fontSize: 13, fontWeight: 600, color: "#6F4E37", display: "block", marginBottom: 8 }}
              >
                오늘의 커피타임 이름
              </label>
              <input
                className="input-field"
                placeholder="예: 오후 3시 커피타임"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                maxLength={50}
              />
            </div>

            <div>
              <label
                style={{ fontSize: 13, fontWeight: 600, color: "#6F4E37", display: "block", marginBottom: 8 }}
              >
                👤 내 이름
              </label>
              <input
                className="input-field"
                placeholder="예: 민우"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                maxLength={20}
              />
            </div>

            {error && (
              <p style={{ color: "#E57373", fontSize: 13, textAlign: "center" }}>{error}</p>
            )}

            <button
              type="submit"
              className="btn-hover"
              disabled={!canSubmit}
              style={{
                marginTop: 8,
                padding: "16px",
                borderRadius: 18,
                background: canSubmit
                  ? "linear-gradient(135deg, #C9A57B, #6F4E37)"
                  : "#F5E6D3",
                color: canSubmit ? "#FFF8F0" : "#C9A57B",
                border: "none",
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "'Gowun Dodum', sans-serif",
                cursor: canSubmit ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              방 만들기 🎉
            </button>
          </form>
        </div>

        <p
          className="animate-fade-up"
          style={{
            textAlign: "center",
            color: "#C9A57B",
            fontSize: 13,
            marginTop: 20,
            animationDelay: "0.2s",
          }}
        >
          로그인 없이 바로 시작해요 🥱
        </p>
      </div>
    </div>
  );
}
