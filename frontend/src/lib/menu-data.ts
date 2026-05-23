import type { CafeId, MenuItem } from "./types";

export const MENU_CATEGORIES = [
  { id: "coffee",     label: "☕ 커피" },
  { id: "decaf",      label: "💤 디카페인" },
  { id: "non-coffee", label: "🍵 논커피" },
] as const;

export interface CafeInfo {
  id: CafeId;
  name: string;
  logoPath: string;
  color: string;
}

export const CAFE_LIST: CafeInfo[] = [
  { id: "starbucks", name: "스타벅스",    logoPath: "/cafes/starbucks.png", color: "#00704A" },
  { id: "mega",      name: "메가커피",    logoPath: "/cafes/mega.png",      color: "#FFD600" },
  { id: "twosome",   name: "투썸플레이스", logoPath: "/cafes/twosome.png",   color: "#C8102E" },
];

const STARBUCKS: MenuItem[] = [
  { id: "americano",       name: "아메리카노",         emoji: "☕", category: "coffee",     iced: true },
  { id: "latte",           name: "카페라떼",           emoji: "🥛", category: "coffee",     iced: true },
  { id: "cappuccino",      name: "카푸치노",           emoji: "☁️", category: "coffee",     iced: false },
  { id: "vanilla_latte",   name: "바닐라라떼",         emoji: "🤍", category: "coffee",     iced: true },
  { id: "caramel_mac",     name: "카라멜마키아또",     emoji: "🍮", category: "coffee",     iced: true },
  { id: "mocha",           name: "카페모카",           emoji: "🍫", category: "coffee",     iced: true },
  { id: "espresso",        name: "에스프레소",         emoji: "⚡", category: "coffee",     iced: false },
  { id: "cold_brew",       name: "콜드브루",           emoji: "🧊", category: "coffee",     iced: true },
  { id: "java_chip",       name: "자바칩 프라푸치노",  emoji: "🍪", category: "coffee",     iced: true },
  { id: "decaf",           name: "디카페인 아메리카노", emoji: "💤", category: "decaf",      iced: true },
  { id: "green_latte",     name: "그린티라떼",         emoji: "🍵", category: "non-coffee", iced: true },
  { id: "green_frappuccino", name: "그린티 프라푸치노", emoji: "🍵", category: "non-coffee", iced: true },
  { id: "strawberry_frappuccino", name: "딸기 프라푸치노", emoji: "🍓", category: "non-coffee", iced: true },
  { id: "lemonade",        name: "레몬에이드",         emoji: "🍋", category: "non-coffee", iced: true },
];

const MEGA: MenuItem[] = [
  { id: "americano",       name: "아메리카노",         emoji: "☕", category: "coffee",     iced: true },
  { id: "latte",           name: "카페라떼",           emoji: "🥛", category: "coffee",     iced: true },
  { id: "vanilla_latte",   name: "바닐라라떼",         emoji: "🤍", category: "coffee",     iced: true },
  { id: "caramel_latte",   name: "카라멜라떼",         emoji: "🍮", category: "coffee",     iced: true },
  { id: "mocha",           name: "카페모카",           emoji: "🍫", category: "coffee",     iced: true },
  { id: "espresso",        name: "에스프레소",         emoji: "⚡", category: "coffee",     iced: false },
  { id: "cold_brew",       name: "콜드브루",           emoji: "🧊", category: "coffee",     iced: true },
  { id: "blacksugar_latte", name: "흑당라떼",          emoji: "🍯", category: "coffee",     iced: true },
  { id: "strawberry_latte", name: "딸기라떼",          emoji: "🍓", category: "coffee",     iced: true },
  { id: "cheese_latte",    name: "황치즈라떼",         emoji: "🧀", category: "coffee",     iced: true },
  { id: "icecream_latte",  name: "아이스크림라떼",     emoji: "🍨", category: "coffee",     iced: true },
  { id: "decaf",           name: "디카페인 아메리카노", emoji: "💤", category: "decaf",      iced: true },
  { id: "choco_latte",     name: "초코라떼",           emoji: "🍫", category: "non-coffee", iced: true },
  { id: "milk_tea",        name: "버블밀크티",         emoji: "🧋", category: "non-coffee", iced: true },
  { id: "lemonade",        name: "레몬에이드",         emoji: "🍋", category: "non-coffee", iced: true },
];

const TWOSOME: MenuItem[] = [
  { id: "americano",       name: "아메리카노",         emoji: "☕", category: "coffee",     iced: true },
  { id: "latte",           name: "카페라떼",           emoji: "🥛", category: "coffee",     iced: true },
  { id: "cappuccino",      name: "카푸치노",           emoji: "☁️", category: "coffee",     iced: false },
  { id: "vanilla_latte",   name: "바닐라라떼",         emoji: "🤍", category: "coffee",     iced: true },
  { id: "caramel_mac",     name: "카라멜마키아또",     emoji: "🍮", category: "coffee",     iced: true },
  { id: "mocha",           name: "카페모카",           emoji: "🍫", category: "coffee",     iced: true },
  { id: "espresso",        name: "에스프레소",         emoji: "⚡", category: "coffee",     iced: false },
  { id: "cold_brew",       name: "콜드브루",           emoji: "🧊", category: "coffee",     iced: true },
  { id: "strawberry_latte", name: "딸기라떼",          emoji: "🍓", category: "coffee",     iced: true },
  { id: "decaf",           name: "디카페인 아메리카노", emoji: "💤", category: "decaf",      iced: true },
  { id: "matcha_latte",    name: "말차라떼",           emoji: "🍵", category: "non-coffee", iced: true },
  { id: "choco_latte",     name: "초코라떼",           emoji: "🍫", category: "non-coffee", iced: true },
  { id: "earl_grey_latte", name: "얼그레이라떼",       emoji: "🫖", category: "non-coffee", iced: true },
  { id: "lemonade",        name: "레몬에이드",         emoji: "🍋", category: "non-coffee", iced: true },
  { id: "grapefruit_ade",  name: "자몽에이드",         emoji: "🍊", category: "non-coffee", iced: true },
];

export const CAFE_MENUS: Record<CafeId, MenuItem[]> = {
  starbucks: STARBUCKS,
  mega:      MEGA,
  twosome:   TWOSOME,
};

export function getMenuByCafe(cafeId: CafeId): MenuItem[] {
  return CAFE_MENUS[cafeId] ?? STARBUCKS;
}

export function getCafeInfo(cafeId: CafeId): CafeInfo {
  return CAFE_LIST.find((c) => c.id === cafeId) ?? CAFE_LIST[0];
}

// 하위 호환 — 기존 코드가 참조하는 경우를 위해 유지
export const COFFEE_MENU = STARBUCKS;
