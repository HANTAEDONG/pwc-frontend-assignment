## PwC AC 프론트엔드 채용 과제

<b>관심 기업 관리 서비스 및 DART 재무제표 뷰어</b>

FY26 하반기 **PwC Acceleration Center** 프론트엔드 개발자 채용 과제를 구현한 프로젝트입니다.
과제에서 요구한 기능 구현뿐 아니라 **스스로 발견한 문제들을 해결하고 더 나은 사용자 경험과 유지보수성**을 만드는 데 초점을 두고 설계했습니다.

## 프로젝트 실행

### 1. 패키지 설치

```bash
pnpm install
```

### 2. 환경 변수 설정(선택)

루트 경로에 `.env` 파일 생성 후 필요한 값을 설정합니다.

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_DART_API_KEY` (DART 기업코드 갱신 시 사용)

### 3. 개발 서버 실행

```bash
pnpm dev
```

## 기술 스택

### Core

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Testing / Mocking

![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing%20Library-E33332?style=for-the-badge&logo=testinglibrary&logoColor=white)
![MSW](https://img.shields.io/badge/MSW-FF6A33?style=for-the-badge&logo=msw&logoColor=white)

### Style / Icons

![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-000000?style=for-the-badge&logo=lucide&logoColor=white)

- 기타: class-variance-authority, tailwind-merge

## 프로젝트 아키텍처(Feature-Sliced Design 기반)

다음과 같은 이유로 FSD 레이어 구조를 사용했습니다.

- 기능 모듈을 독립적 단위로 관리해 유지보수가 용이하도록 함
- API, 상태, UI 책임을 분리해 협업 시 충돌을 최소화
- 관심사 분리를 통해 테스트 작성 및 기능 확장이 쉬운 코드 구조 유지

```
src/
├── app/             # 라우팅 및 페이지 엔트리, 글로벌 Provider
│
├── entities/        # 도메인 모델: 타입, API, 서버 상태(Query), store
│                    # (예: company, favorite, auth 등의 핵심 비즈니스 단위)
│
├── features/        # 사용자 기능 단위: 폼, 액션, 상호작용 로직 + UI
│                    # (예: 회사 검색, 회사 생성/수정 모달, 즐겨찾기 토글)
│
├── widgets/         # 페이지를 구성하는 중간 규모 UI 블록
│                    # (예: FavoriteCompanyList, CompanySearchSection)
│
└── shared/          # 공통 유틸리티, 스타일, API 클라이언트, 훅, UI 컴포넌트
                     # (예: http client, Button, Modal, config)
```

## 구현 기능

### [필수] 관심 기업 관리 서비스

- 기업명 Searchable Dropdown을 통한 회사 선택
- 관심 기업 등록 / 목록 조회 / 수정 / 삭제 (CRUD)
- TanStack Query 기반 캐싱 및 일부 낙관적 업데이트 적용
- 비동기 예외 처리 및 사용자 피드백(UI 메시지, 에러 표시) 제공

### [선택] DART 재무제표 뷰어

- 기업명 검색 → 로컬 `public/corp-codes.json`에서 `corp_code` 매핑 후 재무정보 조회
- `react-hook-form` 기반 폼 검증으로 필수 값 미입력 시 제출 차단
- 연도·보고서 유형 필터 및 가로 스크롤 가능한 재무제표 테이블 UI
- DART `corpCode.xml` → `corp-codes.json`으로 변환하는 스크립트(`corp:generate`, `corp:update`) 제공

## 트러블 슈팅

| 구분   | 문제 상황                                                   | 해결 방안                                                              | 효과                                    |
| ------ | ----------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------- |
| **UX** | 회사명 검색이 느리고 불안정함 (DART API 기업명 검색 미지원) | 로컬 `corp-codes.json` 기반 즉시 필터링, 재무제표 화면은 디바운스 제거 | 실시간 검색 UX 확보, 외부 API 의존 제거 |
| **-**  | 드롭다운 입력 시 지연 및 불필요 트래픽 발생                 | Searchable Dropdown 훅에 `debounceMs` 옵션 도입                        | 부드러운 입력 경험, 트래픽 감소         |
| **-**  | API 오류 시 사용자 흐름 단절(alert 의존)                    | ErrorBoundary + 재시도 버튼 + Query retry 전략 도입                    | 안정적인 오류 복구, 사용자 경험 향상    |
| **-**  | DART 대용량 XML ZIP을 매번 클라이언트가 받아야 하는 부담    | ZIP→JSON 변환 스크립트(`corp:update`)로 경량 JSON 사용                 | 초기 로딩 감소, 유지보수 편의성 향상    |
| **DX** | Query Key 충돌로 사용자별 데이터가 섞일 위험                | Query Key Factory + email 기반 key 분리                                | 데이터 일관성 확보                      |
| **-**  | 레이어 간 역할 불명확 (entities, features 혼재)             | FSD 원칙 재정립, Public API 경계 명확화                                | 구조 안정성 증가, 기능 확장 용이        |
| **-**  | 환경 변수 여러 곳에서 직접 참조                             | `shared/config/env.ts`로 중앙 관리                                     | 설정 안정성 향상                        |
| **-**  | 로직·UI 혼합으로 테스트 어려움                              | 비즈니스 로직 훅 분리 + MSW 기반 모킹                                  | 테스트 생산성 증가                      |

### 상세 분석 기록

1. 기업명 검색 성능/UX

- 관찰: 1글자 입력부터 필터링/렌더가 발생해 입력 지연과 네트워크 호출(원격 API 사용 시)이 과다했습니다.
- 가설: 최소 입력 길이·디바운스·결과 상한만으로도 체감 성능이 크게 개선될 것.
- 실험:
  - 디바운스 0/150/250/400ms 비교(격자 입력 20자 기준 TTI 측정, DevTools Performance) → 250ms에서 입력 체감 지연 최소/불필요 호출 확실히 감소.
  - 결과 개수 상한 20/50/100 비교 → 50개가 “탐색성 확보 vs 렌더 비용” 균형 최적.
- 결정: 최소 2자 + 250ms 디바운스 + 상한 50개. 재무제표(모달)는 네트워크 트래픽/연산을 줄이고, 관심기업 생성(드롭다운)은 즉시 반응성을 유지하도록 분기.
- 회귀 방지: 훅 옵션화(`debounceMs`, `useRemoteApi`) 및 E2E 시나리오(2글자 미만에서 결과 노출 금지) 추가 가이드.

2. 재무제표 기업명 검색 모달의 확정/취소 플로우

- 문제: 리스트 항목 클릭만으로 반영되어 의도치 않은 변경이 발생, 닫기 시 상태가 애매하게 남음.
- 대안 비교:
  - 즉시 반영(기존) vs “선택하기” 버튼으로 확정 vs 더블클릭 확정.
  - 접근성/명확성/오류 방지 관점에서 버튼 확정이 최선.
- 적용: 항목 클릭은 내부 대기(`pendingCompany`)로만 저장, “선택하기” 버튼으로 확정. X/외부 클릭/취소는 입력 초기화(`clear()`).
- 이득: 사용자가 명확한 의사결정 지점에서만 상태 변경. 뒤로가기 같은 혼란 제거.

3. 에러 상태 처리(폼 검증 + 서버 오류 매핑)

- 목표: 사용자가 “무엇을 고치면 다시 성공할지”를 빠르게 이해하도록 에러를 구조화.
- 입력 검증(클라이언트): `react-hook-form`으로 필수값·포맷을 선제 차단.
  - 필수 입력 누락 시 필드 하단 인라인 메시지 노출, 제출 자체를 차단(noValidate + RHF rules).
  - 재무제표 필터처럼 폼 복합 요소는 Controller로 일관된 에러 표출.
- 서버 오류 매핑: 네트워크/권한/검증/데이터없음/기타를 사용자 친화 문구로 변환.
  - 전역 매핑 헬퍼에서 메시지를 결정하고, 뷰 컴포넌트는 “표시”만 담당(whitespace-pre-line으로 줄바꿈).
  - 에러 상태 UI는 lucide `Annoyed`(65×65, 검정) 아이콘으로 시각 일관성 유지, “재시도” 버튼 제공.
- 서버 상태 신선도 관리: 리액트 쿼리를 사용하되 “필요한 곳에서만” staleTime을 둠.
  - 예: 즐겨찾기 목록 프리패치/탐색성 향상을 위해 staleTime 부여(목록 재탐색 시 깜빡임 최소화).
  - 사용자 입력에 민감하거나 최신성 중요한 쿼리는 기본 신선도(빠른 리패치) 유지.

## 선택 과제 수행 여부

선택 과제(DART 재무제표 뷰어) 수행 완료.
재무제표 조회 로직의 데이터 흐름 및 최적화 아이디어를 문서로 정리했습니다.

## AI 활용 내용

- 구조 설계 과정에서 FSD 레이어링 전략 검토
- 오류 메시지 패턴 정의 시 AI로 초안 비교
- 복잡한 API 응답 분석 시 요약 도움

아이디어 검토와 세부적인 구현은 수동으로 진행하고 코드 초안 작성과 리뷰, 커밋 및 PR 작성 시 AI를 활용했습니다.
