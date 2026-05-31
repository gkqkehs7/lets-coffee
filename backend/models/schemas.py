from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field


Temperature = Literal["HOT", "ICED"]
Size = Literal["Tall", "Grande", "Venti"]
ParticipantStatus = Literal["thinking", "ordering", "editing", "decided"]
CafeId = Literal["starbucks", "mega", "compose"]


class Order(BaseModel):
    menu_id: str
    menu_name: str
    menu_emoji: str
    temperature: Optional[Temperature] = None
    size: Optional[Size] = None
    note: str = ""


class Participant(BaseModel):
    user_id: str
    user_name: str
    is_host: bool = False
    is_online: bool = True
    status: ParticipantStatus = "thinking"
    order: Optional[Order] = None


class Room(BaseModel):
    room_id: str
    room_name: str
    host_id: str
    cafe_id: CafeId = "starbucks"
    is_closed: bool = False
    participants: dict[str, Participant] = Field(default_factory=dict)


# ── REST API 요청/응답 ──

class CreateRoomRequest(BaseModel):
    room_name: str = Field(min_length=1, max_length=50)
    host_name: str = Field(min_length=1, max_length=20)
    cafe_id: CafeId = "starbucks"


class CreateRoomResponse(BaseModel):
    room_id: str
    user_id: str
    user_name: str
    room_name: str
    cafe_id: CafeId


class JoinRoomRequest(BaseModel):
    user_name: str = Field(min_length=1, max_length=20)


class JoinRoomResponse(BaseModel):
    user_id: str
    user_name: str
    is_host: bool
    room_id: str


class RoomResponse(BaseModel):
    room_id: str
    room_name: str
    cafe_id: CafeId
    is_closed: bool
    participants: list[Participant]


class MenuItemResponse(BaseModel):
    id: str
    name: str
    emoji: str
    category: str
    iced: bool
