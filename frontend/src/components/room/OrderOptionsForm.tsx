"use client";

import { useState } from "react";
import type { MenuItem, Order, Temperature, Size } from "@/lib/types";

interface Props {
  menuItem: MenuItem;
  onSubmit: (order: Order) => void;
  onBack: () => void;
}

export function OrderOptionsForm({ menuItem, onSubmit, onBack }: Props) {
  const isCustom = menuItem.id === "custom";
  const [customName, setCustomName] = useState("");
  const [temp, setTemp] = useState<Temperature>(menuItem.iced ? "ICED" : "HOT");
  const [size, setSize] = useState<Size>("Grande");
  const [note, setNote] = useState("");

  const canSubmit = isCustom ? customName.trim().length > 0 : true;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      menu_id:     isCustom ? "custom" : menuItem.id,
      menu_name:   isCustom ? customName.trim() : menuItem.name,
      menu_emoji:  isCustom ? "✏️" : menuItem.emoji,
      temperature: temp,
      size,
      note,
    });
  };

  const sectionLabel = (text: string) => (
    <div style={{
      fontSize: 10,
      fontWeight: 700,
      color: "#6B6762",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      marginBottom: 10,
    }}>
      {text}
    </div>
  );

  return (
    <div className="animate-slide-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* 메뉴 헤더 */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        paddingBottom: 16,
        borderBottom: "1.5px solid #1C1C1A",
      }}>
        <div style={{
          width: 48,
          height: 48,
          border: "1.5px solid #D0CCC7",
          borderRadius: 4,
          background: "#F5F3EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          flexShrink: 0,
        }}>
          {isCustom ? "✏️" : menuItem.emoji}
        </div>
        {isCustom ? (
          <input
            className="input-field"
            placeholder="음료 이름을 입력해주세요"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            autoFocus
            style={{ fontSize: 15, fontWeight: 700, flex: 1, width: "auto" }}
          />
        ) : (
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1C1C1A" }}>{menuItem.name}</div>
            <div style={{ fontSize: 12, color: "#6B6762", marginTop: 2 }}>옵션을 선택해주세요</div>
          </div>
        )}
      </div>

      {/* 온도 */}
      <div>
        {sectionLabel("온도")}
        <div className="toggle-group">
          {(["HOT", "ICED"] as Temperature[]).map((t) => (
            <button
              key={t}
              className={`toggle-btn ${temp === t ? "active" : ""}`}
              onClick={() => setTemp(t)}
              type="button"
            >
              {t === "HOT" ? "HOT" : "ICED"}
            </button>
          ))}
        </div>
      </div>

      {/* 사이즈 */}
      <div>
        {sectionLabel("사이즈")}
        <div className="toggle-group">
          {(["Tall", "Grande", "Venti"] as Size[]).map((s) => (
            <button
              key={s}
              className={`toggle-btn ${size === s ? "active" : ""}`}
              onClick={() => setSize(s)}
              type="button"
            >
              {s === "Tall" ? "S · Tall" : s === "Grande" ? "M · Grande" : "L · Venti"}
            </button>
          ))}
        </div>
      </div>

      {/* 메모 */}
      <div>
        {sectionLabel("메모 (선택)")}
        <input
          className="input-field"
          placeholder="얼음 적게, 달달하게 등"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* 버튼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
        <button
          type="button"
          className="btn-primary"
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{ width: "100%", padding: "15px", fontSize: 15 }}
        >
          주문 완료
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={onBack}
          style={{ width: "100%", padding: "12px", fontSize: 14 }}
        >
          다시 고를게요
        </button>
      </div>
    </div>
  );
}
