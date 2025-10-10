# LinkToss - API 명세서

## 📌 문서 정보
- **버전**: 1.1
- **최종 수정일**: 2025-10-10
- **작성자**: Engineering Team
- **상태**: Draft
- **Base URL**: `https://api.linktoss.com/v1`

## 목차
1. [개요](#1-개요)
2. [인증](#2-인증)
3. [공통 응답 형식](#3-공통-응답-형식)
4. [에러 코드](#4-에러-코드)
5. [API 엔드포인트](#5-api-엔드포인트)

---

## 1. 개요

### 1.1 API 설계 원칙
- **RESTful 아키텍처**: 표준 HTTP 메서드 사용
- **버전 관리**: URL에 버전 포함 (`/v1`)
- **JSON 형식**: 모든 요청/응답은 JSON
- **페이지네이션**: 목록 조회 시 커서 기반 페이지네이션
- **Rate Limiting**: 사용자당 시간당 1000 요청

### 1.2 HTTP 메서드
- `GET`: 리소스 조회
- `POST`: 리소스 생성
- `PUT`: 리소스 전체 수정
- `PATCH`: 리소스 부분 수정
- `DELETE`: 리소스 삭제

### 1.3 HTTP 상태 코드
- `200 OK`: 성공
- `201 Created`: 생성 성공
- `204 No Content`: 삭제 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스 없음
- `409 Conflict`: 충돌 (중복 등)
- `422 Unprocessable Entity`: 검증 실패
- `429 Too Many Requests`: Rate limit 초과
- `500 Internal Server Error`: 서버 오류

---

## 2. 인증

### 2.1 JWT 토큰 기반 인증
모든 보호된 엔드포인트는 JWT 토큰 필요

**요청 헤더**:
```
Authorization: Bearer <access_token>
```

**토큰 만료**:
- Access Token: 1시간
- Refresh Token: 30일

### 2.2 인증 플로우
```
1. 로그인 → Access Token + Refresh Token 발급
2. API 요청 시 Access Token 사용
3. Access Token 만료 시 Refresh Token으로 갱신
4. Refresh Token 만료 시 재로그인
```

---

## 3. 공통 응답 형식

### 3.1 성공 응답
```json
{
  "success": true,
  "data": {
    // 응답 데이터
  },
  "meta": {
    "timestamp": "2025-10-10T12:00:00Z",
    "version": "1.0"
  }
}
```

### 3.2 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-10-10T12:00:00Z"
  }
}
```

### 3.3 페이지네이션 응답
```json
{
  "success": true,
  "data": [
    // 배열 데이터
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## 4. 에러 코드

| 에러 코드 | HTTP 상태 | 설명 |
|----------|-----------|------|
| `VALIDATION_ERROR` | 422 | 입력 데이터 검증 실패 |
| `AUTHENTICATION_ERROR` | 401 | 인증 실패 |
| `AUTHORIZATION_ERROR` | 403 | 권한 없음 |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `DUPLICATE_RESOURCE` | 409 | 중복된 리소스 |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit 초과 |
| `INTERNAL_ERROR` | 500 | 서버 내부 오류 |

---

## 5. API 엔드포인트

## 5.1 인증 (Authentication)

**주의**: 이 서비스는 소셜 로그인(OAuth)만 지원합니다. 이메일/비밀번호 기반 인증은 제공하지 않습니다.

---

### POST /auth/oauth/google
Google OAuth 로그인 및 회원가입

**설명**: Google OAuth를 통한 로그인. 첫 로그인 시 자동으로 회원가입 처리됩니다.

**요청 바디**:
```json
{
  "code": "4/0AX4XfWh...",
  "redirectUri": "https://linktoss.com/auth/callback"
}
```

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "username": "hongkildong",
      "name": "홍길동",
      "avatarUrl": "https://lh3.googleusercontent.com/...",
      "bio": null,
      "emailVerified": true,
      "createdAt": "2025-10-10T12:00:00Z",
      "isNewUser": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
  }
}
```

**프로세스**:
1. 클라이언트가 Google OAuth 인증 코드 획득
2. 서버가 Google API로 사용자 정보 조회
3. 기존 사용자: 로그인 처리 (`isNewUser: false`)
4. 신규 사용자: 자동 회원가입 후 로그인 (`isNewUser: true`)
5. 신규 사용자인 경우 기본 Repository "My First Repository" 자동 생성

**에러**:
- `401`: OAuth 인증 코드 무효
- `500`: Google API 호출 실패

---

### POST /auth/oauth/github
GitHub OAuth 로그인 및 회원가입

**설명**: GitHub OAuth를 통한 로그인. 첫 로그인 시 자동으로 회원가입 처리됩니다.

**요청 바디**:
```json
{
  "code": "gho_abc123...",
  "redirectUri": "https://linktoss.com/auth/callback"
}
```

**응답** (200 OK): `/auth/oauth/google`과 동일

**프로세스**: Google OAuth와 동일

**에러**:
- `401`: OAuth 인증 코드 무효
- `500`: GitHub API 호출 실패

---

### POST /auth/refresh
토큰 갱신

**요청 바디**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

---

### POST /auth/logout
로그아웃

**헤더**: `Authorization: Bearer <token>`

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## 5.2 사용자 (Users)

### GET /users/me
현재 사용자 정보 조회

**헤더**: `Authorization: Bearer <token>`

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "hongkildong",
    "name": "홍길동",
    "avatarUrl": "https://cdn.linktoss.com/avatars/abc.jpg",
    "bio": "프론트엔드 개발자",
    "emailVerified": true,
    "createdAt": "2025-10-01T10:00:00Z",
    "stats": {
      "repositoryCount": 12,
      "documentCount": 156,
      "publicRepositoryCount": 3
    }
  }
}
```

---

### PATCH /users/me
현재 사용자 정보 수정

**헤더**: `Authorization: Bearer <token>`

**요청 바디**:
```json
{
  "name": "홍길동",
  "username": "newhongkildong",
  "bio": "풀스택 개발자",
  "avatarUrl": "https://cdn.linktoss.com/avatars/new.jpg"
}
```

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "newhongkildong",
    "name": "홍길동",
    "avatarUrl": "https://cdn.linktoss.com/avatars/new.jpg",
    "bio": "풀스택 개발자",
    "updatedAt": "2025-10-10T12:00:00Z"
  }
}
```

**에러**:
- `409`: 이미 존재하는 사용자명

---

### GET /users/:username
사용자 프로필 조회 (Public)

**경로 파라미터**:
- `username`: 사용자명

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "username": "hongkildong",
    "name": "홍길동",
    "avatarUrl": "https://cdn.linktoss.com/avatars/abc.jpg",
    "bio": "프론트엔드 개발자",
    "publicRepositories": [
      {
        "id": "650e8400-e29b-41d4-a716-446655440001",
        "name": "웹 개발 학습 자료",
        "description": "초보자를 위한 웹 개발 학습 로드맵",
        "icon": "📚",
        "documentCount": 45,
        "createdAt": "2025-09-01T10:00:00Z"
      }
    ]
  }
}
```

---

## 5.3 Repository

### GET /repositories
사용자의 Repository 목록 조회

**헤더**: `Authorization: Bearer <token>`

**쿼리 파라미터**:
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 20, 최대: 100)
- `sort`: 정렬 (`created_at`, `updated_at`, `name`)
- `order`: 정렬 순서 (`asc`, `desc`)
- `parentId`: 부모 Repository ID (Sub-repository 필터)

**응답** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "parentId": null,
      "name": "개발 자료",
      "description": "프론트엔드 개발 관련 자료 모음",
      "icon": "📁",
      "isPublic": false,
      "slug": "dev-resources",
      "position": 0,
      "documentCount": 24,
      "subRepositoryCount": 2,
      "createdAt": "2025-09-01T10:00:00Z",
      "updatedAt": "2025-10-09T15:30:00Z"
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 20,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

---

### GET /repositories/:id
Repository 상세 조회

**헤더**: `Authorization: Bearer <token>` (Private인 경우)

**경로 파라미터**:
- `id`: Repository ID

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "user": {
      "username": "hongkildong",
      "name": "홍길동",
      "avatarUrl": "https://cdn.linktoss.com/avatars/abc.jpg"
    },
    "parentId": null,
    "name": "개발 자료",
    "description": "프론트엔드 개발 관련 자료 모음",
    "icon": "📁",
    "isPublic": false,
    "slug": "dev-resources",
    "documentCount": 24,
    "subRepositories": [
      {
        "id": "750e8400-e29b-41d4-a716-446655440002",
        "name": "React",
        "icon": "⚛️",
        "documentCount": 12
      }
    ],
    "stats": {
      "viewCount": 156,
      "shareCount": 5,
      "lastAccessedAt": "2025-10-10T11:00:00Z"
    },
    "createdAt": "2025-09-01T10:00:00Z",
    "updatedAt": "2025-10-09T15:30:00Z"
  }
}
```

**에러**:
- `404`: Repository 없음
- `403`: Private repository에 접근 권한 없음

---

### POST /repositories
Repository 생성

**헤더**: `Authorization: Bearer <token>`

**요청 바디**:
```json
{
  "name": "개발 자료",
  "description": "프론트엔드 개발 관련 자료 모음",
  "icon": "📁",
  "isPublic": false,
  "parentId": null
}
```

**응답** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "parentId": null,
    "name": "개발 자료",
    "description": "프론트엔드 개발 관련 자료 모음",
    "icon": "📁",
    "isPublic": false,
    "slug": "dev-resources",
    "position": 0,
    "createdAt": "2025-10-10T12:00:00Z",
    "updatedAt": "2025-10-10T12:00:00Z"
  }
}
```

**에러**:
- `409`: 중복된 Repository 이름/slug
- `422`: 검증 실패 (이름 길이, Public 하위 Private 등)

---

### PATCH /repositories/:id
Repository 수정

**헤더**: `Authorization: Bearer <token>`

**경로 파라미터**:
- `id`: Repository ID

**요청 바디**:
```json
{
  "name": "웹 개발 자료",
  "description": "웹 개발 관련 자료 모음 (수정됨)",
  "icon": "🌐",
  "isPublic": true
}
```

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "name": "웹 개발 자료",
    "description": "웹 개발 관련 자료 모음 (수정됨)",
    "icon": "🌐",
    "isPublic": true,
    "slug": "web-dev-resources",
    "updatedAt": "2025-10-10T12:30:00Z"
  }
}
```

**에러**:
- `404`: Repository 없음
- `403`: 수정 권한 없음

---

### DELETE /repositories/:id
Repository 삭제 (Soft Delete)

**헤더**: `Authorization: Bearer <token>`

**경로 파라미터**:
- `id`: Repository ID

**응답** (204 No Content)

**에러**:
- `404`: Repository 없음
- `403`: 삭제 권한 없음

---

### PUT /repositories/:id/restore
삭제된 Repository 복원

**헤더**: `Authorization: Bearer <token>`

**경로 파라미터**:
- `id`: Repository ID

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "name": "개발 자료",
    "deletedAt": null,
    "restoredAt": "2025-10-10T13:00:00Z"
  }
}
```

---

### PUT /repositories/reorder
Repository 순서 변경

**헤더**: `Authorization: Bearer <token>`

**요청 바디**:
```json
{
  "repositoryIds": [
    "650e8400-e29b-41d4-a716-446655440001",
    "650e8400-e29b-41d4-a716-446655440002",
    "650e8400-e29b-41d4-a716-446655440003"
  ]
}
```

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Repository order updated successfully"
  }
}
```

---

### POST /repositories/:id/members
Repository 멤버 초대

**헤더**: `Authorization: Bearer <token>`

**경로 파라미터**:
- `id`: Repository ID

**요청 바디**:
```json
{
  "email": "member@example.com"
}
```

**응답** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "a50e8400-e29b-41d4-a716-446655440007",
    "repositoryId": "650e8400-e29b-41d4-a716-446655440001",
    "userId": "b50e8400-e29b-41d4-a716-446655440008",
    "user": {
      "id": "b50e8400-e29b-41d4-a716-446655440008",
      "email": "member@example.com",
      "username": "membername",
      "name": "멤버 이름",
      "avatarUrl": "https://cdn.linktoss.com/avatars/member.jpg"
    },
    "role": "editor",
    "invitedBy": "550e8400-e29b-41d4-a716-446655440000",
    "invitedAt": "2025-10-10T14:00:00Z",
    "acceptedAt": null,
    "status": "pending"
  }
}
```

**에러**:
- `403`: Owner 권한 없음 (Owner만 멤버 초대 가능)
- `403`: Public repository는 멤버 초대 불가 (Private만 가능)
- `404`: Repository 없음
- `404`: 해당 이메일의 사용자 없음
- `409`: 이미 초대된 사용자

---

### GET /repositories/:id/members
Repository 멤버 목록 조회

**헤더**: `Authorization: Bearer <token>`

**경로 파라미터**:
- `id`: Repository ID

**응답** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "a50e8400-e29b-41d4-a716-446655440006",
      "repositoryId": "650e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "owner@example.com",
        "username": "ownerusername",
        "name": "오너 이름",
        "avatarUrl": "https://cdn.linktoss.com/avatars/owner.jpg"
      },
      "role": "owner",
      "invitedBy": null,
      "invitedAt": "2025-09-01T10:00:00Z",
      "acceptedAt": "2025-09-01T10:00:00Z"
    },
    {
      "id": "a50e8400-e29b-41d4-a716-446655440007",
      "repositoryId": "650e8400-e29b-41d4-a716-446655440001",
      "userId": "b50e8400-e29b-41d4-a716-446655440008",
      "user": {
        "id": "b50e8400-e29b-41d4-a716-446655440008",
        "email": "editor@example.com",
        "username": "editorusername",
        "name": "편집자 이름",
        "avatarUrl": "https://cdn.linktoss.com/avatars/editor.jpg"
      },
      "role": "editor",
      "invitedBy": "550e8400-e29b-41d4-a716-446655440000",
      "invitedAt": "2025-10-05T11:00:00Z",
      "acceptedAt": "2025-10-05T14:30:00Z"
    }
  ]
}
```

**에러**:
- `403`: Repository 접근 권한 없음
- `404`: Repository 없음

---

### DELETE /repositories/:id/members/:userId
Repository 멤버 제거

**헤더**: `Authorization: Bearer <token>`

**경로 파라미터**:
- `id`: Repository ID
- `userId`: 제거할 사용자 ID

**응답** (204 No Content)

**에러**:
- `403`: Owner 권한 없음 (Owner만 멤버 제거 가능)
- `403`: Owner는 제거할 수 없음
- `404`: Repository 없음
- `404`: 멤버 없음

---

### GET /invitations
현재 사용자의 초대 목록 조회

**헤더**: `Authorization: Bearer <token>`

**쿼리 파라미터**:
- `status`: 초대 상태 (`pending`, `accepted`, `rejected`)

**응답** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "a50e8400-e29b-41d4-a716-446655440009",
      "repository": {
        "id": "650e8400-e29b-41d4-a716-446655440001",
        "name": "팀 프로젝트",
        "description": "팀 협업용 링크 모음",
        "icon": "🤝",
        "documentCount": 45
      },
      "invitedBy": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "teamlead",
        "name": "팀 리더",
        "avatarUrl": "https://cdn.linktoss.com/avatars/lead.jpg"
      },
      "role": "editor",
      "invitedAt": "2025-10-09T10:00:00Z",
      "status": "pending"
    }
  ]
}
```

---

### POST /invitations/:id/accept
초대 수락

**헤더**: `Authorization: Bearer <token>`

**경로 파라미터**:
- `id`: 초대 ID (repository_members.id)

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "a50e8400-e29b-41d4-a716-446655440009",
    "repositoryId": "650e8400-e29b-41d4-a716-446655440001",
    "userId": "c50e8400-e29b-41d4-a716-446655440010",
    "role": "editor",
    "acceptedAt": "2025-10-10T15:00:00Z",
    "repository": {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "name": "팀 프로젝트",
      "description": "팀 협업용 링크 모음",
      "icon": "🤝"
    }
  }
}
```

**에러**:
- `404`: 초대 없음
- `403`: 다른 사용자의 초대
- `409`: 이미 수락/거절된 초대

---

### POST /invitations/:id/reject
초대 거절

**헤더**: `Authorization: Bearer <token>`

**경로 파라미터**:
- `id`: 초대 ID (repository_members.id)

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Invitation rejected successfully"
  }
}
```

**에러**:
- `404`: 초대 없음
- `403`: 다른 사용자의 초대
- `409`: 이미 수락/거절된 초대

---

## 5.4 Document

### GET /repositories/:repositoryId/documents
Repository의 Document 목록 조회

**헤더**: `Authorization: Bearer <token>` (Private인 경우)

**경로 파라미터**:
- `repositoryId`: Repository ID

**쿼리 파라미터**:
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 20)
- `sort`: 정렬 (`created_at`, `updated_at`, `title`)
- `order`: 정렬 순서 (`asc`, `desc`)
- `tags`: 태그 필터 (쉼표로 구분, 예: `react,frontend`)
- `search`: 검색어 (제목, 내용)

**응답** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "850e8400-e29b-41d4-a716-446655440003",
      "repositoryId": "650e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "title": "React 공식 문서",
      "url": "https://react.dev",
      "contentPreview": "React는 사용자 인터페이스를 만들기 위한...",
      "linkMetadata": {
        "ogTitle": "React",
        "ogImage": "https://react.dev/og-image.png",
        "ogDescription": "A JavaScript library for building user interfaces"
      },
      "tags": [
        {
          "id": "950e8400-e29b-41d4-a716-446655440004",
          "name": "react",
          "color": "#61DAFB"
        }
      ],
      "createdAt": "2025-10-08T10:00:00Z",
      "updatedAt": "2025-10-09T14:00:00Z"
    }
  ],
  "pagination": {
    "total": 24,
    "page": 1,
    "limit": 20,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

### GET /documents/:id
Document 상세 조회

**헤더**: `Authorization: Bearer <token>` (Private인 경우)

**경로 파라미터**:
- `id`: Document ID

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "850e8400-e29b-41d4-a716-446655440003",
    "repositoryId": "650e8400-e29b-41d4-a716-446655440001",
    "repository": {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "name": "개발 자료",
      "isPublic": false
    },
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "React 공식 문서",
    "url": "https://react.dev",
    "content": "# React란?\n\nReact는 사용자 인터페이스를...",
    "linkMetadata": {
      "ogTitle": "React",
      "ogImage": "https://react.dev/og-image.png",
      "ogDescription": "A JavaScript library for building user interfaces",
      "ogUrl": "https://react.dev",
      "favicon": "https://react.dev/favicon.ico",
      "siteName": "React",
      "type": "website",
      "fetchedAt": "2025-10-08T10:00:00Z"
    },
    "tags": [
      {
        "id": "950e8400-e29b-41d4-a716-446655440004",
        "name": "react",
        "color": "#61DAFB"
      },
      {
        "id": "950e8400-e29b-41d4-a716-446655440005",
        "name": "frontend",
        "color": "#3B82F6"
      }
    ],
    "createdAt": "2025-10-08T10:00:00Z",
    "updatedAt": "2025-10-09T14:00:00Z"
  }
}
```

**에러**:
- `404`: Document 없음
- `403`: 접근 권한 없음

---

### POST /documents
Document 생성

**헤더**: `Authorization: Bearer <token>`

**요청 바디**:
```json
{
  "repositoryId": "650e8400-e29b-41d4-a716-446655440001",
  "title": "React 공식 문서",
  "url": "https://react.dev",
  "content": "# React란?\n\nReact는 사용자 인터페이스를...",
  "tags": ["react", "frontend"]
}
```

**응답** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "850e8400-e29b-41d4-a716-446655440003",
    "repositoryId": "650e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "React 공식 문서",
    "url": "https://react.dev",
    "content": "# React란?\n\nReact는 사용자 인터페이스를...",
    "linkMetadata": {
      "ogTitle": "React",
      "ogImage": "https://react.dev/og-image.png",
      "ogDescription": "A JavaScript library for building user interfaces"
    },
    "tags": [
      {
        "id": "950e8400-e29b-41d4-a716-446655440004",
        "name": "react",
        "color": "#61DAFB"
      }
    ],
    "createdAt": "2025-10-10T12:00:00Z",
    "updatedAt": "2025-10-10T12:00:00Z"
  }
}
```

**에러**:
- `404`: Repository 없음
- `422`: URL 형식 오류

---

### PATCH /documents/:id
Document 수정

**헤더**: `Authorization: Bearer <token>`

**경로 파라미터**:
- `id`: Document ID

**요청 바디**:
```json
{
  "title": "React 공식 문서 (업데이트)",
  "content": "# React란?\n\n(수정된 내용)...",
  "tags": ["react", "frontend", "library"]
}
```

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "850e8400-e29b-41d4-a716-446655440003",
    "title": "React 공식 문서 (업데이트)",
    "content": "# React란?\n\n(수정된 내용)...",
    "tags": [
      {
        "id": "950e8400-e29b-41d4-a716-446655440004",
        "name": "react",
        "color": "#61DAFB"
      },
      {
        "id": "950e8400-e29b-41d4-a716-446655440005",
        "name": "frontend",
        "color": "#3B82F6"
      },
      {
        "id": "950e8400-e29b-41d4-a716-446655440006",
        "name": "library",
        "color": "#10B981"
      }
    ],
    "updatedAt": "2025-10-10T13:00:00Z"
  }
}
```

---

### DELETE /documents/:id
Document 삭제

**헤더**: `Authorization: Bearer <token>`

**경로 파라미터**:
- `id`: Document ID

**응답** (204 No Content)

**에러**:
- `404`: Document 없음
- `403`: 삭제 권한 없음

---

### POST /documents/fetch-metadata
URL 메타데이터 가져오기

**헤더**: `Authorization: Bearer <token>`

**요청 바디**:
```json
{
  "url": "https://react.dev"
}
```

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "url": "https://react.dev",
    "ogTitle": "React",
    "ogDescription": "A JavaScript library for building user interfaces",
    "ogImage": "https://react.dev/og-image.png",
    "ogUrl": "https://react.dev",
    "favicon": "https://react.dev/favicon.ico",
    "siteName": "React",
    "type": "website"
  }
}
```

**에러**:
- `422`: 유효하지 않은 URL
- `500`: 메타데이터 가져오기 실패

---

## 5.5 태그 (Tags)

### GET /tags
사용자의 태그 목록 조회

**헤더**: `Authorization: Bearer <token>`

**쿼리 파라미터**:
- `search`: 태그 이름 검색

**응답** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "950e8400-e29b-41d4-a716-446655440004",
      "name": "react",
      "color": "#61DAFB",
      "documentCount": 24,
      "createdAt": "2025-09-01T10:00:00Z"
    },
    {
      "id": "950e8400-e29b-41d4-a716-446655440005",
      "name": "frontend",
      "color": "#3B82F6",
      "documentCount": 45,
      "createdAt": "2025-09-05T11:00:00Z"
    }
  ]
}
```

---

### POST /tags
태그 생성

**헤더**: `Authorization: Bearer <token>`

**요청 바디**:
```json
{
  "name": "react",
  "color": "#61DAFB"
}
```

**응답** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "950e8400-e29b-41d4-a716-446655440004",
    "name": "react",
    "color": "#61DAFB",
    "documentCount": 0,
    "createdAt": "2025-10-10T12:00:00Z"
  }
}
```

**에러**:
- `409`: 중복된 태그 이름

---

### PATCH /tags/:id
태그 수정

**헤더**: `Authorization: Bearer <token>`

**경로 파라미터**:
- `id`: 태그 ID

**요청 바디**:
```json
{
  "name": "reactjs",
  "color": "#00D8FF"
}
```

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "950e8400-e29b-41d4-a716-446655440004",
    "name": "reactjs",
    "color": "#00D8FF",
    "updatedAt": "2025-10-10T13:00:00Z"
  }
}
```

---

### DELETE /tags/:id
태그 삭제

**헤더**: `Authorization: Bearer <token>`

**경로 파라미터**:
- `id`: 태그 ID

**응답** (204 No Content)

---

## 5.6 검색 (Search)

### GET /search
전역 검색

**헤더**: `Authorization: Bearer <token>`

**쿼리 파라미터**:
- `q`: 검색어 (필수)
- `type`: 검색 타입 (`all`, `repositories`, `documents`)
- `page`: 페이지 번호
- `limit`: 페이지당 항목 수
- `dateRange`: 날짜 범위 (`week`, `month`, `year`)
- `repositoryId`: Repository 필터

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "repositories": [
      {
        "id": "650e8400-e29b-41d4-a716-446655440001",
        "name": "React 학습 자료",
        "description": "React 관련 튜토리얼과 문서 모음",
        "documentCount": 24,
        "highlight": {
          "name": "<em>React</em> 학습 자료"
        }
      }
    ],
    "documents": [
      {
        "id": "850e8400-e29b-41d4-a716-446655440003",
        "title": "React 공식 문서",
        "url": "https://react.dev",
        "repository": {
          "id": "650e8400-e29b-41d4-a716-446655440001",
          "name": "개발 자료"
        },
        "highlight": {
          "title": "<em>React</em> 공식 문서",
          "content": "<em>React</em>는 사용자 인터페이스를..."
        }
      }
    ]
  },
  "meta": {
    "query": "react",
    "total": {
      "repositories": 5,
      "documents": 37
    }
  }
}
```

---

### GET /search/autocomplete
검색 자동완성

**헤더**: `Authorization: Bearer <token>`

**쿼리 파라미터**:
- `q`: 검색어 (필수, 최소 2자)
- `limit`: 결과 개수 (기본값: 10)

**응답** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "type": "repository",
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "text": "React 학습 자료",
      "icon": "📚"
    },
    {
      "type": "document",
      "id": "850e8400-e29b-41d4-a716-446655440003",
      "text": "React 공식 문서",
      "url": "https://react.dev"
    },
    {
      "type": "tag",
      "id": "950e8400-e29b-41d4-a716-446655440004",
      "text": "react",
      "color": "#61DAFB"
    }
  ]
}
```

---

## 5.7 탐색 (Explore)

### GET /explore/repositories
Public Repository 탐색

**쿼리 파라미터**:
- `page`: 페이지 번호
- `limit`: 페이지당 항목 수
- `sort`: 정렬 (`popular`, `recent`, `trending`)
- `category`: 카테고리 필터

**응답** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "name": "웹 개발 학습 로드맵",
      "description": "초보자를 위한 웹 개발 학습 자료 모음",
      "icon": "📚",
      "user": {
        "username": "john",
        "name": "John Doe",
        "avatarUrl": "https://cdn.linktoss.com/avatars/john.jpg"
      },
      "documentCount": 128,
      "stats": {
        "viewCount": 1456,
        "shareCount": 89
      },
      "tags": ["webdev", "tutorial", "beginner"],
      "createdAt": "2025-08-01T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "limit": 20,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

### GET /explore/categories
카테고리 목록 조회

**응답** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "category-1",
      "name": "개발",
      "slug": "development",
      "icon": "💻",
      "repositoryCount": 1234
    },
    {
      "id": "category-2",
      "name": "디자인",
      "slug": "design",
      "icon": "🎨",
      "repositoryCount": 856
    }
  ]
}
```

---

## 5.8 공유 (Share)

### POST /repositories/:id/share
Repository 공유 링크 생성

**헤더**: `Authorization: Bearer <token>`

**경로 파라미터**:
- `id`: Repository ID

**요청 바디** (선택):
```json
{
  "expiresIn": 86400
}
```

**응답** (201 Created):
```json
{
  "success": true,
  "data": {
    "shareToken": "abc123xyz456",
    "shareUrl": "https://linktoss.com/s/abc123xyz456",
    "expiresAt": "2025-10-11T12:00:00Z",
    "createdAt": "2025-10-10T12:00:00Z"
  }
}
```

**에러**:
- `403`: Private repository는 공유 불가

---

### GET /share/:token
공유된 Repository 조회 (Public)

**경로 파라미터**:
- `token`: 공유 토큰

**응답** (200 OK): `/repositories/:id`와 동일 (읽기 전용)

**에러**:
- `404`: 유효하지 않은 토큰
- `410`: 만료된 공유 링크

---

## 5.9 통계 (Stats)

### GET /stats/dashboard
대시보드 통계

**헤더**: `Authorization: Bearer <token>`

**응답** (200 OK):
```json
{
  "success": true,
  "data": {
    "overview": {
      "repositoryCount": 12,
      "documentCount": 156,
      "publicRepositoryCount": 3,
      "tagCount": 24
    },
    "recentDocuments": [
      {
        "id": "850e8400-e29b-41d4-a716-446655440003",
        "title": "React 공식 문서",
        "url": "https://react.dev",
        "createdAt": "2025-10-08T10:00:00Z"
      }
    ],
    "frequentRepositories": [
      {
        "id": "650e8400-e29b-41d4-a716-446655440001",
        "name": "개발 자료",
        "documentCount": 24,
        "lastAccessedAt": "2025-10-10T11:00:00Z"
      }
    ]
  }
}
```

---

## 6. Webhook (추후 구현)

### POST /webhooks
Repository 업데이트 시 Webhook 호출

---

## 7. Rate Limiting

### 제한 정책
- **인증된 사용자**: 시간당 1000 요청
- **비인증 사용자**: 시간당 100 요청

### 응답 헤더
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1633046400
```

### Rate Limit 초과 시
**응답** (429 Too Many Requests):
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 3600
  }
}
```

---

## 8. 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 2025-10-10 | 1.1 | OAuth 전용 인증으로 변경, Repository 멤버 관리 및 초대 기능 API 추가 | Engineering Team |
| 2025-10-10 | 1.0 | 초기 작성 | Engineering Team |

---

## 부록: API 테스트 예제

### cURL 예제

**Google OAuth 로그인**:
```bash
curl -X POST https://api.linktoss.com/v1/auth/oauth/google \
  -H "Content-Type: application/json" \
  -d '{
    "code": "4/0AX4XfWh...",
    "redirectUri": "https://linktoss.com/auth/callback"
  }'
```

**Repository 생성**:
```bash
curl -X POST https://api.linktoss.com/v1/repositories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "개발 자료",
    "description": "프론트엔드 개발 관련 자료 모음",
    "isPublic": false
  }'
```

**Document 생성**:
```bash
curl -X POST https://api.linktoss.com/v1/documents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "repositoryId": "650e8400-e29b-41d4-a716-446655440001",
    "title": "React 공식 문서",
    "url": "https://react.dev",
    "content": "# React\n\nA JavaScript library...",
    "tags": ["react", "frontend"]
  }'
```

---

## Postman Collection
Postman Collection 파일은 별도로 제공됩니다: `linktoss-api.postman_collection.json`
