"use client";

import { MENU_CATEGORIES } from "@/lib/menu-data";
import type { MenuItem } from "@/lib/types";

interface Props {
  menu: MenuItem[];
  selectedId: string | null;
  onSelectMenu: (item: MenuItem) => void;
  onSelectCustom: () => void;
}

function MenuRow({
  item,
  isSelected,
  onClick,
}: {
  item: MenuItem;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        background: isSelected ? "#FFF8F6" : "#FFFFFF",
        border: "none",
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
        fontFamily: "inherit",
        outline: "none",
        borderLeft: isSelected ? "3px solid #D4341A" : "3px solid transparent",
        transition: "background 0.1s, border-left-color 0.1s",
      }}
    >
      <div style={{
        width: 34,
        height: 34,
        background: "#F5F3EE",
        border: `1.5px solid ${isSelected ? "#D4341A" : "#D0CCC7"}`,
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        flexShrink: 0,
        transition: "border-color 0.1s",
      }}>
        {item.emoji}
      </div>
      <span style={{
        fontSize: 14,
        fontWeight: 600,
        color: isSelected ? "#D4341A" : "#1C1C1A",
        flex: 1,
        transition: "color 0.1s",
      }}>
        {item.name}
      </span>
      {isSelected ? (
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "#D4341A",
          fontWeight: 500,
          letterSpacing: "0.04em",
          flexShrink: 0,
        }}>
          선택됨
        </span>
      ) : (
        <span style={{ color: "#B0ADA8", fontSize: 14, flexShrink: 0 }}>›</span>
      )}
    </button>
  );
}

export function CoffeeMenuGrid({ menu, selectedId, onSelectMenu, onSelectCustom }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {MENU_CATEGORIES.map((cat) => {
        const items = menu.filter((m) => m.category === cat.id);
        if (items.length === 0) return null;
        return (
          <div key={cat.id}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              fontWeight: 500,
              color: "#B0ADA8",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
              paddingBottom: 6,
              borderBottom: "1px solid #1C1C1A",
            }}>
              {cat.label}
            </div>
            <div style={{
              border: "1.5px solid #D0CCC7",
              borderRadius: 4,
              overflow: "hidden",
            }}>
              {items.map((item, idx) => (
                <div key={item.id} style={{
                  borderBottom: idx < items.length - 1 ? "1px solid #F0EDE8" : "none",
                }}>
                  <MenuRow
                    item={item}
                    isSelected={selectedId === item.id}
                    onClick={() => onSelectMenu(item)}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* 직접 입력 */}
      <div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          fontWeight: 500,
          color: "#B0ADA8",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 8,
          paddingBottom: 6,
          borderBottom: "1px solid #1C1C1A",
        }}>
          기타
        </div>
        <button
          onClick={onSelectCustom}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px",
            border: `1.5px dashed ${selectedId === "custom" ? "#D4341A" : "#D0CCC7"}`,
            borderRadius: 4,
            background: selectedId === "custom" ? "#FFF8F6" : "#FFFFFF",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            fontFamily: "inherit",
            outline: "none",
            transition: "all 0.12s",
          }}
        >
          <div style={{
            width: 34,
            height: 34,
            background: "#F5F3EE",
            border: `1.5px solid ${selectedId === "custom" ? "#D4341A" : "#D0CCC7"}`,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            flexShrink: 0,
          }}>
            ✏️
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: selectedId === "custom" ? "#D4341A" : "#1C1C1A" }}>
              직접 입력
            </div>
            <div style={{ fontSize: 12, color: "#B0ADA8", marginTop: 1 }}>
              메뉴에 없는 음료
            </div>
          </div>
          <span style={{ color: selectedId === "custom" ? "#D4341A" : "#B0ADA8", fontSize: 14 }}>›</span>
        </button>
      </div>
    </div>
  );
}
