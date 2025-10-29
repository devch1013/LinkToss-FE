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
  DeckCreate,
  DecksCreateData,
  DecksDeleteData,
  DecksDeleteParams,
  DecksListData,
  DecksListParams,
  DecksReadData,
  DecksReadParams,
  DecksTreeData,
  DecksTreeParams,
  DecksUpdateData,
  DecksUpdateParams,
  DeckUpdate,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Decks<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 사용자의 deck 목록을 조회합니다. parent 파라미터로 특정 deck의 children만 조회 가능합니다.
   *
   * @tags decks
   * @name DecksList
   * @summary Deck 목록 조회
   * @request GET:/decks/
   * @secure
   * @response `200` `DecksListData`
   */
  decksList = (query: DecksListParams, params: RequestParams = {}) =>
    this.request<DecksListData, any>({
      path: `/decks/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 새로운 deck을 생성합니다.
   *
   * @tags decks
   * @name DecksCreate
   * @summary Deck 생성
   * @request POST:/decks/
   * @secure
   * @response `201` `DecksCreateData`
   * @response `400` `void` Bad request
   */
  decksCreate = (data: DeckCreate, params: RequestParams = {}) =>
    this.request<DecksCreateData, void>({
      path: `/decks/`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Deck의 전체 트리 구조를 재귀적으로 조회합니다.
   *
   * @tags decks
   * @name DecksTree
   * @summary Deck 트리 조회
   * @request GET:/decks/tree/
   * @secure
   * @response `200` `DecksTreeData`
   */
  decksTree = (query: DecksTreeParams, params: RequestParams = {}) =>
    this.request<DecksTreeData, any>({
      path: `/decks/tree/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 deck의 상세 정보를 조회합니다.
   *
   * @tags decks
   * @name DecksRead
   * @summary Deck 상세 조회
   * @request GET:/decks/{id}/
   * @secure
   * @response `200` `DecksReadData`
   * @response `404` `void` Deck not found
   */
  decksRead = ({ id, ...query }: DecksReadParams, params: RequestParams = {}) =>
    this.request<DecksReadData, void>({
      path: `/decks/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 기존 deck을 수정합니다.
   *
   * @tags decks
   * @name DecksUpdate
   * @summary Deck 수정
   * @request PUT:/decks/{id}/
   * @secure
   * @response `200` `DecksUpdateData`
   * @response `400` `void` Bad request
   * @response `404` `void` Deck not found
   */
  decksUpdate = (
    { id, ...query }: DecksUpdateParams,
    data: DeckUpdate,
    params: RequestParams = {},
  ) =>
    this.request<DecksUpdateData, void>({
      path: `/decks/${id}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description deck을 soft delete합니다. 하위 children도 함께 삭제됩니다.
   *
   * @tags decks
   * @name DecksDelete
   * @summary Deck 삭제
   * @request DELETE:/decks/{id}/
   * @secure
   * @response `204` `DecksDeleteData` Deleted successfully
   * @response `404` `void` Deck not found
   */
  decksDelete = (
    { id, ...query }: DecksDeleteParams,
    params: RequestParams = {},
  ) =>
    this.request<DecksDeleteData, void>({
      path: `/decks/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
