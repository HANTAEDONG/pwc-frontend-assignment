## 목적 / 배경

- 무엇을 왜 바꾸는지 한 문단 요약
- 예: 기존 API 호출 로직을 TanStack Query로 마이그레이션하여 서버 상태 관리 개선

## 변경 사항

- 핵심 변경 요약 (bullet)
  - 예: `useQuery` 훅 추가
  - 예: API 함수 타입 정의 추가
- 스크린샷/영상 첨부 (UI 변경이 있는 경우)

## FSD 영향

- layers: app / entities / features / widgets / shared
- 변경 경로 예:
  - `entities/favorite/queries.ts`
  - `features/favorite-form/ui/favorite-form.tsx`
  - `widgets/favorite-section/ui/favorite-section.tsx`

## 테스트 / 확인 방법

- [ ] `pnpm install` 실행
- [ ] `pnpm lint` 통과 확인
- [ ] `pnpm run typecheck` 통과 확인
- [ ] `pnpm test` 통과 확인
- [ ] `pnpm dev` 실행하여 수동 확인
  - 예: 관심 기업 목록 조회 동작 확인
  - 예: 관심 기업 생성/수정/삭제 동작 확인

## 성능 / 접근성 / 리스크

- 성능: 렌더링 최적화, 네트워크 요청 최소화 등
- 접근성: 키보드 네비게이션, ARIA 속성 등
- 리스크: 회귀 가능성, 브레이킹 체인지 등

## 이슈

- Closes #123
