"use client";

import type { Participant } from "@/lib/types";


interface Props {
  participants: Participant[];
  currentUserId: string;
  roomName: string;
  cafeLogoPath: string;
}

export function RoomView({
  participants,
  currentUserId,
  roomName,
  cafeLogoPath,
}: Props) {
  const decided = participants.filter((p) => p.order !== null);
  const ordered = decided.filter((p) => p.order?.menu_id !== "skip");
  const skipped = decided.filter((p) => p.order?.menu_id === "skip");
  const totalCups = ordered.length;
  const decidedCount = decided.length;

  // 음료별 집계
  const drinkGroups: Record<string, {
    name: string;
    emoji: string;
    people: { name: string; note: string; isMe: boolean }[];
    count: number;
  }> = {};
  ordered.forEach((p) => {
    const key = p.order!.menu_name;
    if (!drinkGroups[key]) {
      drinkGroups[key] = { name: key, emoji: p.order!.menu_emoji, people: [], count: 0 };
    }
    drinkGroups[key].people.push({ name: p.user_name, note: p.order!.note, isMe: p.user_id === currentUserId });
    drinkGroups[key].count++;
  });
  const rankedDrinks = Object.values(drinkGroups).sort((a, b) => b.count - a.count);


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
              style={{ objectFit: "contain", flexShrink: 0, mixBlendMode: "multiply" }}
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
          <div style={{
            fontSize: 12, color: "#8D6E63", fontWeight: 600,
            letterSpacing: "0.02em", marginBottom: 10,
          }}>
            음료별 집계
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rankedDrinks.map((drink) => {
              const isMyDrink = drink.people.some((p) => p.isMe);
              return (
              <div
                key={drink.name}
                style={{
                  background: "#FFFFFF", borderRadius: 18,
                  padding: "14px 16px", border: `1.5px solid ${isMyDrink ? "#C9A57B" : "#F0E6D8"}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cafeLogoPath}
                    alt="cafe logo"
                    width={28}
                    height={28}
                    style={{ objectFit: "contain", flexShrink: 0, mixBlendMode: "multiply" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#3E2723" }}>{drink.name}</span>
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
                            {p.note ? `${p.name} · ${p.note}` : p.name}
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
                    <span style={{ fontSize: 12, color: "#8D6E63", marginLeft: 1 }}>명</span>
                  </div>
                </div>
              </div>
              );
            })}
            {skipped.length > 0 && (
              <div style={{
                background: "#FAFAFA", borderRadius: 18,
                padding: "14px 16px", border: "1px solid #F0E6D8",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            let orderText = "";
            if (p.order!.menu_id === "skip") {
              orderText = "안먹어요";
            } else {
              const temp = p.order!.temperature === "HOT" ? "핫" : "아이스";
              orderText = `${temp} ${p.order!.menu_name}`;
              if (p.order!.note) orderText += ` (${p.order!.note})`;
            }
            return (
              <div key={p.user_id} style={{
                background: "#FFFFFF",
                border: "1.5px solid #E8DDD4",
                borderRadius: 14,
                padding: "13px 16px",
                display: "flex", alignItems: "center", gap: 13,
                letterSpacing: "-0.04em",
              }}>
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
                <span style={{ fontSize: 13, color: "#7A5C44", whiteSpace: "nowrap" }}>{orderText}</span>
              </div>
            );
          })}
          {/* 나머지 (고민중) */}
          {participants.filter((p) => p.order === null).map((p) => {
            const isMe = p.user_id === currentUserId;
            return (
              <div key={p.user_id} style={{
                background: "#FFFFFF",
                border: "1.5px solid #E8DDD4",
                borderRadius: 14,
                padding: "13px 16px",
                display: "flex", alignItems: "center", gap: 13,
                letterSpacing: "-0.04em",
                opacity: 0.38,
              }}>
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
                <span style={{ fontSize: 13, color: "#CCBA9A", whiteSpace: "nowrap" }}>
                  고민중<span className="thinking-dots" />
                </span>
              </div>
            );
          })}
        </div>
      </div>


      {/* Bottom spacer for fixed bar */}
      <div style={{ height: 100 }} />
    </div>
  );
}
