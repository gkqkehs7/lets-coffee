from fastapi import APIRouter, HTTPException

from core.room_manager import room_manager
from models.schemas import (
    CreateRoomRequest,
    CreateRoomResponse,
    JoinRoomRequest,
    JoinRoomResponse,
    RoomResponse,
)

router = APIRouter(prefix="/api/rooms", tags=["rooms"])


@router.post("", response_model=CreateRoomResponse)
async def create_room(body: CreateRoomRequest) -> CreateRoomResponse:
    room, host = await room_manager.create_room(body.room_name, body.host_name)
    return CreateRoomResponse(
        room_id=room.room_id,
        user_id=host.user_id,
        user_name=host.user_name,
        room_name=room.room_name,
    )


@router.get("/{room_id}", response_model=RoomResponse)
async def get_room(room_id: str) -> RoomResponse:
    room = await room_manager.get_room(room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="방을 찾을 수 없어요")
    return RoomResponse(
        room_id=room.room_id,
        room_name=room.room_name,
        is_closed=room.is_closed,
        participants=list(room.participants.values()),
    )


@router.post("/{room_id}/join", response_model=JoinRoomResponse)
async def join_room(room_id: str, body: JoinRoomRequest) -> JoinRoomResponse:
    room = await room_manager.get_room(room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="방을 찾을 수 없어요")
    participant = await room_manager.join_room(room_id, body.user_name)
    if participant is None:
        raise HTTPException(status_code=404, detail="방을 찾을 수 없어요")
    return JoinRoomResponse(
        user_id=participant.user_id,
        user_name=participant.user_name,
        is_host=participant.is_host,
        room_id=room_id,
    )
