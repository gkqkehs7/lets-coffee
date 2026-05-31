from __future__ import annotations

import asyncio
import logging
import socketio

from core.room_manager import room_manager
from models.schemas import Order

logging.basicConfig(level=logging.DEBUG, format="[%(asctime)s] %(levelname)s %(message)s")
log = logging.getLogger("sio")

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
    logger=False,
    engineio_logger=False,
    ping_interval=10,
    ping_timeout=20,
)

# sid → (room_id, user_id)
_connections: dict[str, tuple[str, str]] = {}


async def _broadcast(event: str, data: dict, room_id: str, skip_sid: str | None = None) -> None:
    targets = [(sid, uid) for sid, (r_id, uid) in list(_connections.items()) if r_id == room_id and sid != skip_sid]
    log.debug("[BROADCAST] event=%s room=%s target_users=%s", event, room_id, [t[1] for t in targets])
    for t in targets:
        await sio.emit(event, data, to=t[0])


@sio.event
async def connect(sid: str, environ: dict, auth: dict | None = None) -> None:
    log.debug("[CONNECT] sid=%s  connections_total=%d", sid, len(_connections))


@sio.event
async def disconnect(sid: str) -> None:
    conn = _connections.pop(sid, None)
    log.debug("[DISCONNECT] sid=%s  was_registered=%s  connections_after=%d", sid, conn is not None, len(_connections))
    if conn is None:
        return
    room_id, user_id = conn
    # 짧은 대기 후 재연결 여부 확인 (transport 업그레이드 또는 순간 끊김 대응)
    await asyncio.sleep(2)
    already_reconnected = any(
        u == user_id and r == room_id for r, u in _connections.values()
    )
    if already_reconnected:
        log.debug("[DISCONNECT] user=%s reconnected, skipping participant:left", user_id)
        return
    p = await room_manager.set_online(room_id, user_id, False)
    if p:
        log.debug("[DISCONNECT] broadcasting participant:left user=%s room=%s", user_id, room_id)
        await _broadcast("participant:left", {"user_id": user_id}, room_id)


@sio.on("room:join")
async def room_join(sid: str, data: dict) -> None:
    room_id: str = data.get("room_id", "")
    user_id: str = data.get("user_id", "")
    log.debug("[ROOM:JOIN] sid=%s room=%s user=%s", sid, room_id, user_id)

    room = await room_manager.get_room(room_id)
    if room is None or user_id not in room.participants:
        log.warning("[ROOM:JOIN] REJECTED — room_exists=%s user_in_room=%s", room is not None, user_id in (room.participants if room else {}))
        await sio.emit("error", {"message": "방을 찾을 수 없어요"}, to=sid)
        return

    # 같은 sid가 이미 다른 user로 등록돼 있으면 이전 user를 오프라인 처리
    prev = _connections.get(sid)
    if prev is not None and prev != (room_id, user_id):
        prev_room_id, prev_user_id = prev
        log.warning("[ROOM:JOIN] sid=%s 이미 다른 user(%s)로 등록됨 → 이전 user 오프라인 처리", sid, prev_user_id)
        await room_manager.set_online(prev_room_id, prev_user_id, False)

    _connections[sid] = (room_id, user_id)
    await room_manager.set_online(room_id, user_id, True)

    # 방 안 모든 참가자(신규 포함)에게 최신 상태 브로드캐스트
    room = await room_manager.get_room(room_id)  # set_online 반영된 최신 room 재조회
    participants_in_room = list(room.participants.keys())
    connections_in_room = [uid for r_id, uid in _connections.values() if r_id == room_id]
    log.debug("[ROOM:JOIN] participants_in_room=%s  connections_in_room=%s", participants_in_room, connections_in_room)
    room_state = {
        "room": {
            **room.model_dump(mode="json"),
            "participants": [p.model_dump(mode="json") for p in room.participants.values()],
        }
    }
    await _broadcast("room:state", room_state, room_id)



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
        await _broadcast("participant:updated", {"participant": p.model_dump(mode="json")}, room_id)


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
        await _broadcast("participant:updated", {"participant": p.model_dump(mode="json")}, room_id)


@sio.on("order:edit")
async def order_edit(sid: str, data: dict) -> None:
    conn = _connections.get(sid)
    if conn is None:
        return
    room_id, user_id = conn
    p = await room_manager.edit_order(room_id, user_id)
    if p:
        await _broadcast("participant:updated", {"participant": p.model_dump(mode="json")}, room_id)


@sio.on("room:close")
async def room_close(sid: str, data: dict) -> None:
    conn = _connections.get(sid)
    if conn is None:
        return
    room_id, user_id = conn
    ok, auto_skipped = await room_manager.close_room(room_id, user_id)
    if ok:
        for p in auto_skipped:
            await _broadcast("participant:updated", {"participant": p.model_dump(mode="json")}, room_id)
        await _broadcast("room:closed", {}, room_id)
    else:
        await sio.emit("error", {"message": "마감 권한이 없어요"}, to=sid)
