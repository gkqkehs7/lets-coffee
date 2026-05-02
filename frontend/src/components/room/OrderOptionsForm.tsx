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
  const [extraShot, setExtraShot] = useState(false);
  const [extraSyrup, setExtraSyrup] = useState(false);
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
      extra_shot:  extraShot,
      extra_syrup: extraSyrup,
      note,
    });
  };

  return (
    <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 메뉴 헤더 */}
      <div
        style={{
          background: "linear-gradient(135deg, #F5E6D3, #FFF8F0)",
          borderRadius: 20,
          padding: "20px",
          textAlign: "center",
          border: "1.5px solid #F5E6D3",
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 8 }}>
          {isCustom ? "✏️" : menuItem.emoji}
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
      </div>

      {/* 사이즈 */}
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

      {/* 추가 옵션 */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#6F4E37", marginBottom: 10 }}>
          추가 옵션
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: "☕ 샷 추가",  val: extraShot,  set: setExtraShot },
            { label: "🍯 시럽 추가", val: extraSyrup, set: setExtraSyrup },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              className="btn-hover"
              onClick={() => opt.set(!opt.val)}
              style={{
                flex: 1,
                padding: "12px 8px",
                borderRadius: 16,
                background: opt.val ? "#6F4E37" : "#F5E6D3",
                color: opt.val ? "#FFF8F0" : "#8D6E63",
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 메모 */}
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

      {/* 버튼 */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          className="btn-hover"
          onClick={onBack}
          style={{
            flex: 1,
            padding: "14px",
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
          ← 다시 고를게요
        </button>
        <button
          type="button"
          className="btn-hover"
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            flex: 2,
            padding: "14px",
            borderRadius: 16,
            background: canSubmit
              ? "linear-gradient(135deg, #C9A57B, #6F4E37)"
              : "#F5E6D3",
            color: canSubmit ? "#FFF8F0" : "#C9A57B",
            border: "none",
            fontSize: 15,
            fontWeight: 700,
            cursor: canSubmit ? "pointer" : "not-allowed",
            fontFamily: "'Gowun Dodum', sans-serif",
          }}
        >
          주문 완료 ✨
        </button>
      </div>
    </div>
  );
}
