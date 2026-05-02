from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal, Optional

from pydantic import BaseModel, Field


Temperature = Literal["HOT", "ICED"]
Size = Literal["Tall", "Grande", "Venti"]
ParticipantStatus = Literal["thinking", "ordering", "decided"]


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
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Room(BaseModel):
    room_id: str
    room_name: str
    host_id: str
    is_closed: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    participants: dict[str, Participant] = Field(default_factory=dict)


# ── REST API 요청/응답 ──

class CreateRoomRequest(BaseModel):
    room_name: str = Field(min_length=1, max_length=50)
    host_name: str = Field(min_length=1, max_length=20)


class CreateRoomResponse(BaseModel):
    room_id: str
    user_id: str
    user_name: str
    room_name: str


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
    is_closed: bool
    participants: list[Participant]


class MenuItemResponse(BaseModel):
    id: str
    name: str
    emoji: str
    category: str
    iced: bool
