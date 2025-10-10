# LinkToss - Product Requirements Document (PRD)

## 📌 문서 정보
- **버전**: 1.0
- **최종 수정일**: 2025-10-10
- **작성자**: Product Team
- **상태**: Draft

## 1. 제품 개요

### 1.1 제품 비전
LinkToss는 사용자들이 웹상의 유용한 링크를 체계적으로 수집, 정리, 공유할 수 있는 링크 관리 플랫폼입니다. 단순한 북마크를 넘어 각 링크에 대한 노트와 설명을 마크다운 형식으로 작성하여, 지식을 축적하고 공유하는 개인 및 공개 지식 저장소를 만들 수 있습니다.

### 1.2 목표 사용자
- **개인 연구자/학습자**: 학습 자료를 체계적으로 정리하고 싶은 사용자
- **개발자**: 기술 문서, 레퍼런스, 튜토리얼을 관리하고 공유하려는 사용자
- **콘텐츠 큐레이터**: 특정 주제에 대한 링크 모음을 만들어 공유하고 싶은 사용자
- **팀/커뮤니티**: 공동으로 관리하는 리소스 저장소가 필요한 그룹

### 1.3 핵심 가치 제안
- 📁 **체계적 정리**: Repository와 Sub-repository를 통한 계층적 구조화
- 📝 **풍부한 문서화**: 각 링크마다 마크다운 형식의 상세한 노트 작성
- 🎨 **리치 프리뷰**: 유튜브 영상, 이미지 등 링크의 미리보기 제공
- 🔒 **유연한 공개 설정**: Private/Public repository를 통한 공유 관리
- 🤝 **협업 지원**: Repository에 팀원을 초대하여 공동 작업
- 🔗 **간편한 공유**: Public repository를 통한 지식 공유

## 2. 핵심 용어 정의

### Repository (저장소)
- GitHub의 repository 개념과 유사한 링크 저장 공간
- **Private Repository**: 소유자와 초대된 멤버만 접근 가능
- **Public Repository**: 모든 사용자가 조회 가능
- **Sub-repository**: Repository 내부에 폴더 구조처럼 중첩 가능
- 계층 구조로 링크를 체계적으로 분류 가능

### Member Role (멤버 역할)
- **Owner (소유자)**: Repository를 생성한 사용자
  - 모든 권한 보유 (편집, 삭제, 멤버 관리, 설정 변경)
  - Repository 삭제 및 소유권 이전 가능
- **Editor (편집자)**: Repository에 초대받은 멤버
  - Document 생성, 수정, 삭제 가능
  - Sub-repository 생성 가능
  - Repository 설정 변경 및 삭제 불가
  - 다른 멤버 초대 불가

### Document (문서)
- Repository에 저장되는 개별 링크 아이템
- **필수 요소**: 외부 링크 URL (1개)
- **선택 요소**: 마크다운 형식의 노트/설명
- 링크와 노트는 별도의 입력 영역으로 분리

## 3. 기능 요구사항

### 3.1 사용자 인증 및 관리

#### FR-1.1: 소셜 로그인 회원가입
- **우선순위**: P0 (필수)
- **설명**: 사용자가 소셜 계정으로 회원가입 및 로그인할 수 있어야 함
- **요구사항**:
  - 소셜 로그인만 지원 (Google, GitHub)
  - OAuth 2.0 인증 프로토콜
  - 첫 로그인 시 자동 회원가입 처리
  - 사용자 프로필 정보 자동 입력 (이름, 이메일, 프로필 이미지)
- **성공 기준**:
  - 소셜 로그인 완료 후 자동 로그인
  - 첫 가입 시 기본 repository 1개 자동 생성 ("My First Repository")

#### FR-1.2: 로그인/로그아웃
- **우선순위**: P0 (필수)
- **설명**: 사용자가 안전하게 로그인/로그아웃할 수 있어야 함
- **요구사항**:
  - Google OAuth 로그인
  - GitHub OAuth 로그인
  - JWT 기반 세션 관리
  - 자동 로그인 (Refresh Token)

### 3.2 Repository 관리

#### FR-2.1: Repository 생성
- **우선순위**: P0 (필수)
- **설명**: 사용자가 새로운 repository를 생성할 수 있어야 함
- **요구사항**:
  - Repository 이름 (필수, 중복 불가)
  - Repository 설명 (선택)
  - 공개 설정 선택 (Private/Public)
  - 아이콘/이모지 선택 (선택)
  - 태그/카테고리 설정 (선택)
- **검증 규칙**:
  - 이름: 1~100자, 특수문자 제한
  - 설명: 최대 500자
- **성공 기준**:
  - Repository 생성 후 해당 repository 화면으로 이동

#### FR-2.2: Sub-repository 생성
- **우선순위**: P0 (필수)
- **설명**: Repository 내부에 계층적 구조로 Sub-repository를 생성할 수 있어야 함
- **요구사항**:
  - 부모 repository 선택
  - 무제한 깊이의 중첩 지원 (권장: 최대 5단계)
  - Sub-repository도 Private/Public 설정 가능
  - 부모의 공개 설정 상속 옵션
- **제약사항**:
  - Public repository 하위에 Private sub-repository 생성 불가
  - Private repository 하위에는 Private sub-repository만 가능

#### FR-2.3: Repository 목록 조회
- **우선순위**: P0 (필수)
- **설명**: 사용자가 자신의 repository 목록을 조회할 수 있어야 함
- **요구사항**:
  - 본인이 생성한 모든 repository 표시
  - 초대받아 참여 중인 repository 표시 (별도 섹션 또는 뱃지로 구분)
  - 트리 구조로 Sub-repository 표시
  - 각 repository의 문서 개수 표시
  - Repository별 역할 표시 (Owner/Editor)
  - 정렬 옵션 (생성일, 이름, 최근 수정일)
  - 검색 기능

#### FR-2.4: Repository 수정/삭제
- **우선순위**: P1 (중요)
- **설명**: Repository의 정보를 수정하거나 삭제할 수 있어야 함
- **요구사항**:
  - 이름, 설명, 공개 설정 변경
  - 삭제 시 확인 프로세스 (Sub-repository 및 Document 포함 여부 안내)
  - 삭제된 repository 복구 기능 (30일 이내, 선택사항)
- **권한**:
  - Owner만 수정/삭제 가능

#### FR-2.5: Repository 멤버 관리 (협업)
- **우선순위**: P1 (중요)
- **설명**: Repository에 다른 사용자를 초대하여 협업할 수 있어야 함
- **요구사항**:
  - 이메일 주소로 멤버 초대
  - 초대받은 사용자에게 이메일 알림 발송
  - 초대 수락/거절 기능
  - 멤버 목록 조회
  - 멤버 역할: Owner, Editor
  - 멤버 제거 기능 (Owner만 가능)
- **제약사항**:
  - Owner는 1명만 존재
  - Editor는 무제한
  - Private Repository만 멤버 초대 가능 (Public은 이미 모두에게 공개)
  - 초대된 멤버는 Repository 설정 변경 및 삭제 불가
  - Sub-repository는 부모 Repository의 멤버 권한 상속
- **성공 기준**:
  - 초대받은 멤버가 수락 시 Repository 접근 가능
  - Editor는 Document 및 Sub-repository 생성/수정/삭제 가능

### 3.3 Document 관리

#### FR-3.1: Document 생성
- **우선순위**: P0 (필수)
- **설명**: Repository에 새로운 document를 생성할 수 있어야 함
- **요구사항**:
  - 외부 링크 URL 입력 (필수)
  - 마크다운 에디터로 노트 작성 (선택)
  - 링크와 노트는 별도의 입력 영역
  - Document 제목 자동/수동 설정
    - 자동: 링크의 메타데이터에서 추출 (og:title)
    - 수동: 사용자가 직접 입력
  - 태그 추가 기능
- **검증 규칙**:
  - URL 형식 검증
  - 중복 URL 경고 (같은 repository 내)
- **성공 기준**:
  - Document 생성 후 미리보기 화면 표시

#### FR-3.2: Document 목록 조회
- **우선순위**: P0 (필수)
- **설명**: Repository에 저장된 document 목록을 조회할 수 있어야 함
- **요구사항**:
  - 카드 형식으로 document 목록 표시
  - 각 카드에 표시되는 정보:
    - 제목
    - 링크 프리뷰 (이미지/영상)
    - 노트 요약 (첫 3줄)
    - 생성일/수정일
    - 태그
  - 정렬 옵션 (생성일, 수정일, 제목)
  - 필터 옵션 (태그별)
  - 검색 기능 (제목, 노트 내용)

#### FR-3.3: Document 상세 조회
- **우선순위**: P0 (필수)
- **설명**: Document의 상세 내용을 조회할 수 있어야 함
- **요구사항**:
  - 원본 링크 표시 및 새 탭에서 열기
  - 링크 프리뷰:
    - **유튜브/비메오**: 임베디드 플레이어
    - **이미지**: 이미지 미리보기
    - **일반 웹페이지**: 메타 이미지 및 설명
  - 마크다운 노트 렌더링
  - 생성일/수정일 표시
  - 태그 표시
  - 공유 버튼 (Public인 경우)

#### FR-3.4: Document 수정/삭제
- **우선순위**: P0 (필수)
- **설명**: Document의 내용을 수정하거나 삭제할 수 있어야 함
- **요구사항**:
  - 링크 URL, 제목, 노트, 태그 수정 가능
  - 삭제 시 확인 프로세스
  - 수정 이력 저장 (선택사항)

### 3.4 공유 기능

#### FR-4.1: Public Repository 공유
- **우선순위**: P1 (중요)
- **설명**: Public repository를 다른 사용자와 공유할 수 있어야 함
- **요구사항**:
  - 고유한 공유 URL 생성
  - URL 복사 기능
  - 소셜 미디어 공유 버튼
  - QR 코드 생성 (선택사항)
- **제약사항**:
  - Private repository는 공유 불가

#### FR-4.2: Public Repository 탐색
- **우선순위**: P2 (선택)
- **설명**: 다른 사용자의 Public repository를 탐색할 수 있어야 함
- **요구사항**:
  - 인기 Public repository 목록
  - 카테고리별 탐색
  - 검색 기능
  - 북마크/팔로우 기능 (선택사항)

### 3.5 검색 및 필터링

#### FR-5.1: 전역 검색
- **우선순위**: P1 (중요)
- **설명**: 사용자의 모든 repository와 document를 검색할 수 있어야 함
- **요구사항**:
  - 검색 범위: Repository 이름, Document 제목, 노트 내용
  - 실시간 자동완성
  - 검색 결과 하이라이팅
  - 필터 옵션:
    - Repository별
    - 공개 설정별
    - 날짜 범위
    - 태그별

## 4. 비기능 요구사항

### 4.1 성능
- **NFR-1.1**: Repository 목록 로딩 시간 < 1초
- **NFR-1.2**: Document 목록 로딩 시간 < 2초 (페이지당 20개)
- **NFR-1.3**: 검색 결과 응답 시간 < 1초
- **NFR-1.4**: 마크다운 렌더링 < 500ms

### 4.2 확장성
- **NFR-2.1**: 사용자당 최대 1,000개 repository 지원
- **NFR-2.2**: Repository당 최대 10,000개 document 지원
- **NFR-2.3**: 동시 사용자 10,000명 지원

### 4.3 보안
- **NFR-3.1**: HTTPS 통신 필수
- **NFR-3.2**: JWT 기반 인증
- **NFR-3.3**: XSS, CSRF 공격 방어
- **NFR-3.4**: Private repository 접근 권한 철저히 검증 (Owner 및 Editor 확인)
- **NFR-3.5**: OAuth 토큰 안전한 저장 및 관리
- **NFR-3.6**: Repository 멤버 권한 검증 (모든 Document 및 Sub-repository 작업 시)

### 4.4 사용성
- **NFR-4.1**: 반응형 디자인 (모바일, 태블릿, 데스크톱)
- **NFR-4.2**: 웹 접근성 준수 (WCAG 2.1 AA)
- **NFR-4.3**: 다크 모드 지원
- **NFR-4.4**: 키보드 단축키 지원

### 4.5 호환성
- **NFR-5.1**: 브라우저 지원: Chrome, Firefox, Safari, Edge (최신 2개 버전)
- **NFR-5.2**: 모바일 브라우저 지원: iOS Safari, Chrome

## 5. 사용자 플로우

### 5.1 신규 사용자 플로우
```
1. 랜딩 페이지 접속
2. "Google로 시작하기" 또는 "GitHub로 시작하기" 버튼 클릭
3. 소셜 로그인 OAuth 인증 프로세스
4. 첫 로그인 시 자동 회원가입 처리
5. 프로필 정보 자동 입력 (이름, 이메일, 프로필 이미지)
6. 대시보드로 자동 이동
7. 기본 repository 자동 생성 ("My First Repository")
8. 온보딩 튜토리얼 (선택사항)
```

### 5.2 Document 생성 플로우
```
1. Repository 목록에서 repository 선택
2. "새 Document 추가" 버튼 클릭
3. 링크 URL 입력
4. (자동) 링크 메타데이터 가져오기 (제목, 이미지)
5. 마크다운 에디터에서 노트 작성
6. 태그 추가 (선택)
7. "저장" 버튼 클릭
8. Document 상세 화면으로 이동
```

### 5.3 Repository 공유 플로우
```
1. Repository 목록에서 Public repository 선택
2. "공유" 버튼 클릭
3. 공유 URL 표시 모달 열림
4. URL 복사 또는 소셜 미디어 공유
5. 비로그인 사용자가 공유 URL 접속
6. Public repository 및 document 목록 조회 가능
```

### 5.4 Repository 협업 플로우
```
1. Repository Owner가 Repository 설정 페이지 접속
2. "멤버 관리" 탭 선택
3. 초대할 사용자의 이메일 입력
4. "초대" 버튼 클릭
5. 초대받은 사용자에게 이메일 알림 발송
6. 초대받은 사용자가 이메일의 초대 링크 클릭
7. 로그인 (미로그인 시)
8. 초대 수락/거절 선택
9. 수락 시 Repository 목록에 추가됨 (Editor 역할)
10. Editor는 Document 및 Sub-repository 생성/수정/삭제 가능
```

## 6. 우선순위 및 로드맵

### Phase 1 (MVP) - 5주
- 소셜 로그인 (Google, GitHub)
- Repository 생성, 조회, 수정, 삭제
- Sub-repository 1단계 깊이 지원
- Document 생성, 조회, 수정, 삭제
- 기본 링크 프리뷰 (메타 이미지)
- 마크다운 에디터 및 렌더링 (shadcn/ui 사용)
- Repository 멤버 초대 및 협업 기능 (Owner, Editor)

### Phase 2 - 2주
- 유튜브 임베디드 플레이어
- Public repository 공유 기능
- 검색 기능 (기본)
- 태그 시스템

### Phase 3 - 2주
- Sub-repository 무제한 깊이 지원
- Public repository 탐색 페이지
- 다크 모드
- 반응형 디자인 개선

### Phase 4 (추후) - TBD
- 브라우저 익스텐션
- 모바일 앱
- AI 기반 자동 태깅 및 요약
- Repository 템플릿 기능

## 7. 성공 지표 (KPI)

- **사용자 지표**:
  - 주간 활성 사용자 (WAU)
  - 월간 활성 사용자 (MAU)
  - 사용자 유지율 (Retention Rate)

- **사용 지표**:
  - 사용자당 평균 repository 개수
  - 사용자당 평균 document 개수
  - Document 생성률 (일일)

- **참여 지표**:
  - Public repository 공유 횟수
  - Public repository 조회 횟수
  - 평균 세션 시간

- **협업 지표**:
  - Repository당 평균 멤버 수
  - 멤버 초대 수락률
  - 협업 Repository 비율

## 8. 리스크 및 제약사항

### 8.1 기술적 리스크
- **링크 메타데이터 가져오기 실패**: CORS 이슈, 메타 태그 없음
  - **완화 방안**: 서버 사이드 프록시를 통한 메타데이터 수집

- **마크다운 XSS 공격**: 악성 스크립트 삽입
  - **완화 방안**: DOMPurify 등 sanitization 라이브러리 사용

### 8.2 법적 리스크
- **저작권 문제**: 링크된 콘텐츠의 저작권
  - **완화 방안**: 링크만 저장하고 콘텐츠 복사하지 않음, DMCA 정책 수립

- **개인정보 보호**: GDPR, 개인정보보호법 준수
  - **완화 방안**: 개인정보 처리방침 명시, 데이터 삭제 요청 프로세스 구축

### 8.3 비즈니스 리스크
- **경쟁 서비스**: Pocket, Raindrop.io, Notion 등
  - **차별화 전략**: 마크다운 노트 통합, 계층적 구조, 공유 기능

## 9. 부록

### 9.1 참고 서비스
- **Pocket**: 링크 저장 및 나중에 읽기
- **Raindrop.io**: 북마크 관리 및 컬렉션
- **Notion**: 문서 작성 및 지식 관리
- **GitHub**: Repository 구조 및 공개/비공개 개념

### 9.2 기술 스택 (프론트엔드)
- **프레임워크**: Next.js (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: shadcn/ui
- **상태 관리**: Zustand 또는 React Query
- **마크다운 에디터**: react-markdown, remark/rehype
- **인증**: NextAuth.js (OAuth)

### 9.3 변경 이력
| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 2025-10-10 | 1.0 | 초기 작성 | Product Team |
| 2025-10-10 | 1.1 | 협업 기능 추가, 소셜 로그인 전용으로 변경, 기술 스택 추가 | Product Team |
