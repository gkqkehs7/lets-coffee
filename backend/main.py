import os

import socketio
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from api.menu import router as menu_router
from api.rooms import router as rooms_router
from core.sio import sio

# ── FastAPI 앱 ──
app = FastAPI(title="☕ 커피 뭐드실래요? API")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rooms_router)
app.include_router(menu_router)

# ── Socket.IO ASGI 마운트 ──
asgi_app = socketio.ASGIApp(sio, other_asgi_app=app)


@app.get("/")
async def root():
    return {"message": "☕ 커피 뭐드실래요? API"}


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:asgi_app", host="0.0.0.0", port=port, reload=True)
