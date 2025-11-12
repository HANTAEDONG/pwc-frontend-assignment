# Review Guide — PR 체크리스트

## 1) 레이어링 & 의존성

- [ ] shared → entities → features → widgets → app 순서만 의존하는가?
- [ ] import path alias(`@/shared` 등) 일관성, 상향 의존/순환참조 없는가?

## 2) 시멘틱 & 접근성

- [ ] header/nav/main/aside/footer 랜드마크 구성했는가?
- [ ] section/article + 올바른 헤딩 레벨 구조인가?
- [ ] form/label/fieldset/legend, aria-describedby로 에러 연결했는가?
- [ ] 버튼/링크 역할 구분, 키보드 내비게이션/포커스 링 보장되는가?

## 3) 타입/계약

- [ ] API 입출력 zod 스키마(최소한 타입 선언)로 계약 고정?
- [ ] `any`/`unknown` 남용 없음, `satisfies`/`as const` 적용?

## 4) React Query

- [ ] 쿼리키/캐시 범위 일관, 로딩/빈/에러 분기 명확?
- [ ] optimistic → 롤백 → invalidate 패턴 지켰는가?
- [ ] `keepPreviousData`, `staleTime` 적절?

## 5) Zustand

- [ ] 서버 데이터 저장 금지, UI 상태만 저장?
- [ ] 셀렉터/shallow로 구독 최소화?

## 6) UI/성능

- [ ] 리스트/테이블(기업 목록) 시멘틱 마크업 사용?
- [ ] 불필요 렌더/익명 핸들러 최소화, 메모이제이션 과용 금지?

## 7) 보안/설정

- [ ] .env 사용 및 하드코딩 없음?
- [ ] 콘솔 민감로그 없음?

## 8) 문서화/테스트(선택)

- [ ] 복잡 UI(드롭다운) 상호작용 시나리오 정리/테스트?
- [ ] README에 실행/환경 변수 안내?
