"use client";

import { useState } from "react";
import type { MenuItem, Order, Temperature, Size } from "@/lib/types";

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
  const [size, setSize] = useState<Size>("Grande");
  const [note, setNote] = useState("");

  const canSubmit = isCustom ? customName.trim().length > 0 : true;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      menu_id:    isCustom ? "custom" : menuItem.id,
      menu_name:  isCustom ? customName.trim() : menuItem.name,
      menu_emoji: isCustom ? "✏️" : menuItem.emoji,
      temperature: temp,
      size,
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
          background: "#FFFFFF", borderRadius: 20,
          border: "2px solid #F5E6D3",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 12px rgba(111,78,55,0.08)",
        }}>
          {!isCustom ? (() => {
            // 온도에 따라 표시할 이미지 결정
            const src = temp === "HOT" && menuItem.imagePathHot
              ? menuItem.imagePathHot
              : (menuItem.imagePath ?? (cafeId ? `/cafes/menus/${cafeId}/${menuItem.id}.png` : null));
            return src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={menuItem.name}
                width={80}
                height={80}
                style={{ objectFit: "contain" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = "block";
                }}
              />
            ) : null;
          })() : null}
          <span style={{ fontSize: 48, display: (!isCustom && (menuItem.imagePath ?? menuItem.imagePathHot ?? cafeId)) ? "none" : "block" }}>
            {isCustom ? "✏️" : menuItem.emoji}
          </span>
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
        )}
      </div>

      {/* 온도 */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#6F4E37", marginBottom: 10 }}>
          온도
        </div>
        {fixedTemp ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 20,
              background: fixedTemp === "HOT" ? "#FFF3E0" : "#E3F2FD",
              border:     `1.5px solid ${fixedTemp === "HOT" ? "#FF8C00" : "#42A5F5"}`,
              color:      fixedTemp === "HOT" ? "#E65100" : "#1565C0",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {fixedTemp === "HOT" ? "HOT 전용" : "ICED 전용"}

          </div>
        ) : (
          <div className="toggle-group">
            {(["HOT", "ICED"] as Temperature[]).map((t) => (
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
        )}
      </div>

      {/* 사이즈 */}
      {cafeId !== "mega" && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#6F4E37", marginBottom: 10 }}>
            사이즈
          </div>
          <div className="toggle-group">
            {(["Tall", "Grande", "Venti"] as Size[]).map((s) => (
              <button
                key={s}
                className={`toggle-btn ${size === s ? "active" : ""}`}
                onClick={() => setSize(s)}
                type="button"
              >
                {s === "Tall" ? "S" : s === "Grande" ? "M" : "L"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 메모 */}
      {cafeId !== "mega" && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#6F4E37", marginBottom: 10 }}>
            메모
          </div>
          <input
            className="input-field"
            placeholder="예: 얼음 적게요, 달달하게요 🥰"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      )}

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
