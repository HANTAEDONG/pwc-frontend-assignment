# Cursor Project Rules — 관심 기업 관리 서비스

## Tech & Scope

- Next.js (App Router, **RSC 우선**), TypeScript, TanStack Query, Zustand, Axios, TailwindCSS, Lucide React
- 기능: 관심 기업 **등록/조회/수정/삭제** + 기업명 **Searchable Dropdown**
- API: `NEXT_PUBLIC_API_BASE_URL` 사용 (하드코딩 금지)

## Architecture — FSD Layered

app/
(routes) # 페이지/레이아웃 (RSC 중심)
src/
shared/ # 레이어 최하단: 유틸/토큰/스타일/기반 컴포넌트/HTTP
api/ # Axios 인스턴스/인터셉터/에러 매핑
lib/ # 헬퍼(키보드 핸들러, debounce 등)
ui/ # **원자적/재사용** UI (Button, Input 등) - 시멘틱 태그 우선
entities/ # 도메인 모델 & 타입 & 쿼리키/쿼리Fn(API 호출)
company/
favorite/
features/ # 사용자 Task 단위(등록폼, 수정폼, 검색 드롭다운 등)
widgets/ # 페이지 조합 단위(목록 테이블 섹션, 헤더 등)
processes/ # (선택) 다수 feature orchestration
pages/ # (선택) SSR/RSC 조합 외 UI 스켈레톤

### Layer 규칙

- **상향 의존 금지**: shared → entities → features → widgets → app 로만 의존.
- import-alias: `@/shared`, `@/entities/*`, `@/features/*`, `@/widgets/*`.
- 서버 상태는 **entities**의 `api.ts`/`queries.ts`에서만 정의. feature/widget은 훅만 소비.

## Server/Client 경계

- 기본 RSC. 상호작용(입력, 포커스, 드롭다운, 쿼리 훅) 필요한 컴포넌트에만 `"use client"`.
- React Query 훅/상태(Zustand)는 **클라이언트 컴포넌트 내부**에서 사용.

## Semantic HTML & A11y (강화)

- **랜드마크**: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` 필수 구조.
- **문서 구획**: 의미가 있으면 `<section>` + `<h2>` 이상 레벨링, 독립 기사성 있으면 `<article>`.
- **데이터 표현**: 목록은 `<ul>/<li>`, 정의형은 `<dl>/<dt>/<dd>`, 테이블은 `<table><caption><thead><tbody><tfoot>...`.
- **폼**: `<form>` 태그 사용, `<label for>`로 연결, `<fieldset><legend>`로 그룹, 에러는 `aria-describedby`.
- **버튼/링크**: 동작은 `<button>`, 이동은 `<a>`; `role`/`aria-*`는 **필요할 때만**.
- **키보드**: Tab/Enter/Escape/Arrow 기본 내비게이션 보장.
- **포커스 스타일**: `:focus-visible` 링 유지(지우지 말 것), 스킵 링크 고려(`#main`).

## State

- **서버 상태**: TanStack Query (cache/invalidate로 동기화).
- **UI/제어 상태**: Zustand (모달/선택행/오버레이 등). 서버 데이터 복사 금지.

## Data Layer

- `shared/api/http.ts`: Axios 인스턴스/응답 에러 매핑
- `entities/**/api.ts`: 도메인 API 함수 (입출력 **zod** 스키마 Validate 권장)
- 쿼리키 예: `['favorite','list']`, `['favorite','detail', id]`, `['company','search', keyword]`

## UX 규칙

- 등록/수정/삭제: **optimistic update → 실패 롤백 → invalidate**.
- Searchable Dropdown: 디바운스 300ms, `keepPreviousData: true`, 키보드 내비게이션.
- 상태 분기(로딩/빈/에러/성공) UI 명확, 토스트/인라인 피드백 일관.

## Tailwind & UI

- 유틸 클래스 남용 시 `shared/ui`로 승격 (Button, Input, Combobox, Table 등).
- 클래스 순서: layout → box-model → typography → visual → state.
- 다크모드/명암 대비 고려, Lucide size token(16/20/24) 통일.

## 에러/로그

- API 에러 → `AppError`로 매핑(사용자 메시지 vs 개발자 메시지 분리).
- dev에서만 상세 로그, 사용자 노출은 토스트/인라인 메시지.

## 품질 게이트

- `any` 금지, `satisfies`/`as const` 적극 사용.
- 리스트 key 안정성(id), 익명 함수 프롭 전달 지양.
- 접근성: role/aria는 **보조**, 시멘틱이 우선.

## 보안/설정

- `.env.local`의 `NEXT_PUBLIC_API_BASE_URL`만 사용.
- 민감정보 하드코딩/로그 금지.

## Cursor Behavior

- Do not add explanatory comments or file headers in generated code.
- Keep code clean, minimal, and self-explanatory without inline documentation.
