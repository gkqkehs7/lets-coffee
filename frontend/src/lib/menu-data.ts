import type { MenuItem } from "./types";

export const COFFEE_MENU: MenuItem[] = [
  { id: "americano",     name: "아메리카노",       emoji: "☕", category: "coffee",     iced: true },
  { id: "latte",         name: "카페라떼",          emoji: "🥛", category: "coffee",     iced: true },
  { id: "cappuccino",    name: "카푸치노",           emoji: "☁️", category: "coffee",     iced: false },
  { id: "vanilla_latte", name: "바닐라라떼",         emoji: "🤍", category: "coffee",     iced: true },
  { id: "caramel_mac",   name: "카라멜마키아또",     emoji: "🍮", category: "coffee",     iced: true },
  { id: "mocha",         name: "카페모카",           emoji: "🍫", category: "coffee",     iced: true },
  { id: "espresso",      name: "에스프레소",         emoji: "⚡", category: "coffee",     iced: false },
  { id: "cold_brew",     name: "콜드브루",           emoji: "🧊", category: "coffee",     iced: true },
  { id: "decaf",         name: "디카페인 아메리카노", emoji: "💤", category: "decaf",      iced: true },
  { id: "green_latte",   name: "그린티라떼",         emoji: "🍵", category: "non-coffee", iced: true },
  { id: "choco_latte",   name: "초코라떼",           emoji: "🍫", category: "non-coffee", iced: true },
  { id: "milk_tea",      name: "밀크티",             emoji: "🧋", category: "non-coffee", iced: true },
  { id: "lemonade",      name: "레몬에이드",         emoji: "🍋", category: "non-coffee", iced: true },
];

export const MENU_CATEGORIES = [
  { id: "coffee",     label: "☕ 커피" },
  { id: "decaf",      label: "💤 디카페인" },
  { id: "non-coffee", label: "🍵 논커피" },
] as const;
