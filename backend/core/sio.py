from __future__ import annotations

import socketio

from core.room_manager import room_manager
from models.schemas import Order

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
    logger=False,
    engineio_logger=False,
)

# sid → (room_id, user_id)
_connections: dict[str, tuple[str, str]] = {}


@sio.event
async def connect(sid: str, environ: dict, auth: dict | None = None) -> None:
    pass


@sio.event
async def disconnect(sid: str) -> None:
    conn = _connections.pop(sid, None)
    if conn is None:
        return
    room_id, user_id = conn
    p = await room_manager.set_online(room_id, user_id, False)
    if p:
        await sio.emit(
            "participant:left",
            {"user_id": user_id},
            room=room_id,
            skip_sid=sid,
        )


@sio.on("room:join")
async def room_join(sid: str, data: dict) -> None:
    room_id: str = data.get("room_id", "")
    user_id: str = data.get("user_id", "")

    room = await room_manager.get_room(room_id)
    if room is None or user_id not in room.participants:
        await sio.emit("error", {"message": "방을 찾을 수 없어요"}, to=sid)
        return

    _connections[sid] = (room_id, user_id)
    await sio.enter_room(sid, room_id)
    await room_manager.set_online(room_id, user_id, True)

    # 입장한 본인에게 방 전체 상태 전송
    await sio.emit(
        "room:state",
        {
            "room": {
                **room.model_dump(),
                "participants": [p.model_dump() for p in room.participants.values()],
            }
        },
        to=sid,
    )

    # 다른 참가자들에게 입장 알림
    p = room.participants[user_id]
    await sio.emit(
        "participant:joined",
        {"participant": p.model_dump()},
        room=room_id,
        skip_sid=sid,
    )


@sio.on("status:update")
async def status_update(sid: str, data: dict) -> None:
    conn = _connections.get(sid)
    if conn is None:
        return
    room_id, user_id = conn
    status = data.get("status", "thinking")
    p = await room_manager.update_status(room_id, user_id, status)
    if p:
        await sio.emit(
            "participant:updated",
            {"participant": p.model_dump()},
            room=room_id,
        )


@sio.on("order:submit")
async def order_submit(sid: str, data: dict) -> None:
    conn = _connections.get(sid)
    if conn is None:
        return
    room_id, user_id = conn
    try:
        order = Order(**data.get("order", {}))
    except Exception:
        await sio.emit("error", {"message": "주문 데이터가 잘못됐어요"}, to=sid)
        return
    p = await room_manager.submit_order(room_id, user_id, order)
    if p:
        await sio.emit(
            "participant:updated",
            {"participant": p.model_dump()},
            room=room_id,
        )


@sio.on("order:skip")
async def order_skip(sid: str, data: dict) -> None:
    conn = _connections.get(sid)
    if conn is None:
        return
    room_id, user_id = conn
    order = Order(
        menu_id="skip",
        menu_name="안먹을게요",
        menu_emoji="🙅",
        temperature=None,
        size=None,
    )
    p = await room_manager.submit_order(room_id, user_id, order)
    if p:
        await sio.emit(
            "participant:updated",
            {"participant": p.model_dump()},
            room=room_id,
        )


@sio.on("order:edit")
async def order_edit(sid: str, data: dict) -> None:
    conn = _connections.get(sid)
    if conn is None:
        return
    room_id, user_id = conn
    p = await room_manager.edit_order(room_id, user_id)
    if p:
        await sio.emit(
            "participant:updated",
            {"participant": p.model_dump()},
            room=room_id,
        )


@sio.on("room:close")
async def room_close(sid: str, data: dict) -> None:
    conn = _connections.get(sid)
    if conn is None:
        return
    room_id, user_id = conn
    ok = await room_manager.close_room(room_id, user_id)
    if ok:
        await sio.emit("room:closed", {}, room=room_id)
    else:
        await sio.emit("error", {"message": "마감 권한이 없어요"}, to=sid)
