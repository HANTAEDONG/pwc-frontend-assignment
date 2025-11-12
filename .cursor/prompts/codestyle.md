# Code Style Prompts for Cursor

## 생성 원칙

- 시멘틱 마크업을 **항상** 우선: form/label/button, table/thead/tbody, ul/li, dl/dt/dd, header/nav/main/aside/footer.
- ARIA는 시멘틱으로 해결 안 되는 경우에만 보조적으로 사용.
- FSD 흐름: shared(api/http) → entities(api/queries/types) → features(hooks/ui) → widgets(composition) → app(routing)
- 서버 상태는 entities에서만 정의, component에서는 훅 소비만.

## 뮤테이션 패턴

- onMutate: snapshot + optimistic
- onError: rollback
- onSettled: invalidate

## Searchable Dropdown

- 입력 300ms 디바운스, 키보드(ArrowUp/Down, Enter, Esc) 지원
- combobox 패턴(role="combobox", listbox/option, aria-activedescendant) **혹은** 시멘틱 친화적 자체 구현 중 하나 선택, 과도한 ARIA 금지
- 포커스 트랩 금지, 이동 자유

## Tailwind

- 재사용 가능한 스타일은 `shared/ui` 컴포넌트로 추출(Button/Input/Table/Modal)
- :focus-visible 링 유지, hover-only 인터랙션 금지(키보드/스크린리더 고려)

## 파일 네이밍

- 폴더는 케밥, 파일은 기능+역할; 타입은 T*, 스키마는 *Schema, 쿼리키는 \*QueryKeys
