"use client";

import { useState } from "react";
import type { Participant } from "@/lib/types";

interface Props {
  participants: Participant[];
  currentUserId: string;
  isHost: boolean;
  roomName: string;
  isClosed: boolean;
  onEditOrder: () => void;
}

function StatusBadge({ status, isOnline }: { status: string; isOnline: boolean }) {
  if (!isOnline) return <span className="badge badge-offline">오프라인</span>;
  if (status === "ordering") return <span className="badge badge-ordering">고민중<span className="thinking-dots" /></span>;
  if (status === "editing")  return <span className="badge badge-editing">변경중<span className="thinking-dots" /></span>;
  return <span className="badge badge-thinking">대기중</span>;
}

function Avatar({ name, isMine, isDecided }: { name: string; isMine: boolean; isDecided: boolean }) {
  return (
    <div style={{
      width: 36,
      height: 36,
      border: `1.5px solid ${isMine ? "#D4341A" : isDecided ? "#1C1C1A" : "#D0CCC7"}`,
      borderRadius: 4,
      background: isDecided ? "#FFFFFF" : "#F5F3EE",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 15,
      fontWeight: 700,
      color: isMine ? "#D4341A" : isDecided ? "#1C1C1A" : "#B0ADA8",
      flexShrink: 0,
    }}>
      {name.charAt(0)}
    </div>
  );
}

export function RoomView({
  participants,
  currentUserId,
  isHost,
  roomName,
  isClosed,
  onEditOrder,
}: Props) {
  const [copied, setCopied] = useState(false);

  const decided = participants.filter((p) => p.order !== null);
  const pending  = participants.filter((p) => p.order === null);
  const skipped  = decided.filter((p) => p.order?.menu_id === "skip");
  const ordered  = decided.filter((p) => p.order?.menu_id !== "skip");

  const groups: Record<string, { order: Participant["order"]; people: Participant[] }> = {};
  decided.forEach((p) => {
    if (!p.order) return;
    const key = `${p.order.menu_name}(${p.order.temperature})`;
    if (!groups[key]) groups[key] = { order: p.order, people: [] };
    groups[key].people.push(p);
  });

  const summaryText = [
    `[${roomName}] 총 ${ordered.length}잔`,
    ...Object.entries(groups)
      .filter(([, g]) => g.order?.menu_id !== "skip")
      .map(([, g]) => {
        const names = g.people
          .map((p) => {
            let n = p.user_name;
            if (p.order?.note) n += `(${p.order.note})`;
            return n;
          })
          .join(", ");
        return `${g.order?.menu_name} ${g.order?.temperature} x${g.people.length} — ${names}`;
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

  const sectionLabel = (text: string) => (
    <div style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 10,
      fontWeight: 500,
      color: "#B0ADA8",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      marginBottom: 10,
    }}>
      {text}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── 주문 완료 ── */}
      {decided.length > 0 && (
        <div>
          {sectionLabel(`DONE · ${decided.length}명${skipped.length > 0 ? ` (패스 ${skipped.length}명 포함)` : ""}`)}

          <div style={{
            border: "1.5px solid #1C1C1A",
            borderRadius: 4,
            overflow: "hidden",
          }}>
            {decided.map((p, idx) => (
              <div
                key={p.user_id}
                className="animate-slide-in"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  background: p.user_id === currentUserId ? "#FFFAF9" : "#FFFFFF",
                  borderBottom: idx < decided.length - 1 ? "1px solid #F0EDE8" : "none",
                  borderLeft: p.user_id === currentUserId ? "3px solid #D4341A" : "3px solid transparent",
                }}
              >
                <Avatar
                  name={p.user_name}
                  isMine={p.user_id === currentUserId}
                  isDecided={true}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#1C1C1A" }}>
                      {p.user_name}
                    </span>
                    {p.is_host && (
                      <span className="chip" style={{ border: "1.5px solid #B86B10", color: "#B86B10", fontSize: 10 }}>
                        HOST
                      </span>
                    )}
                    {p.user_id === currentUserId && (
                      <span className="chip" style={{ background: "#D4341A", color: "#FFFFFF", fontSize: 10 }}>
                        나
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: p.order?.menu_id === "skip" ? "#B0ADA8" : "#6B6762",
                    marginTop: 2,
                    fontWeight: 500,
                  }}>
                    {p.order?.menu_id === "skip"
                      ? "안먹을게요"
                      : `${p.order?.menu_emoji} ${p.order?.menu_name} ${p.order?.temperature}${
                          p.order?.size ? ` · ${p.order.size}` : ""
                        }${p.order?.note ? ` · ${p.order.note}` : ""}`}
                  </div>
                </div>

                {p.user_id === currentUserId && !isClosed ? (
                  <button
                    className="btn-secondary"
                    onClick={onEditOrder}
                    style={{ padding: "5px 12px", fontSize: 12, flexShrink: 0 }}
                  >
                    수정
                  </button>
                ) : p.user_id !== currentUserId ? (
                  <span className="badge badge-decided">완료</span>
                ) : null}
              </div>
            ))}
          </div>

          {/* 집계 패널 — 방장만 */}
          {isHost && ordered.length >= 1 && (
            <div style={{
              marginTop: 12,
              border: "1.5px dashed #1C1C1A",
              borderRadius: 4,
              overflow: "hidden",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderBottom: "1px dashed #D0CCC7",
              }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  fontWeight: 500,
                  color: "#6B6762",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  Order Summary
                </span>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#1C1C1A",
                }}>
                  총 {ordered.length}잔
                </span>
              </div>

              <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 7 }}>
                {Object.entries(groups)
                  .filter(([, g]) => g.order?.menu_id !== "skip")
                  .map(([key, g]) => (
                    <div key={key} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#D4341A",
                        flexShrink: 0,
                        minWidth: 24,
                      }}>
                        ×{g.people.length}
                      </span>
                      <span style={{ fontSize: 13, color: "#1C1C1A", fontWeight: 600, flex: 1 }}>
                        {g.order?.menu_name} {g.order?.temperature}
                      </span>
                      <span style={{ fontSize: 12, color: "#6B6762" }}>
                        {g.people.map((p) => p.user_name).join(", ")}
                      </span>
                    </div>
                  ))}
              </div>

              <div style={{ padding: "10px 14px", borderTop: "1px dashed #D0CCC7" }}>
                <button
                  className="btn-secondary"
                  onClick={handleCopy}
                  style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: 13,
                    background: copied ? "#1C1C1A" : "transparent",
                    color: copied ? "#F5F3EE" : "#1C1C1A",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {copied ? "복사됨" : "주문 복사하기"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 고르는 중 ── */}
      {pending.length > 0 && (
        <div>
          {sectionLabel(`WAITING · ${pending.length}명`)}

          <div style={{
            border: "1.5px solid #D0CCC7",
            borderRadius: 4,
            overflow: "hidden",
          }}>
            {pending.map((p, idx) => (
              <div
                key={p.user_id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  background: "#FFFFFF",
                  borderBottom: idx < pending.length - 1 ? "1px solid #F0EDE8" : "none",
                  opacity: p.is_online ? 1 : 0.5,
                  borderLeft: p.user_id === currentUserId ? "3px solid #D4341A" : "3px solid transparent",
                }}
              >
                <Avatar name={p.user_name} isMine={p.user_id === currentUserId} isDecided={false} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: p.is_online ? "#1C1C1A" : "#B0ADA8" }}>
                      {p.user_name}
                    </span>
                    {p.is_host && (
                      <span className="chip" style={{ border: "1.5px solid #B86B10", color: "#B86B10", fontSize: 10 }}>
                        HOST
                      </span>
                    )}
                    {p.user_id === currentUserId && (
                      <span className="chip" style={{ background: "#D4341A", color: "#FFFFFF", fontSize: 10 }}>
                        나
                      </span>
                    )}
                  </div>
                </div>

                <StatusBadge status={p.status} isOnline={p.is_online} />
              </div>
            ))}
          </div>
        </div>
      )}

      {decided.length === 0 && pending.length === 0 && (
        <div style={{ textAlign: "center", padding: "56px 0" }}>
          <div style={{ fontSize: 13, color: "#B0ADA8", marginBottom: 6 }}>아직 아무도 없어요</div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: "#D0CCC7",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            Waiting...
          </div>
        </div>
      )}
    </div>
  );
}
