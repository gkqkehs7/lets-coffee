"use client";

import { useState, useEffect } from "react";
import type { MenuItem, Order, Temperature } from "@/lib/types";

interface Props {
  menuItem: MenuItem;
  onSubmit: (order: Order) => void;
  onBack: () => void;
  cafeId?: string;
}

export function OrderOptionsForm({ menuItem, onSubmit, onBack, cafeId }: Props) {
  const isCustom = menuItem.id === "custom";
  const fixedTemp = menuItem.tempFixed ?? null;
  const [customName, setCustomName] = useState("");
  const [temp, setTemp] = useState<Temperature>(
    fixedTemp ?? (menuItem.iced ? "ICED" : "HOT")
  );
  const [note, setNote] = useState("");

  const imgSrc = !isCustom
    ? (temp === "HOT" && menuItem.imagePathHot
        ? menuItem.imagePathHot
        : (menuItem.imagePath ?? (cafeId ? `/cafes/menus/${cafeId}/${menuItem.id}.png` : null)))
    : null;
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  useEffect(() => {
    setImgLoaded(false);
    setImgFailed(false);
  }, [imgSrc]);
  const cardLoading = !!imgSrc && !imgLoaded && !imgFailed;

  const canSubmit = isCustom ? customName.trim().length > 0 : true;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      menu_id:    isCustom ? "custom" : menuItem.id,
      menu_name:  isCustom ? customName.trim() : menuItem.name,
      menu_emoji: isCustom ? "✏️" : menuItem.emoji,
      temperature: temp,
      size: null,
      note,
    });
  };

  return (
    <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 메뉴 헤더 */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {/* 메뉴 카드 */}
        <div style={{
          width: 120, height: 120,
          borderRadius: 20,
          border: `2px solid ${cardLoading ? "transparent" : "#F5E6D3"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 12px rgba(111,78,55,0.08)",
          ...(cardLoading ? {
            background: "linear-gradient(90deg, #F5E6D3 25%, #EDD9C8 50%, #F5E6D3 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s linear infinite",
          } : { background: "#FFFFFF" }),
        }}>
          <div style={{ opacity: cardLoading ? 0 : 1, transition: "opacity 0.25s", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {imgSrc && !imgFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={imgSrc}
                src={imgSrc}
                alt={menuItem.name}
                width={80}
                height={80}
                style={{ objectFit: "contain" }}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgFailed(true)}
              />
            ) : (
              <span style={{ fontSize: 48 }}>{isCustom ? "✏️" : menuItem.emoji}</span>
            )}
          </div>
        </div>

        {isCustom ? (
          <input
            className="input-field"
            placeholder="음료 이름을 입력해주세요"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            autoFocus
            style={{ textAlign: "center", fontSize: 17, fontWeight: 700 }}
          />
        ) : (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'Gowun Dodum', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: "#3E2723",
              }}
            >
              {menuItem.name}
            </div>
            {menuItem.priceIce != null && (
              <div style={{ fontSize: 13, color: "#B0906F", fontWeight: 500, marginTop: 4 }}>
                {(temp === "HOT" && menuItem.priceHot != null ? menuItem.priceHot : menuItem.priceIce).toLocaleString()}원
              </div>
            )}
          </div>
        )}
      </div>

      {/* 온도 */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="toggle-group">
          {(["HOT", "ICED"] as Temperature[])
            .filter((t) => !fixedTemp || t === fixedTemp)
            .map((t) => (
              <button
                key={t}
                className={`toggle-btn ${temp === t ? "active" : ""}`}
                onClick={() => setTemp(t)}
                type="button"
              >
                {t === "HOT" ? "🔥 HOT" : "🧊 ICED"}
              </button>
            ))}
        </div>
      </div>

      {/* 버튼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          type="button"
          className="btn-hover"
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 18,
            background: canSubmit
              ? "linear-gradient(135deg, #C9A57B, #6F4E37)"
              : "#F5E6D3",
            color: canSubmit ? "#FFF8F0" : "#C9A57B",
            border: "none",
            fontSize: 16,
            fontWeight: 700,
            cursor: canSubmit ? "pointer" : "not-allowed",
            fontFamily: "'Gowun Dodum', sans-serif",
          }}
        >
          주문 완료
        </button>
        <button
          type="button"
          className="btn-hover"
          onClick={onBack}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 16,
            background: "#F5E6D3",
            color: "#6F4E37",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          다시 고를게요
        </button>
      </div>
    </div>
  );
}
