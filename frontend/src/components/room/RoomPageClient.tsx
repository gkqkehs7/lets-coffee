"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { loadSession, saveSession } from "@/lib/session";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import type { MenuItem, Order, Participant, Room } from "@/lib/types";
import { JoinRoomModal } from "./JoinRoomModal";
import { CoffeeMenuGrid } from "./CoffeeMenuGrid";
import { OrderOptionsForm } from "./OrderOptionsForm";
import { RoomView } from "./RoomView";
import { ShareButton } from "./ShareButton";
import { Confetti } from "@/components/ui/Confetti";
import { Toast } from "@/components/ui/Toast";

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

  const [showConfetti, setShowConfetti] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const socketRef = useRef(connectSocket());
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
    socketRef.current.emit("status:update", { status: "ordering" });
    setParticipants((prev) =>
      prev.map((p) =>
        p.user_id === myUserId ? { ...p, status: "ordering" } : p,
      ),
    );
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
    setView("room");
    setShowConfetti(true);
    showToast("주문 완료! ✨");
  };

  // ── 수정 ──
  const handleEditOrder = () => {
    socketRef.current.emit("order:edit", {});
    socketRef.current.emit("status:update", { status: "editing" });
    setParticipants((prev) =>
      prev.map((p) =>
        p.user_id === myUserId ? { ...p, status: "editing", order: null } : p,
      ),
    );
    setView("menu");
  };

  // ── 메뉴/옵션 취소 (room으로 복귀) ──
  const handleCancelToRoom = () => {
    socketRef.current.emit("status:update", { status: "thinking" });
    setParticipants((prev) =>
      prev.map((p) =>
        p.user_id === myUserId ? { ...p, status: "thinking" } : p,
      ),
    );
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

  // ── 언마운트 시 소켓 해제 ──
  useEffect(() => {
    return () => { disconnectSocket(); };
  }, []);

  // 내가 화면을 보고 있으면 무조건 온라인 — 백엔드 응답을 기다릴 필요 없음
  const displayParticipants = myUserId
    ? participants.map((p) => p.user_id === myUserId ? { ...p, is_online: true } : p)
    : participants;

  const myOrder = displayParticipants.find((p) => p.user_id === myUserId)?.order ?? null;
  const onlineCount = displayParticipants.filter((p) => p.is_online).length;
  const decidedCount = displayParticipants.filter((p) => p.order !== null).length;

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#FFF8F0",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 16,
      }}>
        <div className="animate-float" style={{ fontSize: 48 }}>☕</div>
        <p style={{ color: "#8D6E63", fontSize: 14 }}>방 정보 불러오는 중...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{
        minHeight: "100vh", background: "#FFF8F0",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 16, textAlign: "center", padding: 24,
      }}>
        <div style={{ fontSize: 48 }}>😢</div>
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
      {showJoin && room && <JoinRoomModal roomName={room.room_name} onJoin={handleJoin} />}

      {/* 헤더 */}
      <div style={{
        background: "#FFFFFF",
        padding: "16px 20px 14px",
        borderBottom: "1.5px solid #F5E6D3",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h1 style={{
                fontFamily: "'Gowun Dodum', sans-serif",
                fontSize: 20, color: "#3E2723", lineHeight: 1.2,
              }}>
                {room?.room_name}
              </h1>
              {!isClosed && <ShareButton roomId={roomId} />}
              {isClosed && (
                <span className="chip" style={{ background: "#F5E6D3", color: "#6F4E37", fontSize: 12 }}>
                  ✨ 마감
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: "#8D6E63", marginTop: 3 }}>
              {isClosed
                ? "🔒 주문이 마감됐어요"
                : `${decidedCount}/${onlineCount}명 주문 완료`}
            </div>
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div style={{ flex: 1, padding: "16px 20px", paddingBottom: 120, overflowY: "auto" }}>

        {view === "menu" && !isClosed && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <button
                onClick={handleCancelToRoom}
                style={{
                  background: "#F5E6D3", border: "none", borderRadius: 12,
                  padding: "8px 14px", fontSize: 13, color: "#6F4E37",
                  cursor: "pointer", fontWeight: 600, fontFamily: "inherit",
                }}
              >
                ← 뒤로
              </button>
              <h2 style={{ fontFamily: "'Gowun Dodum', sans-serif", fontSize: 18, color: "#3E2723" }}>
                메뉴 선택 ☕
              </h2>
            </div>
            <CoffeeMenuGrid
              selectedId={selectedMenu?.id ?? null}
              onSelectMenu={handleSelectMenu}
              onSelectCustom={handleSelectCustom}
            />
          </div>
        )}

        {view === "options" && selectedMenu && !isClosed && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <button
                onClick={() => setView("menu")}
                style={{
                  background: "#F5E6D3", border: "none", borderRadius: 12,
                  padding: "8px 14px", fontSize: 13, color: "#6F4E37",
                  cursor: "pointer", fontWeight: 600, fontFamily: "inherit",
                }}
              >
                ← 뒤로
              </button>
              <h2 style={{ fontFamily: "'Gowun Dodum', sans-serif", fontSize: 18, color: "#3E2723" }}>
                옵션 선택
              </h2>
            </div>
            <OrderOptionsForm
              menuItem={selectedMenu}
              onSubmit={handleSubmitOrder}
              onBack={() => setView("menu")}
            />
          </div>
        )}

        {view === "room" && myUserId && (
          <RoomView
            participants={displayParticipants}
            currentUserId={myUserId}
            isHost={isHost}
            roomName={room?.room_name ?? ""}
            isClosed={isClosed}
            onEditOrder={handleEditOrder}
          />
        )}
      </div>

      {/* 하단 바 */}
      {view === "room" && myUserId && (
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 480,
          background: "#FFFFFF",
          borderTop: "1.5px solid #F5E6D3",
          padding: "12px 20px 28px",
          display: "flex", flexDirection: "column", gap: 10,
          zIndex: 200,
        }}>
          {!myOrder && !isClosed && (
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-hover"
                onClick={() => {
                  setView("menu");
                  socketRef.current.emit("status:update", { status: "ordering" });
                  setParticipants((prev) =>
                    prev.map((p) =>
                      p.user_id === myUserId ? { ...p, status: "ordering" } : p,
                    ),
                  );
                }}
                style={{
                  flex: 3, padding: "16px", borderRadius: 18,
                  background: "linear-gradient(135deg, #C9A57B, #6F4E37)",
                  color: "#FFF8F0", border: "none",
                  fontSize: 16, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Gowun Dodum', sans-serif",
                }}
              >
                메뉴 고르러 가기 ☕
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
                안먹기 🙅
              </button>
            </div>
          )}

          {isHost && !isClosed && (
            <button
              className="btn-hover"
              onClick={handleCloseRoom}
              style={{
                width: "100%", padding: "13px", borderRadius: 16,
                background: "#F5E6D3", color: "#6F4E37", border: "none",
                fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              🔒 주문 마감하기
            </button>
          )}

          {isClosed && (
            <div style={{
              padding: "12px", borderRadius: 16,
              background: "linear-gradient(135deg, #F5E6D3, #FFF8F0)",
              border: "1.5px solid #C9A57B",
              textAlign: "center", color: "#6F4E37", fontSize: 14, fontWeight: 600,
            }}>
              ✨ 주문이 마감됐어요! 맛있는 커피 타임 되세요 ☕
            </div>
          )}
        </div>
      )}
    </div>
  );
}
