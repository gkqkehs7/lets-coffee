export type Temperature = "HOT" | "ICED";
export type Size = "Tall" | "Grande" | "Venti";
export type ParticipantStatus = "thinking" | "ordering" | "editing" | "decided";
export type CafeId = "starbucks" | "mega" | "twosome";

export interface Order {
  menu_id: string;
  menu_name: string;
  menu_emoji: string;
  temperature: Temperature | null;
  size: Size | null;
  note: string;
}

export interface Participant {
  user_id: string;
  user_name: string;
  is_host: boolean;
  is_online: boolean;
  status: ParticipantStatus;
  order: Order | null;
  joined_at: string;
}

export interface Room {
  room_id: string;
  room_name: string;
  host_id: string;
  cafe_id: CafeId;
  is_closed: boolean;
  created_at: string;
  participants: Participant[];
}

export interface MenuItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  iced: boolean;
  imagePath?: string;
  imagePathHot?: string;
  tempFixed?: Temperature;
}

/* REST API 응답 */
export interface CreateRoomResponse {
  room_id: string;
  user_id: string;
  user_name: string;
  room_name: string;
  cafe_id: CafeId;
}

export interface JoinRoomResponse {
  user_id: string;
  user_name: string;
  is_host: boolean;
  room_id: string;
}

/* Socket.IO 이벤트 페이로드 */
export interface RoomStateEvent  { room: Room }
export interface ParticipantEvent { participant: Participant }
export interface ParticipantLeftEvent { user_id: string }
