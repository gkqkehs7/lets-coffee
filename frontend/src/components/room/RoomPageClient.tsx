"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { loadSession, saveSession } from "@/lib/session";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { getCafeInfo, getMenuByCafe } from "@/lib/menu-data";
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
  const userIdRef = useRef<string | null>(null);

  const showToast = useCallback((msg: string) => setToast(msg), []);

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
      showToast("주문이 마감됐어요");
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

  const handleJoin = async (name: string) => {
    try {
      console.log("[JOIN] HTTP joinRoom  name=%s", name);
      const res = await api.joinRoom(roomId, name);
      console.log("[JOIN] HTTP joinRoom response  user_id=%s", res.user_id);
      saveSession({
        user_id:   res.user_id,
        user_name: res.user_name,
        is_host:   res.is_host,
        room_id:   roomId,
      });
      setMyUserId(res.user_id);
      setIsHost(res.is_host);
      setShowJoin(false);
      joinSocketRoom(res.user_id);
    } catch {
      showToast("입장에 실패했어요");
    }
  };

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

  const handleSubmitOrder = (order: Order) => {
    socketRef.current.emit("order:submit", { order });
    setParticipants((prev) =>
      prev.map((p) =>
        p.user_id === myUserId ? { ...p, status: "decided", order } : p,
      ),
    );
    setView("room");
    setShowConfetti(true);
    showToast("주문 완료!");
  };

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

  const handleCancelToRoom = () => {
    socketRef.current.emit("status:update", { status: "thinking" });
    setParticipants((prev) =>
      prev.map((p) =>
        p.user_id === myUserId ? { ...p, status: "thinking" } : p,
      ),
    );
    setView("room");
  };

  const handleSkip = () => {
    socketRef.current.emit("order:skip", {});
    const skipOrder: Order = {
      menu_id:     "skip",
      menu_name:   "안먹을게요",
      menu_emoji:  "🙅",
      temperature: null,
      size:        null,
      note:        "",
    };
    setParticipants((prev) =>
      prev.map((p) =>
        p.user_id === myUserId ? { ...p, status: "decided", order: skipOrder } : p,
      ),
    );
    showToast("안먹기로 했어요");
  };

  const handleCloseRoom = () => {
    socketRef.current.emit("room:close", {});
    setIsClosed(true);
    showToast("주문이 마감됐어요");
  };

  useEffect(() => {
    return () => { disconnectSocket(); };
  }, []);

  const displayParticipants = myUserId
    ? participants.map((p) => p.user_id === myUserId ? { ...p, is_online: true } : p)
    : participants;

  const myOrder       = displayParticipants.find((p) => p.user_id === myUserId)?.order ?? null;
  const onlineParticipants = displayParticipants.filter((p) => p.is_online);
  const decidedCount  = displayParticipants.filter((p) => p.order !== null).length;

  const cafeMenu = room ? getMenuByCafe(room.cafe_id) : [];
  const cafeInfo = room ? getCafeInfo(room.cafe_id) : null;

  /* ── 로딩 ── */
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
          Loading...
        </div>
        <div style={{ width: 120, height: 2, background: "#E8E5E0", position: "relative", overflow: "hidden" }}>
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

  /* ── 없는 방 ── */
  if (notFound) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#F5F3EE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
        textAlign: "center",
        padding: 24,
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "#B0ADA8",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}>
          404 Not Found
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1C1C1A", letterSpacing: "-0.01em" }}>
          방을 찾을 수 없어요
        </h2>
        <p style={{ color: "#6B6762", fontSize: 14 }}>링크가 만료됐거나 잘못됐어요.</p>
        <a
          href="/"
          className="btn-secondary"
          style={{ marginTop: 8, padding: "12px 24px", fontSize: 14, textDecoration: "none" }}
        >
          홈으로 돌아가기
        </a>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F3EE",
      display: "flex",
      flexDirection: "column",
      maxWidth: 480,
      margin: "0 auto",
    }}>
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      {showJoin && room && <JoinRoomModal roomName={room.room_name} cafeInfo={cafeInfo} onJoin={handleJoin} />}

      {/* ── 헤더 ── */}
      <div style={{
        background: "#FFFFFF",
        padding: "14px 20px 12px",
        borderBottom: "1.5px solid #1C1C1A",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* 카페 로고 */}
          {cafeInfo && (
            <div style={{
              width: 36,
              height: 36,
              border: `1.5px solid ${cafeInfo.color}`,
              borderRadius: 4,
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
                width={28}
                height={28}
                style={{ objectFit: "contain" }}
              />
            </div>
          )}

          {/* 방 이름 + 프로그레스 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h1 style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1C1C1A",
                letterSpacing: "-0.01em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {room?.room_name}
              </h1>
              {isClosed && (
                <span className="chip" style={{
                  border: "1.5px solid #1C1C1A",
                  color: "#1C1C1A",
                  fontSize: 10,
                  flexShrink: 0,
                }}>
                  마감
                </span>
              )}
            </div>

            {/* 세그먼트 프로그레스 */}
            <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
              {isClosed ? (
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "#6B6762",
                  letterSpacing: "0.04em",
                }}>
                  주문 마감됨
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 3, flex: 1 }}>
                    {onlineParticipants.map((p) => (
                      <div
                        key={p.user_id}
                        style={{
                          flex: 1,
                          height: 5,
                          borderRadius: 2,
                          background: p.order !== null ? "#1C1C1A" : "transparent",
                          border: `1.5px solid ${p.order !== null ? "#1C1C1A" : "#D0CCC7"}`,
                          transition: "background 0.3s ease, border-color 0.3s ease",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: "#6B6762",
                    flexShrink: 0,
                    letterSpacing: "0.02em",
                  }}>
                    {decidedCount}/{onlineParticipants.length}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* 공유 버튼 */}
          {!isClosed && <ShareButton roomId={roomId} />}
        </div>
      </div>

      {/* ── 컨텐츠 ── */}
      <div style={{ flex: 1, padding: "20px 20px", paddingBottom: 130, overflowY: "auto" }}>

        {/* 메뉴 선택 뷰 */}
        {view === "menu" && !isClosed && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <button
                className="btn-ghost"
                onClick={handleCancelToRoom}
                style={{ padding: "6px 0", fontSize: 13 }}
              >
                ← 뒤로
              </button>
              <div style={{ width: 1, height: 14, background: "#D0CCC7" }} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A" }}>
                {cafeInfo ? `${cafeInfo.name} 메뉴` : "메뉴 선택"}
              </h2>
            </div>
            <CoffeeMenuGrid
              menu={cafeMenu}
              selectedId={selectedMenu?.id ?? null}
              onSelectMenu={handleSelectMenu}
              onSelectCustom={handleSelectCustom}
            />
          </div>
        )}

        {/* 옵션 선택 뷰 */}
        {view === "options" && selectedMenu && !isClosed && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <button
                className="btn-ghost"
                onClick={() => setView("menu")}
                style={{ padding: "6px 0", fontSize: 13 }}
              >
                ← 뒤로
              </button>
              <div style={{ width: 1, height: 14, background: "#D0CCC7" }} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1A" }}>옵션 선택</h2>
            </div>
            <OrderOptionsForm
              menuItem={selectedMenu}
              onSubmit={handleSubmitOrder}
              onBack={() => setView("menu")}
            />
          </div>
        )}

        {/* 방 뷰 */}
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

      {/* ── 하단 바 ── */}
      {view === "room" && myUserId && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          background: "#FFFFFF",
          borderTop: "1.5px solid #1C1C1A",
          padding: "14px 20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 200,
        }}>
          {!myOrder && !isClosed && (
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-primary"
                onClick={() => {
                  setView("menu");
                  socketRef.current.emit("status:update", { status: "ordering" });
                  setParticipants((prev) =>
                    prev.map((p) =>
                      p.user_id === myUserId ? { ...p, status: "ordering" } : p,
                    ),
                  );
                }}
                style={{ flex: 3, padding: "15px", fontSize: 15 }}
              >
                메뉴 고르러 가기
              </button>
              <button
                className="btn-secondary"
                onClick={handleSkip}
                style={{ flex: 1, padding: "15px", fontSize: 14 }}
              >
                패스
              </button>
            </div>
          )}

          {isHost && !isClosed && (
            <button
              className="btn-ghost"
              onClick={handleCloseRoom}
              style={{ width: "100%", padding: "11px", fontSize: 13, color: "#6B6762" }}
            >
              주문 마감하기
            </button>
          )}

          {isClosed && (
            <div style={{
              padding: "13px",
              border: "1.5px solid #1C1C1A",
              borderRadius: 4,
              textAlign: "center",
              color: "#1C1C1A",
              fontSize: 13,
              fontWeight: 600,
              background: "#F5F3EE",
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.02em",
            }}>
              주문이 마감됐어요
            </div>
          )}
        </div>
      )}
    </div>
  );
}
