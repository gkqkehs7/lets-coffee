# 커피 뭐드실래요? — Design Spec v2

> **컨셉: "Order Slip"**  
> 실물 커피숍 영수증/주문표에서 영감을 받은 Neo-Brutalist 디자인.  
> 귀엽지 않고 **confident**하다. 따뜻하지 않고 **crisp**하다. 떠다니지 않고 **grounded**하다.

---

## 0. 왜 이 방향인가

현재 디자인의 문제:
- 베이지 + 브라운 그라데이션 → 모든 Claude 앱의 기본값
- `Gowun Dodum` + 이모지 남발 → "귀여운 AI 프로젝트" 느낌
- 둥근 카드 + 부드러운 그림자 → 구분이 없는 형태들
- 배경 이모지 float → 노이즈, 실용성 없음

목표:
- **업무 툴처럼 느껴지되 재미있어야 한다** — Notion, Linear, Deno 같은 느낌
- **커피숍이 연상되어야 한다** — 고급 스페셜티 카페의 주문표/메뉴판
- **모바일 퍼스트, 인터랙션이 명확해야 한다** — 탭 영역이 크고, 상태가 즉각 보인다

---

## 1. 컬러 시스템

```
Background    #F5F3EE   종이 흰색 (pure white 아님, 약간 크림)
Surface       #FFFFFF   카드/패널
Border        #1C1C1A   잉크 블랙 (off-black)
Text Primary  #1C1C1A   메인 텍스트
Text Muted    #6B6762   서브 텍스트
Text Faint    #B0ADA8   플레이스홀더, 비활성

Accent Red    #D4341A   핵심 강조 (버튼, 선택 상태, CTA)
              → 커피숍 스탬프/잉크 레드 느낌
Accent Dark   #8C1F0E   Hover 상태의 Accent Red
Green         #2E6B3E   주문 완료 상태
Amber         #B86B10   고민 중/ordering 상태

Starbucks     #00704A   브랜드 고유 유지
Mega          #FFD600   브랜드 고유 유지
Twosome       #C8102E   브랜드 고유 유지
```

**팔레트 원칙:**
- 배경은 절대 유색(Colored) 배경 없음. 항상 `#F5F3EE` 또는 `#FFFFFF`.
- 컬러는 의미가 있을 때만 쓴다 (상태 표시, CTA, 브랜드).
- 그라데이션 금지. 단색만.

---

## 2. 타이포그래피

```
Primary:  "Pretendard Variable"  (기존 유지, 한국어 최적)
Mono:     "DM Mono"              (주문 코드, 메뉴 가격, 카운터)
          → Google Fonts CDN: family=DM+Mono:wght@400;500
```

**폰트 스케일:**
```
display    32px / weight 800 / tracking -0.02em   (헤더 타이틀)
heading    22px / weight 700 / tracking -0.01em   (페이지 제목)
subhead    16px / weight 600                      (섹션 제목)
body       15px / weight 400                      (기본)
caption    12px / weight 500 / tracking 0.04em    (라벨, uppercase)
mono       13px / DM Mono                         (주문 코드, 카운터)
```

**제거:**
- `Gowun Dodum` — 더 이상 사용하지 않음
- `Quicksand` — 더 이상 사용하지 않음

---

## 3. 형태 & 레이아웃

### Border Radius
```
Sharp     0px    (기본 카드, 인풋, 섹션 divider)
Minimal   4px    (태그/칩)
Pill      999px  (상태 인디케이터 dot 전용)
```
> 현재 디자인의 28px 카드, 18px 버튼 → 모두 4px 이하로 교체

### Shadow
그라데이션 그림자 대신 **offset shadow (브루탈 그림자)**:
```css
--shadow-card:   2px 2px 0px #1C1C1A;
--shadow-input:  2px 2px 0px #B0ADA8;   /* 포커스 전 */
--shadow-focus:  2px 2px 0px #D4341A;   /* 포커스 시 */
--shadow-button: 3px 3px 0px #8C1F0E;  /* 버튼 hover */
```

### 테두리
```css
border: 1.5px solid #1C1C1A;   /* 카드, 인풋, 버튼 기본 */
border: 2px solid #D4341A;      /* 선택 상태, 포커스 */
```

### 구분선
점선 divider로 영수증 느낌:
```css
border-top: 1.5px dashed #D0CCC7;   /* 섹션 구분 */
border-top: 1.5px solid #1C1C1A;    /* 헤더/푸터 경계 */
```

### 간격
```
4 / 8 / 12 / 16 / 24 / 32 / 48px
```
8의 배수. 여백을 아끼지 말 것. 공백이 디자인이다.

---

## 4. 컴포넌트 스펙

### 버튼

**Primary (CTA)**
```
background:  #D4341A
color:       #FFFFFF
border:      1.5px solid #D4341A
border-radius: 4px
padding:     14px 24px
font-size:   15px / weight 700
shadow:      none (기본), 3px 3px 0 #8C1F0E (hover)
transform:   translateY(-2px) on hover
active:      translateY(0), shadow none
```

**Secondary**
```
background:  transparent
color:       #1C1C1A
border:      1.5px solid #1C1C1A
border-radius: 4px
padding:     12px 20px
font-size:   14px / weight 600
hover:       background #1C1C1A, color #F5F3EE
```

**Ghost (텍스트 버튼)**
```
background:  transparent
color:       #6B6762
border:      none
padding:     8px 12px
underline:   none
hover:       color #1C1C1A
```

**Disabled**
```
background:  #E8E5E0
color:       #B0ADA8
border:      1.5px solid #D0CCC7
cursor:      not-allowed
```

### 인풋

```
background:    #FFFFFF
border:        1.5px solid #1C1C1A
border-radius: 4px
padding:       12px 14px
font-size:     15px
color:         #1C1C1A
placeholder:   #B0ADA8

focus:
  border-color: #D4341A
  box-shadow:   2px 2px 0 #D4341A
  outline:      none
```

### 카드 / 리스트 아이템

기존 흰 카드 + 그림자 대신:
```
background:    #FFFFFF
border:        1.5px solid #1C1C1A
border-radius: 4px
padding:       14px 16px

선택된 아이템:
  border: 2px solid #D4341A
  background: #FFF8F6
```

### 상태 배지 (Status Badge)

dot 대신 **filled pill label**:
```
thinking:  border 1.5px solid #B0ADA8, color #6B6762, bg transparent, text "대기중"
ordering:  border 1.5px solid #B86B10, color #B86B10, bg #FFF8EC,    text "고민중"
editing:   border 1.5px solid #B86B10, color #B86B10, bg #FFF8EC,    text "변경중"
decided:   border 1.5px solid #2E6B3E, color #2E6B3E, bg #F0F7F2,    text "완료"
offline:   bg #E8E5E0, color #B0ADA8,                                 text "오프라인"

font-size:     11px
font-weight:   600
letter-spacing: 0.04em
padding:       2px 8px
border-radius: 4px
```

### 칩 (Cafe / 카테고리 레이블)
```
background:    transparent
border:        1.5px solid currentColor
border-radius: 4px
padding:       3px 8px
font-size:     11px / weight 700 / uppercase / tracking 0.06em
```

### Progress Bar (주문 현황)

기존 그라데이션 pill 바 → **세그먼트 방식**:
```
각 참여자를 1개의 사각형 세그먼트로 표현
완료된 참여자: background #1C1C1A
미완료:        background transparent, border 1.5px solid #D0CCC7
height: 8px, width: 동적, gap: 3px, border-radius: 2px
```

### 모달 / Bottom Sheet

```
overlay:       rgba(28, 28, 26, 0.6), backdrop-filter: blur(2px)
sheet:         background #F5F3EE
               border-top: 2px solid #1C1C1A
               border-radius: 0 (모바일), 4px (데스크탑)
               padding: 28px 24px 40px
               NO border-radius 28px
```

---

## 5. 모션 & 애니메이션

### 원칙
- 배경에 떠다니는 이모지 → **완전 제거**
- popIn / confetti 과도한 연출 → **최소화**
- 모든 애니메이션은 **목적이 있을 때만**

### 유지하는 애니메이션
```css
/* 페이지/카드 등장 */
@keyframes slideIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* 주문 완료 시 체크 stamp 효과 */
@keyframes stamp {
  0%   { transform: scale(1.4) rotate(-3deg); opacity: 0; }
  60%  { transform: scale(0.95) rotate(0deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
/* loading indicator - 점이 아닌 라인 스캔 */
@keyframes scanLine {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### 제거하는 애니메이션
- `animate-float` (배경 이모지)
- `popIn` bounce
- `confetti` (UX 위주면 필요 시 유지 가능, 단 1회만)
- `fadeUp` (→ `slideIn` 으로 통일, 8px 이동으로 줄임)

---

## 6. 아이콘 & 이모지 정책

### 이모지 사용 기준
- **메뉴 아이템** (☕, 🍵 등): 유지. 메뉴 구분에 실용적.
- **UI 장식용 이모지** (배경 float, 버튼 끝 ✨🎉): **전부 제거**
- **상태 표시용 이모지** (✅ ⏳ 👑 🔒): 텍스트 라벨로 교체
- **로딩 스피너**: `☕` float → CSS 라인 스캐너로 교체

### 아이콘 (필요 시)
- `lucide-react` 또는 SVG inline 사용
- 선 두께 1.5px, 스트로크 기반

---

## 7. 홈 페이지 (CreateRoomForm)

### 레이아웃 구조

```
┌─────────────────────────────┐
│  ☕  커피 뭐드실래요?         │  ← 앱 헤더 (좌측 정렬)
│  링크 하나로 팀 주문 끝         │    작은 서브타이틀
│─────────────────────────────│  ← solid border
│                             │
│  어느 카페?                   │  ← uppercase caption
│  [스타벅스] [메가커피] [투썸]   │  ← 브랜드 컬러 테두리 버튼
│                             │
│- - - - - - - - - - - - - - -│  ← dashed divider
│                             │
│  커피타임 이름               │
│  [__________________]       │
│                             │
│  내 이름                     │
│  [__________________]       │
│                             │
│  [    방 만들기    ]          │  ← Primary 버튼 (full width)
│                             │
└─────────────────────────────┘
```

- 전체 배경: `#F5F3EE`
- 중앙 폼: max-width 400px, border 1.5px solid #1C1C1A, bg #FFFFFF, padding 32px
- 오프셋 그림자: `4px 4px 0 #1C1C1A`
- 플로팅 이모지 배경 → **제거**
- 로고: 80px 원형 이모지 박스 → **`☕` 텍스트 또는 작은 SVG**로 교체

### 카페 선택 버튼

```
각 버튼:
  flex: 1
  padding: 14px 8px
  border: 1.5px solid #D0CCC7
  border-radius: 4px
  bg: #FFFFFF
  display: flex, column, align center, gap 6px

선택 시:
  border: 2px solid [cafeColor]
  bg: [cafeColor]08  (매우 연한 브랜드 컬러)
  box-shadow: 2px 2px 0 [cafeColor]
```

---

## 8. 방 페이지 (RoomPageClient)

### 헤더

```
┌─────────────────────────────────┐
│ [로고 32px]  오후 커피타임       공유 │
│ 스타벅스      ■■■■□□□  3/6명        │
└─────────────────────────────────┘
height: auto (컨텐츠에 맞춤)
border-bottom: 1.5px solid #1C1C1A
bg: #FFFFFF
padding: 14px 20px
```

- 카페 로고: 32px, border 1.5px solid [cafeColor], border-radius 4px
- 방 이름: 17px / weight 700, 말줄임
- 프로그레스: 세그먼트 방식 (위 5번 참고)
- 공유 버튼: `공유` 텍스트, border 1.5px solid #1C1C1A, 36×36, border-radius 4px

### 참여자 리스트 아이템

**주문 완료:**
```
┌──────────────────────────────┐  ← border 1.5px #1C1C1A
│ [이니셜] 민우         [완료]  │  ← status badge
│         아이스 라떼 Tall      │  ← 주문 정보
└──────────────────────────────┘
```
- 아바타: 36px, border 1.5px #1C1C1A, 이름 이니셜 (이모지 아님)
- "나" 표시: 테두리 색 `#D4341A`, 오른쪽에 `나` 칩
- 수정 버튼: Secondary 스타일 소형

**대기 중:**
```
┌──────────────────────────────┐  ← border 1.5px #D0CCC7 (연한 테두리)
│  [?]  민우              [고민중] │
│        ...                   │
└──────────────────────────────┘
opacity: 0.7 (오프라인)
```

### 집계 패널 (방장 전용)
```
┌──────────────────────────────┐  ← dashed border
│ ORDER SUMMARY        총 5잔  │  ← mono font
│ ─────────────────────────────│
│ 아이스 라떼     ×2  민우,지현 │
│ 따뜻한 아메리카노 ×1  준혁    │
│ ─────────────────────────────│
│        [주문 복사하기]         │
└──────────────────────────────┘
font-family: 'DM Mono' for 수량/코드, Pretendard for 이름
```

### 하단 CTA 바

```
bg: #FFFFFF
border-top: 1.5px solid #1C1C1A
padding: 16px 20px 32px

[   메뉴 고르러 가기   ] [안먹기]
         Primary         Ghost
```

---

## 9. 메뉴 그리드 (CoffeeMenuGrid)

현재: 이모지 카드들, 카테고리 헤더 있음

개선:
```
카테고리 헤더:
  font-size: 11px / uppercase / weight 700 / tracking 0.08em
  border-bottom: 1px solid #1C1C1A
  padding-bottom: 6px
  margin-bottom: 12px

메뉴 아이템 카드:
  height: 68px
  border: 1.5px solid #D0CCC7
  border-radius: 4px
  display: flex, row, align center
  padding: 12px

  왼쪽: 이모지 32px, bg #F5F3EE, border 1px #D0CCC7, 4px radius
  가운데: 이름 (14px/600) + 온도 정보 (12px/#6B6762)
  오른쪽: 화살표 →

선택 시:
  border: 2px solid #D4341A
  bg: #FFF8F6
```

---

## 10. 참여 모달 (JoinRoomModal)

```
overlay: rgba(28,28,26,0.6), blur(2px)

sheet:
  bg: #F5F3EE
  border-top: 2px solid #1C1C1A  (모바일)
  border: 2px solid #1C1C1A, border-radius: 4px  (데스크탑)
  
상단:
  [로고 28px] 스타벅스 · 오후 커피타임
  ← 카페 칩 형태

h2: "이름을 알려주세요" (22px/700)
sub: "주문이 완료되면 알려드려요" (14px/#6B6762)

[입력창]
[참여하기 →]  ← Primary 버튼
```

---

## 11. globals.css 변경사항 요약

### 추가
```css
/* DM Mono 폰트 */
@import url("https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap");

/* Neo-Brutal shadow */
.brutal-shadow  { box-shadow: 3px 3px 0 #1C1C1A; }
.brutal-shadow-sm { box-shadow: 2px 2px 0 #1C1C1A; }
.brutal-shadow-red { box-shadow: 3px 3px 0 #8C1F0E; }

/* stamp 애니메이션 */
.animate-stamp { animation: stamp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
```

### 제거
- `--color-cream`, `--color-beige`, `--color-caramel`, `--color-latte` 등 파스텔 팔레트
- `--font-title` (Gowun Dodum)
- `--font-en` (Quicksand)
- `.animate-float` → 배경 이모지에 쓰던 것
- `.btn-hover` (translateY + box-shadow 그라데이션 버전) → 새 버튼 스타일로 대체
- `.card-hover` → 새 카드 스타일로 대체

### 수정
- `--radius-card: 4px` (기존 20px)
- `--radius-button: 4px` (기존 18px)
- `--color-background: #F5F3EE` (기존 #FFF8F0)
- `--color-border: #1C1C1A` (기존 #F5E6D3)

---

## 12. 레퍼런스 무드

이 디자인이 영향받은 것들:
- **Deno** (clean, stark, confident)
- **Linear** (precision, tight typography)
- **고급 스페셜티 카페 영수증** (DM Mono, uppercase labels, dashed dividers)
- **Korean zine / 독립출판** (bold borders, paper texture, 강한 타이포)

피해야 하는 것들:
- Tailwind UI 기본 스타일
- Shadcn/ui 기본 카드
- 모든 "따뜻하고 귀여운" 앱 feel
- 이모지로 감정 표현하는 버튼

---

## 13. 구현 완료 내역

> 2026-05-23 적용 완료. 빌드 오류 없음.

---

### `frontend/src/app/globals.css`

**제거**
- `Gowun Dodum`, `Quicksand` 폰트 import
- `--color-espresso`, `--color-latte`, `--color-caramel`, `--color-cream`, `--color-beige`, `--color-matcha` 등 파스텔 팔레트
- `.animate-float`, `.animate-fade-up`, `.animate-pop-in` — 배경 장식용 애니메이션
- `.btn-hover`, `.card-hover` — 그라데이션 그림자 hover 클래스
- `.status-dot`, `.status-online`, `.status-ordering`, `.status-decided`, `.status-offline` — dot 상태 표시

**추가**
- `DM Mono` 폰트 import (Google Fonts)
- 새 컬러 팔레트: `--color-paper #F5F3EE`, `--color-ink #1C1C1A`, `--color-accent #D4341A`, `--color-green #2E6B3E`, `--color-amber #B86B10`
- `.btn-primary` — `#D4341A` 레드 버튼, hover 시 `3px 3px 0 #8C1F0E` 오프셋 그림자
- `.btn-secondary` — 투명 배경, `#1C1C1A` 테두리, hover 시 색 반전
- `.btn-ghost` — 텍스트 전용 버튼
- `.badge-thinking`, `.badge-ordering`, `.badge-editing`, `.badge-decided`, `.badge-offline` — pill 텍스트 배지
- `.animate-slide-in` (8px), `.animate-stamp` — 새 진입 애니메이션
- `@keyframes scanLine` — 로딩 스캔라인
- `--radius-card: 4px`, `--radius-button: 4px` (기존 20/18px)
- `.toggle-btn` 전체 너비 균등 분할 (`flex: 1`)

**수정**
- `.input-field` — `border: 1.5px solid #1C1C1A`, focus 시 `#D4341A` 테두리 + 오프셋 그림자
- `.toggle-group` — `display: flex` (inline-flex → flex), `border: 1.5px solid #1C1C1A`, `border-radius: 4px`
- `.modal-sheet` — `border-top: 2px solid #1C1C1A`, `background: #F5F3EE`, 데스크탑에서 `box-shadow: 5px 5px 0 #1C1C1A`
- `.chip` — `border-radius: 4px` (기존 999px pill)

---

### `frontend/src/components/home/CreateRoomForm.tsx`

**제거**
- `BG_EMOJIS` 배경 이모지 배열 및 렌더링 전체
- `Gowun Dodum` 폰트 참조 (h1, 버튼)
- 그라데이션 버튼 (`linear-gradient(135deg, #C9A57B, #6F4E37)`)
- 로딩 시 `animate-float` 이모지 ☕

**추가**
- `DM Mono` uppercase `"Team Coffee Order"` 서브레이블
- 폼 카드: `border: 1.5px solid #1C1C1A`, `box-shadow: 4px 4px 0 #1C1C1A`
- 카페 선택 버튼: 선택 시 브랜드 컬러 오프셋 그림자 (`2px 2px 0 [cafeColor]`)
- 카페 로고 컨테이너: `border-radius: 4px` (기존 12px)
- 로딩 상태: DM Mono `"Creating room..."` + `scanLine` 애니메이션 바
- 푸터 텍스트: DM Mono `"로그인 없이 바로 시작"`, 이모지 없음

**수정**
- `<h1>` 폰트: Gowun Dodum → Pretendard, `font-weight: 800`, `letter-spacing: -0.02em`
- 라벨: `font-size: 10px`, `letter-spacing: 0.1em`, `text-transform: uppercase`
- 구분선: `border-top: 1.5px dashed #D0CCC7` (기존 `height: 1px solid`)
- 제출 버튼: `.btn-primary` 클래스 사용

---

### `frontend/src/components/room/RoomPageClient.tsx`

**제거**
- 로딩 시 `animate-float` 이모지 ☕
- notFound 시 이모지 😢, Gowun Dodum h2, 그라데이션 링크 버튼
- 헤더 progress bar 그라데이션 fill (`linear-gradient(90deg, #C9A57B, #6F4E37)`)
- 하단 바 "메뉴 고르러 가기 ☕", "안먹기 🙅" 이모지 포함 버튼
- "주문 마감하기 🔒", "마감됨 ✨" 이모지 텍스트
- isClosed 배너의 그라데이션 배경

**추가**
- 로딩: DM Mono `"Loading..."` + `scanLine` 바
- notFound: DM Mono `"404 Not Found"` 레이블
- 헤더: **세그먼트 프로그레스** — `onlineParticipants` 배열로 각 참여자를 `5px` 사각 세그먼트로 렌더링 (결정 시 `#1C1C1A` fill, 미결정 시 `#D0CCC7` 테두리만)
- 헤더 카운터: DM Mono `"N/M"` 포맷
- 헤더 카페 로고: `border: 1.5px solid [cafeColor]`, `border-radius: 4px` (기존 overflow hidden 원형)
- 뒤로 버튼: `.btn-ghost` + 세로 구분선
- 하단 바: `border-top: 1.5px solid #1C1C1A`, `background: #FFFFFF`
- `onlineParticipants` 파생 변수 추가

**수정**
- "방 마감하기": `.btn-ghost` (기존 `#F5E6D3` 배경 버튼)
- "메뉴 고르러 가기": `.btn-primary`, "패스": `.btn-secondary`
- isClosed 배너: DM Mono 텍스트, `border: 1.5px solid #1C1C1A`, `background: #F5F3EE`

---

### `frontend/src/components/room/RoomView.tsx`

**제거**
- 이모지 아바타 (✅ ⏳ 👑 🔒 🥱 등 UI 장식 이모지 전체)
- 그라데이션 배경 (`linear-gradient(135deg, rgba(168,192,154,0.06), transparent)`)
- `.status-dot` 기반 색 점 상태 표시
- `background: "linear-gradient(135deg, #F5E6D3, #C9A57B)"` 아바타 배경
- 집계 패널의 `#F5E6D3` 배경 + `#6F4E37` 텍스트

**추가**
- `Avatar` 컴포넌트: 이름 첫 글자 이니셜, 4px 테두리 사각 박스, 내 것은 `#D4341A` 강조
- `StatusBadge` 컴포넌트: `.badge-*` 클래스 pill 텍스트 배지
- 섹션 헤더 helper: DM Mono `"DONE · N명"`, `"WAITING · N명"` uppercase
- 참여자 카드 left accent bar: 내 카드에 `3px solid #D4341A` 왼쪽 테두리
- `HOST` 칩: `border: 1.5px solid #B86B10` (기존 👑 이모지)
- `나` 칩: `background: #D4341A`, 흰 텍스트
- **집계 패널 receipt 스타일**: `border: 1.5px dashed #1C1C1A`, "ORDER SUMMARY" DM Mono 헤더, `×N` DM Mono 수량, dashed 구분선
- 빈 상태: DM Mono `"Waiting..."` (기존 🥱 이모지)

**수정**
- 수정 버튼: `.btn-secondary` (기존 `#F5E6D3` 배경)
- 주문 복사 버튼: `.btn-secondary`, 복사 완료 시 `background: #1C1C1A` 색 반전
- 참여자 카드 컨테이너: `border: 1.5px solid #1C1C1A` (완료) / `border: 1.5px solid #D0CCC7` (대기), `overflow: hidden`, 내부 행 구분은 `border-bottom: 1px solid #F0EDE8`

---

### `frontend/src/components/room/CoffeeMenuGrid.tsx`

**제거**
- `card-hover` 그리드 카드 레이아웃 전체
- 선택 시 체크 원형 배지 (흰 배경 + ✓)
- `border-radius: 20px` 카드
- ✏️ 기타 섹션의 `border-radius: 20px` dashed 카드 (큰 이모지 + 두 줄 텍스트)

**추가**
- `MenuRow` 컴포넌트: flex row 리스트 아이템 (`height ~58px`)
- 이모지를 `34×34` 사각 박스에 포함 (`border: 1.5px solid #D0CCC7`, `border-radius: 4px`)
- 선택 시 left accent bar `3px solid #D4341A` + `background: #FFF8F6`
- 선택 시 오른쪽에 DM Mono `"선택됨"` 텍스트 (기존 ✓ 원형)
- 카테고리 헤더: DM Mono `10px uppercase`, `border-bottom: 1px solid #1C1C1A`
- 카테고리 내 항목을 `border: 1.5px solid #D0CCC7` 컨테이너에 묶음

**수정**
- 직접 입력: `border: 1.5px dashed`, row 형태로 통일 (기존 큰 카드 형태)
- `auto-fill` 그리드 → 세로 리스트

---

### `frontend/src/components/room/OrderOptionsForm.tsx`

**제거**
- `linear-gradient(135deg, #F5E6D3, #FFF8F0)` 메뉴 헤더 박스
- `font-size: 56px` 대형 이모지
- Gowun Dodum 메뉴 이름
- "주문 완료 ✨", "← 다시 고를게요" 이모지 포함 버튼
- 그라데이션 제출 버튼

**추가**
- 메뉴 헤더: flex row (`48×48` 이모지 박스 + 메뉴 이름 + 서브텍스트), `border-bottom: 1.5px solid #1C1C1A`
- 섹션 라벨: `10px uppercase` 헬퍼 함수

**수정**
- 온도/사이즈 `.toggle-btn` 라벨: `"🔥 HOT"` → `"HOT"`, 사이즈에 `"S · Tall"` 형식 추가
- 제출 버튼: `.btn-primary`
- 취소 버튼: `.btn-ghost`
- 메모 placeholder: 이모지 제거 (`"얼음 적게, 달달하게 등"`)

---

### `frontend/src/components/room/JoinRoomModal.tsx`

**제거**
- 카페 pill의 `border-radius: 24px` (큰 pill)
- Gowun Dodum h2
- "커피 주문에 참여해요!" 서브텍스트
- "입장하기 ✨" 이모지
- `animate-pop-in` 클래스

**추가**
- 카페 칩: `border: 1.5px solid [cafeColor]`, `border-radius: 4px`, 로고 `22×22`
- 방 이름 h2: `font-weight: 800`, `letter-spacing: -0.01em`
- 서브텍스트: `"이름을 알려주세요"`
- 라벨: uppercase `"내 이름"`

**수정**
- 참여 버튼: `.btn-primary`, `"참여하기"` (이모지 없음)
- submitting 텍스트: `"입장 중..."` 유지

---

### `frontend/src/components/room/ShareButton.tsx`

**변경**
- 크기: `44×44` → `38×38`
- `border-radius: 12px` → `4px`
- 배경: `#F5E6D3` → `transparent`
- 테두리: `none` → `1.5px solid #1C1C1A`
- 텍스트 색: `#8D6E63` → `#1C1C1A`
- 복사 완료 상태: `background: #A8C09A` → `background: #1C1C1A, color: #F5F3EE`
- 완료 아이콘: `"✓"` 유지 (텍스트 동일)

---

### `frontend/src/components/ui/Toast.tsx`

**변경**
- 배경: `#3E2723` → `#1C1C1A`
- 텍스트 색: `#FFF8F0` → `#F5F3EE`
- `border-radius: 999px` → `4px`
- `box-shadow: 0 4px 20px rgba(...)` → `box-shadow: 3px 3px 0 #6B6762` (오프셋)
- 애니메이션: `animate-pop-in` → `animate-slide-in`
8. **폰트 교체** — DM Mono 추가, Gowun Dodum 제거 (30분)
