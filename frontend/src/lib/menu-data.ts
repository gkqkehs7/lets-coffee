import type { CafeId, MenuItem } from "./types";

export interface CafeInfo {
  id: CafeId;
  name: string;
  logoPath: string;
  color: string;
}

export const CAFE_LIST: CafeInfo[] = [
  { id: "mega",      name: "메가커피",    logoPath: "/cafes/mega.png",      color: "#E6B800" },
  { id: "starbucks", name: "스타벅스",    logoPath: "/cafes/starbucks.png", color: "#00704A" },
  { id: "compose",   name: "컴포즈커피",   logoPath: "/cafes/compose.svg",   color: "#FFD700" },
];

// ─── 카테고리 정의 ────────────────────────────────────────────────────────────

const STARBUCKS_CATEGORIES = [
  { id: "에스프레소",            label: "에스프레소" },
  { id: "콜드 브루",             label: "콜드 브루" },
  { id: "브루드 커피",           label: "브루드 커피" },
  { id: "프라푸치노",            label: "프라푸치노" },
  { id: "블렌디드",              label: "블렌디드" },
  { id: "티(타바나)",            label: "티" },
  { id: "기타 제조 음료",        label: "기타 음료" },
  { id: "스타벅스 리프레셔",     label: "리프레셔" },
  { id: "스타벅스 피지오",       label: "피지오" },
  { id: "스타벅스 주스(병음료)", label: "주스" },
] as const;

const MEGA_CATEGORIES = [
  { id: "커피",       label: "커피" },
  { id: "디카페인",   label: "디카페인" },
  { id: "음료",       label: "음료" },
  { id: "티",         label: "티" },
  { id: "에이드&주스", label: "에이드&주스" },
  { id: "신상품",     label: "신상품" },
  { id: "스무디&프라페", label: "스무디&프라페" },
] as const;

const TWOSOME_CATEGORIES = [
  { id: "coffee",     label: "☕ 커피" },
  { id: "decaf",      label: "💤 디카페인" },
  { id: "non-coffee", label: "🍵 논커피" },
] as const;

export function getCategoriesByCafe(cafeId: CafeId): { id: string; label: string }[] {
  if (cafeId === "mega")     return [...MEGA_CATEGORIES];
  if (cafeId === "compose")  return [...TWOSOME_CATEGORIES];
  return [...STARBUCKS_CATEGORIES];
}

// ─── 메가커피 이미지 경로 헬퍼 ────────────────────────────────────────────────

function megaImg(category: string, temp: "hot" | "ice", name: string, ext: "webp" = "webp"): string {
  return `/cafes/menus/mega/${encodeURIComponent(category)}/${temp}/${encodeURIComponent(name)}.${ext}`;
}

// ─── 스타벅스 이미지 경로 헬퍼 ────────────────────────────────────────────────

function sbuxImg(category: string, temp: "hot" | "ice", name: string, ext: "jpg" | "png" = "jpg"): string {
  return `/cafes/menus/starbucks/${encodeURIComponent(category)}/${temp}/${encodeURIComponent(name)}.${ext}`;
}

// ─── 메뉴 데이터 ──────────────────────────────────────────────────────────────
// ─── 스타벅스 ─────────────────────────────────────────────────────────────────
// 폴더 구조: /cafes/menus/starbucks/{카테고리}/{hot|ice}/{메뉴명}.{jpg|png}

const STARBUCKS_NEW: MenuItem[] = [
  // ── 에스프레소 / 통합 (hot + ice 동일명 → 유저가 온도 선택) ──
  { id: "sbux_아메리카노",        name: "카페 아메리카노",         emoji: "☕", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","카페 아메리카노") },
  { id: "sbux_라떼",              name: "카페 라떼",               emoji: "🥛", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","카페 라떼") },
  { id: "sbux_모카",              name: "카페 모카",               emoji: "🍫", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","카페 모카") },
  { id: "sbux_카라멜마키아또",    name: "카라멜 마키아또",         emoji: "🍮", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","카라멜 마키아또") },
  { id: "sbux_바닐라라떼",        name: "바닐라 라떼",             emoji: "🤍", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","바닐라 라떼") },
  { id: "sbux_바닐라빈라떼",      name: "바닐라 빈 라떼",          emoji: "🤍", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","바닐라 빈 라떼") },
  { id: "sbux_화이트모카",        name: "화이트 초콜릿 모카",      emoji: "🍫", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","화이트 초콜릿 모카") },
  { id: "sbux_카푸치노",          name: "카푸치노",                emoji: "☁️", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","카푸치노") },
  { id: "sbux_플랫화이트",        name: "플랫 화이트",             emoji: "🥛", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","플랫 화이트") },
  { id: "sbux_돌체라떼",          name: "돌체 라떼",               emoji: "🍯", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","돌체 라떼") },
  { id: "sbux_꿀호떡라떼",        name: "꿀 호떡 라떼",            emoji: "🍯", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","꿀 호떡 라떼") },
  { id: "sbux_라벤더브레베",      name: "라벤더 카페 브레베",      emoji: "💜", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","라벤더 카페 브레베","png") },
  { id: "sbux_인절미크림라떼",    name: "인절미 크림 라떼",        emoji: "🌾", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","인절미 크림 라떼") },
  // 에스프레소 / HOT 전용
  { id: "sbux_hot_에스프레소",            name: "에스프레소",               emoji: "⚡", category: "에스프레소", iced: false, imagePath: sbuxImg("에스프레소","hot","에스프레소") },
  { id: "sbux_hot_에스프레소마키아또",    name: "에스프레소 마키아또",      emoji: "⚡", category: "에스프레소", iced: false, imagePath: sbuxImg("에스프레소","hot","에스프레소 마키아또") },
  { id: "sbux_hot_에스프레소콘파나",      name: "에스프레소 콘 파나",       emoji: "⚡", category: "에스프레소", iced: false, imagePath: sbuxImg("에스프레소","hot","에스프레소 콘 파나") },
  { id: "sbux_hot_에스프레소플라이트",    name: "에스프레소 플라이트",      emoji: "⚡", category: "에스프레소", iced: false, imagePath: sbuxImg("에스프레소","hot","에스프레소 플라이트") },
  { id: "sbux_hot_에스프레소플라이트도산", name: "에스프레소 플라이트 도산", emoji: "⚡", category: "에스프레소", iced: false, imagePath: sbuxImg("에스프레소","hot","에스프레소 플라이트 도산") },
  { id: "sbux_hot_코르타도",              name: "코르타도",                 emoji: "☕", category: "에스프레소", iced: false, imagePath: sbuxImg("에스프레소","hot","코르타도") },
  { id: "sbux_hot_밀크마라멜라떼",        name: "밀크마라멜 라떼",          emoji: "🥛", category: "에스프레소", iced: false, imagePath: sbuxImg("에스프레소","hot","밀크마라멜 라떼") },
  // 에스프레소 / ICE 전용
  { id: "sbux_ice_밀크카라멜라떼",        name: "밀크카라멜 라떼",              emoji: "🥛", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","밀크카라멜 라떼") },
  { id: "sbux_ice_바닐라더블샷",          name: "바닐라 스타벅스 더블 샷",      emoji: "☕", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","바닐라 스타벅스 더블 샷") },
  { id: "sbux_ice_번트카라멜라떼",        name: "번트 카라멜 라떼",             emoji: "🍮", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","번트 카라멜 라떼") },
  { id: "sbux_ice_사케라또비안코",        name: "사케라또 비안코 오버 아이스",  emoji: "☕", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","사케라또 비안코 오버 아이스") },
  { id: "sbux_ice_사케라또아포가토",      name: "사케라또 아포가토",            emoji: "☕", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","사케라또 아포가토") },
  { id: "sbux_ice_더블샷",               name: "스타벅스 더블 샷",             emoji: "☕", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","스타벅스 더블 샷") },
  { id: "sbux_ice_에어로카노",            name: "스타벅스 에어로카노",          emoji: "☕", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","스타벅스 에어로카노") },
  { id: "sbux_ice_스파클링시트러스",      name: "스파클링 시트러스 에스프레소", emoji: "✨", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","스파클링 시트러스 에스프레소") },
  { id: "sbux_ice_클래식민트모카",        name: "클래식 민트 모카",             emoji: "🌿", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","클래식 민트 모카") },
  { id: "sbux_ice_클래식아포가토",        name: "클래식 아포가토",              emoji: "🍦", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","클래식 아포가토") },
  { id: "sbux_ice_헤이즐넛더블샷",        name: "헤이즐넛 더블 샷",             emoji: "☕", category: "에스프레소", iced: true, imagePath: sbuxImg("에스프레소","ice","헤이즐넛 더블 샷") },

  // ── 콜드 브루 (모두 ICE) ──
  { id: "sbux_ice_나이트로바닐라크림",    name: "나이트로 바닐라 크림",         emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","나이트로 바닐라 크림") },
  { id: "sbux_ice_나이트로콜드브루",      name: "나이트로 콜드 브루",           emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","나이트로 콜드 브루") },
  { id: "sbux_ice_돌체콜드브루",          name: "돌체 콜드 브루",               emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","돌체 콜드 브루") },
  { id: "sbux_ice_리저브나이트로",        name: "리저브 나이트로",              emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","리저브 나이트로") },
  { id: "sbux_ice_리저브콜드브루",        name: "리저브 콜드 브루",             emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","리저브 콜드 브루") },
  { id: "sbux_ice_막걸리크림콜드브루",    name: "막걸리향 크림 콜드 브루",      emoji: "🍶", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","막걸리향 크림 콜드 브루") },
  { id: "sbux_ice_민트콜드브루",          name: "민트 콜드 브루",               emoji: "🌿", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","민트 콜드 브루") },
  { id: "sbux_ice_아인슈페터콜드브루",    name: "바닐라 아인슈페터 콜드브루",   emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","바닐라 아인슈페터 콜드브루") },
  { id: "sbux_ice_바닐라크림콜드브루",    name: "바닐라 크림 콜드 브루",        emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","바닐라 크림 콜드 브루") },
  { id: "sbux_ice_베르가못콜드브루",      name: "베르가못 콜드 브루",           emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","베르가못 콜드 브루") },
  { id: "sbux_ice_블랙화이트콜드브루",    name: "블랙&화이트 콜드 브루",        emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","블랙&화이트 콜드 브루") },
  { id: "sbux_ice_서울막걸리콜드브루",    name: "서울 막걸리향 콜드브루",       emoji: "🍶", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","서울 막걸리향 콜드브루") },
  { id: "sbux_ice_스모크드콜드패션드",    name: "스모크드 콜드 패션드",         emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","스모크드 콜드 패션드") },
  { id: "sbux_ice_시그니처블랙콜드브루",  name: "시그니처 더 블랙 콜드 브루",   emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","시그니처 더 블랙 콜드 브루") },
  { id: "sbux_ice_여수윤슬콜드브루",      name: "여수 윤슬 헤이즐넛 콜드브루",  emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","여수 윤슬 헤이즐넛 콜드브루") },
  { id: "sbux_ice_오트콜드브루",          name: "오트 콜드 브루",               emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","오트 콜드 브루") },
  { id: "sbux_ice_제주비자림콜드브루",    name: "제주 비자림 리저브 콜드 브루", emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","제주 비자림 리저브 콜드 브루") },
  { id: "sbux_ice_콜드브루몰트",          name: "콜드 브루 몰트",               emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","콜드 브루 몰트") },
  { id: "sbux_ice_콜드브루플로트",        name: "콜드 브루 플로트",             emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","콜드 브루 플로트") },
  { id: "sbux_ice_콜드브루",              name: "콜드 브루",                    emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","콜드 브루") },
  { id: "sbux_ice_프렌치바닐라콜드브루",  name: "프렌치 바닐라 콜드 브루",      emoji: "🧊", category: "콜드 브루", iced: true, imagePath: sbuxImg("콜드 브루","ice","프렌치 바닐라 콜드 브루") },

  // ── 브루드 커피 / 통합 ──
  { id: "sbux_브루드커피",               name: "브루드 커피",       emoji: "☕", category: "브루드 커피", iced: true, imagePath: sbuxImg("브루드 커피","ice","브루드 커피") },
  // 브루드 커피 / ICE 전용
  { id: "sbux_ice_스위트밀크커피",       name: "스위트 밀크 커피",  emoji: "🥛", category: "브루드 커피", iced: true, imagePath: sbuxImg("브루드 커피","ice","스위트 밀크 커피") },

  // ── 프라푸치노 (모두 ICE) ──
  { id: "sbux_ice_더블에스프레소칩프라푸",  name: "더블 에스프레소 칩 프라푸치노",          emoji: "☕", category: "프라푸치노", iced: true, imagePath: sbuxImg("프라푸치노","ice","더블 에스프레소 칩 프라푸치노") },
  { id: "sbux_ice_딸기글레이즈드프라푸",    name: "딸기 글레이즈드 크림 프라푸치노",         emoji: "🍓", category: "프라푸치노", iced: true, imagePath: sbuxImg("프라푸치노","ice","딸기 글레이즈드 크림 프라푸치노") },
  { id: "sbux_ice_바나나마키다미아프라푸",  name: "바나나 마키다미아 오트 프라푸치노",       emoji: "🍌", category: "프라푸치노", iced: true, imagePath: sbuxImg("프라푸치노","ice","바나나 마키다미아 오트 프라푸치노") },
  { id: "sbux_ice_베르가못딸기프라푸",      name: "베르가못 딸기 크림 프라푸치노",           emoji: "🍓", category: "프라푸치노", iced: true, imagePath: sbuxImg("프라푸치노","ice","베르가못 딸기 크림 프라푸치노") },
  { id: "sbux_ice_꿀호떡크림프라푸",       name: "스타벅스 꿀 호떡 크림 프라푸치노",        emoji: "🍯", category: "프라푸치노", iced: true, imagePath: sbuxImg("프라푸치노","ice","스타벅스 꿀 호떡 크림 프라푸치노") },
  { id: "sbux_ice_에스프레소프라푸",        name: "에스프레소 프라푸치노",                   emoji: "☕", category: "프라푸치노", iced: true, imagePath: sbuxImg("프라푸치노","ice","에스프레소 프라푸치노") },
  { id: "sbux_ice_자몽망고코코프라푸",      name: "자몽 망고 코코 프라푸치노",               emoji: "🥭", category: "프라푸치노", iced: true, imagePath: sbuxImg("프라푸치노","ice","자몽 망고 코코 프라푸치노") },
  { id: "sbux_ice_자바칩프라푸",            name: "자바 칩 프라푸치노",                      emoji: "🍪", category: "프라푸치노", iced: true, imagePath: sbuxImg("프라푸치노","ice","자바 칩 프라푸치노") },
  { id: "sbux_ice_말차크림프라푸",          name: "제주 말차 크림 프라푸치노",               emoji: "🍵", category: "프라푸치노", iced: true, imagePath: sbuxImg("프라푸치노","ice","제주 말차 크림 프라푸치노") },
  { id: "sbux_ice_초코바나나마카다미아프라푸", name: "초코 바나나 마카다미아 오트 프라푸치노", emoji: "🍫", category: "프라푸치노", iced: true, imagePath: sbuxImg("프라푸치노","ice","초코 바나나 마카다미아 오트 프라푸치노") },
  { id: "sbux_ice_초콜릿크림칩프라푸",      name: "초콜릿 크림 칩 프라푸치노",               emoji: "🍫", category: "프라푸치노", iced: true, imagePath: sbuxImg("프라푸치노","ice","초콜릿 크림 칩 프라푸치노") },
  { id: "sbux_ice_카라멜프라푸",            name: "카라멜 프라푸치노",                       emoji: "🍮", category: "프라푸치노", iced: true, imagePath: sbuxImg("프라푸치노","ice","카라멜 프라푸치노") },
  { id: "sbux_ice_화이트타이거프라푸",      name: "화이트 타이거 프라푸치노",                emoji: "🐯", category: "프라푸치노", iced: true, imagePath: sbuxImg("프라푸치노","ice","화이트 타이거 프라푸치노") },

  // ── 블렌디드 (모두 ICE) ──
  { id: "sbux_ice_딸기딜라이트블렌",      name: "딸기 딜라이트 요거트 블렌디드",         emoji: "🍓", category: "블렌디드", iced: true, imagePath: sbuxImg("블렌디드","ice","딸기 딜라이트 요거트 블렌디드") },
  { id: "sbux_ice_레드빈빙수블렌",        name: "레드빈 빙수 블렌디드",                 emoji: "🫘", category: "블렌디드", iced: true, imagePath: sbuxImg("블렌디드","ice","레드빈 빙수 블렌디드") },
  { id: "sbux_ice_망고바나나블렌",        name: "망고 바나나 블렌디드",                 emoji: "🥭", category: "블렌디드", iced: true, imagePath: sbuxImg("블렌디드","ice","망고 바나나 블렌디드") },
  { id: "sbux_ice_망고패션블렌",          name: "망고 패션 프루트 블렌디드",            emoji: "🥭", category: "블렌디드", iced: true, imagePath: sbuxImg("블렌디드","ice","망고 패션 프루트 블렌디드") },
  { id: "sbux_ice_북한산블렌",            name: "북한산 레몬 얼 그레이 블렌디드",       emoji: "🍋", category: "블렌디드", iced: true, imagePath: sbuxImg("블렌디드","ice","북한산 레몬 얼 그레이 블렌디드") },
  { id: "sbux_ice_블랙글레이즈드블렌",    name: "블랙 글레이즈드 셔벗 플레이트",        emoji: "🫐", category: "블렌디드", iced: true, imagePath: sbuxImg("블렌디드","ice","블랙 글레이즈드 셔벗 플레이트") },
  { id: "sbux_ice_수박주스블렌",          name: "수박 주스 블렌디드",                   emoji: "🍉", category: "블렌디드", iced: true, imagePath: sbuxImg("블렌디드","ice","수박 주스 블렌디드") },
  { id: "sbux_ice_클래식밀크티블렌",      name: "스타벅스 클래식 밀크티 블렌디드",      emoji: "🧋", category: "블렌디드", iced: true, imagePath: sbuxImg("블렌디드","ice","스타벅스 클래식 밀크티 블렌디드") },
  { id: "sbux_ice_애플망고빙수블렌",      name: "애플망고 빙수 블렌디드",               emoji: "🥭", category: "블렌디드", iced: true, imagePath: sbuxImg("블렌디드","ice","애플망고 빙수 블렌디드") },
  { id: "sbux_ice_여수바다유자블렌",      name: "여수 바다 유자 블렌디드",              emoji: "🍊", category: "블렌디드", iced: true, imagePath: sbuxImg("블렌디드","ice","여수 바다 유자 블렌디드") },
  { id: "sbux_ice_자몽허니레몬블렌",      name: "자몽 허니 레몬 블렌디드",              emoji: "🍋", category: "블렌디드", iced: true, imagePath: sbuxImg("블렌디드","ice","자몽 허니 레몬 블렌디드") },

  // ── 티(타바나) / 통합 (hot + ice 동일명) ──
  { id: "sbux_레몬캐모마일티",            name: "레몬 캐모마일 블렌드 티",  emoji: "🌼", category: "티(타바나)", iced: true, imagePath: sbuxImg("티(타바나)","ice","레몬 캐모마일 블렌드 티") },
  { id: "sbux_말차티라미수",              name: "말차 티라미수 라떼",       emoji: "🍵", category: "티(타바나)", iced: true, imagePath: sbuxImg("티(타바나)","ice","말차 티라미수 라떼") },
  { id: "sbux_민트블렌드티",              name: "민트 블렌드 티",           emoji: "🌿", category: "티(타바나)", iced: true, imagePath: sbuxImg("티(타바나)","ice","민트 블렌드 티") },
  { id: "sbux_클래식밀크티",              name: "스타벅스 클래식 밀크 티",  emoji: "🧋", category: "티(타바나)", iced: true, imagePath: sbuxImg("티(타바나)","ice","스타벅스 클래식 밀크 티") },
  { id: "sbux_얼그레이바닐라티라떼",      name: "얼 그레이 바닐라 티 라떼", emoji: "🫖", category: "티(타바나)", iced: true, imagePath: sbuxImg("티(타바나)","ice","얼 그레이 바닐라 티 라떼") },
  { id: "sbux_얼그레이티",                name: "얼 그레이 티",             emoji: "🫖", category: "티(타바나)", iced: true, imagePath: sbuxImg("티(타바나)","ice","얼 그레이 티") },
  { id: "sbux_유스베리티",                name: "유스베리 티",              emoji: "🫖", category: "티(타바나)", iced: true, imagePath: sbuxImg("티(타바나)","ice","유스베리 티") },
  { id: "sbux_유자민트티",                name: "유자 민트 티",             emoji: "🍊", category: "티(타바나)", iced: true, imagePath: sbuxImg("티(타바나)","ice","유자 민트 티") },
  { id: "sbux_잉글리쉬브렉퍼스트",        name: "잉글리쉬 브렉퍼스트 티",  emoji: "🫖", category: "티(타바나)", iced: true, imagePath: sbuxImg("티(타바나)","ice","잉글리쉬 브렉퍼스트 티") },
  { id: "sbux_자몽허니블랙티",            name: "자몽 허니 블랙 티",        emoji: "🍊", category: "티(타바나)", iced: true, imagePath: sbuxImg("티(타바나)","ice","자몽 허니 블랙 티") },
  { id: "sbux_제주말차라떼",              name: "제주 말차 라떼",           emoji: "🍵", category: "티(타바나)", iced: true, imagePath: sbuxImg("티(타바나)","ice","제주 말차 라떼") },
  { id: "sbux_제주녹차티",                name: "제주 유기농 녹차로 만든 티", emoji: "🍵", category: "티(타바나)", iced: true, imagePath: sbuxImg("티(타바나)","ice","제주 유기농 녹차로 만든 티") },
  { id: "sbux_캐모마일티",                name: "캐모마일 블렌드 티",       emoji: "🌼", category: "티(타바나)", iced: true, imagePath: sbuxImg("티(타바나)","ice","캐모마일 블렌드 티") },
  // 티(타바나) / 통합 (hot+ice 파일명 다름 → 경로 명시)
  { id: "sbux_프렌치바닐라말차",          name: "프렌치 바닐라 말차 라떼",      emoji: "🍵", category: "티(타바나)", iced: true,  imagePath: sbuxImg("티(타바나)","ice","프렌치 바닐라 말차 라떼"),      imagePathHot: sbuxImg("티(타바나)","hot","프렌치 바닐라 말차 라데") },
  { id: "sbux_히비스커스티",              name: "히비스커스 블렌드 티",         emoji: "🌺", category: "티(타바나)", iced: true,  imagePath: sbuxImg("티(타바나)","ice","히비스커스 브렌드 티"),         imagePathHot: sbuxImg("티(타바나)","hot","히비스커스 블렌드 티") },
  { id: "sbux_제주팔삭자몽블랙티",        name: "제주팔삭 & 자몽 허니 블랙 티", emoji: "🍊", category: "티(타바나)", iced: true,  imagePath: sbuxImg("티(타바나)","ice","제주팔삭&자몽 허니 블랙 티"),  imagePathHot: sbuxImg("티(타바나)","hot","제주팔삭 & 자몽 허니 블랙 티") },
  { id: "sbux_복숭아티",                  name: "복숭아 티",                    emoji: "🍑", category: "티(타바나)", iced: true,  imagePath: sbuxImg("티(타바나)","ice","복숭아 아이스 티"),            imagePathHot: sbuxImg("티(타바나)","hot","복숭아 핫 티") },
  // 티(타바나) / HOT 전용
  { id: "sbux_hot_의암호라벤더티",        name: "의암호의 보랏빛 라벤더 티 라떼",      emoji: "💜", category: "티(타바나)", iced: false, imagePath: sbuxImg("티(타바나)","hot","의암호의 보랏빛 라벤더 티 라떼") },
  { id: "sbux_hot_아이스의암호라벤더티",  name: "아이스 의암호의 보랏빛 라벤더 티 라떼", emoji: "💜", category: "티(타바나)", iced: false, imagePath: sbuxImg("티(타바나)","hot","아이스 의암호의 보랏빛 라벤더 티 라떼") },
  { id: "sbux_hot_클라우드코코말차",      name: "클라우드 코코 말차",           emoji: "🍵", category: "티(타바나)", iced: false, imagePath: sbuxImg("티(타바나)","hot","클라우드 코코 말차") },
  // 티(타바나) / ICE 전용
  { id: "sbux_ice_레드파워패션티",        name: "레드 파워 패션 티",    emoji: "🔴", category: "티(타바나)", iced: true, imagePath: sbuxImg("티(타바나)","ice","레드 파워 패션 티") },
  { id: "sbux_ice_시트러스가든민트티",    name: "시트러스 가든 민트 티", emoji: "🌿", category: "티(타바나)", iced: true, imagePath: sbuxImg("티(타바나)","ice","시트러스 가든 민트 티") },

  // ── 기타 제조 음료 / HOT 전용 ──
  { id: "sbux_hot_시그니처초콜릿",        name: "시그니처 핫 초콜릿",     emoji: "🍫", category: "기타 제조 음료", iced: false, imagePath: sbuxImg("기타 제조 음료","hot","시그니처 핫 초콜릿") },
  { id: "sbux_hot_티라미수초콜릿",        name: "티라미수 초콜릿",         emoji: "🍫", category: "기타 제조 음료", iced: false, imagePath: sbuxImg("기타 제조 음료","hot","티라미수 초콜릿") },
  { id: "sbux_hot_플러피판다핫초콜릿",    name: "플러피 판다 핫 초콜릿",  emoji: "🐼", category: "기타 제조 음료", iced: false, imagePath: sbuxImg("기타 제조 음료","hot","플러피 판다 핫 초콜릿") },
  // 기타 제조 음료 / ICE 전용
  { id: "sbux_ice_딸기콜드폼라떼",        name: "딸기 콜드폼 딸기 라떼",   emoji: "🍓", category: "기타 제조 음료", iced: true, imagePath: sbuxImg("기타 제조 음료","ice","딸기 콜드폼 딸기 라떼") },
  { id: "sbux_ice_딸기콜드폼초콜릿",      name: "딸기 콜드폼 초콜릿",      emoji: "🍓", category: "기타 제조 음료", iced: true, imagePath: sbuxImg("기타 제조 음료","ice","딸기 콜드폼 초콜릿") },
  { id: "sbux_ice_스타벅스슬래머",        name: "스타벅스 슬래머",         emoji: "⚡", category: "기타 제조 음료", iced: true, imagePath: sbuxImg("기타 제조 음료","ice","스타벅스 슬래머") },
  { id: "sbux_ice_스팀우유",              name: "스팀 우유",               emoji: "🥛", category: "기타 제조 음료", iced: true, imagePath: sbuxImg("기타 제조 음료","ice","스팀 우유") },
  { id: "sbux_ice_아이스시그니처초콜릿",  name: "아이스 시그니처 초콜릿",  emoji: "🍫", category: "기타 제조 음료", iced: true, imagePath: sbuxImg("기타 제조 음료","ice","아이스 시그니처 초콜릿") },
  { id: "sbux_ice_아이스티라미수초콜릿",  name: "아이스 티라미수 초콜릿",  emoji: "🍫", category: "기타 제조 음료", iced: true, imagePath: sbuxImg("기타 제조 음료","ice","아이스 티라미수 초콜릿") },
  { id: "sbux_ice_우유",                  name: "우유",                    emoji: "🥛", category: "기타 제조 음료", iced: true, imagePath: sbuxImg("기타 제조 음료","ice","우유") },
  { id: "sbux_ice_제주팔삭셔벗",          name: "제주팔삭 셔벗",           emoji: "🍊", category: "기타 제조 음료", iced: true, imagePath: sbuxImg("기타 제조 음료","ice","제주팔삭 셔벗") },
  { id: "sbux_ice_플러피판다아이스초콜릿", name: "플러피 판다 아이스 초콜릿", emoji: "🐼", category: "기타 제조 음료", iced: true, imagePath: sbuxImg("기타 제조 음료","ice","플러피 판다 아이스 초콜릿") },

  // ── 스타벅스 리프레셔 (모두 ICE) ──
  { id: "sbux_ice_딸기아사이레모네이트",  name: "딸기 아사이 레모네이트 스타벅스 리프레셔", emoji: "🍓", category: "스타벅스 리프레셔", iced: true, imagePath: sbuxImg("스타벅스 리프레셔","ice","딸기 아사이 레모네이트 스타벅스 리프레셔") },

  // ── 스타벅스 피지오 (모두 ICE) ──
  { id: "sbux_ice_골드만다린피지오",      name: "골드 만다린 홉 피지오",        emoji: "🌿", category: "스타벅스 피지오", iced: true, imagePath: sbuxImg("스타벅스 피지오","ice","골드 만다린 홉 피지오") },
  { id: "sbux_ice_라이트핑크자몽피지오",  name: "라이트 핑크 자몽 피지오",      emoji: "🍊", category: "스타벅스 피지오", iced: true, imagePath: sbuxImg("스타벅스 피지오","ice","라이트 핑크 자몽 피지오") },
  { id: "sbux_ice_리버피치피지오",        name: "리버 피치 피지오",             emoji: "🍑", category: "스타벅스 피지오", iced: true, imagePath: sbuxImg("스타벅스 피지오","ice","리버 피치 피지오") },
  { id: "sbux_ice_서울석양오미자피지오",  name: "서울 석양 오미자 피지오",      emoji: "🍓", category: "스타벅스 피지오", iced: true, imagePath: sbuxImg("스타벅스 피지오","ice","서울 석양 오미자 피지오") },
  { id: "sbux_ice_여수바다자몽피지오",    name: "여수 바다 자몽 피지오",        emoji: "🍊", category: "스타벅스 피지오", iced: true, imagePath: sbuxImg("스타벅스 피지오","ice","여수 바다 자몽 피지오") },
  { id: "sbux_ice_의암호초록빛피지오",    name: "의암호의 초록빛 자몽 피지오",  emoji: "🍊", category: "스타벅스 피지오", iced: true, imagePath: sbuxImg("스타벅스 피지오","ice","의암호의 초록빛 자몽 피지오") },
  { id: "sbux_ice_제주팔삭피지오",        name: "제주팔삭 피지오",              emoji: "🍊", category: "스타벅스 피지오", iced: true, imagePath: sbuxImg("스타벅스 피지오","ice","제주팔삭 피지오") },
  { id: "sbux_ice_체리자두에너지피지오",  name: "체리&자두 에너지 피지오",      emoji: "🍒", category: "스타벅스 피지오", iced: true, imagePath: sbuxImg("스타벅스 피지오","ice","체리&자두 에너지 피지오") },
  { id: "sbux_ice_쿨라임피지오",          name: "쿨 라임 피지오",               emoji: "🍋", category: "스타벅스 피지오", iced: true, imagePath: sbuxImg("스타벅스 피지오","ice","쿨 라임 피지오") },
  { id: "sbux_ice_피치딸기피지오",        name: "피치 딸기 피지오",             emoji: "🍑", category: "스타벅스 피지오", iced: true, imagePath: sbuxImg("스타벅스 피지오","ice","피치 딸기 피지오") },

  // ── 스타벅스 주스(병음료) (모두 ICE) ──
  { id: "sbux_ice_abc클렌즈",             name: "ABC 클렌즈",        emoji: "🥤", category: "스타벅스 주스(병음료)", iced: true, imagePath: sbuxImg("스타벅스 주스(병음료)","ice","ABC 클렌즈") },
  { id: "sbux_ice_딸기가득요거트",        name: "딸기가득 요거트",   emoji: "🍓", category: "스타벅스 주스(병음료)", iced: true, imagePath: sbuxImg("스타벅스 주스(병음료)","ice","딸기가득 요거트") },
  { id: "sbux_ice_딸기주스",              name: "딸기주스",          emoji: "🍓", category: "스타벅스 주스(병음료)", iced: true, imagePath: sbuxImg("스타벅스 주스(병음료)","ice","딸기주스") },
  { id: "sbux_ice_망고주스",              name: "망고주스",          emoji: "🥭", category: "스타벅스 주스(병음료)", iced: true, imagePath: sbuxImg("스타벅스 주스(병음료)","ice","망고주스") },
  { id: "sbux_ice_블루베리요거트",        name: "블루베리 요거트",   emoji: "🫐", category: "스타벅스 주스(병음료)", iced: true, imagePath: sbuxImg("스타벅스 주스(병음료)","ice","블루베리 요거트") },
  { id: "sbux_ice_수박주스",              name: "수박 주스",         emoji: "🍉", category: "스타벅스 주스(병음료)", iced: true, imagePath: sbuxImg("스타벅스 주스(병음료)","ice","수박 주스") },
  { id: "sbux_ice_스퀴즈드오렌지주스",    name: "스퀴즈드 오렌지주스", emoji: "🍊", category: "스타벅스 주스(병음료)", iced: true, imagePath: sbuxImg("스타벅스 주스(병음료)","ice","스퀴즈드 오렌지주스") },
  { id: "sbux_ice_유기농오렌지주스",      name: "유기농 오렌지주스", emoji: "🍊", category: "스타벅스 주스(병음료)", iced: true, imagePath: sbuxImg("스타벅스 주스(병음료)","ice","유기농 오렌지주스") },
  { id: "sbux_ice_케일클렌즈",            name: "케일 클렌즈",       emoji: "🥤", category: "스타벅스 주스(병음료)", iced: true, imagePath: sbuxImg("스타벅스 주스(병음료)","ice","케일 클렌즈") },
  { id: "sbux_ice_케일사과주스",          name: "케일&사과주스",     emoji: "🥤", category: "스타벅스 주스(병음료)", iced: true, imagePath: sbuxImg("스타벅스 주스(병음료)","ice","케일&사과주스") },
  { id: "sbux_ice_한라봉주스",            name: "한라봉주스",        emoji: "🍊", category: "스타벅스 주스(병음료)", iced: true, imagePath: sbuxImg("스타벅스 주스(병음료)","ice","한라봉주스") },
  { id: "sbux_ice_햇사과주스",            name: "햇사과주스",        emoji: "🍎", category: "스타벅스 주스(병음료)", iced: true, imagePath: sbuxImg("스타벅스 주스(병음료)","ice","햇사과주스") },
];

// ─── 메가커피 ──────────────────────────────────────────────────────────────────
// 폴더 구조: /cafes/menus/mega/{카테고리}/{hot|ice}/{메뉴명}.{jpg|png}
// 같은 이름이 hot/ice 모두 있는 경우 → iced:true 하나로 통합, 아이스 이미지 사용

const MEGA: MenuItem[] = [
  // ── 커피 / 통합 (hot + ice 선택 가능) ──
  { id: "mega_아메리카노",         name: "아메리카노",         emoji: "☕", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스아메리카노"),      imagePathHot: megaImg("커피","hot","아메리카노") },
  { id: "mega_꿀아메리카노",       name: "꿀아메리카노",       emoji: "🍯", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스꿀아메리카노"),    imagePathHot: megaImg("커피","hot","꿀아메리카노") },
  { id: "mega_바닐라아메리카노",   name: "바닐라 아메리카노",   emoji: "🤍", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스바닐라아메리카노"), imagePathHot: megaImg("커피","hot","바닐라아메리카노") },
  { id: "mega_헤이즐넛아메리카노", name: "헤이즐넛 아메리카노", emoji: "☕", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스헤이즐넛아메리카노"), imagePathHot: megaImg("커피","hot","헤이즐넛아메리카노") },
  { id: "mega_카페라떼",           name: "카페라떼",           emoji: "🥛", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스카페라떼"),        imagePathHot: megaImg("커피","hot","카레파떼") },
  { id: "mega_바닐라라떼",         name: "바닐라라떼",         emoji: "🤍", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스바닐라라떼"),      imagePathHot: megaImg("커피","hot","바닐라라떼") },
  { id: "mega_헤이즐넛라떼",       name: "헤이즐넛라떼",       emoji: "☕", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스헤이즐넛라떼"),    imagePathHot: megaImg("커피","hot","헤이즐넛라떼") },
  { id: "mega_카페모카",           name: "카페모카",           emoji: "🍫", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스카페모카"),        imagePathHot: megaImg("커피","hot","카페모카") },
  { id: "mega_카라멜마끼아또",     name: "카라멜 마끼아또",     emoji: "🍮", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스카라멜마끼아또"),  imagePathHot: megaImg("커피","hot","카라멜마끼아또") },
  { id: "mega_카푸치노",           name: "카푸치노",             emoji: "☁️", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스카푸치노"),        imagePathHot: megaImg("커피","hot","카푸치노") },
  { id: "mega_연유라떼",           name: "연유라떼",           emoji: "🥛", category: "커피", iced: true,  imagePath: megaImg("커피","ice","연유라떼"),              imagePathHot: megaImg("커피","hot","핫연유라떼") },
  { id: "mega_헛개리카노",         name: "헛개리카노",           emoji: "🌿", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스헛개리카노"),      imagePathHot: megaImg("커피","hot","핫헛개리카노") },
  { id: "mega_콜드브루오리지널",   name: "콜드브루 오리지널",   emoji: "🧊", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스콜드브루오리지널"), imagePathHot: megaImg("커피","hot","콜드브루오리지널") },
  { id: "mega_콜드브루라떼",       name: "콜드브루라떼",       emoji: "🧊", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스콜드브루라떼"),    imagePathHot: megaImg("커피","hot","콜드브루라떼") },
  // 커피 / HOT 전용
  { id: "mega_hot_에스프레소",       name: "에스프레소",         emoji: "⚡", category: "커피", iced: false, imagePath: megaImg("커피","hot","에스프레소") },
  { id: "mega_hot_에스프레소도피오", name: "에스프레소 도피오",  emoji: "⚡", category: "커피", iced: false, imagePath: megaImg("커피","hot","에스프레소도피오") },
  // 커피 / ICE 전용
  { id: "mega_ice_메가리카노",           name: "메가리카노",                 emoji: "☕", category: "커피", iced: true, imagePath: megaImg("커피","ice","메가리카노") },
  { id: "mega_ice_라이트바닐라아몬드라떼", name: "라이트바닐라 아몬드라떼", emoji: "🤍", category: "커피", iced: true, imagePath: megaImg("커피","ice","라이트바닐라아몬드라떼") },
  { id: "mega_ice_아이스큐브라떼",       name: "아이스큐브라떼",           emoji: "🧊", category: "커피", iced: true, imagePath: megaImg("커피","ice","아이스큐브라떼") },
  { id: "mega_ice_왕메가카페라떼",       name: "왕메가 카페라떼",          emoji: "🥛", category: "커피", iced: true, imagePath: megaImg("커피","ice","왕메가카페라떼") },
  { id: "mega_ice_왕메가헛개리카노",     name: "왕메가 헛개리카노",         emoji: "🌿", category: "커피", iced: true, imagePath: megaImg("커피","ice","왕메가헛개리카노") },
  { id: "mega_ice_할메가커피",           name: "할메가커피",               emoji: "☕", category: "커피", iced: true, imagePath: megaImg("커피","ice","할메가커피") },
  { id: "mega_ice_왕할메가커피",         name: "왕 할메가커피",             emoji: "☕", category: "커피", iced: true, imagePath: megaImg("커피","ice","왕할메가커피") },
  { id: "mega_ice_할메가미숫커피",       name: "할메가 미숫커피",           emoji: "☕", category: "커피", iced: true, imagePath: megaImg("커피","ice","할메가미숫커피") },
  { id: "mega_ice_초코젤라또말차라떼",   name: "초코젤라또 말차라떼",     emoji: "🍵", category: "커피", iced: true, imagePath: megaImg("커피","ice","초코젤라또말차라떼") },

  // ── 디카페인 / 통합 (hot+ice 동일명 → iced:true, 아이스 이미지) ──
  { id: "mega_dc_디카페인꿀아메리카노",   name: "디카페인 꿀아메리카노",   emoji: "🍯", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인꿀아메리카노") },
  { id: "mega_dc_디카페인바닐라라떼",     name: "디카페인 바닐라라떼",     emoji: "🤍", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인바닐라라떼") },
  { id: "mega_dc_디카페인연유라떼",       name: "디카페인 연유라떼",       emoji: "🥛", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인연유라떼") },
  { id: "mega_dc_디카페인카라멜마끼아또", name: "디카페인 카라멜마끼아또", emoji: "🍮", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인카라멜마끼아또") },
  { id: "mega_dc_디카페인카페라떼",       name: "디카페인 카페라떼",       emoji: "🥛", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인카페라떼") },
  { id: "mega_dc_디카페인카페모카",       name: "디카페인 카페모카",       emoji: "🍫", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인카페모카") },
  { id: "mega_dc_디카페인카푸치노",       name: "디카페인 카푸치노",         emoji: "☁️", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인카푸치노") },
  { id: "mega_dc_디카페인헛개리카노",     name: "디카페인 헛개리카노",       emoji: "🌿", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인헛개리카노") },
  { id: "mega_dc_디카페인헤이즐넛라떼",   name: "디카페인 헤이즐넛라떼",   emoji: "☕", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인헤이즐넛라떼") },
  { id: "mega_dc_콜드브루디카페인",       name: "콜드브루 디카페인",         emoji: "🧊", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "콜드브루디카페인") },
  { id: "mega_dc_콜드브루디카페인라떼",   name: "콜드브루 디카페인라떼",   emoji: "🧊", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "콜드브루디카페인라떼") },
  // 디카페인 / hot only
  { id: "mega_dchot_디카페인아메키라노",  name: "디카페인 아메키라노",       emoji: "☕", category: "디카페인", iced: false, imagePath: megaImg("디카페인", "hot", "디카페인아메키라노") },
  { id: "mega_dchot_디카페인에스프레소",  name: "디카페인 에스프레소",       emoji: "⚡", category: "디카페인", iced: false, imagePath: megaImg("디카페인", "hot", "디카페인에스프레소") },
  // 디카페인 / ice only
  { id: "mega_dcice_디카페인아메리카노",      name: "디카페인 아메리카노",           emoji: "☕", category: "디카페인", iced: true, imagePath: megaImg("디카페인", "ice", "디카페인아메리카노") },
  { id: "mega_dcice_디카페인바닐라아메리카노", name: "디카페인 바닐라 아메리카노",    emoji: "🤍", category: "디카페인", iced: true, imagePath: megaImg("디카페인", "ice", "디카페인바닐라아메리카노") },
  { id: "mega_dcice_디카페인헤이즐넛아메리카노", name: "디카페인 헤이즐넛 아메리카노", emoji: "☕", category: "디카페인", iced: true, imagePath: megaImg("디카페인", "ice", "디카페인헤이즐넛아메리카노") },
  { id: "mega_dcice_디카페인메가리카노",      name: "디카페인 메가리카노",           emoji: "☕", category: "디카페인", iced: true, imagePath: megaImg("디카페인", "ice", "디카페인메가리카노") },
  { id: "mega_dcice_디카페인라이트바닐라아몬드라떼", name: "디카페인 라이트바닐라 아몬드라떼", emoji: "🤍", category: "디카페인", iced: true, imagePath: megaImg("디카페인", "ice", "디카페인라이트바닐라아몬드라떼") },
  { id: "mega_dcice_디카페인왕메가카페라떼",  name: "디카페인 왕메가카페라떼",    emoji: "🥛", category: "디카페인", iced: true, imagePath: megaImg("디카페인", "ice", "디카페인왕메가카페라떼") },
  { id: "mega_dcice_디카페인왕메가헛개리카노", name: "디카페인 왕메가헛개리카노",   emoji: "🌿", category: "디카페인", iced: true, imagePath: megaImg("디카페인", "ice", "디카페인왕메가헛개리카노") },

  // ── 음료 / 통합 (hot + ice 선택 가능) ──
  { id: "mega_초코",         name: "초코",           emoji: "🍫", category: "음료", iced: true, imagePath: megaImg("음료","ice","아이스초코"),       imagePathHot: megaImg("음료","hot","핫초코") },
  { id: "mega_녹차라떼",     name: "녹차라떼",     emoji: "🍵", category: "음료", iced: true, imagePath: megaImg("음료","ice","녹차라떼"),         imagePathHot: megaImg("음료","hot","핫녹차라떼") },
  { id: "mega_고구마라떼",   name: "고구마라떼",   emoji: "🍠", category: "음료", iced: true, imagePath: megaImg("음료","ice","고구마라떼"),       imagePathHot: megaImg("음료","hot","핫고구마라떼") },
  { id: "mega_곡물라떼",     name: "곡물라떼",     emoji: "🌾", category: "음료", iced: true, imagePath: megaImg("음료","ice","곡물라떼"),         imagePathHot: megaImg("음료","hot","핫곡물라떼") },
  { id: "mega_로얄밀크티라떼", name: "로얄 밀크티라떼", emoji: "🫖", category: "음료", iced: true, imagePath: megaImg("음료","ice","로얄밀크티라떼"), imagePathHot: megaImg("음료","hot","핫로얄밀크티라떼") },
  { id: "mega_토피넛라떼",   name: "토피넛라떼",   emoji: "🌰", category: "음료", iced: true, imagePath: megaImg("음료","ice","토피넛라떼"),       imagePathHot: megaImg("음료","hot","핫토피넛라떼") },
  // 음료 / ICE 전용
  { id: "mega_ice_딸기라떼",           name: "딸기라떼",             emoji: "🍓", category: "음료", iced: true, imagePath: megaImg("음료","ice","딸기라떼") },
  { id: "mega_ice_흑당라떼",           name: "흑당라떼",             emoji: "🍯", category: "음료", iced: true, imagePath: megaImg("음료","ice","흑당라떼") },
  { id: "mega_ice_흑당밀크티라떼",     name: "흑당 밀크티라떼",     emoji: "🧋", category: "음료", iced: true, imagePath: megaImg("음료","ice","흑당밀크티라떼") },
  { id: "mega_ice_흑당버블라떼",       name: "흑당버블라떼",       emoji: "🧋", category: "음료", iced: true, imagePath: megaImg("음료","ice","흑당버블라떼") },
  { id: "mega_ice_흑당버블밀크티라떼", name: "흑당버블 밀크티라떼", emoji: "🧋", category: "음료", iced: true, imagePath: megaImg("음료","ice","흑당버블밀크티라떼") },
  { id: "mega_ice_오레오초코라떼",     name: "오레오 초코라떼",     emoji: "🍫", category: "음료", iced: true, imagePath: megaImg("음료","ice","오레오초코라떼") },
  { id: "mega_ice_왕메가초코",         name: "왕메가초코",           emoji: "🍫", category: "음료", iced: true, imagePath: megaImg("음료","ice","왕메가초코") },

  // ── 티 / 통합 (hot+ice 동일명 → iced:true) ──
  { id: "mega_tea_녹차",       name: "녹차",           emoji: "🍵", category: "티", iced: true,  imagePath: megaImg("티", "ice", "녹차") },
  { id: "mega_tea_레몬차",     name: "레몬차",         emoji: "🍋", category: "티", iced: true,  imagePath: megaImg("티", "ice", "레몬차") },
  { id: "mega_tea_사과유자차", name: "사과유자차",    emoji: "🍎", category: "티", iced: true,  imagePath: megaImg("티", "ice", "사과유자차") },
  { id: "mega_tea_상큼리치티", name: "상큼 리치티",  emoji: "🍒", category: "티", iced: true,  imagePath: megaImg("티", "ice", "상큼리치티") },
  { id: "mega_tea_얼그레이",   name: "얼그레이",       emoji: "🫖", category: "티", iced: true,  imagePath: megaImg("티", "ice", "얼그레이") },
  { id: "mega_tea_유자차",     name: "유자차",         emoji: "🍊", category: "티", iced: true,  imagePath: megaImg("티", "ice", "유자차") },
  { id: "mega_tea_자몽차",     name: "자몽차",         emoji: "🍊", category: "티", iced: true,  imagePath: megaImg("티", "ice", "자몽차") },
  { id: "mega_tea_캐모마일",   name: "캐모마일",       emoji: "🌼", category: "티", iced: true,  imagePath: megaImg("티", "ice", "캐모마일") },
  { id: "mega_tea_페퍼민트",   name: "페퍼민트",       emoji: "🌿", category: "티", iced: true,  imagePath: megaImg("티", "ice", "페퍼민트") },
  { id: "mega_tea_허니자몽블랙티", name: "허니자몽 블랙티", emoji: "🍊", category: "티", iced: true, imagePath: megaImg("티", "ice", "허니자몽블랙티") },
  // 티 / hot only
  { id: "mega_teahot_유자생강차", name: "유자 생강차",  emoji: "🫚", category: "티", iced: false, imagePath: megaImg("티", "hot", "유자생강차", "webp") },
  // 티 / ice only
  { id: "mega_teaice_복숭아이스티",    name: "복숭아 아이스티",       emoji: "🍑", category: "티", iced: true, imagePath: megaImg("티", "ice", "복숭아이스티") },
  { id: "mega_teaice_왕메가사과유자",  name: "왕메가 사과유자",       emoji: "🍎", category: "티", iced: true, imagePath: megaImg("티", "ice", "왕메가사과유자") },
  { id: "mega_teaice_왕메가아이스티",  name: "왕메가 아이스티",       emoji: "🫖", category: "티", iced: true, imagePath: megaImg("티", "ice", "왕메가아이스티") },
  { id: "mega_teaice_제로복숭아아이스티", name: "제로 복숭아 아이스티", emoji: "🍑", category: "티", iced: true, imagePath: megaImg("티", "ice", "제로복숭아아이스티") },

  // ── 에이드&주스 (모두 ICE) ──
  { id: "mega_ade_레몬에이드",      name: "레몬 에이드",       emoji: "🍋", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "레몬에이드") },
  { id: "mega_ade_자몽에이드",      name: "자몽 에이드",       emoji: "🍊", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "자몽에이드", "webp") },
  { id: "mega_ade_청포도에이드",    name: "청포도 에이드",     emoji: "🍇", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "청포도에이드") },
  { id: "mega_ade_블루레몬에이드",  name: "블루레몬 에이드",  emoji: "💙", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "블루레몬에이드") },
  { id: "mega_ade_메가에이드",      name: "메가 에이드",       emoji: "🟡", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "메가에이드") },
  { id: "mega_ade_제로부스트에이드", name: "제로부스트 에이드", emoji: "⚡", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "제로부스트에이드") },
  { id: "mega_ade_라임모히또",      name: "라임모히또",       emoji: "🌿", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "라임모히또") },
  { id: "mega_ade_체리콜라",        name: "체리콜라",         emoji: "🍒", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "체리콜라", "webp") },
  { id: "mega_ade_딸기주스",        name: "딸기주스",         emoji: "🍓", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "딸기주스") },
  { id: "mega_ade_딸기바나나주스",  name: "딸기바나나주스",  emoji: "🍓", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "딸기바나나주스") },
  { id: "mega_ade_골드키위주스",    name: "골드키위주스",    emoji: "🥝", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "골드키위주스") },
  { id: "mega_ade_블루베리플럼주스", name: "블루베리플럼주스", emoji: "🫐", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "블루베리플럼주스") },

  // ── 스무디&프라페 (모두 ICE) ──
  { id: "mega_smo_커피프라페",          name: "커피프라페",           emoji: "☕", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "커피프라페") },
  { id: "mega_smo_녹차프라페",          name: "녹차 프라페",           emoji: "🍵", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "녹차프라페", "webp") },
  { id: "mega_smo_민트프라페",          name: "민트 프라페",           emoji: "🌿", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "민트프라페") },
  { id: "mega_smo_리얼초코프라페",      name: "리얼초코 프라페",      emoji: "🍫", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "리얼초코프라페") },
  { id: "mega_smo_쿠키프라페",          name: "쿠키 프라페",           emoji: "🍪", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "쿠키프라페") },
  { id: "mega_smo_딸기쿠키프라페",      name: "딸기쿠키 프라페",      emoji: "🍓", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "딸기쿠키프라페") },
  { id: "mega_smo_밀크쉐이크",          name: "밀크쉐이크",             emoji: "🥤", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "밀크쉐이크", "webp") },
  { id: "mega_smo_골드망고스무디",      name: "골드망고 스무디",      emoji: "🥭", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "골드망고스무디") },
  { id: "mega_smo_망고요거트스무디",    name: "망고 요거트 스무디",    emoji: "🥭", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "망고요거트스무디") },
  { id: "mega_smo_딸기요거트",          name: "딸기 요거트",           emoji: "🍓", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "딸기요거트") },
  { id: "mega_smo_플레인요거트스무디",  name: "플레인 요거트 스무디",  emoji: "🥤", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "플레인요거트스무디") },
  { id: "mega_smo_블루베리요거트스무디", name: "블루베리 요거트 스무디", emoji: "🫐", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "블루베리요거트스무디") },
  { id: "mega_smo_귤톡톡제리스무디",    name: "귤톡톡 제리 스무디",  emoji: "🍊", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "귤톡톡제리스무디") },
  { id: "mega_smo_코코넛커피스무디",    name: "코코넛 커피 스무디",    emoji: "🥥", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "코코넛커피스무디") },
  { id: "mega_smo_그린키위콕콕딸키스무디", name: "그린키위 콕콕 딸기 스무디", emoji: "🥝", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "그린키위콕콕딸키스무디", "webp") },
  { id: "mega_smo_딸기퐁크러쉬",        name: "딸기 퐁크러쉬",         emoji: "🍓", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "딸기퐁크러쉬") },
  { id: "mega_smo_바나나퐁크러쉬",      name: "바나나 퐁크러쉬",       emoji: "🍌", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "바나나퐁크러쉬") },
  { id: "mega_smo_초코허니퐁크러쉬",    name: "초코허니 퐁크러쉬",   emoji: "🍫", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "초코허니퐁크러쉬") },
  { id: "mega_smo_플레인퐁크러쉬",      name: "플레인 퐁크러쉬",       emoji: "🥤", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "플레인퐁크러쉬") },

  // ── 신상품 (모두 ICE) ──
  { id: "mega_new_꿀수박주스",              name: "꿀수박 주스",                   emoji: "🍉", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "꿀수박주스", "webp") },
  { id: "mega_new_수박리치코코슬러시",      name: "수박리치코코 슬러시",           emoji: "🍉", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "수박리치코코슬러시", "webp") },
  { id: "mega_new_수박소르베밀키스무디",    name: "수박소르베 밀키 스무디",         emoji: "🍉", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "수박소르베밀키스무디", "webp") },
  { id: "mega_new_자몽톡톡스무디",          name: "자몽톡톡 스무디",               emoji: "🍊", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "자몽톡톡스무디", "webp") },
  { id: "mega_new_애플머스캣요거트스무디",  name: "애플머스캣 요거트 스무디",       emoji: "🍇", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "애플머스캣요거트스무디", "webp") },
  { id: "mega_new_파인망고코코스무디",      name: "파인망고코코 스무디",           emoji: "🍍", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "파인망고코코스무디", "webp") },
  { id: "mega_new_제로레몬말차아이스티",    name: "제로레몬말차 아이스티",         emoji: "🍵", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "제로레몬말차아이스티", "webp") },
  { id: "mega_new_저당꿀배XO야구르트",      name: "저당꿀배 XO 야구르트",           emoji: "🍐", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "저당꿀배XO야구르트", "webp") },
  { id: "mega_new_M망고G구아바C캐럿주스",   name: "M망고G구아바C캐럿주스",           emoji: "🥭", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "M망고G구아바C캐럿주스", "webp") },
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

// ID 접두사로 tempFixed 자동 설정:
//   mega_hot_*, mega_dchot_*, mega_teahot_*          → HOT 고정
//   mega_ice_*, mega_dcice_*, mega_teaice_*,
//   mega_ade_*, mega_smo_*, mega_new_*                → ICE 고정
//   mega_dc_*, mega_tea_*  (hot+ice 통합)             → 토글 (tempFixed 없음)
const HOT_PREFIX = ["mega_hot_", "mega_dchot_", "mega_teahot_"];
const ICE_PREFIX = ["mega_ice_", "mega_dcice_", "mega_teaice_", "mega_ade_", "mega_smo_", "mega_new_"];

const MERGED_PREFIX = ["mega_dc_", "mega_tea_"];

const MEGA_FINAL: MenuItem[] = MEGA.map((item) => {
  if (HOT_PREFIX.some((p) => item.id.startsWith(p))) return { ...item, tempFixed: "HOT" as const };
  if (ICE_PREFIX.some((p) => item.id.startsWith(p))) return { ...item, tempFixed: "ICED" as const };
  // 통합 아이템: ice 이미지 경로에서 /ice/ → /hot/ 으로 hot 경로 유도
  if (MERGED_PREFIX.some((p) => item.id.startsWith(p)) && item.imagePath) {
    return { ...item, imagePathHot: item.imagePath.replace("/ice/", "/hot/") };
  }
  return item;
});

// ID 접두사로 tempFixed 자동 설정:
//   sbux_hot_*          → HOT 고정
//   sbux_ice_*          → ICE 고정
//   sbux_* (그 외)      → 통합 (토글), imagePathHot 없으면 /ice/ → /hot/ 으로 유도
const SBUX_HOT_PREFIX = ["sbux_hot_"];
const SBUX_ICE_PREFIX = ["sbux_ice_"];

const STARBUCKS_FINAL: MenuItem[] = STARBUCKS_NEW.map((item) => {
  if (SBUX_HOT_PREFIX.some((p) => item.id.startsWith(p))) return { ...item, tempFixed: "HOT" as const };
  if (SBUX_ICE_PREFIX.some((p) => item.id.startsWith(p))) return { ...item, tempFixed: "ICED" as const };
  // 통합 아이템: imagePathHot 없는 경우 ice 경로에서 /ice/ → /hot/ 으로 유도
  if (item.imagePath && !item.imagePathHot) {
    return { ...item, imagePathHot: item.imagePath.replace("/ice/", "/hot/") };
  }
  return item;
});

export const CAFE_MENUS: Record<CafeId, MenuItem[]> = {
  starbucks: STARBUCKS_FINAL,
  mega:      MEGA_FINAL,
  compose:   TWOSOME,
};

export function getMenuByCafe(cafeId: CafeId): MenuItem[] {
  return CAFE_MENUS[cafeId] ?? STARBUCKS_FINAL;
}

export function getCafeInfo(cafeId: CafeId): CafeInfo {
  return CAFE_LIST.find((c) => c.id === cafeId) ?? CAFE_LIST[0];
}

export const COFFEE_MENU = STARBUCKS_FINAL;
