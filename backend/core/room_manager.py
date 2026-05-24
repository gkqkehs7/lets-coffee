from __future__ import annotations

import asyncio
from typing import Optional

from nanoid import generate

from models.schemas import Order, Participant, Room


def _new_id(size: int = 8) -> str:
    return generate("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", size)


class RoomManager:
    def __init__(self) -> None:
        self._rooms: dict[str, Room] = {}
        self._lock = asyncio.Lock()

    async def create_room(self, room_name: str, host_name: str, cafe_id: str = "starbucks") -> tuple[Room, Participant]:
        async with self._lock:
            room_id = _new_id(8)
            user_id = _new_id(12)
            host = Participant(
                user_id=user_id,
                user_name=host_name,
                is_host=True,
                is_online=True,
                status="thinking",
            )
            room = Room(
                room_id=room_id,
                room_name=room_name,
                host_id=user_id,
                cafe_id=cafe_id,  # type: ignore[arg-type]
                participants={user_id: host},
            )
            self._rooms[room_id] = room
            return room, host

    async def get_room(self, room_id: str) -> Optional[Room]:
        return self._rooms.get(room_id)

    async def join_room(self, room_id: str, user_name: str) -> Optional[Participant]:
        async with self._lock:
            room = self._rooms.get(room_id)
            if room is None:
                return None
            user_id = _new_id(12)
            participant = Participant(
                user_id=user_id,
                user_name=user_name,
                is_host=False,
                is_online=True,
                status="thinking",
            )
            room.participants[user_id] = participant
            return participant

    async def set_online(self, room_id: str, user_id: str, online: bool) -> Optional[Participant]:
        async with self._lock:
            room = self._rooms.get(room_id)
            if room is None:
                return None
            p = room.participants.get(user_id)
            if p is None:
                return None
            p.is_online = online
            return p

    async def submit_order(
        self, room_id: str, user_id: str, order: Order
    ) -> Optional[Participant]:
        async with self._lock:
            room = self._rooms.get(room_id)
            if room is None or room.is_closed:
                return None
            p = room.participants.get(user_id)
            if p is None:
                return None
            p.order = order
            p.status = "decided"
            return p

    async def edit_order(self, room_id: str, user_id: str) -> Optional[Participant]:
        async with self._lock:
            room = self._rooms.get(room_id)
            if room is None or room.is_closed:
                return None
            p = room.participants.get(user_id)
            if p is None:
                return None
            p.order = None
            p.status = "ordering"
            return p

    async def close_room(self, room_id: str, user_id: str) -> bool:
        async with self._lock:
            room = self._rooms.get(room_id)
            if room is None or room.host_id != user_id:
                return False
            room.is_closed = True
            return True


room_manager = RoomManager()
