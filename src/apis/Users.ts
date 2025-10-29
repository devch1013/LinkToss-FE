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

import {
  RefreshToken,
  SocialLoginRequest,
  UserProfileUpdate,
  UsersLoginCreateData,
  UsersLoginCreateParams,
  UsersProfileMeData,
  UsersProfileMeUpdateMeData,
  UsersRefreshData,
  UsersWithdrawData,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Users<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 현재 로그인한 사용자의 프로필 정보를 조회합니다.
   *
   * @tags users
   * @name UsersProfileMe
   * @summary 내 프로필 조회
   * @request GET:/users/profile/me/
   * @secure
   * @response `200` `UsersProfileMeData`
   */
  usersProfileMe = (params: RequestParams = {}) =>
    this.request<UsersProfileMeData, any>({
      path: `/users/profile/me/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 로그인한 사용자의 프로필 정보를 수정합니다. profile_image는 S3에 업로드됩니다.
   *
   * @tags users
   * @name UsersProfileMeUpdateMe
   * @summary 내 프로필 수정
   * @request PATCH:/users/profile/me/update/
   * @secure
   * @response `200` `UsersProfileMeUpdateMeData`
   * @response `400` `void` Bad request
   */
  usersProfileMeUpdateMe = (
    data: UserProfileUpdate,
    params: RequestParams = {},
  ) =>
    this.request<UsersProfileMeUpdateMeData, void>({
      path: `/users/profile/me/update/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 유효한 Refresh 토큰을 사용하여 새로운 Access 토큰을 발급받습니다. Refresh 토큰이 만료되지 않은 경우 새로운 Access 토큰과 Refresh 토큰을 반환합니다.
   *
   * @tags 인증
   * @name UsersRefresh
   * @summary 토큰 갱신
   * @request POST:/users/refresh/
   * @secure
   * @response `200` `UsersRefreshData`
   * @response `400` `void` 잘못된 요청 데이터
   * @response `401` `void` 유효하지 않은 Refresh 토큰
   */
  usersRefresh = (data: RefreshToken, params: RequestParams = {}) =>
    this.request<UsersRefreshData, void>({
      path: `/users/refresh/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 로그인한 사용자의 계정을 완전히 삭제합니다. Apple 로그인 사용자의 경우 Apple 서버에서도 토큰을 폐기합니다. 이 작업은 되돌릴 수 없습니다.
   *
   * @tags 사용자 관리
   * @name UsersWithdraw
   * @summary 사용자 계정 탈퇴
   * @request DELETE:/users/withdraw/
   * @secure
   * @response `200` `UsersWithdrawData`
   * @response `401` `void` 인증되지 않은 사용자
   * @response `500` `void` 내부 서버 오류
   */
  usersWithdraw = (params: RequestParams = {}) =>
    this.request<UsersWithdrawData, void>({
      path: `/users/withdraw/`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 소셜 로그인을 통해 사용자 인증을 처리합니다. 지원되는 제공업체: - google: Google OAuth 로그인 - native: 자체 계정 로그인 (개발용) 성공 시 JWT 토큰을 반환합니다.
   *
   * @tags 인증
   * @name UsersLoginCreate
   * @summary 소셜 로그인
   * @request POST:/users/{provider}/login/
   * @secure
   * @response `200` `UsersLoginCreateData`
   * @response `400` `void` 잘못된 요청 데이터 또는 인증 실패
   * @response `500` `void` 내부 서버 오류
   */
  usersLoginCreate = (
    { provider, ...query }: UsersLoginCreateParams,
    data: SocialLoginRequest,
    params: RequestParams = {},
  ) =>
    this.request<UsersLoginCreateData, void>({
      path: `/users/${provider}/login/`,
      method: "POST",
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
