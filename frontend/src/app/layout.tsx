import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "커피셔틀",
  description: "링크 하나로 팀 커피 주문 끝!",
  icons: {
    icon: "/character.png",
    apple: "/character.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFF8F0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link rel="preload" as="image" href="/cafes/starbucks.png" />
        <link rel="preload" as="image" href="/cafes/mega.png" />
        <link rel="preload" as="image" href="/cafes/twosome.png" />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
