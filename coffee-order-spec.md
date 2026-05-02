# ☕ 커피 뭐드실래요? - 작업 계획서

> 팀원들의 커피 주문을 실시간으로 집계하는 웹 서비스
> 메모장에 적느라 번거로웠던 커피 주문, 링크 하나로 끝!

---

## 📌 프로젝트 개요

### 문제 정의

- 팀에서 커피 사올 때마다 메모장에 한 명씩 적어가며 주문을 받는 게 번거로움
- 누가 뭘 시켰는지, 몇 잔씩인지 매번 직접 정리해야 함

### 솔루션

- 호스트가 방을 만들고 링크 공유 → 팀원들이 각자 자기 메뉴 입력 → 실시간으로 집계되어 한눈에 확인 가능

### 핵심 가치

- **간편함**: 로그인 불필요, 링크 하나로 시작
- **실시간성**: 누가 접속했고 누가 입력 중인지 바로 보임
- **모바일 친화**: 카페에서 핸드폰으로도 편하게 사용

---

## 🛠️ 기술 스택

### Frontend

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS** (아기자기한 카페 디자인)
- **Socket.IO Client** (실시간 통신)
- **shadcn/ui** 또는 비슷한 컴포넌트 라이브러리 (선택)
- **qrcode.react** (QR 코드 생성)
- **lucide-react** (아이콘)

### Backend

- **FastAPI** (Python 3.11+)
- **python-socketio** (Socket.IO 서버)
- **Pydantic v2** (모델 검증)
- **uvicorn** (ASGI 서버)
- **In-memory storage** (MVP 기준 — 추후 Redis 확장 고려)

### 배포 (선택)

- Frontend: Vercel
- Backend: Railway / Fly.io / Render

---

## ✨ 기능 명세

### 1. 방 생성 (홈 페이지)

- 입력 항목: **방 이름** (예: "오후 3시 커피타임"), **호스트 이름**
- 제출 시 백엔드에서 `room_id` (예: `nanoid` 기반 8자리) 생성
- 생성한 사용자는 자동으로 호스트 권한 부여
- 호스트의 `user_id`와 `user_name`은 쿠키/세션에 저장

### 2. 링크 공유

- 방 이름 옆에 **링크 복사** 버튼 (작게 인라인 표시)
- 복사 완료 시 버튼 텍스트가 "✓ 복사됨"으로 잠시 변경

### 3. 방 입장 + 이름 입력

- 공유된 링크로 진입 시
  - 쿠키/세션에 해당 방의 `user_id`가 있으면 → 바로 입장
  - 없으면 → 이름 입력 모달/페이지 표시
- 이름 입력 후 백엔드에 등록 → `user_id` 발급 → 쿠키/세션 저장
- 새로고침/재접속 시 동일한 신원으로 복원

### 4. 실시간 상태 표시 (WebSocket)

- 단일 주문 현황 뷰에 모든 참가자 표시
- 완료/미완료 두 섹션으로 구분 (탭 없이 위아래로)
  - **✅ 주문 완료** 섹션: 주문한 사람 + 안먹기 선택한 사람
  - **⏳ 고르는 중** 섹션: 아직 결정 못 한 사람
- 각 사용자의 상태 표시
  - 🟢 **접속 중** (방에 있지만 메뉴 미선택) — 아바타에 `?` 표시
  - 🤔 **고민중..** (메뉴 선택 화면 진입 / 입력 중) — 점점점 애니메이션
  - ✅ **결정완료** (주문 제출 완료) — 메뉴 이모지 표시
  - 🙅 **안먹기** (이번엔 패스) — 회색 처리
- 호스트는 왕관 아이콘 👑 표시
- 오프라인 사용자는 회색 + 흐리게 표시

### 5. 메뉴 선택 + 주문 입력

- 미리 정의된 커피 메뉴 카드 그리드 표시
  - 아메리카노, 카페라떼, 카푸치노, 바닐라라떼, 카라멜마키아또, 카페모카, 에스프레소, 콜드브루, 그린티라떼, 초코라떼, 밀크티, 레몬에이드, 디카페인 아메리카노 등
  - **기타 (직접 입력)**: 메뉴에 없는 음료를 직접 타이핑할 수 있는 카드
- 각 메뉴별로 옵션 선택
  - **HOT / ICED** 토글
  - **사이즈** (Tall / Grande / Venti) — 선택사항
  - **샷 추가** / **시럽 추가** — 선택사항
  - **메모** (자유 입력, "얼음 적게요" 등)
- 선택 시 사용자 상태가 `ordering`(고민중)으로 변경 → 다른 참가자에게 실시간 반영
- 제출 시 `decided`(결정완료)로 변경 → 메뉴 이모지가 사용자 카드에 표시

### 6. 안먹기

- 메뉴 선택 대신 **안먹기** 버튼으로 이번 커피타임을 패스할 수 있음
- 안먹기 선택 시 `decided` 상태로 전환, 주문 집계에서는 제외
- 주문 복사 텍스트에 안먹기 인원은 포함하지 않음
- 마감 전이면 "수정하기" 버튼으로 다시 변경 가능

### 7. 주문 수정

- 마감 전이면 "수정하기" 버튼으로 다시 메뉴 선택 화면 진입
- 수정 시작 시 상태가 다시 `ordering`으로 전환

### 8. 호스트 권한

- **주문 마감** 버튼 (호스트만 보임)
- 마감 시 모든 사용자의 추가 입력/수정 차단
- 마감 후에는 집계 화면 강조

### 9. 주문 집계

- 안먹기를 제외한 실제 주문만 집계
- 완료 섹션 하단에 "총 N잔 집계됐어요" + **주문 복사** 버튼
- **주문 복사** 버튼 (카페에서 그대로 주문할 수 있도록 텍스트 형태로)
  - 예시:
    ```
    📋 오후 3시 커피타임 (총 5잔)
    ☕ 아메리카노(ICED) x3 - 민우, 영희, 철수
    🥛 카페라떼(HOT) x2 - 지민(샷 추가), 수진
    ```

### 10. 반응형 디자인

- 모바일 우선 설계 (Tailwind `sm:`, `md:`, `lg:` 활용)
- 메뉴 카드: 모바일 2열, 태블릿 3열, 데스크탑 4~5열
- 호스트 컨트롤은 모바일에서 하단 고정 바, 데스크탑에서 상단 고정

### 11. (선택) PWA 지원

- `manifest.json`과 service worker 추가 → 홈 화면에 추가 가능
- 짧은 시간 오프라인 캐싱

---

## 📁 프로젝트 구조

```
coffee-order/
├── backend/
│   ├── main.py              # FastAPI + Socket.IO 진입점
│   ├── api/
│   │   ├── __init__.py
│   │   ├── rooms.py         # 방 생성/조회 REST API
│   │   └── menu.py          # 메뉴 조회 REST API
│   ├── core/
│   │   ├── __init__.py
│   │   ├── room_manager.py  # 인메모리 방/사용자 관리
│   │   └── sio.py           # Socket.IO 핸들러
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py       # Pydantic 모델
│   ├── data/
│   │   └── coffee_menu.py   # 커피 메뉴 데이터
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # 홈: 방 생성
│   │   ├── room/[roomId]/
│   │   │   └── page.tsx              # 방 페이지
│   │   ├── globals.css
│   │   └── api/                      # (선택) Next.js Route Handlers
│   ├── components/
│   │   ├── home/
│   │   │   └── CreateRoomForm.tsx
│   │   ├── room/
│   │   │   ├── JoinRoomModal.tsx
│   │   │   ├── RoomView.tsx          # 통합 주문현황 뷰
│   │   │   ├── ShareButton.tsx       # 링크 복사 버튼
│   │   │   ├── CoffeeMenuGrid.tsx
│   │   │   ├── OrderOptionsForm.tsx
│   │   │   ├── HostControls.tsx
│   │   │   └── MyOrderCard.tsx
│   │   └── ui/                       # 공용 컴포넌트 (Button, Card, Modal 등)
│   ├── lib/
│   │   ├── socket.ts                 # Socket.IO 클라이언트 인스턴스
│   │   ├── api.ts                    # REST API fetch 헬퍼
│   │   ├── session.ts                # 쿠키/세션 헬퍼
│   │   ├── types.ts                  # 공유 타입
│   │   └── menu-data.ts              # 프론트용 메뉴 메타데이터
│   ├── public/
│   │   └── coffees/                  # 커피 이미지(또는 이모지로 대체)
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── next.config.js
│
└── README.md
```

---

## 🗃️ 데이터 모델

### Room

```python
class Room:
    room_id: str          # nanoid 8자리 (예: "x4kT9aBz")
    room_name: str        # 사용자가 입력한 방 이름
    host_id: str          # 호스트 user_id
    is_closed: bool       # 주문 마감 여부
    created_at: datetime
    participants: dict[str, Participant]  # user_id를 키로
```

### Participant

```python
class Participant:
    user_id: str          # nanoid
    user_name: str
    is_host: bool
    is_online: bool       # WebSocket 연결 상태
    status: Literal["thinking", "ordering", "decided"]
    order: Optional[Order]
    joined_at: datetime
```

### Order

```python
class Order:
    menu_id: str          # "skip"이면 안먹기
    menu_name: str
    menu_emoji: str
    temperature: Optional[Literal["HOT", "ICED"]]  # 안먹기면 None
    size: Optional[Literal["Tall", "Grande", "Venti"]]
    extra_shot: bool
    extra_syrup: bool
    note: str             # 자유 메모
```

---

## 🔌 REST API 명세

### `POST /api/rooms`

방 생성

- **Request**: `{ "room_name": str, "host_name": str }`
- **Response**: `{ "room_id": str, "user_id": str, "user_name": str, "room_name": str }`

### `GET /api/rooms/{room_id}`

방 정보 조회

- **Response**: `{ "room_id": str, "room_name": str, "is_closed": bool, "participants": [...] }`
- **Error**: `404` (방 없음)

### `POST /api/rooms/{room_id}/join`

방 참가 (이름 등록)

- **Request**: `{ "user_name": str }`
- **Response**: `{ "user_id": str, "user_name": str, "is_host": bool, ... }`

### `GET /api/menu`

커피 메뉴 목록 조회

- **Response**: `[{ "id": str, "name": str, "emoji": str, "category": str }, ...]`

---

## 📡 WebSocket 이벤트 명세 (Socket.IO)

### Client → Server

| 이벤트          | 페이로드                               | 설명                                 |
| --------------- | -------------------------------------- | ------------------------------------ |
| `room:join`     | `{ room_id, user_id }`                 | 방 입장 (소켓 룸 join)               |
| `status:update` | `{ status: "thinking" \| "ordering" }` | 상태 변경 알림                       |
| `order:submit`  | `{ order: Order }`                     | 주문 제출 (안먹기 포함)              |
| `order:skip`    | `{}`                                   | 안먹기 선택                          |
| `order:edit`    | `{}`                                   | 주문 수정 시작 (status=ordering으로) |
| `room:close`    | `{}`                                   | 호스트만, 주문 마감                  |

### Server → Client

| 이벤트                | 페이로드      | 설명                   |
| --------------------- | ------------- | ---------------------- |
| `room:state`          | `Room` 전체   | 입장 시 초기 상태 전송 |
| `participant:joined`  | `Participant` | 새 참가자 입장         |
| `participant:left`    | `{ user_id }` | 참가자 오프라인        |
| `participant:updated` | `Participant` | 상태/주문 변경         |
| `room:closed`         | `{}`          | 방 마감 알림           |
| `error`               | `{ message }` | 에러 알림              |

---

## 🎨 디자인 가이드 (아기자기한 카페 느낌)

### 컬러 팔레트

- **Primary (에스프레소)**: `#6F4E37`
- **Secondary (라떼)**: `#C9A57B`
- **Background (크림)**: `#FFF8F0`
- **Surface (베이지)**: `#F5E6D3`
- **Accent (캐러멜)**: `#D4A574`
- **Success (말차)**: `#A8C09A`
- **Text Primary**: `#3E2723`
- **Text Muted**: `#8D6E63`

### 타이포그래피

- 본문/UI: **Pretendard** 또는 **Noto Sans KR**
- 강조/타이틀: **Gowun Dodum** (귀여운 느낌)
- 영문 보조: **Quicksand** (둥근 산세리프)

### 컴포넌트 스타일

- 둥근 모서리 (`rounded-2xl` ~ `rounded-3xl`)
- 부드러운 그림자 (`shadow-md`, 호버 시 `shadow-lg`)
- 테두리 색상은 베이지/연한 갈색 계열
- 버튼은 살짝 통통한 느낌, 호버 시 살짝 들리는 애니메이션

### 마이크로 인터랙션

- 메뉴 카드 호버: scale 1.03 + 그림자 강조
- 주문 제출 시: 컨페티 또는 작은 ☕ 이모지 애니메이션
- "고민중.." 옆에 점점점 애니메이션 (`...`)
- 카드 등장 시 fade-up 애니메이션

### 이모지 활용

- 헤더: ☕ 커피 뭐드실래요?
- 빈 상태: 🥱 아직 아무도 없어요
- 마감 시: ✨ 주문이 마감됐어요!
- 호스트 표시: 👑
- 안먹기: 🙅

---

## 🪜 작업 단계 (Implementation Phases)

### Phase 1. 프로젝트 초기 세팅

- [ ] `frontend/`에 Next.js 14 프로젝트 생성 (`create-next-app`, TypeScript, Tailwind)
- [ ] `backend/`에 FastAPI 프로젝트 구조 생성
- [ ] Tailwind에 카페 컬러 팔레트 등록
- [ ] 한국어 폰트 (Pretendard) 적용
- [ ] CORS 설정

### Phase 2. 백엔드 핵심 기능

- [ ] `coffee_menu.py` 데이터 정의
- [ ] Pydantic 모델 정의
- [ ] `room_manager.py` 인메모리 저장소 (방 생성/조회/참가, lock 처리)
- [ ] REST API 엔드포인트 구현
- [ ] Socket.IO 통합 (`python-socketio` + ASGI 마운트)

### Phase 3. 프론트 — 방 생성/참가 흐름

- [ ] 홈 페이지 (방 생성 폼)
- [ ] `room/[roomId]` 페이지 라우팅
- [ ] 쿠키 기반 세션 헬퍼 (`session.ts`)
- [ ] 이름 입력 모달
- [ ] REST API 연동

### Phase 4. 프론트 — 메뉴 선택 + 주문

- [ ] 메뉴 카드 그리드 (기타/직접 입력 카드 포함)
- [ ] 옵션 선택 폼 (HOT/ICED, 사이즈, 메모)
- [ ] 안먹기 버튼 (메뉴 선택 화면 하단)
- [ ] 주문 제출 → 내 주문 카드 표시
- [ ] 주문 수정 버튼

### Phase 5. 실시간 동기화

- [ ] Socket.IO 클라이언트 연결 (`lib/socket.ts`)
- [ ] 통합 주문현황 뷰 (완료/미완료 섹션)
- [ ] 상태별 표시(고민중../결정완료/안먹기) + 애니메이션
- [ ] 주문 변경 실시간 반영

### Phase 6. 호스트 기능 + 집계

- [ ] 호스트 컨트롤 컴포넌트 (마감 버튼)
- [ ] 주문 집계 (안먹기 제외한 실제 주문만)
- [ ] 텍스트 복사 기능
- [ ] 마감 후 UI 변경

### Phase 7. 공유 기능

- [ ] 방 이름 옆 링크 복사 버튼 (인라인, 작게)
- [ ] 복사 완료 피드백 (버튼 텍스트 변경)

### Phase 8. 디자인 마무리 + 반응형 점검

- [ ] 모든 페이지/컴포넌트 모바일 점검
- [ ] 빈 상태/에러 상태 디자인
- [ ] 마이크로 인터랙션, 트랜지션 적용
- [ ] 다크모드 (선택)

### Phase 9. 마무리

- [ ] README 작성 (실행/배포 가이드)
- [ ] 환경변수 정리 (`.env.example`)
- [ ] 배포 (선택: Vercel + Railway)

---

## ✅ 검수 체크리스트

### 기능

- [ ] 방 생성 → 다른 브라우저로 링크 접속 → 이름 입력 → 메뉴 선택 → 호스트 화면에서 실시간 반영 확인
- [ ] 새로고침 시 동일한 신원으로 복원되는지
- [ ] 호스트가 마감하면 다른 사용자의 입력이 차단되는지
- [ ] 집계 결과에서 안먹기 인원이 제외되는지
- [ ] 텍스트 복사 결과가 카페에서 바로 주문 가능한 형태인지
- [ ] 기타(직접 입력) 메뉴로 주문이 정상적으로 등록되는지
- [ ] 안먹기 선택 후 수정이 가능한지

### UX

- [ ] 모바일에서 한 손으로 조작 가능한지 (버튼 크기, 위치)
- [ ] 네트워크 끊김/재연결 시 자연스럽게 복구되는지
- [ ] 로딩/빈 상태가 충분히 안내되는지

### 디자인

- [ ] 카페 느낌의 따뜻한 색감/폰트 적용
- [ ] 둥글고 친근한 컴포넌트 스타일
- [ ] 마이크로 인터랙션이 과하지 않으면서 즐거움을 주는지

---

## 🔮 향후 확장 아이디어

- 자주 가는 카페별 메뉴 프리셋
- 자주 시키는 메뉴 즐겨찾기
- 가격 입력 → 1/N 자동 계산
- 카드 / 송금 링크 연동 (토스/카카오페이)
- 방 히스토리 (로그인 도입 시)
- 다국어 지원
- 다크모드

---

## 📚 참고 라이브러리

- 백엔드: `fastapi`, `python-socketio`, `uvicorn[standard]`, `pydantic`, `nanoid`
- 프론트: `next`, `react`, `socket.io-client`, `lucide-react`, `clsx`, `tailwind-merge`
- 폰트: `pretendard` (CDN 또는 npm)
