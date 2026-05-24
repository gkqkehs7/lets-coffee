"use client";

import Image from "next/image";

export function CafeLogoLoader() {
  return (
    <div style={{
      minHeight: "100vh", background: "#FFF8F0",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 20,
    }}>
      <div className="animate-float">
        <Image
          src="/character.png"
          alt="캐릭터"
          width={80}
          height={80}
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
      <p style={{ color: "#8D6E63", fontSize: 14 }}>방 정보 불러오는 중...</p>
    </div>
  );
}
