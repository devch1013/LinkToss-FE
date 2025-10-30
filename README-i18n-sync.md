# 구글 스프레드시트 다국어 동기화 설정 가이드

## 1. 구글 스프레드시트 생성

스프레드시트를 다음 형식으로 만드세요:

| key | ko | en |
|-----|----|----|
| common.loading | 로딩중... | Loading... |
| common.delete | 삭제 | Delete |
| common.edit | 수정 | Edit |
| common.share | 공유 | Share |
| common.cancel | 취소 | Cancel |
| common.submit | 제출 | Submit |
| common.home | 홈 | Home |
| common.anonymous | 익명 | Anonymous |
| metadata.title | LinkToss - 링크를 저장하고, 정리하고, 공유하세요 | LinkToss - Save, Organize, and Share Your Links |
| metadata.description | 마크다운으로 메모를 작성하고 체계적으로 관리할 수 있는 링크 저장소 | Link repository where you can write notes in markdown and manage them systematically |
| drop.confirmDelete | 정말 삭제하시겠습니까? | Are you sure you want to delete? |
| drop.goToDeck | 덱으로 이동 | Go to Deck |
| drop.memo | 📝 메모 | 📝 Memo |
| drop.createdAt | 생성일 | Created |
| drop.updatedAt | 수정일 | Updated |
| drop.comments | 💬 댓글 | 💬 Comments |
| drop.commentsCount | 💬 댓글 ({count}) | 💬 Comments ({count}) |
| drop.writeComment | 댓글 작성 | Write Comment |
| drop.commentPlaceholder | 댓글을 작성하세요... | Write a comment... |
| drop.replyPlaceholder | 답글을 작성하세요... | Write a reply... |
| drop.reply | 답글 | Reply |
| drop.firstComment | 첫 댓글을 작성해보세요! | Be the first to comment! |
| dashboard.welcome | 환영합니다, {name}님! 👋 | Welcome, {name}! 👋 |
| dashboard.welcomeMessage | LinkToss에서 링크를 효율적으로 관리하세요 | LinkToss에서 링크를 효율적으로 관리하세요 |

**중요:**
- 첫 번째 시트 이름을 "i18n"으로 설정 (또는 원하는 이름으로 변경 후 .env.local에 설정)
- 첫 번째 행은 반드시 헤더 (key, ko, en, ...)
- key 컬럼은 필수, 점(.)으로 중첩 구조 표현 (예: `common.loading`)

## 2. Google Sheets API 활성화 및 인증 설정

### 2-1. API 키 생성 (읽기 전용 - sync:i18n)

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 또는 선택
3. "API 및 서비스" > "라이브러리" 이동
4. "Google Sheets API" 검색 후 활성화
5. "사용자 인증 정보" > "사용자 인증 정보 만들기" > "API 키" 선택
6. API 키 복사

### 2-2. Service Account 생성 (쓰기 권한 - push:i18n)

JSON을 스프레드시트로 업로드하려면 Service Account가 필요해요:

1. Google Cloud Console > "사용자 인증 정보" > "사용자 인증 정보 만들기" > "서비스 계정"
2. 서비스 계정 이름 입력 후 생성
3. 생성된 서비스 계정 클릭 > "키" 탭 > "키 추가" > "새 키 만들기" > JSON 선택
4. 다운로드된 JSON 파일을 프로젝트 루트에 `service-account.json`으로 저장 (또는 .env.local에 내용 추가)
5. **중요**: 스프레드시트 공유 버튼 클릭 > 서비스 계정 이메일 추가 (편집자 권한)

## 3. 스프레드시트 공개 설정

1. 스프레드시트 우측 상단 "공유" 클릭
2. "액세스 권한" > "링크가 있는 모든 사용자" 선택
3. 권한을 "뷰어"로 설정
4. 스프레드시트 URL에서 ID 복사
   - URL 형식: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

## 4. 환경변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
# 필수
GOOGLE_SHEET_ID=여기에_스프레드시트_ID_입력
GOOGLE_SHEET_NAME=i18n

# 읽기 전용 (sync:i18n)
GOOGLE_API_KEY=여기에_API_키_입력

# 쓰기 권한 (push:i18n) - 선택 1: 환경변수에 직접 입력
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}

# 또는 선택 2: service-account.json 파일 사용 (프로젝트 루트에 파일 생성)
```

## 5. 패키지 설치 및 실행

```bash
# 패키지 설치
pnpm install

# 다국어 파일 동기화
pnpm sync:i18n
```

## 사용법

### 스프레드시트 → JSON (다운로드)

1. 구글 스프레드시트에서 번역 수정
2. 터미널에서 `pnpm sync:i18n` 실행
3. `src/i18n/locales/` 폴더의 JSON 파일들이 자동 업데이트됨

### JSON → 스프레드시트 (업로드)

1. `src/i18n/locales/` 폴더의 JSON 파일 수정
2. 터미널에서 `pnpm push:i18n` 실행
3. 구글 스프레드시트가 자동 업데이트됨
4. **주의**: 기존 스프레드시트 내용이 덮어써져요!

## 새 언어 추가

1. 스프레드시트에 새 컬럼 추가 (예: `ja`, `zh`)
2. 번역 내용 입력
3. `pnpm sync:i18n` 실행
4. 자동으로 `ja.json`, `zh.json` 파일 생성됨

