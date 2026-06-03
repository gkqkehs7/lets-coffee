"use client";

import { useState } from "react";
import type { CafeId, Participant, Temperature } from "@/lib/types";
import { getMenuByCafe } from "@/lib/menu-data";

type DrinkGroup = {
  name: string; emoji: string;
  temperature: Temperature | null; imagePath: string | null;
  people: { name: string; note: string; isMe: boolean }[];
  count: number;
};

function DrinkCard({ drink, isMyDrink, allReady, onSettled }: {
  drink: DrinkGroup; isMyDrink: boolean; allReady: boolean; onSettled?: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div style={{
      borderRadius: 18,
      padding: "14px 16px",
      ...(!allReady ? {
        background: "linear-gradient(90deg, #F5E6D3 25%, #EDD9C8 50%, #F5E6D3 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s linear infinite",
        border: "1.5px solid transparent",
      } : {
        background: "#FFFFFF",
        border: `1.5px solid ${isMyDrink ? "#C9A57B" : "#F0E6D8"}`,
      }),
    }}>
      <div style={{ opacity: allReady ? 1 : 0, transition: "opacity 0.25s", display: "flex", alignItems: "center", gap: 12 }}>
        {drink.imagePath && !imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={drink.imagePath}
            alt={drink.name}
            width={36}
            height={36}
            style={{ objectFit: "contain", flexShrink: 0 }}
            onLoad={() => onSettled?.()}
            onError={() => { setImgFailed(true); onSettled?.(); }}
          />
        ) : (
          <span style={{ fontSize: 24, flexShrink: 0, width: 36, textAlign: "center" }}>{drink.emoji}</span>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#3E2723" }}>
              {drink.temperature ? `${drink.temperature === "HOT" ? "HOT" : "ICE"} ${drink.name}` : drink.name}
            </span>
            {isMyDrink && (
              <span style={{
                fontSize: 10, fontWeight: 700, color: "#C9A57B",
                background: "#FFF3E0", borderRadius: 999,
                padding: "2px 7px", lineHeight: 1.4,
              }}>나</span>
            )}
          </div>
          <div style={{
            fontSize: 11, color: "#8D6E63", marginTop: 2,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {drink.people.map((p, i) => (
              <span key={i}>
                {i > 0 && ", "}
                <span style={{ fontWeight: p.isMe ? 700 : 400, color: p.isMe ? "#6F4E37" : undefined }}>
                  {p.name}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div style={{ flexShrink: 0, textAlign: "right" }}>
          <span style={{
            fontFamily: "'Gowun Dodum', sans-serif",
            fontSize: 22, fontWeight: 700, color: "#3E2723",
          }}>
            {drink.count}
          </span>
          <span style={{ fontSize: 12, color: "#8D6E63", marginLeft: 1 }}>잔</span>
        </div>
      </div>
    </div>
  );
}

// allReady가 true가 되면 모든 행이 한번에 reveal됨 (안먹어요·고민중 포함)
function ParticipantRow({ p, imgPath, isMe, orderText, isSkip, allReady, onSettled }: {
  p: Participant;
  imgPath: string | null;
  isMe: boolean;
  orderText: string | null; // null = 고민중
  isSkip: boolean;
  allReady: boolean;
  onSettled?: () => void;
}) {
  return (
    <div style={{
      borderRadius: 14,
      padding: "13px 16px",
      display: "flex", alignItems: "center", gap: 13,
      letterSpacing: "-0.04em",
      ...(!allReady ? {
        background: "linear-gradient(90deg, #F5E6D3 25%, #EDD9C8 50%, #F5E6D3 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s linear infinite",
        border: "1.5px solid transparent",
      } : {
        background: "#FFFFFF",
        border: "1.5px solid #E8DDD4",
      }),
    }}>
      <div style={{ opacity: allReady ? 1 : 0, transition: "opacity 0.25s", display: "flex", alignItems: "center", gap: 13, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#2C1A0E" }}>{p.user_name}</span>
          {isMe && (
            <span style={{
              fontSize: 10, fontWeight: 700, color: "#C9A57B",
              background: "#FFF3E0", borderRadius: 999,
              padding: "2px 7px", lineHeight: 1.4, flexShrink: 0,
            }}>나</span>
          )}
        </div>
        {orderText === null ? (
          <span style={{ fontSize: 13, color: "#CCBA9A", whiteSpace: "nowrap" }}>
            고민중<span className="thinking-dots" />
          </span>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
            <span style={{ fontSize: 13, color: "#7A5C44", whiteSpace: "nowrap" }}>{orderText}</span>
            {isSkip ? (
              <div style={{
                width: 28, height: 28, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 900, color: "#B0A098",
                fontFamily: "'Quicksand', sans-serif", letterSpacing: "-0.02em",
                marginLeft: 4,
              }}>pass</div>
            ) : imgPath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgPath}
                alt={orderText}
                width={28}
                height={28}
                style={{ objectFit: "contain" }}
                onLoad={() => onSettled?.()}
                onError={() => onSettled?.()}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  participants: Participant[];
  currentUserId: string;
  roomName: string;
  cafeLogoPath: string;
  cafeId?: CafeId;
  onRefresh?: () => Promise<void>;
}

export function RoomView({
  participants,
  currentUserId,
  roomName,
  cafeLogoPath,
  cafeId,
  onRefresh,
}: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh || refreshing) return;
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };
  const decided = participants.filter((p) => p.order !== null);
  const ordered = decided.filter((p) => p.order?.menu_id !== "skip");
  const skipped = decided.filter((p) => p.order?.menu_id === "skip");
  const totalCups = ordered.length;
  const decidedCount = decided.length;

  // 음료별 집계 (hot/ice 별도 그룹)
  const menuData = cafeId ? getMenuByCafe(cafeId) : [];
  const drinkGroups: Record<string, DrinkGroup> = {};
  ordered.forEach((p) => {
    const order = p.order!;
    const key = `${order.menu_name}_${order.temperature ?? ""}`;
    if (!drinkGroups[key]) {
      const menuItem = menuData.find((m) => m.id === order.menu_id);
      const imgPath =
        order.temperature === "HOT" && menuItem?.imagePathHot
          ? menuItem.imagePathHot
          : (menuItem?.imagePath ?? null);
      drinkGroups[key] = {
        name: order.menu_name, emoji: order.menu_emoji,
        temperature: order.temperature, imagePath: imgPath,
        people: [], count: 0,
      };
    }
    drinkGroups[key].people.push({ name: p.user_name, note: order.note, isMe: p.user_id === currentUserId });
    drinkGroups[key].count++;
  });
  const rankedDrinks = Object.values(drinkGroups).sort((a, b) => b.count - a.count);

  const totalPrice = ordered.reduce((sum, p) => {
    const menuItem = menuData.find((m) => m.id === p.order!.menu_id);
    return sum + (menuItem?.price ?? 3000);
  }, 0);

  // 음료별 집계: 이미지 있는 카드가 모두 settle되면 안먹어요 포함 전체를 한번에 reveal
  const drinkImgCount = rankedDrinks.filter((d) => !!d.imagePath).length;
  const [drinkSettledCount, setDrinkSettledCount] = useState(0);
  const drinksReady = drinkImgCount === 0 || drinkSettledCount >= drinkImgCount;
  const handleDrinkSettled = () => setDrinkSettledCount((c) => c + 1);

  // 팀원 현황: 이미지 있는 행이 모두 settle되면 전체 행을 한번에 reveal
  const participantImgCount = participants.filter((p) => {
    if (!p.order || p.order.menu_id === "skip") return false;
    const m = menuData.find((m) => m.id === p.order!.menu_id);
    const img = p.order.temperature === "HOT" && m?.imagePathHot ? m.imagePathHot : (m?.imagePath ?? null);
    return !!img;
  }).length;
  const [settledCount, setSettledCount] = useState(0);
  const participantsReady = participantImgCount === 0 || settledCount >= participantImgCount;
  const handleParticipantSettled = () => setSettledCount((c) => c + 1);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* ── Hero ── */}
      <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h1 style={{
                fontFamily: "'Gowun Dodum', sans-serif",
                fontSize: 30, color: "#3E2723", lineHeight: 1.25, fontWeight: 700,
              }}>
                {roomName}의<br />커피 주문
              </h1>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cafeLogoPath}
              alt="cafe logo"
              width={64}
              height={64}
              style={{ objectFit: "contain", flexShrink: 0, mixBlendMode: "multiply", borderRadius: 16 }}
            />
        </div>
      </div>

      {/* ── Stats Card ── */}
      <div style={{
        background: "#3A1E0E", borderRadius: 20, padding: "18px 22px",
        marginBottom: 20, color: "#FFF8F0",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 6, letterSpacing: "0.04em" }}>전체 주문</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
              <span style={{
                fontFamily: "'Gowun Dodum', sans-serif",
                fontSize: 44, fontWeight: 700, lineHeight: 1,
              }}>
                {totalCups}
              </span>
              <span style={{ fontSize: 18, opacity: 0.8, marginBottom: 4 }}>잔</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontFamily: "'Gowun Dodum', sans-serif",
              fontSize: 30, fontWeight: 700, lineHeight: 1,
            }}>
              {decidedCount}/{participants.length}
            </div>
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 5 }}>입력 완료</div>
          </div>
        </div>
        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 7, marginTop: 2 }}>
          {participants.map((_, i) => (
            <div
              key={i}
              style={{
                width: 10, height: 10, borderRadius: "50%",
                background: i < decidedCount ? "#C9A57B" : "rgba(255,248,240,0.2)",
                border: i < decidedCount ? "none" : "1.5px solid rgba(255,248,240,0.4)",
              }}
            />
          ))}
        </div>
      </div>


      {/* ── 음료별 집계 ── */}
      {(rankedDrinks.length > 0 || skipped.length > 0) && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{
              fontSize: 12, color: "#8D6E63", fontWeight: 600,
              letterSpacing: "0.02em",
            }}>
              음료별 집계
            </div>
            {onRefresh && (
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                style={{
                  background: "none", border: "none",
                  cursor: refreshing ? "default" : "pointer",
                  padding: "0 4px",
                  opacity: refreshing ? 0.4 : 0.7,
                  transition: "opacity 0.15s",
                  display: "flex", alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{
                  display: "inline-block", fontSize: 24, lineHeight: 1, fontWeight: 900,
                  animation: refreshing ? "spin 0.7s linear infinite" : "none",
                }}>↻</span>
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rankedDrinks.map((drink) => (
              <DrinkCard
                key={`${drink.name}_${drink.temperature ?? ""}`}
                drink={drink}
                isMyDrink={drink.people.some((p) => p.isMe)}
                allReady={drinksReady}
                onSettled={drink.imagePath ? handleDrinkSettled : undefined}
              />
            ))}
            {skipped.length > 0 && (
              <div style={{
                borderRadius: 18,
                padding: "14px 16px",
                ...(!drinksReady ? {
                  background: "linear-gradient(90deg, #F5E6D3 25%, #EDD9C8 50%, #F5E6D3 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.4s linear infinite",
                  border: "1.5px solid transparent",
                } : {
                  background: "#FAFAFA",
                  border: "1px solid #F0E6D8",
                }),
              }}>
                <div style={{ opacity: drinksReady ? 1 : 0, transition: "opacity 0.25s", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 28, height: 28, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 900, color: "#B0A098",
                    fontFamily: "'Quicksand', sans-serif", letterSpacing: "-0.02em",
                  }}>
                    pass
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#8D6E63" }}>
                      안먹어요
                    </div>
                    <div style={{
                      fontSize: 11, color: "#B0A098", marginTop: 2,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {skipped.map((p) => p.user_name).join(", ")}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <span style={{
                      fontFamily: "'Gowun Dodum', sans-serif",
                      fontSize: 22, fontWeight: 700, color: "#8D6E63",
                    }}>
                      {skipped.length}
                    </span>
                    <span style={{ fontSize: 12, color: "#B0A098", marginLeft: 1 }}>명</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {totalPrice > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6, marginTop: 10 }}>
              <span style={{ fontSize: 12, color: "#8D6E63" }}>총</span>
              <span style={{
                fontFamily: "'Gowun Dodum', sans-serif",
                fontSize: 18, fontWeight: 700, color: "#3E2723",
              }}>
                {totalPrice.toLocaleString()}원
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── 팀원 현황 ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 12, color: "#8D6E63", fontWeight: 600,
          letterSpacing: "0.02em", marginBottom: 10,
        }}>
          팀원 현황
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* 주문완료 */}
          {participants.filter((p) => p.order !== null).map((p) => {
            const isMe = p.user_id === currentUserId;
            const order = p.order!;
            const isSkip = order.menu_id === "skip";
            const orderText = isSkip ? "안먹어요" : `${order.temperature === "HOT" ? "HOT" : "ICE"} ${order.menu_name}`;
            const menuItem = menuData.find((m) => m.id === order.menu_id);
            const imgPath = !isSkip
              ? (order.temperature === "HOT" && menuItem?.imagePathHot
                  ? menuItem.imagePathHot
                  : (menuItem?.imagePath ?? null))
              : null;
            return (
              <ParticipantRow
                key={p.user_id}
                p={p}
                imgPath={imgPath}
                isMe={isMe}
                orderText={orderText}
                isSkip={isSkip}
                allReady={participantsReady}
                onSettled={imgPath ? handleParticipantSettled : undefined}
              />
            );
          })}
          {/* 고민중 */}
          {participants.filter((p) => p.order === null).map((p) => (
            <ParticipantRow
              key={p.user_id}
              p={p}
              imgPath={null}
              isMe={p.user_id === currentUserId}
              orderText={null}
              isSkip={false}
              allReady={participantsReady}
            />
          ))}
        </div>
      </div>


      {/* Bottom spacer for fixed bar */}
      <div style={{ height: 100 }} />
    </div>
  );
}
