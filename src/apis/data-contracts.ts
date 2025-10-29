/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Deck {
  /**
   * Id
   * @format uuid
   */
  id?: string;
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /** Description */
  description?: string | null;
  /**
   * Color hex
   * @minLength 1
   * @maxLength 7
   */
  color_hex?: string;
  /**
   * Parent
   * @format uuid
   */
  parent?: string | null;
  /**
   * Order
   * @min -2147483648
   * @max 2147483647
   */
  order?: number;
  /** Is public */
  is_public?: boolean;
  /** Depth */
  depth?: number;
  /** Children count */
  children_count?: string;
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string;
}

export interface DeckCreate {
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /** Description */
  description?: string | null;
  /**
   * Color hex
   * @minLength 1
   * @maxLength 7
   */
  color_hex?: string;
  /**
   * Parent
   * @format uuid
   */
  parent?: string | null;
  /** Is public */
  is_public?: boolean;
}

export interface DeckTree {
  /**
   * Id
   * @format uuid
   */
  id?: string;
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /** Description */
  description?: string | null;
  /**
   * Color hex
   * @minLength 1
   * @maxLength 7
   */
  color_hex?: string;
  /**
   * Order
   * @min -2147483648
   * @max 2147483647
   */
  order?: number;
  /** Is public */
  is_public?: boolean;
  /** Depth */
  depth?: number;
  /** Children */
  children?: string;
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string;
}

export interface DeckUpdate {
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name?: string;
  /** Description */
  description?: string | null;
  /**
   * Color hex
   * @minLength 1
   * @maxLength 7
   */
  color_hex?: string;
  /**
   * Parent
   * @format uuid
   */
  parent?: string | null;
  /**
   * Order
   * @min -2147483648
   * @max 2147483647
   */
  order?: number;
  /** Is public */
  is_public?: boolean;
}

export interface Comment {
  /**
   * Id
   * @format uuid
   */
  id?: string;
  /** Content */
  content?: string | null;
  /** User */
  user?: number;
  /**
   * User name
   * @minLength 1
   */
  user_name?: string;
  /**
   * Drop
   * @format uuid
   */
  drop: string;
  /**
   * Parent
   * @format uuid
   */
  parent?: string | null;
  /** Replies count */
  replies_count?: string;
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string;
}

export interface CommentCreate {
  /**
   * Drop
   * @format uuid
   */
  drop: string;
  /**
   * Content
   * @minLength 1
   */
  content: string;
  /**
   * Parent
   * @format uuid
   */
  parent?: string | null;
}

export interface CommentTree {
  /**
   * Id
   * @format uuid
   */
  id?: string;
  /** Content */
  content?: string | null;
  /** User */
  user?: number;
  /**
   * User name
   * @minLength 1
   */
  user_name?: string;
  /**
   * Drop
   * @format uuid
   */
  drop: string;
  /**
   * Parent
   * @format uuid
   */
  parent?: string | null;
  /** Replies */
  replies?: string;
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string;
}

export interface CommentUpdate {
  /**
   * Content
   * @minLength 1
   */
  content: string;
}

export interface Drop {
  /**
   * Id
   * @format uuid
   */
  id?: string;
  /**
   * Title
   * @minLength 1
   * @maxLength 255
   */
  title: string;
  /** Content */
  content?: string | null;
  /**
   * Url
   * @format uri
   * @minLength 1
   * @maxLength 200
   */
  url: string;
  /** Memo */
  memo?: string | null;
  /**
   * Deck
   * @format uuid
   */
  deck: string;
  /** Tags */
  tags?: string;
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string;
}

export interface DropCreate {
  /**
   * Title
   * @minLength 1
   * @maxLength 255
   */
  title: string;
  /** Content */
  content?: string | null;
  /**
   * Url
   * @format uri
   * @minLength 1
   */
  url: string;
  /** Memo */
  memo?: string | null;
  /**
   * Deck
   * @format uuid
   */
  deck: string;
  tags?: string[];
}

export interface DropUpdate {
  /**
   * Title
   * @minLength 1
   * @maxLength 255
   */
  title?: string;
  /** Content */
  content?: string | null;
  /**
   * Url
   * @format uri
   * @minLength 1
   */
  url?: string;
  /** Memo */
  memo?: string | null;
  /**
   * Deck
   * @format uuid
   */
  deck?: string;
  tags?: string[];
}

export interface User {
  /** ID */
  id?: number;
  /**
   * Username
   * @minLength 1
   * @maxLength 255
   */
  username?: string | null;
  /**
   * Email
   * @format email
   * @maxLength 254
   */
  email?: string | null;
  /**
   * Phone number
   * @maxLength 20
   */
  phone_number?: string | null;
  /**
   * Profile image
   * @format uri
   */
  profile_image?: string;
  /** Provider */
  provider?: "kakao" | "google" | "apple";
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string;
}

export interface UserProfileUpdate {
  /**
   * Username
   * @minLength 1
   * @maxLength 255
   */
  username?: string;
  /**
   * Email
   * @format email
   * @minLength 1
   */
  email?: string;
  /**
   * Phone number
   * @minLength 1
   * @maxLength 20
   */
  phone_number?: string;
  /**
   * Profile image
   * @format uri
   */
  profile_image?: string;
}

export interface RefreshToken {
  /**
   * Refresh token
   * @minLength 1
   */
  refresh_token: string;
}

export interface Token {
  /** User id */
  user_id: number;
  /**
   * Access token
   * @minLength 1
   */
  access_token: string;
  /**
   * Refresh token
   * @minLength 1
   */
  refresh_token: string;
  /**
   * Token type
   * @minLength 1
   */
  token_type: string;
}

export interface MessageResponse {
  /**
   * Message
   * 응답 메시지
   * @minLength 1
   */
  message: string;
}

export interface SocialLoginRequest {
  /**
   * Identifier
   * 사용자 ID (native 로그인)
   * @minLength 1
   */
  identifier?: string;
  /**
   * Password
   * 비밀번호 (native 로그인)
   * @minLength 1
   */
  password?: string;
  /**
   * Id token
   * Firebase ID Token (Firebase 로그인)
   * @minLength 1
   */
  id_token?: string;
}

export interface DecksDecksListParams {
  /**
   * Parent deck ID (optional)
   * @format uuid
   */
  parent?: string;
}

export type DecksDecksListData = Deck[];

export type DecksDecksCreateData = Deck;

export interface DecksDecksTreeParams {
  /**
   * Root deck ID (optional, 없으면 최상위부터)
   * @format uuid
   */
  deck_id?: string;
}

export type DecksDecksTreeData = DeckTree[];

export interface DecksDecksReadParams {
  id: string;
}

export type DecksDecksReadData = Deck;

export interface DecksDecksUpdateParams {
  id: string;
}

export type DecksDecksUpdateData = Deck;

export interface DecksDecksDeleteParams {
  id: string;
}

export type DecksDecksDeleteData = any;

export interface DropsCommentsListParams {
  /**
   * Drop ID (required)
   * @format uuid
   */
  drop_id: string;
}

export type DropsCommentsListData = Comment[];

export type DropsCommentsCreateData = Comment;

export interface DropsCommentsTreeParams {
  /**
   * Drop ID (required)
   * @format uuid
   */
  drop_id: string;
}

export type DropsCommentsTreeData = CommentTree[];

export interface DropsCommentsReadParams {
  id: string;
}

export type DropsCommentsReadData = Comment;

export interface DropsCommentsUpdateParams {
  id: string;
}

export type DropsCommentsUpdateData = Comment;

export interface DropsCommentsDeleteParams {
  id: string;
}

export type DropsCommentsDeleteData = any;

export interface DropsCommentsRepliesParams {
  id: string;
}

export type DropsCommentsRepliesData = Comment[];

export interface DropsDropsListParams {
  /**
   * Deck ID (required)
   * @format uuid
   */
  deck_id: string;
}

export type DropsDropsListData = Drop[];

export type DropsDropsCreateData = Drop;

export interface DropsDropsSearchParams {
  /** Search query */
  query?: string;
  /** Tag names (comma-separated) */
  tags?: string;
}

export type DropsDropsSearchData = Drop[];

export interface DropsDropsReadParams {
  id: string;
}

export type DropsDropsReadData = Drop;

export interface DropsDropsUpdateParams {
  id: string;
}

export type DropsDropsUpdateData = Drop;

export interface DropsDropsDeleteParams {
  id: string;
}

export type DropsDropsDeleteData = any;

export type UsersProfileMeData = User;

export type UsersProfileMeUpdateMeData = User;

export type UsersRefreshData = Token;

export type UsersWithdrawData = MessageResponse;

export interface UsersLoginCreateParams {
  /**
   * OAuth 인증 코드 (소셜 로그인 시 필요)
   * @minLength 1
   */
  code?: string;
  provider: string;
}

export type UsersLoginCreateData = Token;
