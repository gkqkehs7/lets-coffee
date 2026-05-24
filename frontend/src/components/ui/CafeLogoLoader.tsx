"use client";

import { useEffect, useState } from "react";
import { CAFE_LIST } from "@/lib/menu-data";

export function CafeLogoLoader() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 모든 로고 미리 로드
    CAFE_LIST.forEach((cafe) => {
      const img = new Image();
      img.src = cafe.logoPath;
    });

    const interval = setInterval(() => {
      setVisible(false);
      const t = setTimeout(() => {
        setIndex((i) => (i + 1) % CAFE_LIST.length);
        setVisible(true);
      }, 80);
      return () => clearTimeout(t);
    }, 350);
    return () => clearInterval(interval);
  }, []);

  const cafe = CAFE_LIST[index];

  return (
    <div style={{
      minHeight: "100vh", background: "#FFF8F0",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 20,
    }}>
      <div style={{
        width: 80, height: 80,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.15s ease",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cafe.logoPath}
          alt={cafe.name}
          width={72}
          height={72}
          style={{ objectFit: "contain", mixBlendMode: "multiply" }}
        />
      </div>
      <p style={{ color: "#8D6E63", fontSize: 14 }}>방 정보 불러오는 중...</p>
    </div>
  );
}
