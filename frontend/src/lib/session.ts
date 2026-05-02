"use client";

const PREFIX = "coffee_order_";

function key(roomId: string) {
  return `${PREFIX}${roomId}`;
}

export interface SessionData {
  user_id: string;
  user_name: string;
  is_host: boolean;
  room_id: string;
}

export function saveSession(data: SessionData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key(data.room_id), JSON.stringify(data));
  } catch {}
}

export function loadSession(roomId: string): SessionData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key(roomId));
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function clearSession(roomId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key(roomId));
  } catch {}
}
