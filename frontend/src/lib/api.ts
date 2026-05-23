import type {
  CreateRoomResponse,
  JoinRoomResponse,
  MenuItem,
  Room,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  createRoom(roomName: string, hostName: string, cafeId: string): Promise<CreateRoomResponse> {
    return request("/api/rooms", {
      method: "POST",
      body: JSON.stringify({ room_name: roomName, host_name: hostName, cafe_id: cafeId }),
    });
  },

  getRoom(roomId: string): Promise<Room> {
    return request(`/api/rooms/${roomId}`);
  },

  joinRoom(roomId: string, userName: string): Promise<JoinRoomResponse> {
    return request(`/api/rooms/${roomId}/join`, {
      method: "POST",
      body: JSON.stringify({ user_name: userName }),
    });
  },

  getMenu(): Promise<MenuItem[]> {
    return request("/api/menu");
  },
};
