"use client";

import { useState } from "react";
import { RoomView } from "@/components/room/RoomView";
import { CreateRoomForm } from "@/components/home/CreateRoomForm";
import { JoinRoomModal } from "@/components/room/JoinRoomModal";
import { CafeLogoLoader } from "@/components/ui/CafeLogoLoader";
import { CAFE_LIST } from "@/lib/menu-data";
import type { Participant } from "@/lib/types";

type Screen = "home" | "loading" | "notfound" | "join" | "room";

const SCREENS: { id: Screen; label: string }[] = [
  { id: "home",     label: "홈" },
  { id: "loading",  label: "로딩" },
  { id: "notfound", label: "방없음" },
  { id: "join",     label: "입장 모달" },
  { id: "room",     label: "방 화면" },
];

const MOCK_PARTICIPANTS: Participant[] = [
  {
    user_id: "user-1", user_name: "민우", is_host: true, is_online: true, status: "decided",
    order: { menu_id: "americano", menu_name: "아메리카노", menu_emoji: "☕", temperature: "ICED", size: null, note: "" },
    joined_at: new Date().toISOString(),
  },
  {
    user_id: "user-2", user_name: "지연", is_host: false, is_online: true, status: "decided",
    order: { menu_id: "latte", menu_name: "카페라떼", menu_emoji: "☕", temperature: "HOT", size: null, note: "" },
    joined_at: new Date().toISOString(),
  },
  {
    user_id: "user-3", user_name: "혜원", is_host: false, is_online: true, status: "decided",
    order: { menu_id: "vanilla-latte", menu_name: "바닐라라떼", menu_emoji: "☕", temperature: "ICED", size: null, note: "디카페인" },
    joined_at: new Date().toISOString(),
  },
  {
    user_id: "user-4", user_name: "승현", is_host: false, is_online: true, status: "ordering",
    order: null, joined_at: new Date().toISOString(),
  },
  {
    user_id: "user-5", user_name: "도영", is_host: false, is_online: true, status: "editing",
    order: null, joined_at: new Date().toISOString(),
  },
  {
    user_id: "user-6", user_name: "채원", is_host: false, is_online: true, status: "thinking",
    order: null, joined_at: new Date().toISOString(),
  },
  {
    user_id: "user-7", user_name: "태양", is_host: false, is_online: false, status: "thinking",
    order: null, joined_at: new Date().toISOString(),
  },
  {
    user_id: "user-8", user_name: "수빈", is_host: false, is_online: true, status: "decided",
    order: { menu_id: "skip", menu_name: "안먹을게요", menu_emoji: "🙅", temperature: null, size: null, note: "" },
    joined_at: new Date().toISOString(),
  },
];

export default function PreviewPage() {
  const [screen, setScreen] = useState<Screen>("room");
  const [isClosed, setIsClosed] = useState(false);
  const [currentUser, setCurrentUser] = useState<"host" | "member-ordered" | "member-pending">("host");
  const [cafeId, setCafeId] = useState(CAFE_LIST[0].id);

  const cafe = CAFE_LIST.find((c) => c.id === cafeId) ?? CAFE_LIST[0];
  const currentUserId = currentUser === "host" ? "user-1" : currentUser === "member-ordered" ? "user-2" : "user-4";
  const isHost = currentUser === "host";
  const createdAt = new Date(Date.now() - 14 * 60 * 1000).toISOString();

  return (
    <div style={{ background: "#FFF8F0", minHeight: "100vh" }}>

      {/* 상단 탭 */}
      <div style={{
        position: "sticky", top: 0, zIndex: 300,
        background: "#3E2723", padding: "10px 16px",
        display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 11, color: "#C9A57B", fontWeight: 700, marginRight: 4 }}>화면:</span>
        {SCREENS.map((s) => (
          <button
            key={s.id}
            onClick={() => setScreen(s.id)}
            style={{
              padding: "5px 12px", borderRadius: 8,
              background: screen === s.id ? "#C9A57B" : "rgba(255,255,255,0.1)",
              color: screen === s.id ? "#3E2723" : "#FFF8F0",
              border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 홈 */}
      {screen === "home" && <CreateRoomForm />}

      {/* 로딩 */}
      {screen === "loading" && <CafeLogoLoader />}

      {/* 방없음 */}
      {screen === "notfound" && (
        <div style={{
          minHeight: "calc(100vh - 45px)", background: "#FFF8F0",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 16, textAlign: "center", padding: 24,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/character.png" alt="캐릭터" width={80} height={80} style={{ objectFit: "contain" }} />
          <h2 style={{ fontFamily: "'Gowun Dodum', sans-serif", fontSize: 22, color: "#3E2723" }}>
            방을 찾을 수 없어요
          </h2>
          <p style={{ color: "#8D6E63", fontSize: 14 }}>링크가 만료됐거나 잘못됐어요.</p>
          <button
            onClick={() => setScreen("home")}
            style={{
              marginTop: 8, padding: "12px 24px", borderRadius: 18,
              background: "linear-gradient(135deg, #C9A57B, #6F4E37)",
              color: "#FFF8F0", border: "none", fontSize: 14, fontWeight: 700,
              fontFamily: "'Gowun Dodum', sans-serif", cursor: "pointer",
            }}
          >
            홈으로 돌아가기
          </button>
        </div>
      )}

      {/* 입장 모달 */}
      {screen === "join" && (
        <div style={{ minHeight: "calc(100vh - 45px)", background: "#FFF8F0", position: "relative" }}>
          <JoinRoomModal
            roomName="개발팀 커피타임"
            cafeInfo={cafe}
            onJoin={async () => { alert("입장 클릭"); }}
          />
        </div>
      )}

      {/* 방 화면 */}
      {screen === "room" && (
        <>
          {/* 방 화면 컨트롤 */}
          <div style={{
            background: "#2C1810", padding: "8px 16px",
            display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 11, color: "#C9A57B", fontWeight: 700 }}>카페:</span>
            {CAFE_LIST.map((c) => (
              <button key={c.id} onClick={() => setCafeId(c.id)} style={{
                padding: "3px 9px", borderRadius: 6,
                background: cafeId === c.id ? c.color : "rgba(255,255,255,0.1)",
                color: "#FFF", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}>{c.name}</button>
            ))}
            <span style={{ fontSize: 11, color: "#C9A57B", fontWeight: 700, marginLeft: 6 }}>시점:</span>
            {(["host", "member-ordered", "member-pending"] as const).map((role) => (
              <button key={role} onClick={() => setCurrentUser(role)} style={{
                padding: "3px 9px", borderRadius: 6,
                background: currentUser === role ? "#C9A57B" : "rgba(255,255,255,0.1)",
                color: currentUser === role ? "#3E2723" : "#FFF",
                border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}>
                {role === "host" ? "방장" : role === "member-ordered" ? "주문완료" : "대기중"}
              </button>
            ))}
            <button onClick={() => setIsClosed((v) => !v)} style={{
              padding: "3px 9px", borderRadius: 6, marginLeft: 6,
              background: isClosed ? "#6F4E37" : "rgba(255,255,255,0.1)",
              color: "#FFF", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer",
            }}>
              {isClosed ? "✓ 마감됨" : "마감 토글"}
            </button>
          </div>

          <div style={{ maxWidth: 480, margin: "0 auto", background: "#FFF8F0", minHeight: "calc(100vh - 90px)", padding: "20px 20px 140px" }}>
            <RoomView
              participants={MOCK_PARTICIPANTS}
              currentUserId={currentUserId}
              roomName="개발팀"
              cafeLogoPath={cafe.logoPath}
              onShare={() => alert("링크 복사 완료! ✨")}
            />
          </div>

          {/* Mock 하단 바 */}
          <div style={{
            position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: 480, background: "#FFF8F0",
            padding: "12px 20px 28px", display: "flex", flexDirection: "column", gap: 10, zIndex: 200,
          }}>
            {!isClosed && (
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{
                  flex: 3, padding: "16px", borderRadius: 18,
                  background: "linear-gradient(135deg, #C9A57B, #6F4E37)",
                  color: "#FFF8F0", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Gowun Dodum', sans-serif",
                }}>
                  {MOCK_PARTICIPANTS.find((p) => p.user_id === currentUserId)?.order
                    ? "✏️ 메뉴 수정하기"
                    : "메뉴 고르러 가기 ☕"}
                </button>
                <button style={{
                  flex: 1, padding: "16px", borderRadius: 18,
                  background: "#F5E6D3", color: "#8D6E63",
                  border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}>안먹기 🙅</button>
              </div>
            )}
            {isHost && !isClosed && (
              <button onClick={() => setIsClosed(true)} style={{
                width: "100%", padding: "15px", borderRadius: 18,
                background: "#FFFFFF", color: "#3E2723", border: "1.5px solid #D8C8B8",
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <span>📋</span><span>주문 마감</span>
              </button>
            )}
            {isClosed && (
              <div style={{
                padding: "14px", borderRadius: 18, background: "#FFFFFF",
                border: "1.5px solid #D8C8B8", textAlign: "center", color: "#6F4E37", fontSize: 14, fontWeight: 600,
              }}>
                주문이 마감됐어요! 맛있는 커피 타임 되세요 ☕
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
