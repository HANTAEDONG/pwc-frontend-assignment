## **PwC AC 프론트엔드 채용 과제**

**관심 기업 관리 서비스 및 DART 재무제표 뷰어**

FY26 하반기 **PwC Acceleration Center** 프론트엔드 개발자 채용 과제를 구현한 프로젝트입니다. 과제에서 요구한 기능 구현뿐 아니라 **스스로 발견한 문제들을 해결하고 더 나은 사용자 경험과 유지보수성**을 만드는 데 초점을 두고 설계했습니다.

## **프로젝트 실행**

```bash
pnpm install
pnpm corp:generate  // 재무제표 조회 시 기업데이터 저장
pnpm dev

```

## **기술 스택**

### **Core**

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](#)

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)

[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](#)

[![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)](#)

[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](#)

### **Testing / Mocking**

[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](#)

[![Testing Library](https://img.shields.io/badge/Testing%20Library-E33332?style=for-the-badge&logo=testinglibrary&logoColor=white)](#)

[![MSW](https://img.shields.io/badge/MSW-FF6A33?style=for-the-badge&logo=msw&logoColor=white)](#)

### **Style / Icons**

[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](#)

[![Lucide](https://img.shields.io/badge/Lucide-000000?style=for-the-badge&logo=lucide&logoColor=white)](#)

- 기타: class-variance-authority, tailwind-merge

## **프로젝트 아키텍처(Feature-Sliced Design 기반)**

```
src/
├── app/             # 라우팅 및 페이지 엔트리, 글로벌 Provider
│
├── entities/        # 도메인 모델: 타입, API, 서버 상태(Query), store
│                    # (company, favorite, auth 등의 핵심 비즈니스 단위)
│
├── features/        # 사용자 기능 단위: 폼, 액션, 상호작용 로직 + UI
│                    # (회사 검색, 회사 생성/수정 모달, 즐겨찾기 토글)
│
├── widgets/         # 페이지를 구성하는 중간 규모 UI 블록
│                    # (FavoriteCompanyList, CompanySearchSection)
│
└── shared/          # 공통 유틸리티, 스타일, API 클라이언트, 훅, UI 컴포넌트
                     # (http client, Button, Modal, config)

```

## **구현 기능**

### **[필수] 관심 기업 관리 서비스**

- 기업명 Searchable Dropdown을 통한 회사 선택
- 관심 기업 등록 / 목록 조회 / 수정 / 삭제 (CRUD)
- 필요한 부분에 대한 TanStack Query 기반 캐싱 및 일부 낙관적 업데이트 적용
- 비동기 예외 처리 및 사용자 피드백(UI 메시지, 에러 표시) 제공

### **[선택] DART 재무제표 뷰어**

- 기업명 검색 → 로컬 `public/corp-codes.json`에서 `corp_code` 매핑 후 재무정보 조회
- `react-hook-form` 기반 폼 검증으로 필수 값 미입력 시 제출 차단
- 연도·보고서 유형 필터 및 가로 스크롤 가능한 재무제표 테이블 UI
- DART `corpCode.xml` → `corp-codes.json`으로 변환하는 스크립트(`corp:generate`, `corp:update`) 제공

## **트러블 슈팅**

### 1. 기업명 검색 성능 / UX 개선

**문제**

기업명 입력 시 1글자만 입력해도 바로 필터링이 일어나면서 렌더링 비용이 늘고, 화면 반응이 눈에 띄게 느려졌습니다.

**해결 방안**

입력 디바운스를 여러 값으로 실험해본 결과, 250ms가 가장 자연스러운 지연 없이 안정적이었습니다.

또한 결과 개수도 50개로 상한을 두고 입력 최소 길이를 2자로 제한했습니다.

**성과**

필터링 비용이 줄면서 입력 반응 속도가 안정적으로 개선되었고, 불필요한 렌더링과 연산이 크게 감소했습니다.

### 2. 재무제표 기업명 검색 모달 선택/취소 플로우 개선

**문제**

리스트 항목을 클릭하는 순간 바로 값이 선택되어 사용자가 의도하지 않은 기업이 적용되는 일이 있었고,모달을 닫을 때 상태가 중간에 남아 혼란을 주었습니다.

**해결 방안**

클릭 시에는 내부적으로 `pending` 상태만 저장하고 최종 선택은 “선택하기” 버튼으로 확정하도록 UX를 변경했습니다.

닫기/X/외부 클릭 시에는 값을 모두 초기화하여 모달을 닫는 행위가 명확한 취소가 되도록 했습니다.

**성과**

사용자의 의도와 다르게 값이 바뀌는 상황이 사라지고 모달의 상태 흐름이 훨씬 명확하고 직관적이 되었습니다.

### 3. 에러 처리 구조 개선 (폼 검증 + 서버 오류 매핑)

**문제**

에러가 발생했을 때 사용자가 무엇을 고쳐야 하는지 파악하기 어려웠고 서버·네트워크·입력 오류가 뒤섞여 있어 UI와 로직 모두 불명확했습니다.

**해결 방안**

입력 단계에서 잘못된 값을 보내지 않도록 **react-hook-form**으로 필수값을 먼저 검사해 오류를 사전에 막았습니다. 서버에서 발생하는 오류는 종류별로 나누어 공통 헬퍼에서 이해하기 쉬운 문구로 바꿔주어, 화면에서는 단순히 그 메시지만 보여주도록 구조를 정리했습니다.

**성과**

사용자는 에러 원인을 쉽게 이해하고 바로 수정할 수 있게 되었고 오류 상황에서도 흐름이 끊기지 않는 안정적인 UX를 제공할 수 있었습니다.

## **선택 과제 수행 여부**

선택 과제(DART 재무제표 뷰어) 수행 완료.

## **AI 활용 내용**

아키텍처 설계와 초기 코드 스캐폴딩은 Cursor의 Plan 모드를 활용해 구조적인 초안을 빠르게 잡았습니다. 세부 구현과 리팩토링은 직접 코드 수준에서 검토·수정하며 진행했습니다. 커밋 메시지와 PR 본문 작성에는 AI를 보조적으로 활용해 변경 사항을 정리하고 표현을 다듬었으며 최종 내용과 책임 소재는 직접 확인 후 확정했습니다.
