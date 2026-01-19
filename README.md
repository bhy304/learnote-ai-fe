# 🎓 LearnoTe AI - 프런트엔드 (Frontend)

> **"AI와 함께 진화하는 스마트 학습 메모장"**
>
> 단순히 받아 적는 노트를 넘어, AI가 당신의 지식을 검증하고 학습 방향을 제시합니다.

LearnoTe AI는 사용자가 기록한 학습 내용을 AI 기술로 분석하여, **사실 관계 검증(Fact-Check)**, **배경 지식 심화 가이드(Expert Guide)**, 그리고 **맞춤형 학습 할 일(Suggested Todos)**을 자동으로 생성해 주는 지능형 학습 지원 플랫폼입니다.

---

## 🏗 프로젝트 개요 (Project Overview)

본 프로젝트는 지능형 학습 환경을 제공하기 위해 설계되었으며, 현대적인 웹 기술 스택과 AI 분석 엔진을 결합하여 최상의 UX/UI를 제공합니다.

### 🔗 관련 리소스

- **Backend Repo:** [learnoteAI-BE (NestJS)](https://github.com/JHParrrk/learnoteAI-BE)
- **Design System:** `shadcn/ui` 기반의 커스텀 문서 스타일 디자인

---

## ✨ 핵심 기능 상세 (Advanced Features)

### 1. 지능형 AI 분석 워크플로우

- **실시간 분석 상태 관리**: 노트를 저장하면 서버에서 AI 분석이 시작됩니다. 클라이언트는 TanStack Query의 **Polling(3초 주기)** 기술을 통해 분석 완료 상태를 감지하고, 완료 즉시 UI를 갱신합니다 (`useNote` hook 활용).
- **Fact-Check (사실 관계 검증)**: 작성한 내용 중 오류를 찾아내어 `CORRECT/INCORRECT` 판정 및 명확한 근거와 수정안을 제시합니다.
- **Expert Guide (전문가 학습 가이드)**: AI가 주제와 관련된 심화 내용 및 배경 지식을 제공하여 학습의 깊이를 더합니다.
- **Refinement (문서화)**: 불완전한 메모를 Markdown 형식이 적용된 정제된 문서로 변환합니다.

### 2. 추천 시스템 기반 Todo 관리

- **AI Suggested Todos**: 분석 결과를 기반으로 다음 학습 단계를 제안합니다.
- **선택적 저장 (`isCreated` 시스템)**: 모든 추천 항목을 강제로 저장하지 않고, 사용자가 선택한 항목만 실제 서버 DB에 영구 저장하여 개인 Todo로 관리할 수 있습니다.
- **중복 생성 방지**: 서버와의 동기화를 통해 이미 생성된 추천 할 일은 중복 생성되지 않도록 UI에서 상태 처리(`CheckCircle` 배지)가 이루어집니다.

### 3. 멀티 뷰 대시보드 및 칸반 보드

- **데이터 시각화**: 학습 연속성을 확인할 수 있는 **Activity Heatmap**과 전체 통계 위젯을 제공합니다.
- **드래그 앤 드롭 칸반**: `@dnd-kit`을 사용하여 Todo의 상태를 `Pending`에서 `Completed`로 직관적으로 전환합니다.
- **낙관적 UI (Optimistic UI)**: 칸반 카드 이동 시 서버 응답을 기다리지 않고 즉시 UI를 반영하여 매끄러운 경험을 제공합니다.

### 4. 고도화된 보안 및 인증

- **Double-Layer JWT Interceptor**: Axios Interceptor를 통해 액세스 토큰 만료 시 Refresh Token으로 자동 갱신 요청을 보냅니다.
- **Request Queuing**: 토큰 갱신 중 발생하는 다중 API 요청을 큐(Queue)에 대기시켰다가 갱신 완료 후 한꺼번에 처리하여 세션 끊김을 방지합니다.

---

## 🛠 기술 스택 (Technical Deep Dive)

### Frontend Core

- **Framework:** `React 19 (Vite 7)`
- **Styling:** `Tailwind CSS v4`, `shacdn/ui`, `Framer Motion` (부드러운 페이지 전환 및 분석 애니메이션)
- **State Management:** `Zustand` (Persist 미들웨어를 통한 인증 정보 로컬 스토리지 유지)
- **Data Fetching:** `TanStack Query v5` (캐싱, 낙관적 업데이트, 폴링 로직)
- **API Automation:** `Orval`을 사용하여 Swagger Spec으로부터 TypeScript 타입과 API 호출 함수 자동 생성

### UI/UX Design

- **Document Binder Style**: `rounded-xl`과 좌측 보더 강조를 사용하여 실제 오프라인 바인더 느낌을 주는 UI를 도입했습니다.
- **Markdown Rendering**: `react-markdown`과 `remark-gfm`을 사용하여 AI가 생성한 정교한 문서를 아름답게 렌더링합니다.

---

## 📂 프로젝트 구조 (Detailed Structure)

```text
src/
├── api/
│   ├── https.ts          # Axios 인스턴스 설정 및 JWT 인터셉터/큐잉 로직
│   ├── auth.api.ts       # 인증 관련 수동 정의 API
│   └── generated/        # Orval로 자동 생성된 도메인별 API (notes, dashboard 등)
├── components/
│   ├── dashboard/        # 통계, 히트맵, 대시보드 리스트 관련 컴포넌트
│   ├── kanban/           # dnd-kit 기반의 칸반 보드 엔진 및 카드
│   ├── common/           # 데이터 테이블, 사이드바, 헤더 등 공통 레이아웃
│   └── ui/               # shadcn/ui 기반 아토믹 디자인 컴포넌트
├── hooks/
│   ├── useNote.ts        # 노트 조회 및 실시간 분석 폴링 전용 훅
│   ├── useNoteActions.ts # 노트 수정/삭제 통합 관리 로직
│   └── useDashboard.ts   # 대시보드 전체 데이터 프리패칭 및 상태 관리
├── models/
│   └── generated/        # 백엔드 DTO와 1:1 매칭되는 TypeScript 인터페이스
├── pages/                # Dashboard, NoteDetail, CreateNote, Auth Pages
├── store/
│   └── authStore.ts      # Zustand 기반 로그인 상태 및 토큰 저장소
└── schema/               # Zod를 이용한 폼 유효성 검사 (Auth, Note)
```

---

## ⚙️ 설정 및 실행 (Installation & Setup)

### 환경 변수 설정 (`.env`)

```bash
VITE_API_BASE_URL=http://your-backend-api.com
```

### 의존성 설치 및 실행

```bash
npm install
npm run dev
```

### API 코드 생성 (Swagger 동기화)

```bash
# 백엔드 Swagger가 열려있는 상태에서 실행
npm run g:api
```

---

## 📄 라이선스 (License)

Copyright © 2026 LearnoTe AI Team. This project is licensed under the MIT License.
