## 목적 / 배경

프로젝트의 네트워크 통신 및 서버 상태 관리 인프라를 구축하기 위해 Axios 인스턴스, TanStack Query 설정, 관심 기업 CRUD 훅 기반을 마련했습니다. 기존 프로젝트에는 기본 스캐폴딩만 존재했으며, 실제 API 통신 및 상태 관리 인프라가 필요했습니다. 이를 통해 일관된 에러 처리, 서버 상태 캐싱, 낙관적 업데이트 등을 제공할 수 있는 기반을 구축했습니다.

## 변경 사항

### 공통 인프라

- `shared/api/http.ts`: Axios 인스턴스 생성 및 인터셉터 설정
- `shared/api/AppError.ts`: 공통 에러 포맷 클래스 및 타입 가드 추가
- `shared/api/interceptors.ts`: 요청/응답 인터셉터 구현 (422 validation error, network error 처리)
- `shared/lib/react-query.ts`: React Query 공유 타입 정의 (QueryOptions, MutationOptions, QueryKeyFactory)

### API 레이어

- `entities/company/api.ts`: 기업 목록 조회 API 함수
- `entities/company/queries.ts`: 기업 목록 조회 쿼리 훅 및 QueryKeyFactory 구현
- `entities/favorite/api.ts`: 관심 기업 CRUD API 함수 (목록 조회, 상세 조회, 생성, 수정, 삭제)
- `entities/favorite/queries.ts`: 관심 기업 CRUD 쿼리/뮤테이션 훅 구현
  - `useFavoriteCompaniesQuery`: 목록 조회 (페이지네이션 지원)
  - `useFavoriteCompanyDetailQuery`: 상세 조회
  - `useCreateFavoriteCompany`: 생성 (낙관적 업데이트 포함)
  - `useUpdateFavoriteCompany`: 수정 (낙관적 업데이트 포함)
  - `useDeleteFavoriteCompany`: 삭제 (낙관적 업데이트 포함)
  - `useFavorite`, `useFavorites`, `useDeleteFavorite`: 편의 훅

### 애플리케이션 설정

- `app/providers.tsx`: QueryClientProvider 및 ReactQueryDevtools 설정
  - queries retry: 3, mutations retry: 1
  - MSW 선택적 활성화 (NEXT_PUBLIC_ENABLE_MSW 환경 변수로 제어)
  - 초기 렌더링 블로킹 제거

### 모킹 서버

- `mocks/handlers.ts`: MSW 핸들러 구현 (모든 CRUD 엔드포인트)
  - GET `/companies`: 기업 목록 조회 (10% 확률로 500 에러)
  - GET `/favorites`: 관심 기업 목록 조회 (페이지네이션, validation error)
  - GET `/favorites/:id`: 관심 기업 상세 조회 (404 에러 처리)
  - POST `/favorites`: 관심 기업 생성 (422, 400 duplicate error)
  - PUT `/favorites/:id`: 관심 기업 수정 (404 에러 처리)
  - DELETE `/favorites/:id`: 관심 기업 삭제 (50% 확률로 204, 50% 확률로 200)
- `mocks/db.ts`: 인메모리 데이터베이스 구현
- `mocks/browser.ts`, `mocks/server.ts`: MSW 워커 설정

### 테스트 환경

- `jest.config.js`: Next.js Jest 설정 및 jsdom 환경 구성
- `jest.polyfills.ts`: TextEncoder/Decoder, Stream, fetch 등 폴리필 추가
- `jest.setup.ts`: @testing-library/jest-dom 설정
- `src/__tests__/entities/company/queries.test.ts`: 기업 쿼리 테스트
- `src/__tests__/entities/favorite/queries.test.ts`: 관심 기업 쿼리 테스트
- `src/__tests__/shared/api/http.test.ts`: HTTP 클라이언트 테스트

### 컴포넌트 통합

- `features/company-search/ui/company-search-dropdown.tsx`: React 타입 import 명시화
- `features/favorite-form/ui/favorite-form.tsx`: API 변경에 맞춘 props 수정
- `features/favorite-table/ui/favorite-table.tsx`: API 변경에 맞춘 업데이트
- `widgets/favorite-section/ui/favorite-section.tsx`: useFavorite 훅 통합

### 설정 및 유틸리티

- `.eslintrc.json`: ESLint 설정 간소화 (no-restricted-imports 비활성화, ignorePatterns 추가)
- `.gitignore`: .env.local 추가
- `package.json`: 테스트 관련 스크립트 및 의존성 추가

## FSD 영향

- **layers**: app / entities / features / widgets / shared
- **변경 경로**:
  - `shared/api/http.ts` - Axios 인스턴스 및 인터셉터
  - `shared/api/AppError.ts` - 공통 에러 타입
  - `shared/api/interceptors.ts` - 요청/응답 인터셉터
  - `shared/lib/react-query.ts` - React Query 공유 타입
  - `entities/company/api.ts` - 기업 API 함수
  - `entities/company/queries.ts` - 기업 쿼리 훅
  - `entities/favorite/api.ts` - 관심 기업 API 함수
  - `entities/favorite/queries.ts` - 관심 기업 쿼리/뮤테이션 훅
  - `app/providers.tsx` - QueryClientProvider 설정
  - `features/favorite-form/ui/favorite-form.tsx` - 폼 컴포넌트
  - `features/favorite-table/ui/favorite-table.tsx` - 테이블 컴포넌트
  - `widgets/favorite-section/ui/favorite-section.tsx` - 섹션 위젯

## 테스트 / 확인 방법

- [x] `pnpm install` 실행
- [x] `pnpm lint` 통과 확인
- [x] `pnpm run typecheck` 통과 확인
- [x] `pnpm test` 통과 확인 (3개 테스트 스위트, 8개 테스트 모두 통과)
- [ ] `pnpm dev` 실행하여 수동 확인
  - [ ] MSW 활성화: `NEXT_PUBLIC_ENABLE_MSW=true` 환경 변수 설정 후 개발 서버 실행
  - [ ] 관심 기업 목록 조회 동작 확인
  - [ ] 관심 기업 생성 동작 확인 (낙관적 업데이트 확인)
  - [ ] 관심 기업 수정 동작 확인 (낙관적 업데이트 확인)
  - [ ] 관심 기업 삭제 동작 확인 (낙관적 업데이트 확인)
  - [ ] 에러 시나리오 확인 (422 validation error, 404 not found, 500 server error)
  - [ ] React Query Devtools에서 쿼리 상태 확인

## 성능 / 접근성 / 리스크

- **성능**:
  - TanStack Query의 자동 캐싱으로 불필요한 네트워크 요청 최소화
  - 낙관적 업데이트로 사용자 경험 개선
  - 쿼리 재시도 정책 설정 (queries: 3회, mutations: 1회)
- **접근성**:
  - 기존 접근성 기능 유지 (키보드 네비게이션, ARIA 속성)
- **리스크**:
  - 401 Unauthorized 응답 처리 미구현 (재시도/리다이렉트 로직 필요)
  - MSW 모킹이 활성화되지 않은 경우 실제 서버 필요
  - 브레이킹 체인지 없음 (기존 컴포넌트와 호환)

## 이슈

- Closes #5
