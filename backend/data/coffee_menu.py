from typing import Literal

COFFEE_MENU: list[dict] = [
    {"id": "americano",     "name": "아메리카노",        "emoji": "☕", "category": "coffee",     "iced": True},
    {"id": "latte",         "name": "카페라떼",           "emoji": "🥛", "category": "coffee",     "iced": True},
    {"id": "cappuccino",    "name": "카푸치노",            "emoji": "☁️", "category": "coffee",     "iced": False},
    {"id": "vanilla_latte", "name": "바닐라라떼",          "emoji": "🤍", "category": "coffee",     "iced": True},
    {"id": "caramel_mac",   "name": "카라멜마키아또",      "emoji": "🍮", "category": "coffee",     "iced": True},
    {"id": "mocha",         "name": "카페모카",            "emoji": "🍫", "category": "coffee",     "iced": True},
    {"id": "espresso",      "name": "에스프레소",          "emoji": "⚡", "category": "coffee",     "iced": False},
    {"id": "cold_brew",     "name": "콜드브루",            "emoji": "🧊", "category": "coffee",     "iced": True},
    {"id": "decaf",         "name": "디카페인 아메리카노",  "emoji": "💤", "category": "decaf",      "iced": True},
    {"id": "green_latte",   "name": "그린티라떼",          "emoji": "🍵", "category": "non-coffee", "iced": True},
    {"id": "choco_latte",   "name": "초코라떼",            "emoji": "🍫", "category": "non-coffee", "iced": True},
    {"id": "milk_tea",      "name": "밀크티",              "emoji": "🧋", "category": "non-coffee", "iced": True},
    {"id": "lemonade",      "name": "레몬에이드",          "emoji": "🍋", "category": "non-coffee", "iced": True},
]
