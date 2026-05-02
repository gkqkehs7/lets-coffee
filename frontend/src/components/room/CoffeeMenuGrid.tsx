"use client";

import { COFFEE_MENU, MENU_CATEGORIES } from "@/lib/menu-data";
import type { MenuItem } from "@/lib/types";

interface Props {
  selectedId: string | null;
  onSelectMenu: (item: MenuItem) => void;
  onSelectCustom: () => void;
}

function MenuCard({
  item,
  isSelected,
  onClick,
}: {
  item: MenuItem;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="card-hover"
      onClick={onClick}
      style={{
        background: isSelected
          ? "linear-gradient(135deg, #C9A57B22, #6F4E3722)"
          : "#FFFFFF",
        borderRadius: 20,
        padding: "16px 12px",
        border: `2px solid ${isSelected ? "#6F4E37" : "#F5E6D3"}`,
        textAlign: "center",
        position: "relative",
      }}
    >
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 18,
            height: 18,
            borderRadius: 9,
            background: "#6F4E37",
            color: "#FFF8F0",
            fontSize: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✓
        </div>
      )}
      <div
        style={{
          fontSize: 32,
          marginBottom: 8,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
        }}
      >
        {item.emoji}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: isSelected ? "#3E2723" : "#6F4E37",
          lineHeight: 1.3,
        }}
      >
        {item.name}
      </div>
    </div>
  );
}

export function CoffeeMenuGrid({ selectedId, onSelectMenu, onSelectCustom }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {MENU_CATEGORIES.map((cat) => (
        <div key={cat.id}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#6F4E37",
              marginBottom: 12,
            }}
          >
            {cat.label}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: 10,
            }}
          >
            {COFFEE_MENU.filter((m) => m.category === cat.id).map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                isSelected={selectedId === item.id}
                onClick={() => onSelectMenu(item)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* 기타 직접 입력 */}
      <div>
        <h3
          style={{ fontSize: 14, fontWeight: 700, color: "#6F4E37", marginBottom: 12 }}
        >
          ✏️ 기타
        </h3>
        <div
          className="card-hover"
          onClick={onSelectCustom}
          style={{
            background:
              selectedId === "custom"
                ? "linear-gradient(135deg, #C9A57B22, #6F4E3722)"
                : "#FFFFFF",
            borderRadius: 20,
            padding: "20px 16px",
            border: `2px dashed ${selectedId === "custom" ? "#6F4E37" : "#C9A57B"}`,
            textAlign: "center",
            position: "relative",
          }}
        >
          {selectedId === "custom" && (
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 18,
                height: 18,
                borderRadius: 9,
                background: "#6F4E37",
                color: "#FFF8F0",
                fontSize: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✓
            </div>
          )}
          <div style={{ fontSize: 32, marginBottom: 8 }}>✏️</div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#8D6E63",
              lineHeight: 1.4,
            }}
          >
            직접 입력
            <br />
            <span style={{ fontWeight: 400, color: "#C9A57B" }}>
              메뉴에 없는 음료
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
