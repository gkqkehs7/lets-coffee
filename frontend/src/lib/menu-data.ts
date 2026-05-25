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
  { id: "twosome",   name: "투썸플레이스", logoPath: "/cafes/twosome.png",   color: "#C8102E" },
];

// ─── 카테고리 정의 ────────────────────────────────────────────────────────────

const STARBUCKS_CATEGORIES = [
  { id: "coffee",     label: "☕ 커피" },
  { id: "decaf",      label: "💤 디카페인" },
  { id: "non-coffee", label: "🍵 논커피" },
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
  if (cafeId === "twosome")  return [...TWOSOME_CATEGORIES];
  return [...STARBUCKS_CATEGORIES];
}

// ─── 메가커피 이미지 경로 헬퍼 ────────────────────────────────────────────────

function megaImg(category: string, temp: "hot" | "ice", name: string, ext: "webp" = "webp"): string {
  return `/cafes/menus/mega/${encodeURIComponent(category)}/${temp}/${encodeURIComponent(name)}.${ext}`;
}

// ─── 메뉴 데이터 ──────────────────────────────────────────────────────────────

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

// ─── 메가커피 ──────────────────────────────────────────────────────────────────
// 폴더 구조: /cafes/menus/mega/{카테고리}/{hot|ice}/{메뉴명}.{jpg|png}
// 같은 이름이 hot/ice 모두 있는 경우 → iced:true 하나로 통합, 아이스 이미지 사용

const MEGA: MenuItem[] = [
  // ── 커피 / 통합 (hot + ice 선택 가능) ──
  { id: "mega_아메리카노",         name: "아메리카노",         emoji: "☕", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스아메리카노"),      imagePathHot: megaImg("커피","hot","아메리카노") },
  { id: "mega_꿀아메리카노",       name: "꿀아메리카노",       emoji: "🍯", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스꿀아메리카노"),    imagePathHot: megaImg("커피","hot","꿀아메리카노") },
  { id: "mega_바닐라아메리카노",   name: "바닐라아메리카노",   emoji: "🤍", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스바닐라아메리카노"), imagePathHot: megaImg("커피","hot","바닐라아메리카노") },
  { id: "mega_헤이즐넛아메리카노", name: "헤이즐넛아메리카노", emoji: "☕", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스헤이즐넛아메리카노"), imagePathHot: megaImg("커피","hot","헤이즐넛아메리카노") },
  { id: "mega_카페라떼",           name: "카페라떼",           emoji: "🥛", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스카페라떼"),        imagePathHot: megaImg("커피","hot","카레파떼") },
  { id: "mega_바닐라라떼",         name: "바닐라라떼",         emoji: "🤍", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스바닐라라떼"),      imagePathHot: megaImg("커피","hot","바닐라라떼") },
  { id: "mega_헤이즐넛라떼",       name: "헤이즐넛라떼",       emoji: "☕", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스헤이즐넛라떼"),    imagePathHot: megaImg("커피","hot","헤이즐넛라떼") },
  { id: "mega_카페모카",           name: "카페모카",           emoji: "🍫", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스카페모카"),        imagePathHot: megaImg("커피","hot","카페모카") },
  { id: "mega_카라멜마끼아또",     name: "카라멜마끼아또",     emoji: "🍮", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스카라멜마끼아또"),  imagePathHot: megaImg("커피","hot","카라멜마끼아또") },
  { id: "mega_카푸치노",           name: "카푸치노",           emoji: "☁️", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스카푸치노"),        imagePathHot: megaImg("커피","hot","카푸치노") },
  { id: "mega_연유라떼",           name: "연유라떼",           emoji: "🥛", category: "커피", iced: true,  imagePath: megaImg("커피","ice","연유라떼"),              imagePathHot: megaImg("커피","hot","핫연유라떼") },
  { id: "mega_헛개리카노",         name: "헛개리카노",         emoji: "🌿", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스헛개리카노"),      imagePathHot: megaImg("커피","hot","핫헛개리카노") },
  { id: "mega_콜드브루오리지널",   name: "콜드브루오리지널",   emoji: "🧊", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스콜드브루오리지널"), imagePathHot: megaImg("커피","hot","콜드브루오리지널") },
  { id: "mega_콜드브루라떼",       name: "콜드브루라떼",       emoji: "🧊", category: "커피", iced: true,  imagePath: megaImg("커피","ice","아이스콜드브루라떼"),    imagePathHot: megaImg("커피","hot","콜드브루라떼") },
  // 커피 / HOT 전용
  { id: "mega_hot_에스프레소",       name: "에스프레소",       emoji: "⚡", category: "커피", iced: false, imagePath: megaImg("커피","hot","에스프레소") },
  { id: "mega_hot_에스프레소도피오", name: "에스프레소도피오", emoji: "⚡", category: "커피", iced: false, imagePath: megaImg("커피","hot","에스프레소도피오") },
  // 커피 / ICE 전용
  { id: "mega_ice_메가리카노",           name: "메가리카노",           emoji: "☕", category: "커피", iced: true, imagePath: megaImg("커피","ice","메가리카노") },
  { id: "mega_ice_라이트바닐라아몬드라떼", name: "라이트바닐라아몬드라떼", emoji: "🤍", category: "커피", iced: true, imagePath: megaImg("커피","ice","라이트바닐라아몬드라떼") },
  { id: "mega_ice_아이스큐브라떼",       name: "아이스큐브라떼",       emoji: "🧊", category: "커피", iced: true, imagePath: megaImg("커피","ice","아이스큐브라떼") },
  { id: "mega_ice_왕메가카페라떼",       name: "왕메가카페라떼",       emoji: "🥛", category: "커피", iced: true, imagePath: megaImg("커피","ice","왕메가카페라떼") },
  { id: "mega_ice_왕메가헛개리카노",     name: "왕메가헛개리카노",     emoji: "🌿", category: "커피", iced: true, imagePath: megaImg("커피","ice","왕메가헛개리카노") },
  { id: "mega_ice_할메가커피",           name: "할메가커피",           emoji: "☕", category: "커피", iced: true, imagePath: megaImg("커피","ice","할메가커피") },
  { id: "mega_ice_왕할메가커피",         name: "왕할메가커피",         emoji: "☕", category: "커피", iced: true, imagePath: megaImg("커피","ice","왕할메가커피") },
  { id: "mega_ice_할메가미숫커피",       name: "할메가미숫커피",       emoji: "☕", category: "커피", iced: true, imagePath: megaImg("커피","ice","할메가미숫커피") },
  { id: "mega_ice_초코젤라또말차라떼",   name: "초코젤라또말차라떼",   emoji: "🍵", category: "커피", iced: true, imagePath: megaImg("커피","ice","초코젤라또말차라떼") },

  // ── 디카페인 / 통합 (hot+ice 동일명 → iced:true, 아이스 이미지) ──
  { id: "mega_dc_디카페인꿀아메리카노",   name: "디카페인꿀아메리카노",   emoji: "🍯", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인꿀아메리카노") },
  { id: "mega_dc_디카페인바닐라라떼",     name: "디카페인바닐라라떼",     emoji: "🤍", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인바닐라라떼") },
  { id: "mega_dc_디카페인연유라떼",       name: "디카페인연유라떼",       emoji: "🥛", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인연유라떼") },
  { id: "mega_dc_디카페인카라멜마끼아또", name: "디카페인카라멜마끼아또", emoji: "🍮", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인카라멜마끼아또") },
  { id: "mega_dc_디카페인카페라떼",       name: "디카페인카페라떼",       emoji: "🥛", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인카페라떼") },
  { id: "mega_dc_디카페인카페모카",       name: "디카페인카페모카",       emoji: "🍫", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인카페모카") },
  { id: "mega_dc_디카페인카푸치노",       name: "디카페인카푸치노",       emoji: "☁️", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인카푸치노") },
  { id: "mega_dc_디카페인헛개리카노",     name: "디카페인헛개리카노",     emoji: "🌿", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인헛개리카노") },
  { id: "mega_dc_디카페인헤이즐넛라떼",   name: "디카페인헤이즐넛라떼",   emoji: "☕", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "디카페인헤이즐넛라떼") },
  { id: "mega_dc_콜드브루디카페인",       name: "콜드브루디카페인",       emoji: "🧊", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "콜드브루디카페인") },
  { id: "mega_dc_콜드브루디카페인라떼",   name: "콜드브루디카페인라떼",   emoji: "🧊", category: "디카페인", iced: true,  imagePath: megaImg("디카페인", "ice", "콜드브루디카페인라떼") },
  // 디카페인 / hot only
  { id: "mega_dchot_디카페인아메키라노",  name: "디카페인아메키라노",     emoji: "☕", category: "디카페인", iced: false, imagePath: megaImg("디카페인", "hot", "디카페인아메키라노") },
  { id: "mega_dchot_디카페인에스프레소",  name: "디카페인에스프레소",     emoji: "⚡", category: "디카페인", iced: false, imagePath: megaImg("디카페인", "hot", "디카페인에스프레소") },
  // 디카페인 / ice only
  { id: "mega_dcice_디카페인아메리카노",      name: "디카페인아메리카노",      emoji: "☕", category: "디카페인", iced: true, imagePath: megaImg("디카페인", "ice", "디카페인아메리카노") },
  { id: "mega_dcice_디카페인바닐라아메리카노", name: "디카페인바닐라아메리카노", emoji: "🤍", category: "디카페인", iced: true, imagePath: megaImg("디카페인", "ice", "디카페인바닐라아메리카노") },
  { id: "mega_dcice_디카페인헤이즐넛아메리카노", name: "디카페인헤이즐넛아메리카노", emoji: "☕", category: "디카페인", iced: true, imagePath: megaImg("디카페인", "ice", "디카페인헤이즐넛아메리카노") },
  { id: "mega_dcice_디카페인메가리카노",      name: "디카페인메가리카노",      emoji: "☕", category: "디카페인", iced: true, imagePath: megaImg("디카페인", "ice", "디카페인메가리카노") },
  { id: "mega_dcice_디카페인라이트바닐라아몬드라떼", name: "디카페인라이트바닐라아몬드라떼", emoji: "🤍", category: "디카페인", iced: true, imagePath: megaImg("디카페인", "ice", "디카페인라이트바닐라아몬드라떼") },
  { id: "mega_dcice_디카페인왕메가카페라떼",  name: "디카페인왕메가카페라떼",  emoji: "🥛", category: "디카페인", iced: true, imagePath: megaImg("디카페인", "ice", "디카페인왕메가카페라떼") },
  { id: "mega_dcice_디카페인왕메가헛개리카노", name: "디카페인왕메가헛개리카노", emoji: "🌿", category: "디카페인", iced: true, imagePath: megaImg("디카페인", "ice", "디카페인왕메가헛개리카노") },

  // ── 음료 / 통합 (hot + ice 선택 가능) ──
  { id: "mega_초코",         name: "초코",         emoji: "🍫", category: "음료", iced: true, imagePath: megaImg("음료","ice","아이스초코"),       imagePathHot: megaImg("음료","hot","핫초코") },
  { id: "mega_녹차라떼",     name: "녹차라떼",     emoji: "🍵", category: "음료", iced: true, imagePath: megaImg("음료","ice","녹차라떼"),         imagePathHot: megaImg("음료","hot","핫녹차라떼") },
  { id: "mega_고구마라떼",   name: "고구마라떼",   emoji: "🍠", category: "음료", iced: true, imagePath: megaImg("음료","ice","고구마라떼"),       imagePathHot: megaImg("음료","hot","핫고구마라떼") },
  { id: "mega_곡물라떼",     name: "곡물라떼",     emoji: "🌾", category: "음료", iced: true, imagePath: megaImg("음료","ice","곡물라떼"),         imagePathHot: megaImg("음료","hot","핫곡물라떼") },
  { id: "mega_로얄밀크티라떼", name: "로얄밀크티라떼", emoji: "🫖", category: "음료", iced: true, imagePath: megaImg("음료","ice","로얄밀크티라떼"), imagePathHot: megaImg("음료","hot","핫로얄밀크티라떼") },
  { id: "mega_토피넛라떼",   name: "토피넛라떼",   emoji: "🌰", category: "음료", iced: true, imagePath: megaImg("음료","ice","토피넛라떼"),       imagePathHot: megaImg("음료","hot","핫토피넛라떼") },
  // 음료 / ICE 전용
  { id: "mega_ice_딸기라떼",           name: "딸기라떼",           emoji: "🍓", category: "음료", iced: true, imagePath: megaImg("음료","ice","딸기라떼") },
  { id: "mega_ice_흑당라떼",           name: "흑당라떼",           emoji: "🍯", category: "음료", iced: true, imagePath: megaImg("음료","ice","흑당라떼") },
  { id: "mega_ice_흑당밀크티라떼",     name: "흑당밀크티라떼",     emoji: "🧋", category: "음료", iced: true, imagePath: megaImg("음료","ice","흑당밀크티라떼") },
  { id: "mega_ice_흑당버블라떼",       name: "흑당버블라떼",       emoji: "🧋", category: "음료", iced: true, imagePath: megaImg("음료","ice","흑당버블라떼") },
  { id: "mega_ice_흑당버블밀크티라떼", name: "흑당버블밀크티라떼", emoji: "🧋", category: "음료", iced: true, imagePath: megaImg("음료","ice","흑당버블밀크티라떼") },
  { id: "mega_ice_오레오초코라떼",     name: "오레오초코라떼",     emoji: "🍫", category: "음료", iced: true, imagePath: megaImg("음료","ice","오레오초코라떼") },
  { id: "mega_ice_왕메가초코",         name: "왕메가초코",         emoji: "🍫", category: "음료", iced: true, imagePath: megaImg("음료","ice","왕메가초코") },

  // ── 티 / 통합 (hot+ice 동일명 → iced:true) ──
  { id: "mega_tea_녹차",       name: "녹차",       emoji: "🍵", category: "티", iced: true,  imagePath: megaImg("티", "ice", "녹차") },
  { id: "mega_tea_레몬차",     name: "레몬차",     emoji: "🍋", category: "티", iced: true,  imagePath: megaImg("티", "ice", "레몬차") },
  { id: "mega_tea_사과유자차", name: "사과유자차", emoji: "🍎", category: "티", iced: true,  imagePath: megaImg("티", "ice", "사과유자차") },
  { id: "mega_tea_상큼리치티", name: "상큼리치티", emoji: "🍒", category: "티", iced: true,  imagePath: megaImg("티", "ice", "상큼리치티") },
  { id: "mega_tea_얼그레이",   name: "얼그레이",   emoji: "🫖", category: "티", iced: true,  imagePath: megaImg("티", "ice", "얼그레이") },
  { id: "mega_tea_유자차",     name: "유자차",     emoji: "🍊", category: "티", iced: true,  imagePath: megaImg("티", "ice", "유자차") },
  { id: "mega_tea_자몽차",     name: "자몽차",     emoji: "🍊", category: "티", iced: true,  imagePath: megaImg("티", "ice", "자몽차") },
  { id: "mega_tea_캐모마일",   name: "캐모마일",   emoji: "🌼", category: "티", iced: true,  imagePath: megaImg("티", "ice", "캐모마일") },
  { id: "mega_tea_페퍼민트",   name: "페퍼민트",   emoji: "🌿", category: "티", iced: true,  imagePath: megaImg("티", "ice", "페퍼민트") },
  { id: "mega_tea_허니자몽블랙티", name: "허니자몽블랙티", emoji: "🍊", category: "티", iced: true, imagePath: megaImg("티", "ice", "허니자몽블랙티") },
  // 티 / hot only
  { id: "mega_teahot_유자생강차", name: "유자생강차", emoji: "🫚", category: "티", iced: false, imagePath: megaImg("티", "hot", "유자생강차", "webp") },
  // 티 / ice only
  { id: "mega_teaice_복숭아이스티",    name: "복숭아이스티",    emoji: "🍑", category: "티", iced: true, imagePath: megaImg("티", "ice", "복숭아이스티") },
  { id: "mega_teaice_왕메가사과유자",  name: "왕메가사과유자",  emoji: "🍎", category: "티", iced: true, imagePath: megaImg("티", "ice", "왕메가사과유자") },
  { id: "mega_teaice_왕메가아이스티",  name: "왕메가아이스티",  emoji: "🫖", category: "티", iced: true, imagePath: megaImg("티", "ice", "왕메가아이스티") },
  { id: "mega_teaice_제로복숭아아이스티", name: "제로복숭아아이스티", emoji: "🍑", category: "티", iced: true, imagePath: megaImg("티", "ice", "제로복숭아아이스티") },

  // ── 에이드&주스 (모두 ICE) ──
  { id: "mega_ade_레몬에이드",      name: "레몬에이드",      emoji: "🍋", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "레몬에이드") },
  { id: "mega_ade_자몽에이드",      name: "자몽에이드",      emoji: "🍊", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "자몽에이드", "webp") },
  { id: "mega_ade_청포도에이드",    name: "청포도에이드",    emoji: "🍇", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "청포도에이드") },
  { id: "mega_ade_블루레몬에이드",  name: "블루레몬에이드",  emoji: "💙", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "블루레몬에이드") },
  { id: "mega_ade_메가에이드",      name: "메가에이드",      emoji: "🟡", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "메가에이드") },
  { id: "mega_ade_제로부스트에이드", name: "제로부스트에이드", emoji: "⚡", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "제로부스트에이드") },
  { id: "mega_ade_라임모히또",      name: "라임모히또",      emoji: "🌿", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "라임모히또") },
  { id: "mega_ade_체리콜라",        name: "체리콜라",        emoji: "🍒", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "체리콜라", "webp") },
  { id: "mega_ade_딸기주스",        name: "딸기주스",        emoji: "🍓", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "딸기주스") },
  { id: "mega_ade_딸기바나나주스",  name: "딸기바나나주스",  emoji: "🍓", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "딸기바나나주스") },
  { id: "mega_ade_골드키위주스",    name: "골드키위주스",    emoji: "🥝", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "골드키위주스") },
  { id: "mega_ade_블루베리플럼주스", name: "블루베리플럼주스", emoji: "🫐", category: "에이드&주스", iced: true, imagePath: megaImg("에이드&주스", "ice", "블루베리플럼주스") },

  // ── 스무디&프라페 (모두 ICE) ──
  { id: "mega_smo_커피프라페",          name: "커피프라페",          emoji: "☕", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "커피프라페") },
  { id: "mega_smo_녹차프라페",          name: "녹차프라페",          emoji: "🍵", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "녹차프라페", "webp") },
  { id: "mega_smo_민트프라페",          name: "민트프라페",          emoji: "🌿", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "민트프라페") },
  { id: "mega_smo_리얼초코프라페",      name: "리얼초코프라페",      emoji: "🍫", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "리얼초코프라페") },
  { id: "mega_smo_쿠키프라페",          name: "쿠키프라페",          emoji: "🍪", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "쿠키프라페") },
  { id: "mega_smo_딸기쿠키프라페",      name: "딸기쿠키프라페",      emoji: "🍓", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "딸기쿠키프라페") },
  { id: "mega_smo_밀크쉐이크",          name: "밀크쉐이크",          emoji: "🥤", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "밀크쉐이크", "webp") },
  { id: "mega_smo_골드망고스무디",      name: "골드망고스무디",      emoji: "🥭", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "골드망고스무디") },
  { id: "mega_smo_망고요거트스무디",    name: "망고요거트스무디",    emoji: "🥭", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "망고요거트스무디") },
  { id: "mega_smo_딸기요거트",          name: "딸기요거트",          emoji: "🍓", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "딸기요거트") },
  { id: "mega_smo_플레인요거트스무디",  name: "플레인요거트스무디",  emoji: "🥤", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "플레인요거트스무디") },
  { id: "mega_smo_블루베리요거트스무디", name: "블루베리요거트스무디", emoji: "🫐", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "블루베리요거트스무디") },
  { id: "mega_smo_귤톡톡제리스무디",    name: "귤톡톡제리스무디",    emoji: "🍊", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "귤톡톡제리스무디") },
  { id: "mega_smo_코코넛커피스무디",    name: "코코넛커피스무디",    emoji: "🥥", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "코코넛커피스무디") },
  { id: "mega_smo_그린키위콕콕딸키스무디", name: "그린키위콕콕딸키스무디", emoji: "🥝", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "그린키위콕콕딸키스무디", "webp") },
  { id: "mega_smo_딸기퐁크러쉬",        name: "딸기퐁크러쉬",        emoji: "🍓", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "딸기퐁크러쉬") },
  { id: "mega_smo_바나나퐁크러쉬",      name: "바나나퐁크러쉬",      emoji: "🍌", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "바나나퐁크러쉬") },
  { id: "mega_smo_초코허니퐁크러쉬",    name: "초코허니퐁크러쉬",    emoji: "🍫", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "초코허니퐁크러쉬") },
  { id: "mega_smo_플레인퐁크러쉬",      name: "플레인퐁크러쉬",      emoji: "🥤", category: "스무디&프라페", iced: true, imagePath: megaImg("스무디&프라페", "ice", "플레인퐁크러쉬") },

  // ── 신상품 (모두 ICE) ──
  { id: "mega_new_꿀수박주스",              name: "꿀수박주스",              emoji: "🍉", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "꿀수박주스", "webp") },
  { id: "mega_new_수박리치코코슬러시",      name: "수박리치코코슬러시",      emoji: "🍉", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "수박리치코코슬러시", "webp") },
  { id: "mega_new_수박소르베밀키스무디",    name: "수박소르베밀키스무디",    emoji: "🍉", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "수박소르베밀키스무디", "webp") },
  { id: "mega_new_자몽톡톡스무디",          name: "자몽톡톡스무디",          emoji: "🍊", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "자몽톡톡스무디", "webp") },
  { id: "mega_new_애플머스캣요거트스무디",  name: "애플머스캣요거트스무디",  emoji: "🍇", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "애플머스캣요거트스무디", "webp") },
  { id: "mega_new_파인망고코코스무디",      name: "파인망고코코스무디",      emoji: "🍍", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "파인망고코코스무디", "webp") },
  { id: "mega_new_제로레몬말차아이스티",    name: "제로레몬말차아이스티",    emoji: "🍵", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "제로레몬말차아이스티", "webp") },
  { id: "mega_new_저당꿀배XO야구르트",      name: "저당꿀배XO야구르트",      emoji: "🍐", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "저당꿀배XO야구르트", "webp") },
  { id: "mega_new_M망고G구아바C캐럿주스",   name: "M망고G구아바C캐럿주스",   emoji: "🥭", category: "신상품", iced: true, imagePath: megaImg("신상품", "ice", "M망고G구아바C캐럿주스", "webp") },
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

export const CAFE_MENUS: Record<CafeId, MenuItem[]> = {
  starbucks: STARBUCKS,
  mega:      MEGA_FINAL,
  twosome:   TWOSOME,
};

export function getMenuByCafe(cafeId: CafeId): MenuItem[] {
  return CAFE_MENUS[cafeId] ?? STARBUCKS;
}

export function getCafeInfo(cafeId: CafeId): CafeInfo {
  return CAFE_LIST.find((c) => c.id === cafeId) ?? CAFE_LIST[0];
}

export const COFFEE_MENU = STARBUCKS;
