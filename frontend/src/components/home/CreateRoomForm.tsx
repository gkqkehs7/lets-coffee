"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/session";
import { CAFE_LIST } from "@/lib/menu-data";
import type { CafeId } from "@/lib/types";

export function CreateRoomForm() {
  const router = useRouter();
  const [cafeId, setCafeId] = useState<CafeId>("starbucks");
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
      const res = await api.createRoom(roomName.trim(), hostName.trim(), cafeId);
      saveSession({
        user_id:   res.user_id,
        user_name: res.user_name,
        is_host:   true,
        room_id:   res.room_id,
      });
      router.push(`/room/${res.room_id}`);
    } catch {
      setError("방을 만들지 못했어요. 다시 시도해 주세요.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#F5F3EE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 14,
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "#6B6762",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          Creating room...
        </div>
        <div style={{
          width: 120,
          height: 2,
          background: "#E8E5E0",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            height: "100%",
            width: "35%",
            background: "#D4341A",
            animation: "scanLine 0.9s linear infinite",
          }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F3EE",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 20px",
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* 헤더 */}
        <div className="animate-slide-in" style={{ marginBottom: 28 }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: "#B0ADA8",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}>
            Team Coffee Order
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#1C1C1A",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}>
            커피 뭐드실래요?
          </h1>
          <p style={{ color: "#6B6762", fontSize: 14, marginTop: 6 }}>
            링크 하나로 팀 커피 주문 끝
          </p>
        </div>

        {/* 폼 카드 */}
        <div
          className="animate-slide-in"
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #1C1C1A",
            borderRadius: 4,
            padding: "28px 24px",
            boxShadow: "4px 4px 0 #1C1C1A",
            animationDelay: "0.05s",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* 카페 선택 */}
            <div>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#6B6762",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}>
                카페 선택
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {CAFE_LIST.map((cafe) => {
                  const selected = cafeId === cafe.id;
                  return (
                    <button
                      key={cafe.id}
                      type="button"
                      onClick={() => setCafeId(cafe.id)}
                      style={{
                        flex: 1,
                        padding: "12px 8px",
                        border: selected ? `2px solid ${cafe.color}` : "1.5px solid #D0CCC7",
                        borderRadius: 4,
                        background: selected ? `${cafe.color}0D` : "#FFFFFF",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        transition: "all 0.12s",
                        outline: "none",
                        boxShadow: selected ? `2px 2px 0 ${cafe.color}` : "none",
                      }}
                    >
                      <div style={{
                        width: 36,
                        height: 36,
                        border: `1.5px solid ${selected ? cafe.color : "#D0CCC7"}`,
                        borderRadius: 4,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#FFFFFF",
                        position: "relative",
                      }}>
                        <Image
                          src={cafe.logoPath}
                          alt={cafe.name}
                          width={36}
                          height={36}
                          style={{ objectFit: "contain" }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: selected ? cafe.color : "#6B6762",
                        lineHeight: 1.2,
                        textAlign: "center",
                      }}>
                        {cafe.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ borderTop: "1.5px dashed #D0CCC7" }} />

            <div>
              <label style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#6B6762",
                display: "block",
                marginBottom: 8,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                커피타임 이름
              </label>
              <input
                className="input-field"
                placeholder="오후 3시 커피타임"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                maxLength={50}
              />
            </div>

            <div>
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
                placeholder="민우"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                maxLength={20}
              />
            </div>

            {error && (
              <p style={{ color: "#D4341A", fontSize: 13 }}>{error}</p>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={!canSubmit}
              style={{ padding: "15px", fontSize: 15, width: "100%" }}
            >
              방 만들기
            </button>
          </form>
        </div>

        <p style={{
          textAlign: "center",
          color: "#B0ADA8",
          fontSize: 11,
          marginTop: 16,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.04em",
        }}>
          로그인 없이 바로 시작
        </p>
      </div>
    </div>
  );
}
