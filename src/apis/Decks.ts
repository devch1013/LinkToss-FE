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
  DecksDecksCreateData,
  DecksDecksDeleteData,
  DecksDecksDeleteParams,
  DecksDecksListData,
  DecksDecksListParams,
  DecksDecksReadData,
  DecksDecksReadParams,
  DecksDecksTreeData,
  DecksDecksTreeParams,
  DecksDecksUpdateData,
  DecksDecksUpdateParams,
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
   * @name DecksDecksList
   * @summary Deck 목록 조회
   * @request GET:/decks/decks/
   * @secure
   * @response `200` `DecksDecksListData`
   */
  decksDecksList = (query: DecksDecksListParams, params: RequestParams = {}) =>
    this.request<DecksDecksListData, any>({
      path: `/decks/decks/`,
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
   * @name DecksDecksCreate
   * @summary Deck 생성
   * @request POST:/decks/decks/
   * @secure
   * @response `201` `DecksDecksCreateData`
   * @response `400` `void` Bad request
   */
  decksDecksCreate = (data: DeckCreate, params: RequestParams = {}) =>
    this.request<DecksDecksCreateData, void>({
      path: `/decks/decks/`,
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
   * @name DecksDecksTree
   * @summary Deck 트리 조회
   * @request GET:/decks/decks/tree/
   * @secure
   * @response `200` `DecksDecksTreeData`
   */
  decksDecksTree = (query: DecksDecksTreeParams, params: RequestParams = {}) =>
    this.request<DecksDecksTreeData, any>({
      path: `/decks/decks/tree/`,
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
   * @name DecksDecksRead
   * @summary Deck 상세 조회
   * @request GET:/decks/decks/{id}/
   * @secure
   * @response `200` `DecksDecksReadData`
   * @response `404` `void` Deck not found
   */
  decksDecksRead = (
    { id, ...query }: DecksDecksReadParams,
    params: RequestParams = {},
  ) =>
    this.request<DecksDecksReadData, void>({
      path: `/decks/decks/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 기존 deck을 수정합니다.
   *
   * @tags decks
   * @name DecksDecksUpdate
   * @summary Deck 수정
   * @request PUT:/decks/decks/{id}/
   * @secure
   * @response `200` `DecksDecksUpdateData`
   * @response `400` `void` Bad request
   * @response `404` `void` Deck not found
   */
  decksDecksUpdate = (
    { id, ...query }: DecksDecksUpdateParams,
    data: DeckUpdate,
    params: RequestParams = {},
  ) =>
    this.request<DecksDecksUpdateData, void>({
      path: `/decks/decks/${id}/`,
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
   * @name DecksDecksDelete
   * @summary Deck 삭제
   * @request DELETE:/decks/decks/{id}/
   * @secure
   * @response `204` `DecksDecksDeleteData` Deleted successfully
   * @response `404` `void` Deck not found
   */
  decksDecksDelete = (
    { id, ...query }: DecksDecksDeleteParams,
    params: RequestParams = {},
  ) =>
    this.request<DecksDecksDeleteData, void>({
      path: `/decks/decks/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
