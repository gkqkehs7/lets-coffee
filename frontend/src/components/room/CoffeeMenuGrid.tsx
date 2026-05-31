"use client";

import { useState, useEffect } from "react";
import { getCategoriesByCafe } from "@/lib/menu-data";
import type { CafeId, MenuItem } from "@/lib/types";

interface Props {
  menu: MenuItem[];
  selectedId: string | null;
  onSelectMenu: (item: MenuItem) => void;
  onSelectCustom?: () => void;
  cafeId?: string;
}

function MenuCard({
  item,
  isSelected,
  onClick,
  cafeId,
}: {
  item: MenuItem;
  isSelected: boolean;
  onClick: () => void;
  cafeId?: string;
}) {
  const imagePath    = item.imagePath    ?? null;
  const imagePathHot = item.imagePathHot ?? null;
  const [imgFailed,    setImgFailed]    = useState(false);
  const [imgHotFailed, setImgHotFailed] = useState(false);
  const [imgLoaded,    setImgLoaded]    = useState(false);
  const [hotLoaded,    setHotLoaded]    = useState(false);
  useEffect(() => {
    setImgFailed(false); setImgHotFailed(false);
    setImgLoaded(false); setHotLoaded(false);
  }, [imagePath]);

  const splitReady  = imgLoaded && hotLoaded;
  const singleReady = imgLoaded;
  const hasImage    = !!(imagePath && (imagePathHot ? !imgFailed && !imgHotFailed : !imgFailed));
  const cardLoading = hasImage && (imagePathHot ? !splitReady : !singleReady);

  return (
    <div
      className={cardLoading ? undefined : "card-hover"}
      onClick={cardLoading ? undefined : onClick}
      style={{
        background: cardLoading
          ? undefined
          : isSelected ? "linear-gradient(135deg, #C9A57B22, #6F4E3722)" : "#FFFFFF",
        ...(cardLoading ? {
          background: "linear-gradient(90deg, #F5E6D3 25%, #EDD9C8 50%, #F5E6D3 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s linear infinite",
        } : {}),
        borderRadius: 20,
        padding: "16px 12px",
        border: `2px solid ${cardLoading ? "transparent" : isSelected ? "#6F4E37" : "#F5E6D3"}`,
        textAlign: "center",
        position: "relative",
        minHeight: 110,
        transition: "opacity 0.3s",
      }}
    >
    <div style={{ opacity: cardLoading ? 0 : 1, transition: "opacity 0.25s" }}>
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
      {item.tempFixed && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            padding: "2px 6px",
            borderRadius: 8,
            background: item.tempFixed === "HOT" ? "#FFF3E0" : "#E3F2FD",
            color:      item.tempFixed === "HOT" ? "#E65100" : "#1565C0",
            fontSize: 9,
            fontWeight: 700,
            lineHeight: 1.4,
          }}
        >
          {item.tempFixed === "HOT" ? "HOT" : "ICE"}
        </div>
      )}
      {imagePath && imagePathHot && !imgFailed && !imgHotFailed ? (
        cafeId === "starbucks" ? (
          /* 스타벅스: 수직 스플릿 */
          <div style={{ width: 56, height: 56, position: "relative", margin: "0 auto 8px", borderRadius: 10, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePathHot} alt="hot" onLoad={() => setHotLoaded(true)} onError={() => setImgHotFailed(true)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", clipPath: "inset(0 23% 0 0)", transform: "translateX(-13px)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePath}    alt="ice"  onLoad={() => setImgLoaded(true)}  onError={() => setImgFailed(true)}    style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", clipPath: "inset(0 0 0 23%)", transform: "translateX(13px)" }} />
          </div>
        ) : (
          /* 기본: 대각선 스플릿 */
          <div style={{ width: 56, height: 56, position: "relative", margin: "0 auto 8px", borderRadius: 10, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePathHot} alt="hot" onLoad={() => setHotLoaded(true)} onError={() => setImgHotFailed(true)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePath}    alt="ice"  onLoad={() => setImgLoaded(true)}  onError={() => setImgFailed(true)}    style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", width: "142%", height: "1.5px", background: "rgba(180,155,130,0.5)", transform: "translate(-50%,-50%) rotate(-45deg)", pointerEvents: "none" }} />
          </div>
        )
      ) : imagePath && !imgFailed ? (
        <div style={{ width: 52, height: 52, margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagePath} alt={item.name} width={52} height={52} onLoad={() => setImgLoaded(true)} style={{ objectFit: "contain", borderRadius: 10 }} onError={() => setImgFailed(true)} />
        </div>
      ) : (
        <div style={{ fontSize: 32, marginBottom: 8 }}>{item.emoji}</div>
      )}
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
    </div>
  );
}

export function CoffeeMenuGrid({ menu, selectedId, onSelectMenu, onSelectCustom, cafeId }: Props) {
  const categories = getCategoriesByCafe((cafeId as CafeId) ?? "starbucks");
  const visibleCategories = categories.filter((cat) => menu.some((m) => m.category === cat.id));
  const [activeCat, setActiveCat] = useState<string>(visibleCategories[0]?.id ?? "");

  // cafeId 바뀌면 첫 번째 카테고리로 리셋
  useEffect(() => {
    setActiveCat(visibleCategories[0]?.id ?? "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cafeId]);

  const activeItems = menu.filter((m) => m.category === activeCat);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 카테고리 탭 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
        }}
      >
        {visibleCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCat(cat.id)}
            style={{
              padding: "7px 14px",
              borderRadius: 15,
              border: activeCat === cat.id ? "2px solid #6F4E37" : "2px solid #F5E6D3",
              background: activeCat === cat.id
                ? "linear-gradient(135deg, #C9A57B, #6F4E37)"
                : "#FFFFFF",
              color: activeCat === cat.id ? "#FFF8F0" : "#8D6E63",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 선택된 카테고리 메뉴 그리드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: 10,
        }}
      >
        {activeItems.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            onClick={() => onSelectMenu(item)}
            cafeId={cafeId}
          />
        ))}
      </div>

    </div>
  );
}
