"use client";

import { useState } from "react";
import type { Participant } from "@/lib/types";

interface Props {
  participants: Participant[];
  currentUserId: string;
  roomName: string;
  isClosed: boolean;
  onEditOrder: () => void;
}

export function RoomView({
  participants,
  currentUserId,
  roomName,
  isClosed,
  onEditOrder,
}: Props) {
  const [copied, setCopied] = useState(false);

  const decided = participants.filter((p) => p.order !== null);
  const pending = participants.filter((p) => p.order === null);
  const skipped = decided.filter((p) => p.order?.menu_id === "skip");
  const ordered = decided.filter((p) => p.order?.menu_id !== "skip");

  // 메뉴 그룹화
  const groups: Record<string, { order: Participant["order"]; people: Participant[] }> = {};
  decided.forEach((p) => {
    if (!p.order) return;
    const key = `${p.order.menu_name}(${p.order.temperature})`;
    if (!groups[key]) groups[key] = { order: p.order, people: [] };
    groups[key].people.push(p);
  });

  const summaryText = [
    `📋 ${roomName} (총 ${ordered.length}잔)`,
    ...Object.entries(groups)
      .filter(([, g]) => g.order?.menu_id !== "skip")
      .map(([key, g]) => {
        const names = g.people
          .map((p) => {
            let n = p.user_name;
            if (p.order?.extra_shot) n += "(샷 추가)";
            if (p.order?.note) n += `(${p.order.note})`;
            return n;
          })
          .join(", ");
        return `${g.order?.menu_emoji} ${key} x${g.people.length} - ${names}`;
      }),
  ].join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
    } catch {
      const el = document.createElement("textarea");
      el.value = summaryText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── 주문 완료 ── */}
      {decided.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#8D6E63",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            ✅ 주문 완료 · {decided.length}명
            {skipped.length > 0 ? ` (패스 ${skipped.length}명 포함)` : ""}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {decided.map((p) => (
              <div
                key={p.user_id}
                className="animate-fade-up"
                style={{
                  background: "#FFFFFF",
                  borderRadius: 18,
                  padding: "12px 14px",
                  border: `2px solid ${p.user_id === currentUserId ? "#C9A57B" : "#F5E6D3"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, rgba(168,192,154,0.06), transparent)",
                    pointerEvents: "none",
                  }}
                />
                {/* 아바타 */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    flexShrink: 0,
                    background:
                      p.order?.menu_id === "skip"
                        ? "#EEE8E3"
                        : "linear-gradient(135deg, #F5E6D3, #C9A57B)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                  }}
                >
                  {p.order?.menu_emoji}
                </div>
                {/* 정보 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: p.order?.menu_id === "skip" ? "#A89990" : "#3E2723",
                      }}
                    >
                      {p.user_name}
                    </span>
                    {p.is_host && <span style={{ fontSize: 13 }}>👑</span>}
                    {p.user_id === currentUserId && (
                      <span
                        className="chip"
                        style={{ background: "#F5E6D3", color: "#6F4E37", fontSize: 10 }}
                      >
                        나
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: p.order?.menu_id === "skip" ? "#C9A57B" : "#6F4E37",
                      fontWeight: 600,
                      marginTop: 1,
                    }}
                  >
                    {p.order?.menu_id === "skip"
                      ? "이번엔 패스"
                      : `${p.order?.menu_name} ${p.order?.temperature}${
                          p.order?.size ? ` · ${p.order.size}` : ""
                        }${p.order?.extra_shot ? " · 샷 추가" : ""}${
                          p.order?.note ? ` · ${p.order.note}` : ""
                        }`}
                  </div>
                </div>
                {/* 수정 버튼 (나인 경우) */}
                {p.user_id === currentUserId && !isClosed && (
                  <button
                    className="btn-hover"
                    onClick={onEditOrder}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 10,
                      flexShrink: 0,
                      background: "#F5E6D3",
                      color: "#6F4E37",
                      border: "none",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    수정
                  </button>
                )}
                {p.user_id !== currentUserId && (
                  <span style={{ color: "#A8C09A", fontSize: 18, flexShrink: 0 }}>✓</span>
                )}
              </div>
            ))}
          </div>

          {/* 집계 & 복사 */}
          {ordered.length >= 1 && (
            <div
              style={{
                marginTop: 12,
                background: "#F5E6D3",
                borderRadius: 16,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 13, color: "#6F4E37", fontWeight: 600 }}>
                총 {ordered.length}잔 집계됐어요
              </div>
              <button
                className="btn-hover"
                onClick={handleCopy}
                style={{
                  padding: "7px 14px",
                  borderRadius: 10,
                  flexShrink: 0,
                  background: copied ? "#A8C09A" : "#6F4E37",
                  color: "#FFF8F0",
                  border: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.2s",
                }}
              >
                {copied ? "복사됨 ✓" : "📋 주문 복사"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── 고르는 중 ── */}
      {pending.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#8D6E63",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            ⏳ 고르는 중 · {pending.length}명
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pending.map((p) => (
              <div
                key={p.user_id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 18,
                  padding: "12px 14px",
                  border: `2px solid ${p.user_id === currentUserId ? "#C9A57B" : "#F5E6D3"}`,
                  opacity: p.is_online ? 1 : 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {/* 아바타 */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    flexShrink: 0,
                    background: p.is_online ? "#F5E6D3" : "#EEE8E3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color: p.is_online ? "#C9A57B" : "#C0B0A8",
                    fontWeight: 700,
                  }}
                >
                  ?
                </div>
                {/* 정보 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: p.is_online ? "#3E2723" : "#A89990",
                      }}
                    >
                      {p.user_name}
                    </span>
                    {p.is_host && <span style={{ fontSize: 13 }}>👑</span>}
                    {p.user_id === currentUserId && (
                      <span
                        className="chip"
                        style={{ background: "#F5E6D3", color: "#6F4E37", fontSize: 10 }}
                      >
                        나
                      </span>
                    )}
                  </div>
                  {p.status === "ordering" ? (
                    <div
                      style={{ fontSize: 12, color: "#D4A574", fontWeight: 600, marginTop: 1 }}
                    >
                      고민중<span className="thinking-dots" />
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: "#C9A57B", marginTop: 1 }}>
                      {p.is_online ? "접속 중" : "오프라인"}
                    </div>
                  )}
                </div>
                {/* 상태 점 */}
                <div
                  className={`status-dot ${
                    p.status === "ordering"
                      ? "status-ordering"
                      : p.is_online
                      ? "status-online"
                      : "status-offline"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {decided.length === 0 && pending.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#C9A57B" }}>
          🥱 아직 아무도 없어요
        </div>
      )}
    </div>
  );
}
