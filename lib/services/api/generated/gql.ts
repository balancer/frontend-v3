/* eslint-disable */
import * as types from './graphql'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  'query GetPools($first: Int, $skip: Int, $orderBy: GqlPoolOrderBy, $orderDirection: GqlPoolOrderDirection, $where: GqlPoolFilter) {\n  pools: poolGetPools(\n    first: $first\n    skip: $skip\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    where: $where\n  ) {\n    ...GqlPoolMinimal\n  }\n  count: poolGetPoolsCount(\n    first: $first\n    skip: $skip\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    where: $where\n  )\n}\n\nfragment GqlPoolMinimal on GqlPoolMinimal {\n  address\n  allTokens {\n    address\n    weight\n  }\n  chain\n  createTime\n  decimals\n  displayTokens {\n    address\n  }\n  dynamicData {\n    totalLiquidity\n    lifetimeVolume\n    lifetimeSwapFees\n    volume24h\n    fees24h\n    holdersCount\n    swapFee\n    swapsCount\n    apr {\n      apr {\n        ... on GqlPoolAprTotal {\n          total\n        }\n        ... on GqlPoolAprRange {\n          min\n          max\n        }\n      }\n      hasRewardApr\n      thirdPartyApr {\n        ... on GqlPoolAprTotal {\n          total\n        }\n        ... on GqlPoolAprRange {\n          min\n          max\n        }\n      }\n      nativeRewardApr {\n        ... on GqlPoolAprTotal {\n          total\n        }\n        ... on GqlPoolAprRange {\n          min\n          max\n        }\n      }\n      swapApr\n      items {\n        id\n        title\n        apr {\n          ... on GqlPoolAprTotal {\n            total\n          }\n          ... on GqlPoolAprRange {\n            min\n            max\n          }\n        }\n        subItems {\n          id\n          title\n          apr {\n            ... on GqlPoolAprTotal {\n              total\n            }\n            ... on GqlPoolAprRange {\n              min\n              max\n            }\n          }\n        }\n      }\n    }\n  }\n  factory\n  id\n  name\n  owner\n  symbol\n  type\n}':
    types.GetPoolsDocument,
}

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetPools($first: Int, $skip: Int, $orderBy: GqlPoolOrderBy, $orderDirection: GqlPoolOrderDirection, $where: GqlPoolFilter) {\n  pools: poolGetPools(\n    first: $first\n    skip: $skip\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    where: $where\n  ) {\n    ...GqlPoolMinimal\n  }\n  count: poolGetPoolsCount(\n    first: $first\n    skip: $skip\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    where: $where\n  )\n}\n\nfragment GqlPoolMinimal on GqlPoolMinimal {\n  address\n  allTokens {\n    address\n    weight\n  }\n  chain\n  createTime\n  decimals\n  displayTokens {\n    address\n  }\n  dynamicData {\n    totalLiquidity\n    lifetimeVolume\n    lifetimeSwapFees\n    volume24h\n    fees24h\n    holdersCount\n    swapFee\n    swapsCount\n    apr {\n      apr {\n        ... on GqlPoolAprTotal {\n          total\n        }\n        ... on GqlPoolAprRange {\n          min\n          max\n        }\n      }\n      hasRewardApr\n      thirdPartyApr {\n        ... on GqlPoolAprTotal {\n          total\n        }\n        ... on GqlPoolAprRange {\n          min\n          max\n        }\n      }\n      nativeRewardApr {\n        ... on GqlPoolAprTotal {\n          total\n        }\n        ... on GqlPoolAprRange {\n          min\n          max\n        }\n      }\n      swapApr\n      items {\n        id\n        title\n        apr {\n          ... on GqlPoolAprTotal {\n            total\n          }\n          ... on GqlPoolAprRange {\n            min\n            max\n          }\n        }\n        subItems {\n          id\n          title\n          apr {\n            ... on GqlPoolAprTotal {\n              total\n            }\n            ... on GqlPoolAprRange {\n              min\n              max\n            }\n          }\n        }\n      }\n    }\n  }\n  factory\n  id\n  name\n  owner\n  symbol\n  type\n}'
): (typeof documents)['query GetPools($first: Int, $skip: Int, $orderBy: GqlPoolOrderBy, $orderDirection: GqlPoolOrderDirection, $where: GqlPoolFilter) {\n  pools: poolGetPools(\n    first: $first\n    skip: $skip\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    where: $where\n  ) {\n    ...GqlPoolMinimal\n  }\n  count: poolGetPoolsCount(\n    first: $first\n    skip: $skip\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    where: $where\n  )\n}\n\nfragment GqlPoolMinimal on GqlPoolMinimal {\n  address\n  allTokens {\n    address\n    weight\n  }\n  chain\n  createTime\n  decimals\n  displayTokens {\n    address\n  }\n  dynamicData {\n    totalLiquidity\n    lifetimeVolume\n    lifetimeSwapFees\n    volume24h\n    fees24h\n    holdersCount\n    swapFee\n    swapsCount\n    apr {\n      apr {\n        ... on GqlPoolAprTotal {\n          total\n        }\n        ... on GqlPoolAprRange {\n          min\n          max\n        }\n      }\n      hasRewardApr\n      thirdPartyApr {\n        ... on GqlPoolAprTotal {\n          total\n        }\n        ... on GqlPoolAprRange {\n          min\n          max\n        }\n      }\n      nativeRewardApr {\n        ... on GqlPoolAprTotal {\n          total\n        }\n        ... on GqlPoolAprRange {\n          min\n          max\n        }\n      }\n      swapApr\n      items {\n        id\n        title\n        apr {\n          ... on GqlPoolAprTotal {\n            total\n          }\n          ... on GqlPoolAprRange {\n            min\n            max\n          }\n        }\n        subItems {\n          id\n          title\n          apr {\n            ... on GqlPoolAprTotal {\n              total\n            }\n            ... on GqlPoolAprRange {\n              min\n              max\n            }\n          }\n        }\n      }\n    }\n  }\n  factory\n  id\n  name\n  owner\n  symbol\n  type\n}']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
