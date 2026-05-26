"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { loadSession, saveSession } from "@/lib/session";
import { getSocket } from "@/lib/socket";
import { getCafeInfo, getMenuByCafe, CAFE_LIST } from "@/lib/menu-data";
import type { MenuItem, Order, Participant, Room } from "@/lib/types";
import { JoinRoomModal } from "./JoinRoomModal";
import { CoffeeMenuGrid } from "./CoffeeMenuGrid";
import { OrderOptionsForm } from "./OrderOptionsForm";
import { RoomView } from "./RoomView";
import { Confetti } from "@/components/ui/Confetti";
import { Toast } from "@/components/ui/Toast";
import { CafeLogoLoader } from "@/components/ui/CafeLogoLoader";

type ViewState = "room" | "menu" | "options";

interface Props {
  roomId: string;
}

export function RoomPageClient({ roomId }: Props) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isClosed, setIsClosed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const [view, setView] = useState<ViewState>("room");
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [committedMenu, setCommittedMenu] = useState<MenuItem | null>(null);

  const [showConfetti, setShowConfetti] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const socketRef = useRef(getSocket());
  // userId를 ref에도 저장 — 소켓 재연결 시 room:join 재전송에 사용
  const userIdRef = useRef<string | null>(null);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  // ── 소켓 room:join 전송 (연결 완료 보장) ──
  const joinSocketRoom = useCallback(
    (userId: string) => {
      userIdRef.current = userId;
      const s = socketRef.current;
      console.log("[SOCKET] joinSocketRoom  user=%s  connected=%s", userId, s.connected);
      if (s.connected) {
        console.log("[SOCKET] emit room:join  room=%s user=%s", roomId, userId);
        s.emit("room:join", { room_id: roomId, user_id: userId });
      } else {
        console.log("[SOCKET] not connected yet — room:join will fire on connect event");
      }
    },
    [roomId],
  );

  // ── 소켓 연결/재연결 시 항상 room:join 전송 ──
  useEffect(() => {
    const s = socketRef.current;
    const handleConnect = () => {
      console.log("[SOCKET] connected  sid=%s  userIdRef=%s", s.id, userIdRef.current);
      if (userIdRef.current) {
        console.log("[SOCKET] emit room:join  room=%s user=%s", roomId, userIdRef.current);
        s.emit("room:join", { room_id: roomId, user_id: userIdRef.current });
      }
    };
    const handleDisconnect = (reason: string) => {
      console.log("[SOCKET] disconnected  reason=%s  userIdRef=%s", reason, userIdRef.current);
    };
    s.on("connect", handleConnect);
    s.on("disconnect", handleDisconnect);
    if (!s.connected) s.connect();
    return () => {
      s.off("connect", handleConnect);
      s.off("disconnect", handleDisconnect);
    };
  }, [roomId]);

  // ── 소켓 이벤트 구독 ──
  useEffect(() => {
    const s = socketRef.current;

    s.on("room:state", (data: { room: Room & { participants: Participant[] } }) => {
      const r = data.room;
      console.log("[EVENT] room:state  participants=%o  is_closed=%s", r.participants.map(p => `${p.user_name}(online=${p.is_online})`), r.is_closed);
      setRoom(r);
      setParticipants(r.participants);
      setIsClosed(r.is_closed);
    });

    s.on("participant:joined", (data: { participant: Participant }) => {
      console.log("[EVENT] participant:joined  user=%s", data.participant.user_name);
      setParticipants((prev) => {
        const exists = prev.find((p) => p.user_id === data.participant.user_id);
        if (exists) {
          return prev.map((p) =>
            p.user_id === data.participant.user_id ? data.participant : p,
          );
        }
        return [...prev, data.participant];
      });
    });

    s.on("participant:left", (data: { user_id: string }) => {
      console.log("[EVENT] participant:left  user_id=%s", data.user_id);
      setParticipants((prev) =>
        prev.map((p) =>
          p.user_id === data.user_id ? { ...p, is_online: false } : p,
        ),
      );
    });

    s.on("participant:updated", (data: { participant: Participant }) => {
      console.log("[EVENT] participant:updated  user=%s  status=%s  online=%s", data.participant.user_name, data.participant.status, data.participant.is_online);
      setParticipants((prev) =>
        prev.map((p) =>
          p.user_id === data.participant.user_id ? data.participant : p,
        ),
      );
    });

    s.on("room:closed", () => {
      console.log("[EVENT] room:closed");
      setIsClosed(true);
      showToast("주문이 마감됐어요! ✨");
    });

    s.on("error", (data: { message: string }) => {
      console.error("[EVENT] error from server:", data.message);
    });

    return () => {
      s.off("room:state");
      s.off("participant:joined");
      s.off("participant:left");
      s.off("participant:updated");
      s.off("room:closed");
      s.off("error");
    };
  }, [showToast]);

  // ── 초기 로드 ──
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const roomData = await api.getRoom(roomId);
        if (!mounted) return;
        setRoom(roomData);
        setParticipants(roomData.participants);
        setIsClosed(roomData.is_closed);

        const session = loadSession(roomId);
        if (session) {
          setMyUserId(session.user_id);
          setIsHost(session.is_host);
          joinSocketRoom(session.user_id);
        } else {
          setShowJoin(true);
        }
      } catch {
        if (mounted) setNotFound(true);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [roomId, joinSocketRoom]);

  // ── 이름 입력 후 입장 ──
  const handleJoin = async (name: string) => {
    try {
      console.log("[JOIN] HTTP joinRoom  name=%s", name);
      const res = await api.joinRoom(roomId, name);
      console.log("[JOIN] HTTP joinRoom response  user_id=%s", res.user_id);
      saveSession({
        user_id: res.user_id,
        user_name: res.user_name,
        is_host: res.is_host,
        room_id: roomId,
      });
      setMyUserId(res.user_id);
      setIsHost(res.is_host);
      setShowJoin(false);
      joinSocketRoom(res.user_id);
    } catch {
      showToast("입장에 실패했어요 😢");
    }
  };

  // ── 메뉴 선택 ──
  const handleSelectMenu = (item: MenuItem) => {
    setSelectedMenu(item);
    setView("options");
  };

  const handleSelectCustom = () => {
    handleSelectMenu({ id: "custom", name: "", emoji: "✏️", category: "coffee", iced: true });
  };

  // ── 주문 제출 ──
  const handleSubmitOrder = (order: Order) => {
    socketRef.current.emit("order:submit", { order });
    setParticipants((prev) =>
      prev.map((p) =>
        p.user_id === myUserId ? { ...p, status: "decided", order } : p,
      ),
    );
    setCommittedMenu(selectedMenu);
    setView("room");
    setShowConfetti(true);
  };

  // ── 수정 ──
  const handleEditOrder = () => {
    socketRef.current.emit("order:edit", {});
    setParticipants((prev) =>
      prev.map((p) =>
        p.user_id === myUserId ? { ...p, order: null } : p,
      ),
    );
    setView("menu");
  };

  // ── 메뉴/옵션 취소 (room으로 복귀) ──
  const handleCancelToRoom = () => {
    setView("room");
  };

  // ── 안먹기 ──
  const handleSkip = () => {
    socketRef.current.emit("order:skip", {});
    const skipOrder: Order = {
      menu_id: "skip",
      menu_name: "안먹을게요",
      menu_emoji: "🙅",
      temperature: null,
      size: null,
      note: "",
    };
    setParticipants((prev) =>
      prev.map((p) =>
        p.user_id === myUserId ? { ...p, status: "decided", order: skipOrder } : p,
      ),
    );
    showToast("안먹기로 했어요 🙅");
  };

  // ── 방 마감 ──
  const handleCloseRoom = () => {
    socketRef.current.emit("room:close", {});
    setIsClosed(true);
    showToast("주문이 마감됐어요! ✨");
  };


  // 내가 화면을 보고 있으면 무조건 온라인 — 백엔드 응답을 기다릴 필요 없음
  const displayParticipants = myUserId
    ? participants.map((p) => p.user_id === myUserId ? { ...p, is_online: true } : p)
    : participants;

  const myOrder = displayParticipants.find((p) => p.user_id === myUserId)?.order ?? null;
  const onlineCount = displayParticipants.filter((p) => p.is_online).length;
  const decidedCount = displayParticipants.filter((p) => p.order !== null).length;

  const cafeMenu = room ? getMenuByCafe(room.cafe_id) : [];
  const cafeInfo = room ? getCafeInfo(room.cafe_id) : null;

  if (loading) {
    return <CafeLogoLoader />;
  }

  if (notFound) {
    return (
      <div style={{
        minHeight: "100vh", background: "#FFF8F0",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 16, textAlign: "center", padding: 24,
      }}>
        <img src="/character.png" alt="캐릭터" width={80} height={80} style={{ objectFit: "contain" }} />
        <h2 style={{ fontFamily: "'Gowun Dodum', sans-serif", fontSize: 22, color: "#3E2723" }}>
          방을 찾을 수 없어요
        </h2>
        <p style={{ color: "#8D6E63", fontSize: 14 }}>링크가 만료됐거나 잘못됐어요.</p>
        <a
          href="/"
          style={{
            marginTop: 8, padding: "12px 24px", borderRadius: 18,
            background: "linear-gradient(135deg, #C9A57B, #6F4E37)",
            color: "#FFF8F0", textDecoration: "none", fontSize: 14, fontWeight: 700,
            fontFamily: "'Gowun Dodum', sans-serif",
          }}
        >
          홈으로 돌아가기
        </a>
      </div>
    );
  }


  return (
    <div style={{
      minHeight: "100vh", background: "#FFF8F0",
      display: "flex", flexDirection: "column",
      maxWidth: 480, margin: "0 auto",
    }}>
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      {showJoin && room && <JoinRoomModal roomName={room.room_name} cafeInfo={cafeInfo} onJoin={handleJoin} />}


      {/* 컨텐츠 */}
      <div style={{
        flex: 1, padding: view === "room" ? "20px 20px" : "16px 20px", paddingBottom: 120, overflowY: "auto",
        ...(view === "options" && { display: "flex", flexDirection: "column", justifyContent: "center" }),
      }}>

        {view === "menu" && !isClosed && (
          <>
            <div style={{ display: "flex", flexDirection: "column", marginBottom: 20 }}>
              <div>
                <button
                  onClick={handleCancelToRoom}
                  style={{
                    background: "none", border: "none",
                    color: "#6F4E37", cursor: "pointer", padding: "4px 8px",
                    fontFamily: "inherit", fontSize: 15, fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 4,
                  }}
                >
                  <span>←</span>
                  <span>뒤로가기</span>
                </button>
              </div>
              {cafeInfo && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cafeInfo.logoPath}
                    alt={cafeInfo.name}
                    width={52}
                    height={52}
                    style={{ objectFit: "contain", mixBlendMode: "multiply", display: "block" }}
                  />
                </div>
              )}
            </div>
            <CoffeeMenuGrid
              menu={cafeMenu}
              selectedId={selectedMenu?.id ?? null}
              onSelectMenu={handleSelectMenu}
              onSelectCustom={handleSelectCustom}
              cafeId={room?.cafe_id}
            />
          </>
        )}

        {view === "options" && selectedMenu && !isClosed && (
          <OrderOptionsForm
            menuItem={selectedMenu}
            onSubmit={handleSubmitOrder}
            onBack={() => { setSelectedMenu(committedMenu); setView("menu"); }}
            cafeId={room?.cafe_id}
          />
        )}

        {view === "room" && myUserId && (
          <RoomView
            participants={displayParticipants}
            currentUserId={myUserId}
            roomName={room?.room_name ?? ""}
            cafeLogoPath={cafeInfo?.logoPath ?? ""}
            cafeId={room?.cafe_id}
            onRefresh={async () => {
              const roomData = await api.getRoom(roomId);
              setRoom(roomData);
              setParticipants(roomData.participants);
              setIsClosed(roomData.is_closed);
            }}
          />
        )}
      </div>

      {/* 하단 바 */}
      {view === "room" && myUserId && (
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 480,
          background: "#FFF8F0",
          padding: "12px 20px 28px",
          display: "flex", flexDirection: "column", gap: 10,
          zIndex: 200,
        }}>
          {!isClosed && (
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-hover"
                onClick={() => {
                  myOrder ? handleEditOrder() : setView("menu");
                }}
                style={{
                  flex: 3, padding: "16px", borderRadius: 18,
                  background: "linear-gradient(135deg, #C9A57B, #6F4E37)",
                  color: "#FFF8F0", border: "none",
                  fontSize: 16, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Gowun Dodum', sans-serif",
                }}
              >
                {myOrder ? "메뉴 수정하기" : "메뉴 고르러 가기"}
              </button>
              <button
                className="btn-hover"
                onClick={handleSkip}
                style={{
                  flex: 1, padding: "16px", borderRadius: 18,
                  background: "#F5E6D3", color: "#8D6E63",
                  border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                안먹기
              </button>
            </div>
          )}

          {isHost && !isClosed && (
            <button
              className="btn-hover"
              onClick={handleCloseRoom}
              style={{
                width: "100%", padding: "15px", borderRadius: 18,
                background: "#FFFFFF", color: "#3E2723",
                border: "1.5px solid #D8C8B8",
                fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              주문 마감
            </button>
          )}

          {isClosed && (
            <div style={{
              padding: "14px", borderRadius: 18,
              background: "#FFFFFF",
              border: "1.5px solid #D8C8B8",
              textAlign: "center", color: "#6F4E37", fontSize: 14, fontWeight: 600,
            }}>
              주문이 마감됐어요! 맛있는 커피 타임 되세요 ☕
            </div>
          )}
        </div>
      )}

      {/* 공유 FAB */}
      {view === "room" && !showJoin && (
        <div style={{
          position: "fixed", bottom: isHost && !isClosed ? 160 : 100,
          left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 480,
          pointerEvents: "none", zIndex: 300,
        }}>
          <button
            onClick={async () => {
              const url = `${window.location.origin}/room/${roomId}`;
              try { await navigator.clipboard.writeText(url); } catch {
                const el = document.createElement("textarea");
                el.value = url;
                document.body.appendChild(el); el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
              }
              setLinkCopied(true);
              setTimeout(() => setLinkCopied(false), 2000);
            }}
            style={{
              position: "absolute", right: 20, bottom: 0,
              width: 52, height: 52, borderRadius: "50%",
              background: "#6F4E37",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, boxShadow: "0 4px 16px rgba(111,78,55,0.35)",
              pointerEvents: "auto",
            }}
          >
            {linkCopied ? "✓" : "🔗"}
          </button>
        </div>
      )}
    </div>
  );
}
