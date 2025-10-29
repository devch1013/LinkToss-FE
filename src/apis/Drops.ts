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
  CommentCreate,
  CommentUpdate,
  DropCreate,
  DropsCommentsCreateData,
  DropsCommentsDeleteData,
  DropsCommentsDeleteParams,
  DropsCommentsListData,
  DropsCommentsListParams,
  DropsCommentsReadData,
  DropsCommentsReadParams,
  DropsCommentsRepliesData,
  DropsCommentsRepliesParams,
  DropsCommentsTreeData,
  DropsCommentsTreeParams,
  DropsCommentsUpdateData,
  DropsCommentsUpdateParams,
  DropsCreateData,
  DropsDeleteData,
  DropsDeleteParams,
  DropsListData,
  DropsListParams,
  DropsReadData,
  DropsReadParams,
  DropsSearchData,
  DropsSearchParams,
  DropsUpdateData,
  DropsUpdateParams,
  DropUpdate,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Drops<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 특정 deck의 drop 목록을 조회합니다.
   *
   * @tags drops
   * @name DropsList
   * @summary Drop 목록 조회
   * @request GET:/drops/
   * @secure
   * @response `200` `DropsListData`
   */
  dropsList = (query: DropsListParams, params: RequestParams = {}) =>
    this.request<DropsListData, any>({
      path: `/drops/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 새로운 drop을 생성합니다. 태그도 함께 생성할 수 있습니다.
   *
   * @tags drops
   * @name DropsCreate
   * @summary Drop 생성
   * @request POST:/drops/
   * @secure
   * @response `201` `DropsCreateData`
   * @response `400` `void` Bad request
   */
  dropsCreate = (data: DropCreate, params: RequestParams = {}) =>
    this.request<DropsCreateData, void>({
      path: `/drops/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 drop의 최상위 댓글 목록을 조회합니다.
   *
   * @tags drops
   * @name DropsCommentsList
   * @summary Comment 목록 조회
   * @request GET:/drops/comments/
   * @secure
   * @response `200` `DropsCommentsListData`
   */
  dropsCommentsList = (
    query: DropsCommentsListParams,
    params: RequestParams = {},
  ) =>
    this.request<DropsCommentsListData, any>({
      path: `/drops/comments/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 새로운 댓글을 생성합니다. parent를 지정하면 대댓글이 됩니다.
   *
   * @tags drops
   * @name DropsCommentsCreate
   * @summary Comment 생성
   * @request POST:/drops/comments/
   * @secure
   * @response `201` `DropsCommentsCreateData`
   * @response `400` `void` Bad request
   */
  dropsCommentsCreate = (data: CommentCreate, params: RequestParams = {}) =>
    this.request<DropsCommentsCreateData, void>({
      path: `/drops/comments/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 drop의 전체 댓글 트리를 재귀적으로 조회합니다.
   *
   * @tags drops
   * @name DropsCommentsTree
   * @summary Comment 트리 조회
   * @request GET:/drops/comments/tree/
   * @secure
   * @response `200` `DropsCommentsTreeData`
   */
  dropsCommentsTree = (
    query: DropsCommentsTreeParams,
    params: RequestParams = {},
  ) =>
    this.request<DropsCommentsTreeData, any>({
      path: `/drops/comments/tree/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 comment의 상세 정보를 조회합니다.
   *
   * @tags drops
   * @name DropsCommentsRead
   * @summary Comment 상세 조회
   * @request GET:/drops/comments/{id}/
   * @secure
   * @response `200` `DropsCommentsReadData`
   * @response `404` `void` Comment not found
   */
  dropsCommentsRead = (
    { id, ...query }: DropsCommentsReadParams,
    params: RequestParams = {},
  ) =>
    this.request<DropsCommentsReadData, void>({
      path: `/drops/comments/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 기존 댓글을 수정합니다. (본인 댓글만 가능)
   *
   * @tags drops
   * @name DropsCommentsUpdate
   * @summary Comment 수정
   * @request PUT:/drops/comments/{id}/
   * @secure
   * @response `200` `DropsCommentsUpdateData`
   * @response `400` `void` Bad request
   * @response `403` `void` Permission denied
   * @response `404` `void` Comment not found
   */
  dropsCommentsUpdate = (
    { id, ...query }: DropsCommentsUpdateParams,
    data: CommentUpdate,
    params: RequestParams = {},
  ) =>
    this.request<DropsCommentsUpdateData, void>({
      path: `/drops/comments/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 댓글을 soft delete합니다. (본인 댓글만 가능, 대댓글도 함께 삭제)
   *
   * @tags drops
   * @name DropsCommentsDelete
   * @summary Comment 삭제
   * @request DELETE:/drops/comments/{id}/
   * @secure
   * @response `204` `DropsCommentsDeleteData` Deleted successfully
   * @response `403` `void` Permission denied
   * @response `404` `void` Comment not found
   */
  dropsCommentsDelete = (
    { id, ...query }: DropsCommentsDeleteParams,
    params: RequestParams = {},
  ) =>
    this.request<DropsCommentsDeleteData, void>({
      path: `/drops/comments/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description 특정 댓글의 대댓글 목록을 조회합니다.
   *
   * @tags drops
   * @name DropsCommentsReplies
   * @summary Comment 대댓글 조회
   * @request GET:/drops/comments/{id}/replies/
   * @secure
   * @response `200` `DropsCommentsRepliesData`
   */
  dropsCommentsReplies = (
    { id, ...query }: DropsCommentsRepliesParams,
    params: RequestParams = {},
  ) =>
    this.request<DropsCommentsRepliesData, any>({
      path: `/drops/comments/${id}/replies/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 제목, 내용, 메모, 태그로 drop을 검색합니다.
   *
   * @tags drops
   * @name DropsSearch
   * @summary Drop 검색
   * @request GET:/drops/search/
   * @secure
   * @response `200` `DropsSearchData`
   */
  dropsSearch = (query: DropsSearchParams, params: RequestParams = {}) =>
    this.request<DropsSearchData, any>({
      path: `/drops/search/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 drop의 상세 정보를 조회합니다.
   *
   * @tags drops
   * @name DropsRead
   * @summary Drop 상세 조회
   * @request GET:/drops/{id}/
   * @secure
   * @response `200` `DropsReadData`
   * @response `404` `void` Drop not found
   */
  dropsRead = ({ id, ...query }: DropsReadParams, params: RequestParams = {}) =>
    this.request<DropsReadData, void>({
      path: `/drops/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 기존 drop을 수정합니다. 태그도 업데이트할 수 있습니다.
   *
   * @tags drops
   * @name DropsUpdate
   * @summary Drop 수정
   * @request PUT:/drops/{id}/
   * @secure
   * @response `200` `DropsUpdateData`
   * @response `400` `void` Bad request
   * @response `404` `void` Drop not found
   */
  dropsUpdate = (
    { id, ...query }: DropsUpdateParams,
    data: DropUpdate,
    params: RequestParams = {},
  ) =>
    this.request<DropsUpdateData, void>({
      path: `/drops/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description drop을 soft delete합니다.
   *
   * @tags drops
   * @name DropsDelete
   * @summary Drop 삭제
   * @request DELETE:/drops/{id}/
   * @secure
   * @response `204` `DropsDeleteData` Deleted successfully
   * @response `404` `void` Drop not found
   */
  dropsDelete = (
    { id, ...query }: DropsDeleteParams,
    params: RequestParams = {},
  ) =>
    this.request<DropsDeleteData, void>({
      path: `/drops/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
