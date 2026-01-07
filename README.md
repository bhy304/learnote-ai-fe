# Learnote AI - Frontend

AI 기반 학습 보조 플랫폼, Learnote의 프론트엔드 레포지토리입니다.

## 🚀 Tech Stack

- **Framework:** React 19 (Vite 7)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query) v5, Axios
- **Form Management:** React Hook Form, Zod
- **Routing:** React Router DOM v7
- **Formatting:** Prettier, ESLint

## 📂 Project Structure

```text
src/
├── assets/          # 정적 파일 (이미지, 아이콘 등)
├── components/      # 공통 컴포넌트
│   └── ui/          # shadcn/ui 로 생성된 기본 UI 컴포넌트
├── lib/             # 공통 유틸리티 함수 및 라이브러리 설정 (e.g. cn)
├── pages/           # 페이지 수준 컴포넌트 (추가 예정)
├── store/           # Zustand 전역 상태 관리 (추가 예정)
├── hooks/           # 커스텀 훅 (추가 예정)
├── App.tsx          # 메인 앱 엔트리
└── main.tsx         # 렌더링 엔트리
```

## ⚙️ Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 🛠 Features (Planned)

- AI 기술을 활용한 학습 노트 요약 및 분석

## 📄 License

MIT License
