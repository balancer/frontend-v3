/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never
}
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  AmountHumanReadable: { input: string; output: string }
  BigDecimal: { input: string; output: string }
  BigInt: { input: string; output: string }
  Bytes: { input: string; output: string }
  Date: { input: any; output: any }
  GqlBigNumber: { input: string; output: string }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any }
}

export type GqlBalancePoolAprItem = {
  __typename: 'GqlBalancePoolAprItem'
  apr: GqlPoolAprValue
  id: Scalars['ID']['output']
  subItems?: Maybe<Array<GqlBalancePoolAprSubItem>>
  title: Scalars['String']['output']
}

export type GqlBalancePoolAprSubItem = {
  __typename: 'GqlBalancePoolAprSubItem'
  apr: GqlPoolAprValue
  id: Scalars['ID']['output']
  title: Scalars['String']['output']
}

export enum GqlChain {
  Arbitrum = 'ARBITRUM',
  Avalanche = 'AVALANCHE',
  Base = 'BASE',
  Fantom = 'FANTOM',
  Gnosis = 'GNOSIS',
  Mainnet = 'MAINNET',
  Optimism = 'OPTIMISM',
  Polygon = 'POLYGON',
  Zkevm = 'ZKEVM',
}

export type GqlContentNewsItem = {
  __typename: 'GqlContentNewsItem'
  discussionUrl?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  image?: Maybe<Scalars['String']['output']>
  source: GqlContentNewsItemSource
  text: Scalars['String']['output']
  timestamp: Scalars['String']['output']
  url: Scalars['String']['output']
}

export enum GqlContentNewsItemSource {
  Discord = 'discord',
  Medium = 'medium',
  Twitter = 'twitter',
}

export type GqlCowSwapApiResponse = {
  __typename: 'GqlCowSwapApiResponse'
  returnAmount: Scalars['String']['output']
  swapAmount: Scalars['String']['output']
  swaps: Array<GqlSwap>
  tokenAddresses: Array<Scalars['String']['output']>
  tokenIn: Scalars['String']['output']
  tokenOut: Scalars['String']['output']
}

export type GqlFeaturePoolGroupItemExternalLink = {
  __typename: 'GqlFeaturePoolGroupItemExternalLink'
  buttonText: Scalars['String']['output']
  buttonUrl: Scalars['String']['output']
  id: Scalars['ID']['output']
  image: Scalars['String']['output']
}

/** Configuration options for SOR V2 */
export type GqlGraphTraversalConfigInput = {
  /**
   * Max number of paths to return (can be less)
   *
   * Default: 5
   */
  approxPathsToReturn?: InputMaybe<Scalars['Int']['input']>
  /**
   * The max hops in a path.
   *
   * Default: 6
   */
  maxDepth?: InputMaybe<Scalars['Int']['input']>
  /**
   * Limit non boosted hop tokens in a boosted path.
   *
   * Default: 2
   */
  maxNonBoostedHopTokensInBoostedPath?: InputMaybe<Scalars['Int']['input']>
  /**
   * Limit of "non-boosted" pools for efficiency.
   *
   * Default: 6
   */
  maxNonBoostedPathDepth?: InputMaybe<Scalars['Int']['input']>
  poolIdsToInclude?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export type GqlHistoricalTokenPrice = {
  __typename: 'GqlHistoricalTokenPrice'
  address: Scalars['String']['output']
  prices: Array<GqlHistoricalTokenPriceEntry>
}

export type GqlHistoricalTokenPriceEntry = {
  __typename: 'GqlHistoricalTokenPriceEntry'
  price: Scalars['Float']['output']
  timestamp: Scalars['String']['output']
}

export type GqlLatestSyncedBlocks = {
  __typename: 'GqlLatestSyncedBlocks'
  poolSyncBlock: Scalars['BigInt']['output']
  userStakeSyncBlock: Scalars['BigInt']['output']
  userWalletSyncBlock: Scalars['BigInt']['output']
}

export type GqlPoolApr = {
  __typename: 'GqlPoolApr'
  apr: GqlPoolAprValue
  hasRewardApr: Scalars['Boolean']['output']
  items: Array<GqlBalancePoolAprItem>
  nativeRewardApr: GqlPoolAprValue
  swapApr: Scalars['BigDecimal']['output']
  thirdPartyApr: GqlPoolAprValue
}

export type GqlPoolAprRange = {
  __typename: 'GqlPoolAprRange'
  max: Scalars['BigDecimal']['output']
  min: Scalars['BigDecimal']['output']
}

export type GqlPoolAprTotal = {
  __typename: 'GqlPoolAprTotal'
  total: Scalars['BigDecimal']['output']
}

export type GqlPoolAprValue = GqlPoolAprRange | GqlPoolAprTotal

export type GqlPoolBase = {
  address: Scalars['Bytes']['output']
  allTokens: Array<GqlPoolTokenExpanded>
  chain: GqlChain
  createTime: Scalars['Int']['output']
  decimals: Scalars['Int']['output']
  displayTokens: Array<GqlPoolTokenDisplay>
  dynamicData: GqlPoolDynamicData
  factory?: Maybe<Scalars['Bytes']['output']>
  id: Scalars['ID']['output']
  investConfig: GqlPoolInvestConfig
  name: Scalars['String']['output']
  owner?: Maybe<Scalars['Bytes']['output']>
  staking?: Maybe<GqlPoolStaking>
  symbol: Scalars['String']['output']
  type: GqlPoolType
  userBalance?: Maybe<GqlPoolUserBalance>
  version: Scalars['Int']['output']
  withdrawConfig: GqlPoolWithdrawConfig
}

export type GqlPoolBatchSwap = {
  __typename: 'GqlPoolBatchSwap'
  chain: GqlChain
  id: Scalars['ID']['output']
  swaps: Array<GqlPoolBatchSwapSwap>
  timestamp: Scalars['Int']['output']
  tokenAmountIn: Scalars['String']['output']
  tokenAmountOut: Scalars['String']['output']
  tokenIn: Scalars['String']['output']
  tokenInPrice: Scalars['Float']['output']
  tokenOut: Scalars['String']['output']
  tokenOutPrice: Scalars['Float']['output']
  tx: Scalars['String']['output']
  userAddress: Scalars['String']['output']
  valueUSD: Scalars['Float']['output']
}

export type GqlPoolBatchSwapPool = {
  __typename: 'GqlPoolBatchSwapPool'
  id: Scalars['ID']['output']
  tokens: Array<Scalars['String']['output']>
}

export type GqlPoolBatchSwapSwap = {
  __typename: 'GqlPoolBatchSwapSwap'
  id: Scalars['ID']['output']
  pool: GqlPoolMinimal
  timestamp: Scalars['Int']['output']
  tokenAmountIn: Scalars['String']['output']
  tokenAmountOut: Scalars['String']['output']
  tokenIn: Scalars['String']['output']
  tokenOut: Scalars['String']['output']
  tx: Scalars['String']['output']
  userAddress: Scalars['String']['output']
  valueUSD: Scalars['Float']['output']
}

export type GqlPoolComposableStable = GqlPoolBase & {
  __typename: 'GqlPoolComposableStable'
  address: Scalars['Bytes']['output']
  allTokens: Array<GqlPoolTokenExpanded>
  amp: Scalars['BigInt']['output']
  bptPriceRate: Scalars['BigDecimal']['output']
  chain: GqlChain
  createTime: Scalars['Int']['output']
  decimals: Scalars['Int']['output']
  displayTokens: Array<GqlPoolTokenDisplay>
  dynamicData: GqlPoolDynamicData
  factory?: Maybe<Scalars['Bytes']['output']>
  id: Scalars['ID']['output']
  investConfig: GqlPoolInvestConfig
  name: Scalars['String']['output']
  nestingType: GqlPoolNestingType
  owner: Scalars['Bytes']['output']
  staking?: Maybe<GqlPoolStaking>
  symbol: Scalars['String']['output']
  tokens: Array<GqlPoolTokenUnion>
  type: GqlPoolType
  userBalance?: Maybe<GqlPoolUserBalance>
  version: Scalars['Int']['output']
  withdrawConfig: GqlPoolWithdrawConfig
}

export type GqlPoolComposableStableNested = {
  __typename: 'GqlPoolComposableStableNested'
  address: Scalars['Bytes']['output']
  amp: Scalars['BigInt']['output']
  bptPriceRate: Scalars['BigDecimal']['output']
  createTime: Scalars['Int']['output']
  factory?: Maybe<Scalars['Bytes']['output']>
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  nestingType: GqlPoolNestingType
  owner: Scalars['Bytes']['output']
  swapFee: Scalars['BigDecimal']['output']
  symbol: Scalars['String']['output']
  tokens: Array<GqlPoolTokenComposableStableNestedUnion>
  totalLiquidity: Scalars['BigDecimal']['output']
  totalShares: Scalars['BigDecimal']['output']
  type: GqlPoolType
  version: Scalars['Int']['output']
}

export type GqlPoolDynamicData = {
  __typename: 'GqlPoolDynamicData'
  apr: GqlPoolApr
  fees24h: Scalars['BigDecimal']['output']
  fees24hAth: Scalars['BigDecimal']['output']
  fees24hAthTimestamp: Scalars['Int']['output']
  fees24hAtl: Scalars['BigDecimal']['output']
  fees24hAtlTimestamp: Scalars['Int']['output']
  fees48h: Scalars['BigDecimal']['output']
  holdersCount: Scalars['BigInt']['output']
  lifetimeSwapFees: Scalars['BigDecimal']['output']
  lifetimeVolume: Scalars['BigDecimal']['output']
  poolId: Scalars['ID']['output']
  sharePriceAth: Scalars['BigDecimal']['output']
  sharePriceAthTimestamp: Scalars['Int']['output']
  sharePriceAtl: Scalars['BigDecimal']['output']
  sharePriceAtlTimestamp: Scalars['Int']['output']
  swapEnabled: Scalars['Boolean']['output']
  swapFee: Scalars['BigDecimal']['output']
  swapsCount: Scalars['BigInt']['output']
  totalLiquidity: Scalars['BigDecimal']['output']
  totalLiquidity24hAgo: Scalars['BigDecimal']['output']
  totalLiquidityAth: Scalars['BigDecimal']['output']
  totalLiquidityAthTimestamp: Scalars['Int']['output']
  totalLiquidityAtl: Scalars['BigDecimal']['output']
  totalLiquidityAtlTimestamp: Scalars['Int']['output']
  totalShares: Scalars['BigDecimal']['output']
  totalShares24hAgo: Scalars['BigDecimal']['output']
  volume24h: Scalars['BigDecimal']['output']
  volume24hAth: Scalars['BigDecimal']['output']
  volume24hAthTimestamp: Scalars['Int']['output']
  volume24hAtl: Scalars['BigDecimal']['output']
  volume24hAtlTimestamp: Scalars['Int']['output']
  volume48h: Scalars['BigDecimal']['output']
  yieldCapture24h: Scalars['BigDecimal']['output']
  yieldCapture48h: Scalars['BigDecimal']['output']
}

export type GqlPoolElement = GqlPoolBase & {
  __typename: 'GqlPoolElement'
  address: Scalars['Bytes']['output']
  allTokens: Array<GqlPoolTokenExpanded>
  baseToken: Scalars['Bytes']['output']
  chain: GqlChain
  createTime: Scalars['Int']['output']
  decimals: Scalars['Int']['output']
  displayTokens: Array<GqlPoolTokenDisplay>
  dynamicData: GqlPoolDynamicData
  factory?: Maybe<Scalars['Bytes']['output']>
  id: Scalars['ID']['output']
  investConfig: GqlPoolInvestConfig
  name: Scalars['String']['output']
  owner: Scalars['Bytes']['output']
  principalToken: Scalars['Bytes']['output']
  staking?: Maybe<GqlPoolStaking>
  symbol: Scalars['String']['output']
  tokens: Array<GqlPoolToken>
  type: GqlPoolType
  unitSeconds: Scalars['BigInt']['output']
  userBalance?: Maybe<GqlPoolUserBalance>
  version: Scalars['Int']['output']
  withdrawConfig: GqlPoolWithdrawConfig
}

export type GqlPoolFeaturedPool = {
  __typename: 'GqlPoolFeaturedPool'
  pool: GqlPoolBase
  poolId: Scalars['ID']['output']
  primary: Scalars['Boolean']['output']
}

export type GqlPoolFeaturedPoolGroup = {
  __typename: 'GqlPoolFeaturedPoolGroup'
  chain: GqlChain
  icon: Scalars['String']['output']
  id: Scalars['ID']['output']
  items: Array<GqlPoolFeaturedPoolGroupItem>
  primary?: Maybe<Scalars['Boolean']['output']>
  title: Scalars['String']['output']
}

export type GqlPoolFeaturedPoolGroupItem = GqlFeaturePoolGroupItemExternalLink | GqlPoolMinimal

export type GqlPoolFilter = {
  categoryIn?: InputMaybe<Array<GqlPoolFilterCategory>>
  categoryNotIn?: InputMaybe<Array<GqlPoolFilterCategory>>
  chainIn?: InputMaybe<Array<GqlChain>>
  chainNotIn?: InputMaybe<Array<GqlChain>>
  createTime?: InputMaybe<GqlPoolTimePeriod>
  filterIn?: InputMaybe<Array<Scalars['String']['input']>>
  filterNotIn?: InputMaybe<Array<Scalars['String']['input']>>
  idIn?: InputMaybe<Array<Scalars['String']['input']>>
  idNotIn?: InputMaybe<Array<Scalars['String']['input']>>
  poolTypeIn?: InputMaybe<Array<GqlPoolType>>
  poolTypeNotIn?: InputMaybe<Array<GqlPoolType>>
  tokensIn?: InputMaybe<Array<Scalars['String']['input']>>
  tokensNotIn?: InputMaybe<Array<Scalars['String']['input']>>
  userAddress?: InputMaybe<Scalars['String']['input']>
}

export enum GqlPoolFilterCategory {
  BlackListed = 'BLACK_LISTED',
  Incentivized = 'INCENTIVIZED',
}

export type GqlPoolFilterDefinition = {
  __typename: 'GqlPoolFilterDefinition'
  id: Scalars['ID']['output']
  title: Scalars['String']['output']
}

export type GqlPoolGyro = GqlPoolBase & {
  __typename: 'GqlPoolGyro'
  address: Scalars['Bytes']['output']
  allTokens: Array<GqlPoolTokenExpanded>
  alpha: Scalars['String']['output']
  beta: Scalars['String']['output']
  c: Scalars['String']['output']
  chain: GqlChain
  createTime: Scalars['Int']['output']
  dSq: Scalars['String']['output']
  decimals: Scalars['Int']['output']
  displayTokens: Array<GqlPoolTokenDisplay>
  dynamicData: GqlPoolDynamicData
  factory?: Maybe<Scalars['Bytes']['output']>
  id: Scalars['ID']['output']
  investConfig: GqlPoolInvestConfig
  lambda: Scalars['String']['output']
  name: Scalars['String']['output']
  nestingType: GqlPoolNestingType
  owner: Scalars['Bytes']['output']
  root3Alpha: Scalars['String']['output']
  s: Scalars['String']['output']
  sqrtAlpha: Scalars['String']['output']
  sqrtBeta: Scalars['String']['output']
  staking?: Maybe<GqlPoolStaking>
  symbol: Scalars['String']['output']
  tauAlphaX: Scalars['String']['output']
  tauAlphaY: Scalars['String']['output']
  tauBetaX: Scalars['String']['output']
  tauBetaY: Scalars['String']['output']
  tokens: Array<GqlPoolTokenUnion>
  type: GqlPoolType
  u: Scalars['String']['output']
  userBalance?: Maybe<GqlPoolUserBalance>
  v: Scalars['String']['output']
  version: Scalars['Int']['output']
  w: Scalars['String']['output']
  withdrawConfig: GqlPoolWithdrawConfig
  z: Scalars['String']['output']
}

export type GqlPoolInvestConfig = {
  __typename: 'GqlPoolInvestConfig'
  options: Array<GqlPoolInvestOption>
  proportionalEnabled: Scalars['Boolean']['output']
  singleAssetEnabled: Scalars['Boolean']['output']
}

export type GqlPoolInvestOption = {
  __typename: 'GqlPoolInvestOption'
  poolTokenAddress: Scalars['String']['output']
  poolTokenIndex: Scalars['Int']['output']
  tokenOptions: Array<GqlPoolToken>
}

export type GqlPoolJoinExit = {
  __typename: 'GqlPoolJoinExit'
  amounts: Array<GqlPoolJoinExitAmount>
  chain: GqlChain
  id: Scalars['ID']['output']
  poolId: Scalars['String']['output']
  sender: Scalars['String']['output']
  timestamp: Scalars['Int']['output']
  tx: Scalars['String']['output']
  type: GqlPoolJoinExitType
  valueUSD?: Maybe<Scalars['String']['output']>
}

export type GqlPoolJoinExitAmount = {
  __typename: 'GqlPoolJoinExitAmount'
  address: Scalars['String']['output']
  amount: Scalars['String']['output']
}

export type GqlPoolJoinExitFilter = {
  chainIn?: InputMaybe<Array<GqlChain>>
  poolIdIn?: InputMaybe<Array<Scalars['String']['input']>>
}

export enum GqlPoolJoinExitType {
  Exit = 'Exit',
  Join = 'Join',
}

export type GqlPoolLinear = GqlPoolBase & {
  __typename: 'GqlPoolLinear'
  address: Scalars['Bytes']['output']
  allTokens: Array<GqlPoolTokenExpanded>
  bptPriceRate: Scalars['BigDecimal']['output']
  chain: GqlChain
  createTime: Scalars['Int']['output']
  decimals: Scalars['Int']['output']
  displayTokens: Array<GqlPoolTokenDisplay>
  dynamicData: GqlPoolDynamicData
  factory?: Maybe<Scalars['Bytes']['output']>
  id: Scalars['ID']['output']
  investConfig: GqlPoolInvestConfig
  lowerTarget: Scalars['BigInt']['output']
  mainIndex: Scalars['Int']['output']
  name: Scalars['String']['output']
  owner: Scalars['Bytes']['output']
  staking?: Maybe<GqlPoolStaking>
  symbol: Scalars['String']['output']
  tokens: Array<GqlPoolToken>
  type: GqlPoolType
  upperTarget: Scalars['BigInt']['output']
  userBalance?: Maybe<GqlPoolUserBalance>
  version: Scalars['Int']['output']
  withdrawConfig: GqlPoolWithdrawConfig
  wrappedIndex: Scalars['Int']['output']
}

export type GqlPoolLinearNested = {
  __typename: 'GqlPoolLinearNested'
  address: Scalars['Bytes']['output']
  bptPriceRate: Scalars['BigDecimal']['output']
  createTime: Scalars['Int']['output']
  factory?: Maybe<Scalars['Bytes']['output']>
  id: Scalars['ID']['output']
  lowerTarget: Scalars['BigInt']['output']
  mainIndex: Scalars['Int']['output']
  name: Scalars['String']['output']
  owner: Scalars['Bytes']['output']
  symbol: Scalars['String']['output']
  tokens: Array<GqlPoolToken>
  totalLiquidity: Scalars['BigDecimal']['output']
  totalShares: Scalars['BigDecimal']['output']
  type: GqlPoolType
  upperTarget: Scalars['BigInt']['output']
  version: Scalars['Int']['output']
  wrappedIndex: Scalars['Int']['output']
}

export type GqlPoolLinearPoolData = {
  __typename: 'GqlPoolLinearPoolData'
  address: Scalars['String']['output']
  balance: Scalars['String']['output']
  id: Scalars['ID']['output']
  mainToken: GqlPoolLinearPoolMainToken
  mainTokenTotalBalance: Scalars['String']['output']
  poolToken: Scalars['String']['output']
  priceRate: Scalars['String']['output']
  symbol: Scalars['String']['output']
  totalSupply: Scalars['String']['output']
  unwrappedTokenAddress: Scalars['String']['output']
  wrappedToken: GqlPoolLinearPoolWrappedToken
}

export type GqlPoolLinearPoolMainToken = {
  __typename: 'GqlPoolLinearPoolMainToken'
  address: Scalars['String']['output']
  balance: Scalars['String']['output']
  decimals: Scalars['Int']['output']
  index: Scalars['Int']['output']
  name: Scalars['String']['output']
  symbol: Scalars['String']['output']
  totalSupply: Scalars['String']['output']
}

export type GqlPoolLinearPoolWrappedToken = {
  __typename: 'GqlPoolLinearPoolWrappedToken'
  address: Scalars['String']['output']
  balance: Scalars['String']['output']
  decimals: Scalars['Int']['output']
  index: Scalars['Int']['output']
  name: Scalars['String']['output']
  priceRate: Scalars['String']['output']
  symbol: Scalars['String']['output']
  totalSupply: Scalars['String']['output']
}

export type GqlPoolLiquidityBootstrapping = GqlPoolBase & {
  __typename: 'GqlPoolLiquidityBootstrapping'
  address: Scalars['Bytes']['output']
  allTokens: Array<GqlPoolTokenExpanded>
  chain: GqlChain
  createTime: Scalars['Int']['output']
  decimals: Scalars['Int']['output']
  displayTokens: Array<GqlPoolTokenDisplay>
  dynamicData: GqlPoolDynamicData
  factory?: Maybe<Scalars['Bytes']['output']>
  id: Scalars['ID']['output']
  investConfig: GqlPoolInvestConfig
  name: Scalars['String']['output']
  nestingType: GqlPoolNestingType
  owner: Scalars['Bytes']['output']
  staking?: Maybe<GqlPoolStaking>
  symbol: Scalars['String']['output']
  tokens: Array<GqlPoolTokenUnion>
  type: GqlPoolType
  userBalance?: Maybe<GqlPoolUserBalance>
  version: Scalars['Int']['output']
  withdrawConfig: GqlPoolWithdrawConfig
}

export type GqlPoolMetaStable = GqlPoolBase & {
  __typename: 'GqlPoolMetaStable'
  address: Scalars['Bytes']['output']
  allTokens: Array<GqlPoolTokenExpanded>
  amp: Scalars['BigInt']['output']
  chain: GqlChain
  createTime: Scalars['Int']['output']
  decimals: Scalars['Int']['output']
  displayTokens: Array<GqlPoolTokenDisplay>
  dynamicData: GqlPoolDynamicData
  factory?: Maybe<Scalars['Bytes']['output']>
  id: Scalars['ID']['output']
  investConfig: GqlPoolInvestConfig
  name: Scalars['String']['output']
  owner: Scalars['Bytes']['output']
  staking?: Maybe<GqlPoolStaking>
  symbol: Scalars['String']['output']
  tokens: Array<GqlPoolToken>
  type: GqlPoolType
  userBalance?: Maybe<GqlPoolUserBalance>
  version: Scalars['Int']['output']
  withdrawConfig: GqlPoolWithdrawConfig
}

export type GqlPoolMinimal = {
  __typename: 'GqlPoolMinimal'
  address: Scalars['Bytes']['output']
  allTokens: Array<GqlPoolTokenExpanded>
  chain: GqlChain
  createTime: Scalars['Int']['output']
  decimals: Scalars['Int']['output']
  displayTokens: Array<GqlPoolTokenDisplay>
  dynamicData: GqlPoolDynamicData
  factory?: Maybe<Scalars['Bytes']['output']>
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  owner?: Maybe<Scalars['Bytes']['output']>
  staking?: Maybe<GqlPoolStaking>
  symbol: Scalars['String']['output']
  type: GqlPoolType
  userBalance?: Maybe<GqlPoolUserBalance>
  version: Scalars['Int']['output']
}

export type GqlPoolNestedUnion = GqlPoolComposableStableNested | GqlPoolLinearNested

export enum GqlPoolNestingType {
  HasOnlyPhantomBpt = 'HAS_ONLY_PHANTOM_BPT',
  HasSomePhantomBpt = 'HAS_SOME_PHANTOM_BPT',
  NoNesting = 'NO_NESTING',
}

export enum GqlPoolOrderBy {
  Apr = 'apr',
  Fees24h = 'fees24h',
  TotalLiquidity = 'totalLiquidity',
  TotalShares = 'totalShares',
  UserbalanceUsd = 'userbalanceUsd',
  Volume24h = 'volume24h',
}

export enum GqlPoolOrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type GqlPoolSnapshot = {
  __typename: 'GqlPoolSnapshot'
  amounts: Array<Scalars['String']['output']>
  chain: GqlChain
  fees24h: Scalars['String']['output']
  holdersCount: Scalars['String']['output']
  id: Scalars['ID']['output']
  poolId: Scalars['String']['output']
  sharePrice: Scalars['String']['output']
  swapsCount: Scalars['String']['output']
  timestamp: Scalars['Int']['output']
  totalLiquidity: Scalars['String']['output']
  totalShares: Scalars['String']['output']
  totalSwapFee: Scalars['String']['output']
  totalSwapVolume: Scalars['String']['output']
  volume24h: Scalars['String']['output']
}

export enum GqlPoolSnapshotDataRange {
  AllTime = 'ALL_TIME',
  NinetyDays = 'NINETY_DAYS',
  OneHundredEightyDays = 'ONE_HUNDRED_EIGHTY_DAYS',
  OneYear = 'ONE_YEAR',
  ThirtyDays = 'THIRTY_DAYS',
}

export type GqlPoolStable = GqlPoolBase & {
  __typename: 'GqlPoolStable'
  address: Scalars['Bytes']['output']
  allTokens: Array<GqlPoolTokenExpanded>
  amp: Scalars['BigInt']['output']
  chain: GqlChain
  createTime: Scalars['Int']['output']
  decimals: Scalars['Int']['output']
  displayTokens: Array<GqlPoolTokenDisplay>
  dynamicData: GqlPoolDynamicData
  factory?: Maybe<Scalars['Bytes']['output']>
  id: Scalars['ID']['output']
  investConfig: GqlPoolInvestConfig
  name: Scalars['String']['output']
  owner: Scalars['Bytes']['output']
  staking?: Maybe<GqlPoolStaking>
  symbol: Scalars['String']['output']
  tokens: Array<GqlPoolToken>
  type: GqlPoolType
  userBalance?: Maybe<GqlPoolUserBalance>
  version: Scalars['Int']['output']
  withdrawConfig: GqlPoolWithdrawConfig
}

export type GqlPoolStableComposablePoolData = {
  __typename: 'GqlPoolStableComposablePoolData'
  address: Scalars['String']['output']
  balance: Scalars['String']['output']
  id: Scalars['ID']['output']
  symbol: Scalars['String']['output']
  tokens: Array<GqlPoolToken>
  totalSupply: Scalars['String']['output']
}

export type GqlPoolStaking = {
  __typename: 'GqlPoolStaking'
  address: Scalars['String']['output']
  chain: GqlChain
  farm?: Maybe<GqlPoolStakingMasterChefFarm>
  gauge?: Maybe<GqlPoolStakingGauge>
  id: Scalars['ID']['output']
  reliquary?: Maybe<GqlPoolStakingReliquaryFarm>
  type: GqlPoolStakingType
}

export type GqlPoolStakingFarmRewarder = {
  __typename: 'GqlPoolStakingFarmRewarder'
  address: Scalars['String']['output']
  id: Scalars['ID']['output']
  rewardPerSecond: Scalars['String']['output']
  tokenAddress: Scalars['String']['output']
}

export type GqlPoolStakingGauge = {
  __typename: 'GqlPoolStakingGauge'
  gaugeAddress: Scalars['String']['output']
  id: Scalars['ID']['output']
  otherGauges?: Maybe<Array<GqlPoolStakingOtherGauge>>
  rewards: Array<GqlPoolStakingGaugeReward>
  status: GqlPoolStakingGaugeStatus
  version: Scalars['Int']['output']
  workingSupply: Scalars['String']['output']
}

export type GqlPoolStakingGaugeReward = {
  __typename: 'GqlPoolStakingGaugeReward'
  id: Scalars['ID']['output']
  rewardPerSecond: Scalars['String']['output']
  tokenAddress: Scalars['String']['output']
}

export enum GqlPoolStakingGaugeStatus {
  Active = 'ACTIVE',
  Killed = 'KILLED',
  Preferred = 'PREFERRED',
}

export type GqlPoolStakingMasterChefFarm = {
  __typename: 'GqlPoolStakingMasterChefFarm'
  beetsPerBlock: Scalars['String']['output']
  id: Scalars['ID']['output']
  rewarders?: Maybe<Array<GqlPoolStakingFarmRewarder>>
}

export type GqlPoolStakingOtherGauge = {
  __typename: 'GqlPoolStakingOtherGauge'
  gaugeAddress: Scalars['String']['output']
  id: Scalars['ID']['output']
  rewards: Array<GqlPoolStakingGaugeReward>
  status: GqlPoolStakingGaugeStatus
  version: Scalars['Int']['output']
}

export type GqlPoolStakingReliquaryFarm = {
  __typename: 'GqlPoolStakingReliquaryFarm'
  beetsPerSecond: Scalars['String']['output']
  id: Scalars['ID']['output']
  levels?: Maybe<Array<GqlPoolStakingReliquaryFarmLevel>>
  totalBalance: Scalars['String']['output']
  totalWeightedBalance: Scalars['String']['output']
}

export type GqlPoolStakingReliquaryFarmLevel = {
  __typename: 'GqlPoolStakingReliquaryFarmLevel'
  allocationPoints: Scalars['Int']['output']
  apr: Scalars['BigDecimal']['output']
  balance: Scalars['BigDecimal']['output']
  id: Scalars['ID']['output']
  level: Scalars['Int']['output']
  requiredMaturity: Scalars['Int']['output']
}

export enum GqlPoolStakingType {
  FreshBeets = 'FRESH_BEETS',
  Gauge = 'GAUGE',
  MasterChef = 'MASTER_CHEF',
  Reliquary = 'RELIQUARY',
}

export type GqlPoolSwap = {
  __typename: 'GqlPoolSwap'
  chain: GqlChain
  id: Scalars['ID']['output']
  poolId: Scalars['String']['output']
  timestamp: Scalars['Int']['output']
  tokenAmountIn: Scalars['String']['output']
  tokenAmountOut: Scalars['String']['output']
  tokenIn: Scalars['String']['output']
  tokenOut: Scalars['String']['output']
  tx: Scalars['String']['output']
  userAddress: Scalars['String']['output']
  valueUSD: Scalars['Float']['output']
}

export type GqlPoolSwapFilter = {
  chainIn?: InputMaybe<Array<GqlChain>>
  poolIdIn?: InputMaybe<Array<Scalars['String']['input']>>
  tokenInIn?: InputMaybe<Array<Scalars['String']['input']>>
  tokenOutIn?: InputMaybe<Array<Scalars['String']['input']>>
}

export type GqlPoolTimePeriod = {
  gt?: InputMaybe<Scalars['Int']['input']>
  lt?: InputMaybe<Scalars['Int']['input']>
}

export type GqlPoolToken = GqlPoolTokenBase & {
  __typename: 'GqlPoolToken'
  address: Scalars['String']['output']
  balance: Scalars['BigDecimal']['output']
  decimals: Scalars['Int']['output']
  id: Scalars['ID']['output']
  index: Scalars['Int']['output']
  name: Scalars['String']['output']
  priceRate: Scalars['BigDecimal']['output']
  priceRateProvider?: Maybe<Scalars['String']['output']>
  symbol: Scalars['String']['output']
  totalBalance: Scalars['BigDecimal']['output']
  weight?: Maybe<Scalars['BigDecimal']['output']>
}

export type GqlPoolTokenBase = {
  address: Scalars['String']['output']
  balance: Scalars['BigDecimal']['output']
  decimals: Scalars['Int']['output']
  id: Scalars['ID']['output']
  index: Scalars['Int']['output']
  name: Scalars['String']['output']
  priceRate: Scalars['BigDecimal']['output']
  priceRateProvider?: Maybe<Scalars['String']['output']>
  symbol: Scalars['String']['output']
  totalBalance: Scalars['BigDecimal']['output']
  weight?: Maybe<Scalars['BigDecimal']['output']>
}

export type GqlPoolTokenComposableStable = GqlPoolTokenBase & {
  __typename: 'GqlPoolTokenComposableStable'
  address: Scalars['String']['output']
  balance: Scalars['BigDecimal']['output']
  decimals: Scalars['Int']['output']
  id: Scalars['ID']['output']
  index: Scalars['Int']['output']
  name: Scalars['String']['output']
  pool: GqlPoolComposableStableNested
  priceRate: Scalars['BigDecimal']['output']
  priceRateProvider?: Maybe<Scalars['String']['output']>
  symbol: Scalars['String']['output']
  totalBalance: Scalars['BigDecimal']['output']
  weight?: Maybe<Scalars['BigDecimal']['output']>
}

export type GqlPoolTokenComposableStableNestedUnion = GqlPoolToken | GqlPoolTokenLinear

export type GqlPoolTokenDisplay = {
  __typename: 'GqlPoolTokenDisplay'
  address: Scalars['String']['output']
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  nestedTokens?: Maybe<Array<GqlPoolTokenDisplay>>
  symbol: Scalars['String']['output']
  weight?: Maybe<Scalars['BigDecimal']['output']>
}

export type GqlPoolTokenExpanded = {
  __typename: 'GqlPoolTokenExpanded'
  address: Scalars['String']['output']
  decimals: Scalars['Int']['output']
  id: Scalars['ID']['output']
  isMainToken: Scalars['Boolean']['output']
  isNested: Scalars['Boolean']['output']
  isPhantomBpt: Scalars['Boolean']['output']
  name: Scalars['String']['output']
  symbol: Scalars['String']['output']
  weight?: Maybe<Scalars['String']['output']>
}

export type GqlPoolTokenLinear = GqlPoolTokenBase & {
  __typename: 'GqlPoolTokenLinear'
  address: Scalars['String']['output']
  balance: Scalars['BigDecimal']['output']
  decimals: Scalars['Int']['output']
  id: Scalars['ID']['output']
  index: Scalars['Int']['output']
  mainTokenBalance: Scalars['BigDecimal']['output']
  name: Scalars['String']['output']
  pool: GqlPoolLinearNested
  priceRate: Scalars['BigDecimal']['output']
  priceRateProvider?: Maybe<Scalars['String']['output']>
  symbol: Scalars['String']['output']
  totalBalance: Scalars['BigDecimal']['output']
  totalMainTokenBalance: Scalars['BigDecimal']['output']
  weight?: Maybe<Scalars['BigDecimal']['output']>
  wrappedTokenBalance: Scalars['BigDecimal']['output']
}

export type GqlPoolTokenUnion = GqlPoolToken | GqlPoolTokenComposableStable | GqlPoolTokenLinear

export enum GqlPoolType {
  ComposableStable = 'COMPOSABLE_STABLE',
  Element = 'ELEMENT',
  Fx = 'FX',
  Gyro = 'GYRO',
  Gyro3 = 'GYRO3',
  Gyroe = 'GYROE',
  Investment = 'INVESTMENT',
  Linear = 'LINEAR',
  LiquidityBootstrapping = 'LIQUIDITY_BOOTSTRAPPING',
  MetaStable = 'META_STABLE',
  PhantomStable = 'PHANTOM_STABLE',
  Stable = 'STABLE',
  Unknown = 'UNKNOWN',
  Weighted = 'WEIGHTED',
}

export type GqlPoolUnion =
  | GqlPoolComposableStable
  | GqlPoolElement
  | GqlPoolGyro
  | GqlPoolLinear
  | GqlPoolLiquidityBootstrapping
  | GqlPoolMetaStable
  | GqlPoolStable
  | GqlPoolWeighted

export type GqlPoolUserBalance = {
  __typename: 'GqlPoolUserBalance'
  stakedBalance: Scalars['AmountHumanReadable']['output']
  stakedBalanceUsd: Scalars['Float']['output']
  totalBalance: Scalars['AmountHumanReadable']['output']
  totalBalanceUsd: Scalars['Float']['output']
  walletBalance: Scalars['AmountHumanReadable']['output']
  walletBalanceUsd: Scalars['Float']['output']
}

export type GqlPoolUserSwapVolume = {
  __typename: 'GqlPoolUserSwapVolume'
  swapVolumeUSD: Scalars['BigDecimal']['output']
  userAddress: Scalars['String']['output']
}

export type GqlPoolWeighted = GqlPoolBase & {
  __typename: 'GqlPoolWeighted'
  address: Scalars['Bytes']['output']
  allTokens: Array<GqlPoolTokenExpanded>
  chain: GqlChain
  createTime: Scalars['Int']['output']
  decimals: Scalars['Int']['output']
  displayTokens: Array<GqlPoolTokenDisplay>
  dynamicData: GqlPoolDynamicData
  factory?: Maybe<Scalars['Bytes']['output']>
  id: Scalars['ID']['output']
  investConfig: GqlPoolInvestConfig
  name: Scalars['String']['output']
  nestingType: GqlPoolNestingType
  owner: Scalars['Bytes']['output']
  staking?: Maybe<GqlPoolStaking>
  symbol: Scalars['String']['output']
  tokens: Array<GqlPoolTokenUnion>
  type: GqlPoolType
  userBalance?: Maybe<GqlPoolUserBalance>
  version: Scalars['Int']['output']
  withdrawConfig: GqlPoolWithdrawConfig
}

export type GqlPoolWithdrawConfig = {
  __typename: 'GqlPoolWithdrawConfig'
  options: Array<GqlPoolWithdrawOption>
  proportionalEnabled: Scalars['Boolean']['output']
  singleAssetEnabled: Scalars['Boolean']['output']
}

export type GqlPoolWithdrawOption = {
  __typename: 'GqlPoolWithdrawOption'
  poolTokenAddress: Scalars['String']['output']
  poolTokenIndex: Scalars['Int']['output']
  tokenOptions: Array<GqlPoolToken>
}

export type GqlProtocolMetricsAggregated = {
  __typename: 'GqlProtocolMetricsAggregated'
  chains: Array<GqlProtocolMetricsChain>
  numLiquidityProviders: Scalars['BigInt']['output']
  poolCount: Scalars['BigInt']['output']
  swapFee24h: Scalars['BigDecimal']['output']
  swapVolume24h: Scalars['BigDecimal']['output']
  totalLiquidity: Scalars['BigDecimal']['output']
  totalSwapFee: Scalars['BigDecimal']['output']
  totalSwapVolume: Scalars['BigDecimal']['output']
  yieldCapture24h: Scalars['BigDecimal']['output']
}

export type GqlProtocolMetricsChain = {
  __typename: 'GqlProtocolMetricsChain'
  chainId: Scalars['String']['output']
  numLiquidityProviders: Scalars['BigInt']['output']
  poolCount: Scalars['BigInt']['output']
  swapFee24h: Scalars['BigDecimal']['output']
  swapVolume24h: Scalars['BigDecimal']['output']
  totalLiquidity: Scalars['BigDecimal']['output']
  totalSwapFee: Scalars['BigDecimal']['output']
  totalSwapVolume: Scalars['BigDecimal']['output']
  yieldCapture24h: Scalars['BigDecimal']['output']
}

export type GqlRelicSnapshot = {
  __typename: 'GqlRelicSnapshot'
  balance: Scalars['String']['output']
  entryTimestamp: Scalars['Int']['output']
  farmId: Scalars['String']['output']
  level: Scalars['Int']['output']
  relicId: Scalars['Int']['output']
}

export type GqlReliquaryFarmLevelSnapshot = {
  __typename: 'GqlReliquaryFarmLevelSnapshot'
  balance: Scalars['String']['output']
  id: Scalars['ID']['output']
  level: Scalars['String']['output']
}

export type GqlReliquaryFarmSnapshot = {
  __typename: 'GqlReliquaryFarmSnapshot'
  dailyDeposited: Scalars['String']['output']
  dailyWithdrawn: Scalars['String']['output']
  farmId: Scalars['String']['output']
  id: Scalars['ID']['output']
  levelBalances: Array<GqlReliquaryFarmLevelSnapshot>
  relicCount: Scalars['String']['output']
  timestamp: Scalars['Int']['output']
  tokenBalances: Array<GqlReliquaryTokenBalanceSnapshot>
  totalBalance: Scalars['String']['output']
  totalLiquidity: Scalars['String']['output']
  userCount: Scalars['String']['output']
}

export type GqlReliquaryTokenBalanceSnapshot = {
  __typename: 'GqlReliquaryTokenBalanceSnapshot'
  address: Scalars['String']['output']
  balance: Scalars['String']['output']
  decimals: Scalars['Int']['output']
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  symbol: Scalars['String']['output']
}

export type GqlSftmxStakingData = {
  __typename: 'GqlSftmxStakingData'
  exchangeRate: Scalars['String']['output']
  maintenancePaused: Scalars['Boolean']['output']
  maxDepositLimit: Scalars['AmountHumanReadable']['output']
  minDepositLimit: Scalars['AmountHumanReadable']['output']
  numberOfVaults: Scalars['Int']['output']
  stakingApr: Scalars['String']['output']
  totalFtmAmount: Scalars['AmountHumanReadable']['output']
  totalFtmAmountInPool: Scalars['AmountHumanReadable']['output']
  totalFtmAmountStaked: Scalars['AmountHumanReadable']['output']
  undelegatePaused: Scalars['Boolean']['output']
  withdrawPaused: Scalars['Boolean']['output']
  withdrawalDelay: Scalars['Int']['output']
}

export type GqlSftmxWithdrawalRequests = {
  __typename: 'GqlSftmxWithdrawalRequests'
  amountSftmx: Scalars['AmountHumanReadable']['output']
  id: Scalars['String']['output']
  isWithdrawn: Scalars['Boolean']['output']
  requestTimestamp: Scalars['Int']['output']
  user: Scalars['String']['output']
}

export type GqlSorGetBatchSwapForTokensInResponse = {
  __typename: 'GqlSorGetBatchSwapForTokensInResponse'
  assets: Array<Scalars['String']['output']>
  swaps: Array<GqlSorSwap>
  tokenOutAmount: Scalars['AmountHumanReadable']['output']
}

export type GqlSorGetSwapsResponse = {
  __typename: 'GqlSorGetSwapsResponse'
  effectivePrice: Scalars['AmountHumanReadable']['output']
  effectivePriceReversed: Scalars['AmountHumanReadable']['output']
  marketSp: Scalars['String']['output']
  priceImpact: Scalars['AmountHumanReadable']['output']
  returnAmount: Scalars['AmountHumanReadable']['output']
  returnAmountConsideringFees: Scalars['BigDecimal']['output']
  returnAmountFromSwaps?: Maybe<Scalars['BigDecimal']['output']>
  returnAmountScaled: Scalars['BigDecimal']['output']
  routes: Array<GqlSorSwapRoute>
  swapAmount: Scalars['AmountHumanReadable']['output']
  swapAmountForSwaps?: Maybe<Scalars['BigDecimal']['output']>
  swapAmountScaled: Scalars['BigDecimal']['output']
  swapType: GqlSorSwapType
  swaps: Array<GqlSorSwap>
  tokenAddresses: Array<Scalars['String']['output']>
  tokenIn: Scalars['String']['output']
  tokenInAmount: Scalars['AmountHumanReadable']['output']
  tokenOut: Scalars['String']['output']
  tokenOutAmount: Scalars['AmountHumanReadable']['output']
}

export type GqlSorSwap = {
  __typename: 'GqlSorSwap'
  amount: Scalars['String']['output']
  assetInIndex: Scalars['Int']['output']
  assetOutIndex: Scalars['Int']['output']
  poolId: Scalars['String']['output']
  userData: Scalars['String']['output']
}

export type GqlSorSwapOptionsInput = {
  forceRefresh?: InputMaybe<Scalars['Boolean']['input']>
  maxPools?: InputMaybe<Scalars['Int']['input']>
  timestamp?: InputMaybe<Scalars['Int']['input']>
}

export type GqlSorSwapRoute = {
  __typename: 'GqlSorSwapRoute'
  hops: Array<GqlSorSwapRouteHop>
  share: Scalars['Float']['output']
  tokenIn: Scalars['String']['output']
  tokenInAmount: Scalars['BigDecimal']['output']
  tokenOut: Scalars['String']['output']
  tokenOutAmount: Scalars['BigDecimal']['output']
}

export type GqlSorSwapRouteHop = {
  __typename: 'GqlSorSwapRouteHop'
  pool: GqlPoolMinimal
  poolId: Scalars['String']['output']
  tokenIn: Scalars['String']['output']
  tokenInAmount: Scalars['BigDecimal']['output']
  tokenOut: Scalars['String']['output']
  tokenOutAmount: Scalars['BigDecimal']['output']
}

export enum GqlSorSwapType {
  ExactIn = 'EXACT_IN',
  ExactOut = 'EXACT_OUT',
}

export type GqlSwap = {
  __typename: 'GqlSwap'
  amount: Scalars['String']['output']
  assetInIndex: Scalars['Int']['output']
  assetOutIndex: Scalars['Int']['output']
  poolId: Scalars['String']['output']
  userData: Scalars['String']['output']
}

export type GqlToken = {
  __typename: 'GqlToken'
  address: Scalars['String']['output']
  chain: GqlChain
  chainId: Scalars['Int']['output']
  decimals: Scalars['Int']['output']
  description?: Maybe<Scalars['String']['output']>
  discordUrl?: Maybe<Scalars['String']['output']>
  logoURI?: Maybe<Scalars['String']['output']>
  name: Scalars['String']['output']
  priority: Scalars['Int']['output']
  symbol: Scalars['String']['output']
  telegramUrl?: Maybe<Scalars['String']['output']>
  tradable: Scalars['Boolean']['output']
  twitterUsername?: Maybe<Scalars['String']['output']>
  websiteUrl?: Maybe<Scalars['String']['output']>
}

export type GqlTokenAmountHumanReadable = {
  address: Scalars['String']['input']
  amount: Scalars['AmountHumanReadable']['input']
}

export type GqlTokenCandlestickChartDataItem = {
  __typename: 'GqlTokenCandlestickChartDataItem'
  close: Scalars['AmountHumanReadable']['output']
  high: Scalars['AmountHumanReadable']['output']
  id: Scalars['ID']['output']
  low: Scalars['AmountHumanReadable']['output']
  open: Scalars['AmountHumanReadable']['output']
  timestamp: Scalars['Int']['output']
}

export enum GqlTokenChartDataRange {
  NinetyDay = 'NINETY_DAY',
  SevenDay = 'SEVEN_DAY',
  ThirtyDay = 'THIRTY_DAY',
}

export type GqlTokenData = {
  __typename: 'GqlTokenData'
  description?: Maybe<Scalars['String']['output']>
  discordUrl?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  telegramUrl?: Maybe<Scalars['String']['output']>
  tokenAddress: Scalars['String']['output']
  twitterUsername?: Maybe<Scalars['String']['output']>
  websiteUrl?: Maybe<Scalars['String']['output']>
}

export type GqlTokenDynamicData = {
  __typename: 'GqlTokenDynamicData'
  ath: Scalars['Float']['output']
  atl: Scalars['Float']['output']
  fdv?: Maybe<Scalars['String']['output']>
  high24h: Scalars['Float']['output']
  id: Scalars['String']['output']
  low24h: Scalars['Float']['output']
  marketCap?: Maybe<Scalars['String']['output']>
  price: Scalars['Float']['output']
  priceChange24h: Scalars['Float']['output']
  priceChangePercent7d?: Maybe<Scalars['Float']['output']>
  priceChangePercent14d?: Maybe<Scalars['Float']['output']>
  priceChangePercent24h: Scalars['Float']['output']
  priceChangePercent30d?: Maybe<Scalars['Float']['output']>
  tokenAddress: Scalars['String']['output']
  updatedAt: Scalars['String']['output']
}

export type GqlTokenPrice = {
  __typename: 'GqlTokenPrice'
  address: Scalars['String']['output']
  chain: GqlChain
  price: Scalars['Float']['output']
}

export type GqlTokenPriceChartDataItem = {
  __typename: 'GqlTokenPriceChartDataItem'
  id: Scalars['ID']['output']
  price: Scalars['AmountHumanReadable']['output']
  timestamp: Scalars['Int']['output']
}

export enum GqlTokenType {
  Bpt = 'BPT',
  LinearWrappedToken = 'LINEAR_WRAPPED_TOKEN',
  PhantomBpt = 'PHANTOM_BPT',
  WhiteListed = 'WHITE_LISTED',
}

export type GqlUserFbeetsBalance = {
  __typename: 'GqlUserFbeetsBalance'
  id: Scalars['String']['output']
  stakedBalance: Scalars['AmountHumanReadable']['output']
  totalBalance: Scalars['AmountHumanReadable']['output']
  walletBalance: Scalars['AmountHumanReadable']['output']
}

export type GqlUserPoolBalance = {
  __typename: 'GqlUserPoolBalance'
  chain: GqlChain
  poolId: Scalars['String']['output']
  stakedBalance: Scalars['AmountHumanReadable']['output']
  tokenAddress: Scalars['String']['output']
  tokenPrice: Scalars['Float']['output']
  totalBalance: Scalars['AmountHumanReadable']['output']
  walletBalance: Scalars['AmountHumanReadable']['output']
}

export type GqlUserPoolSnapshot = {
  __typename: 'GqlUserPoolSnapshot'
  farmBalance: Scalars['AmountHumanReadable']['output']
  fees24h: Scalars['AmountHumanReadable']['output']
  gaugeBalance: Scalars['AmountHumanReadable']['output']
  percentShare: Scalars['Float']['output']
  timestamp: Scalars['Int']['output']
  totalBalance: Scalars['AmountHumanReadable']['output']
  totalValueUSD: Scalars['AmountHumanReadable']['output']
  walletBalance: Scalars['AmountHumanReadable']['output']
}

export type GqlUserPortfolioSnapshot = {
  __typename: 'GqlUserPortfolioSnapshot'
  farmBalance: Scalars['AmountHumanReadable']['output']
  fees24h: Scalars['AmountHumanReadable']['output']
  gaugeBalance: Scalars['AmountHumanReadable']['output']
  pools: Array<GqlUserPoolSnapshot>
  timestamp: Scalars['Int']['output']
  totalBalance: Scalars['AmountHumanReadable']['output']
  totalFees: Scalars['AmountHumanReadable']['output']
  totalValueUSD: Scalars['AmountHumanReadable']['output']
  walletBalance: Scalars['AmountHumanReadable']['output']
}

export type GqlUserRelicSnapshot = {
  __typename: 'GqlUserRelicSnapshot'
  relicCount: Scalars['Int']['output']
  relicSnapshots: Array<GqlRelicSnapshot>
  timestamp: Scalars['Int']['output']
  totalBalance: Scalars['String']['output']
}

export enum GqlUserSnapshotDataRange {
  AllTime = 'ALL_TIME',
  NinetyDays = 'NINETY_DAYS',
  OneHundredEightyDays = 'ONE_HUNDRED_EIGHTY_DAYS',
  OneYear = 'ONE_YEAR',
  ThirtyDays = 'THIRTY_DAYS',
}

export type GqlUserSwapVolumeFilter = {
  poolIdIn?: InputMaybe<Array<Scalars['String']['input']>>
  tokenInIn?: InputMaybe<Array<Scalars['String']['input']>>
  tokenOutIn?: InputMaybe<Array<Scalars['String']['input']>>
}

export type GqlVeBalUserData = {
  __typename: 'GqlVeBalUserData'
  balance: Scalars['AmountHumanReadable']['output']
  rank?: Maybe<Scalars['Int']['output']>
}

export type GqlVotingGauge = {
  __typename: 'GqlVotingGauge'
  addedTimestamp?: Maybe<Scalars['Int']['output']>
  address: Scalars['Bytes']['output']
  childGaugeAddress?: Maybe<Scalars['Bytes']['output']>
  isKilled: Scalars['Boolean']['output']
  relativeWeightCap?: Maybe<Scalars['String']['output']>
}

export type GqlVotingGaugeToken = {
  __typename: 'GqlVotingGaugeToken'
  address: Scalars['String']['output']
  logoURI: Scalars['String']['output']
  symbol: Scalars['String']['output']
  weight?: Maybe<Scalars['String']['output']>
}

export type GqlVotingPool = {
  __typename: 'GqlVotingPool'
  address: Scalars['Bytes']['output']
  chain: GqlChain
  gauge: GqlVotingGauge
  id: Scalars['ID']['output']
  symbol: Scalars['String']['output']
  tokens: Array<GqlVotingGaugeToken>
  type: GqlPoolType
}

export type Mutation = {
  __typename: 'Mutation'
  beetsPoolLoadReliquarySnapshotsForAllFarms: Scalars['String']['output']
  beetsSyncFbeetsRatio: Scalars['String']['output']
  cacheAverageBlockTime: Scalars['String']['output']
  poolBlackListAddPool: Scalars['String']['output']
  poolBlackListRemovePool: Scalars['String']['output']
  poolDeletePool: Scalars['String']['output']
  poolInitOnChainDataForAllPools: Scalars['String']['output']
  poolInitializeSnapshotsForPool: Scalars['String']['output']
  poolLoadOnChainDataForAllPools: Scalars['String']['output']
  poolLoadOnChainDataForPoolsWithActiveUpdates: Scalars['String']['output']
  poolLoadSnapshotsForAllPools: Scalars['String']['output']
  poolLoadSnapshotsForPools: Scalars['String']['output']
  poolReloadAllPoolAprs: Scalars['String']['output']
  poolReloadAllTokenNestedPoolIds: Scalars['String']['output']
  poolReloadPoolNestedTokens: Scalars['String']['output']
  poolReloadPoolTokenIndexes: Scalars['String']['output']
  poolReloadStakingForAllPools: Scalars['String']['output']
  poolSetPoolsWithPreferredGaugesAsIncentivized: Scalars['String']['output']
  poolSyncAllPoolTypesVersions: Scalars['String']['output']
  poolSyncAllPoolsFromSubgraph: Array<Scalars['String']['output']>
  poolSyncLatestSnapshotsForAllPools: Scalars['String']['output']
  poolSyncNewPoolsFromSubgraph: Array<Scalars['String']['output']>
  poolSyncPool: Scalars['String']['output']
  poolSyncPoolAllTokensRelationship: Scalars['String']['output']
  poolSyncPriceRateProviders: Scalars['String']['output']
  poolSyncProtocolYieldFeeExemptions: Scalars['String']['output']
  poolSyncSanityPoolData: Scalars['String']['output']
  poolSyncStakingForPools: Scalars['String']['output']
  poolSyncSwapsForLast48Hours: Scalars['String']['output']
  poolSyncTotalShares: Scalars['String']['output']
  poolUpdateAprs: Scalars['String']['output']
  poolUpdateLifetimeValuesForAllPools: Scalars['String']['output']
  poolUpdateLiquidity24hAgoForAllPools: Scalars['String']['output']
  poolUpdateLiquidityValuesForAllPools: Scalars['String']['output']
  poolUpdateVolumeAndFeeValuesForAllPools: Scalars['String']['output']
  protocolCacheMetrics: Scalars['String']['output']
  sftmxSyncStakingData: Scalars['String']['output']
  sftmxSyncWithdrawalRequests: Scalars['String']['output']
  tokenDeletePrice: Scalars['Boolean']['output']
  tokenDeleteTokenType: Scalars['String']['output']
  tokenInitChartData: Scalars['String']['output']
  tokenReloadAllTokenTypes: Scalars['String']['output']
  tokenReloadTokenPrices?: Maybe<Scalars['Boolean']['output']>
  tokenSyncLatestFxPrices: Scalars['String']['output']
  tokenSyncTokenDefinitions: Scalars['String']['output']
  tokenSyncTokenDynamicData: Scalars['String']['output']
  userInitStakedBalances: Scalars['String']['output']
  userInitWalletBalancesForAllPools: Scalars['String']['output']
  userInitWalletBalancesForPool: Scalars['String']['output']
  userLoadAllRelicSnapshots: Scalars['String']['output']
  userSyncBalance: Scalars['String']['output']
  userSyncBalanceAllPools: Scalars['String']['output']
  userSyncChangedStakedBalances: Scalars['String']['output']
  userSyncChangedWalletBalancesForAllPools: Scalars['String']['output']
  veBalSyncAllUserBalances: Scalars['String']['output']
  veBalSyncTotalSupply: Scalars['String']['output']
}

export type MutationPoolBlackListAddPoolArgs = {
  poolId: Scalars['String']['input']
}

export type MutationPoolBlackListRemovePoolArgs = {
  poolId: Scalars['String']['input']
}

export type MutationPoolDeletePoolArgs = {
  poolId: Scalars['String']['input']
}

export type MutationPoolInitializeSnapshotsForPoolArgs = {
  poolId: Scalars['String']['input']
}

export type MutationPoolLoadSnapshotsForPoolsArgs = {
  poolIds: Array<Scalars['String']['input']>
  reload?: InputMaybe<Scalars['Boolean']['input']>
}

export type MutationPoolReloadPoolNestedTokensArgs = {
  poolId: Scalars['String']['input']
}

export type MutationPoolReloadPoolTokenIndexesArgs = {
  poolId: Scalars['String']['input']
}

export type MutationPoolReloadStakingForAllPoolsArgs = {
  stakingTypes: Array<GqlPoolStakingType>
}

export type MutationPoolSyncLatestSnapshotsForAllPoolsArgs = {
  daysToSync?: InputMaybe<Scalars['Int']['input']>
}

export type MutationPoolSyncPoolArgs = {
  poolId: Scalars['String']['input']
}

export type MutationTokenDeletePriceArgs = {
  timestamp: Scalars['Int']['input']
  tokenAddress: Scalars['String']['input']
}

export type MutationTokenDeleteTokenTypeArgs = {
  tokenAddress: Scalars['String']['input']
  type: GqlTokenType
}

export type MutationTokenInitChartDataArgs = {
  tokenAddress: Scalars['String']['input']
}

export type MutationTokenSyncLatestFxPricesArgs = {
  chain: GqlChain
}

export type MutationUserInitStakedBalancesArgs = {
  stakingTypes: Array<GqlPoolStakingType>
}

export type MutationUserInitWalletBalancesForPoolArgs = {
  poolId: Scalars['String']['input']
}

export type MutationUserSyncBalanceArgs = {
  poolId: Scalars['String']['input']
}

export type Query = {
  __typename: 'Query'
  beetsGetFbeetsRatio: Scalars['String']['output']
  beetsPoolGetReliquaryFarmSnapshots: Array<GqlReliquaryFarmSnapshot>
  blocksGetAverageBlockTime: Scalars['Float']['output']
  blocksGetBlocksPerDay: Scalars['Float']['output']
  blocksGetBlocksPerSecond: Scalars['Float']['output']
  blocksGetBlocksPerYear: Scalars['Float']['output']
  contentGetNewsItems: Array<GqlContentNewsItem>
  latestSyncedBlocks: GqlLatestSyncedBlocks
  poolGetBatchSwaps: Array<GqlPoolBatchSwap>
  poolGetFeaturedPoolGroups: Array<GqlPoolFeaturedPoolGroup>
  poolGetFeaturedPools: Array<GqlPoolFeaturedPool>
  poolGetGyroPools: Array<GqlPoolGyro>
  poolGetJoinExits: Array<GqlPoolJoinExit>
  poolGetLinearPools: Array<GqlPoolLinear>
  poolGetPool: GqlPoolBase
  poolGetPools: Array<GqlPoolMinimal>
  poolGetPoolsCount: Scalars['Int']['output']
  poolGetSnapshots: Array<GqlPoolSnapshot>
  poolGetSwaps: Array<GqlPoolSwap>
  protocolMetricsAggregated: GqlProtocolMetricsAggregated
  protocolMetricsChain: GqlProtocolMetricsChain
  sftmxGetStakingData: GqlSftmxStakingData
  sftmxGetWithdrawalRequests: Array<GqlSftmxWithdrawalRequests>
  sorGetBatchSwapForTokensIn: GqlSorGetBatchSwapForTokensInResponse
  sorGetCowSwaps: GqlCowSwapApiResponse
  sorGetSwaps: GqlSorGetSwapsResponse
  tokenGetCandlestickChartData: Array<GqlTokenCandlestickChartDataItem>
  tokenGetCurrentPrices: Array<GqlTokenPrice>
  tokenGetHistoricalPrices: Array<GqlHistoricalTokenPrice>
  tokenGetPriceChartData: Array<GqlTokenPriceChartDataItem>
  tokenGetProtocolTokenPrice: Scalars['AmountHumanReadable']['output']
  tokenGetRelativePriceChartData: Array<GqlTokenPriceChartDataItem>
  tokenGetTokenData?: Maybe<GqlTokenData>
  tokenGetTokenDynamicData?: Maybe<GqlTokenDynamicData>
  tokenGetTokens: Array<GqlToken>
  tokenGetTokensData: Array<GqlTokenData>
  tokenGetTokensDynamicData: Array<GqlTokenDynamicData>
  userGetFbeetsBalance: GqlUserFbeetsBalance
  userGetPoolBalances: Array<GqlUserPoolBalance>
  userGetPoolJoinExits: Array<GqlPoolJoinExit>
  userGetPoolSnapshots: Array<GqlUserPoolSnapshot>
  userGetPortfolioSnapshots: Array<GqlUserPortfolioSnapshot>
  userGetRelicSnapshots: Array<GqlUserRelicSnapshot>
  userGetStaking: Array<GqlPoolStaking>
  userGetSwaps: Array<GqlPoolSwap>
  veBalGetTotalSupply: Scalars['AmountHumanReadable']['output']
  veBalGetUser: GqlVeBalUserData
  veBalGetUserBalance: Scalars['AmountHumanReadable']['output']
  veBalGetVotingList: Array<GqlVotingPool>
}

export type QueryBeetsPoolGetReliquaryFarmSnapshotsArgs = {
  id: Scalars['String']['input']
  range: GqlPoolSnapshotDataRange
}

export type QueryPoolGetBatchSwapsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  where?: InputMaybe<GqlPoolSwapFilter>
}

export type QueryPoolGetFeaturedPoolGroupsArgs = {
  chains?: InputMaybe<Array<GqlChain>>
}

export type QueryPoolGetFeaturedPoolsArgs = {
  chains: Array<GqlChain>
}

export type QueryPoolGetGyroPoolsArgs = {
  chains?: InputMaybe<Array<GqlChain>>
}

export type QueryPoolGetJoinExitsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  where?: InputMaybe<GqlPoolJoinExitFilter>
}

export type QueryPoolGetLinearPoolsArgs = {
  chains?: InputMaybe<Array<GqlChain>>
}

export type QueryPoolGetPoolArgs = {
  chain?: InputMaybe<GqlChain>
  id: Scalars['String']['input']
  userAddress?: InputMaybe<Scalars['String']['input']>
}

export type QueryPoolGetPoolsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<GqlPoolOrderBy>
  orderDirection?: InputMaybe<GqlPoolOrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  textSearch?: InputMaybe<Scalars['String']['input']>
  where?: InputMaybe<GqlPoolFilter>
}

export type QueryPoolGetPoolsCountArgs = {
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<GqlPoolOrderBy>
  orderDirection?: InputMaybe<GqlPoolOrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  textSearch?: InputMaybe<Scalars['String']['input']>
  where?: InputMaybe<GqlPoolFilter>
}

export type QueryPoolGetSnapshotsArgs = {
  chain?: InputMaybe<GqlChain>
  id: Scalars['String']['input']
  range: GqlPoolSnapshotDataRange
}

export type QueryPoolGetSwapsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  where?: InputMaybe<GqlPoolSwapFilter>
}

export type QueryProtocolMetricsAggregatedArgs = {
  chains?: InputMaybe<Array<GqlChain>>
}

export type QueryProtocolMetricsChainArgs = {
  chain?: InputMaybe<GqlChain>
}

export type QuerySftmxGetWithdrawalRequestsArgs = {
  user: Scalars['String']['input']
}

export type QuerySorGetBatchSwapForTokensInArgs = {
  swapOptions: GqlSorSwapOptionsInput
  tokenOut: Scalars['String']['input']
  tokensIn: Array<GqlTokenAmountHumanReadable>
}

export type QuerySorGetCowSwapsArgs = {
  chain: GqlChain
  swapAmount: Scalars['BigDecimal']['input']
  swapType: GqlSorSwapType
  tokenIn: Scalars['String']['input']
  tokenOut: Scalars['String']['input']
}

export type QuerySorGetSwapsArgs = {
  chain?: InputMaybe<GqlChain>
  swapAmount: Scalars['BigDecimal']['input']
  swapOptions: GqlSorSwapOptionsInput
  swapType: GqlSorSwapType
  tokenIn: Scalars['String']['input']
  tokenOut: Scalars['String']['input']
}

export type QueryTokenGetCandlestickChartDataArgs = {
  address: Scalars['String']['input']
  range: GqlTokenChartDataRange
}

export type QueryTokenGetCurrentPricesArgs = {
  chains?: InputMaybe<Array<GqlChain>>
}

export type QueryTokenGetHistoricalPricesArgs = {
  addresses: Array<Scalars['String']['input']>
}

export type QueryTokenGetPriceChartDataArgs = {
  address: Scalars['String']['input']
  range: GqlTokenChartDataRange
}

export type QueryTokenGetRelativePriceChartDataArgs = {
  range: GqlTokenChartDataRange
  tokenIn: Scalars['String']['input']
  tokenOut: Scalars['String']['input']
}

export type QueryTokenGetTokenDataArgs = {
  address: Scalars['String']['input']
}

export type QueryTokenGetTokenDynamicDataArgs = {
  address: Scalars['String']['input']
}

export type QueryTokenGetTokensArgs = {
  chains?: InputMaybe<Array<GqlChain>>
}

export type QueryTokenGetTokensDataArgs = {
  addresses: Array<Scalars['String']['input']>
}

export type QueryTokenGetTokensDynamicDataArgs = {
  addresses: Array<Scalars['String']['input']>
}

export type QueryUserGetPoolBalancesArgs = {
  address?: InputMaybe<Scalars['String']['input']>
  chains?: InputMaybe<Array<GqlChain>>
}

export type QueryUserGetPoolJoinExitsArgs = {
  address?: InputMaybe<Scalars['String']['input']>
  chain?: InputMaybe<GqlChain>
  first?: InputMaybe<Scalars['Int']['input']>
  poolId: Scalars['String']['input']
  skip?: InputMaybe<Scalars['Int']['input']>
}

export type QueryUserGetPoolSnapshotsArgs = {
  chain: GqlChain
  poolId: Scalars['String']['input']
  range: GqlUserSnapshotDataRange
}

export type QueryUserGetPortfolioSnapshotsArgs = {
  days: Scalars['Int']['input']
}

export type QueryUserGetRelicSnapshotsArgs = {
  farmId: Scalars['String']['input']
  range: GqlUserSnapshotDataRange
}

export type QueryUserGetStakingArgs = {
  address?: InputMaybe<Scalars['String']['input']>
  chains?: InputMaybe<Array<GqlChain>>
}

export type QueryUserGetSwapsArgs = {
  address?: InputMaybe<Scalars['String']['input']>
  chain?: InputMaybe<GqlChain>
  first?: InputMaybe<Scalars['Int']['input']>
  poolId: Scalars['String']['input']
  skip?: InputMaybe<Scalars['Int']['input']>
}

export type GetAppGlobalPollingDataQueryVariables = Exact<{ [key: string]: never }>

export type GetAppGlobalPollingDataQuery = {
  __typename: 'Query'
  blocksGetBlocksPerDay: number
  blocksGetAverageBlockTime: number
  tokenGetCurrentPrices: Array<{ __typename: 'GqlTokenPrice'; price: number; address: string }>
  protocolMetricsChain: {
    __typename: 'GqlProtocolMetricsChain'
    totalLiquidity: string
    totalSwapVolume: string
    totalSwapFee: string
    poolCount: string
    swapFee24h: string
    swapVolume24h: string
  }
}

export type GetTokensQueryVariables = Exact<{
  chains: Array<GqlChain> | GqlChain
}>

export type GetTokensQuery = {
  __typename: 'Query'
  tokens: Array<{
    __typename: 'GqlToken'
    address: string
    name: string
    symbol: string
    decimals: number
    chain: GqlChain
    chainId: number
    logoURI?: string | null
    priority: number
    tradable: boolean
  }>
}

export type GetTokenPricesQueryVariables = Exact<{
  chains: Array<GqlChain> | GqlChain
}>

export type GetTokenPricesQuery = {
  __typename: 'Query'
  tokenPrices: Array<{
    __typename: 'GqlTokenPrice'
    price: number
    address: string
    chain: GqlChain
  }>
}

export type GetTokensDynamicDataQueryVariables = Exact<{
  addresses: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type GetTokensDynamicDataQuery = {
  __typename: 'Query'
  dynamicData: Array<{
    __typename: 'GqlTokenDynamicData'
    ath: number
    atl: number
    fdv?: string | null
    high24h: number
    id: string
    low24h: number
    marketCap?: string | null
    price: number
    priceChange24h: number
    priceChangePercent7d?: number | null
    priceChangePercent14d?: number | null
    priceChangePercent24h: number
    priceChangePercent30d?: number | null
    tokenAddress: string
    updatedAt: string
  }>
}

export type GetBlocksPerDayQueryVariables = Exact<{ [key: string]: never }>

export type GetBlocksPerDayQuery = {
  __typename: 'Query'
  blocksPerDay: number
  avgBlockTime: number
}

export type GetPoolQueryVariables = Exact<{
  id: Scalars['String']['input']
  chain: GqlChain
  userAddress?: InputMaybe<Scalars['String']['input']>
}>

export type GetPoolQuery = {
  __typename: 'Query'
  pool:
    | {
        __typename: 'GqlPoolComposableStable'
        amp: string
        nestingType: GqlPoolNestingType
        bptPriceRate: string
        id: string
        address: string
        name: string
        version: number
        owner: string
        decimals: number
        factory?: string | null
        symbol: string
        createTime: number
        type: GqlPoolType
        chain: GqlChain
        tokens: Array<
          | {
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }
          | {
              __typename: 'GqlPoolTokenComposableStable'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              weight?: string | null
              priceRate: string
              decimals: number
              totalBalance: string
              pool: {
                __typename: 'GqlPoolComposableStableNested'
                id: string
                type: GqlPoolType
                version: number
                name: string
                symbol: string
                address: string
                owner: string
                factory?: string | null
                createTime: number
                totalShares: string
                totalLiquidity: string
                nestingType: GqlPoolNestingType
                swapFee: string
                amp: string
                bptPriceRate: string
                tokens: Array<
                  | {
                      __typename: 'GqlPoolToken'
                      id: string
                      index: number
                      name: string
                      symbol: string
                      balance: string
                      address: string
                      priceRate: string
                      decimals: number
                      weight?: string | null
                      totalBalance: string
                    }
                  | {
                      __typename: 'GqlPoolTokenLinear'
                      id: string
                      index: number
                      name: string
                      symbol: string
                      balance: string
                      address: string
                      priceRate: string
                      decimals: number
                      weight?: string | null
                      mainTokenBalance: string
                      wrappedTokenBalance: string
                      totalMainTokenBalance: string
                      totalBalance: string
                      pool: {
                        __typename: 'GqlPoolLinearNested'
                        id: string
                        type: GqlPoolType
                        version: number
                        name: string
                        symbol: string
                        address: string
                        owner: string
                        factory?: string | null
                        createTime: number
                        wrappedIndex: number
                        mainIndex: number
                        upperTarget: string
                        lowerTarget: string
                        totalShares: string
                        totalLiquidity: string
                        bptPriceRate: string
                        tokens: Array<{
                          __typename: 'GqlPoolToken'
                          id: string
                          index: number
                          name: string
                          symbol: string
                          balance: string
                          address: string
                          priceRate: string
                          decimals: number
                          weight?: string | null
                          totalBalance: string
                        }>
                      }
                    }
                >
              }
            }
          | {
              __typename: 'GqlPoolTokenLinear'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              mainTokenBalance: string
              wrappedTokenBalance: string
              totalMainTokenBalance: string
              totalBalance: string
              pool: {
                __typename: 'GqlPoolLinearNested'
                id: string
                name: string
                type: GqlPoolType
                version: number
                symbol: string
                address: string
                owner: string
                factory?: string | null
                createTime: number
                wrappedIndex: number
                mainIndex: number
                upperTarget: string
                lowerTarget: string
                totalShares: string
                totalLiquidity: string
                bptPriceRate: string
                tokens: Array<{
                  __typename: 'GqlPoolToken'
                  id: string
                  index: number
                  name: string
                  symbol: string
                  balance: string
                  address: string
                  priceRate: string
                  decimals: number
                  weight?: string | null
                  totalBalance: string
                }>
              }
            }
        >
        dynamicData: {
          __typename: 'GqlPoolDynamicData'
          poolId: string
          swapEnabled: boolean
          totalLiquidity: string
          totalLiquidity24hAgo: string
          totalShares: string
          totalShares24hAgo: string
          fees24h: string
          swapFee: string
          volume24h: string
          fees48h: string
          volume48h: string
          lifetimeVolume: string
          lifetimeSwapFees: string
          holdersCount: string
          swapsCount: string
          sharePriceAth: string
          sharePriceAthTimestamp: number
          sharePriceAtl: string
          sharePriceAtlTimestamp: number
          totalLiquidityAth: string
          totalLiquidityAthTimestamp: number
          totalLiquidityAtl: string
          totalLiquidityAtlTimestamp: number
          volume24hAth: string
          volume24hAthTimestamp: number
          volume24hAtl: string
          volume24hAtlTimestamp: number
          fees24hAth: string
          fees24hAthTimestamp: number
          fees24hAtl: string
          fees24hAtlTimestamp: number
          yieldCapture24h: string
          yieldCapture48h: string
          apr: {
            __typename: 'GqlPoolApr'
            hasRewardApr: boolean
            swapApr: string
            thirdPartyApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            nativeRewardApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            apr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            items: Array<{
              __typename: 'GqlBalancePoolAprItem'
              id: string
              title: string
              apr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string }
              subItems?: Array<{
                __typename: 'GqlBalancePoolAprSubItem'
                id: string
                title: string
                apr:
                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                  | { __typename: 'GqlPoolAprTotal'; total: string }
              }> | null
            }>
          }
        }
        allTokens: Array<{
          __typename: 'GqlPoolTokenExpanded'
          id: string
          address: string
          name: string
          symbol: string
          decimals: number
          isNested: boolean
          isPhantomBpt: boolean
          isMainToken: boolean
        }>
        displayTokens: Array<{
          __typename: 'GqlPoolTokenDisplay'
          id: string
          address: string
          name: string
          weight?: string | null
          symbol: string
          nestedTokens?: Array<{
            __typename: 'GqlPoolTokenDisplay'
            id: string
            address: string
            name: string
            weight?: string | null
            symbol: string
          }> | null
        }>
        staking?: {
          __typename: 'GqlPoolStaking'
          id: string
          type: GqlPoolStakingType
          chain: GqlChain
          address: string
          gauge?: {
            __typename: 'GqlPoolStakingGauge'
            id: string
            gaugeAddress: string
            version: number
            status: GqlPoolStakingGaugeStatus
            workingSupply: string
            otherGauges?: Array<{
              __typename: 'GqlPoolStakingOtherGauge'
              gaugeAddress: string
              version: number
              status: GqlPoolStakingGaugeStatus
              id: string
              rewards: Array<{
                __typename: 'GqlPoolStakingGaugeReward'
                id: string
                tokenAddress: string
                rewardPerSecond: string
              }>
            }> | null
            rewards: Array<{
              __typename: 'GqlPoolStakingGaugeReward'
              id: string
              rewardPerSecond: string
              tokenAddress: string
            }>
          } | null
        } | null
        investConfig: {
          __typename: 'GqlPoolInvestConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolInvestOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        withdrawConfig: {
          __typename: 'GqlPoolWithdrawConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolWithdrawOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        userBalance?: {
          __typename: 'GqlPoolUserBalance'
          stakedBalance: string
          totalBalance: string
          walletBalance: string
          stakedBalanceUsd: number
          walletBalanceUsd: number
          totalBalanceUsd: number
        } | null
      }
    | {
        __typename: 'GqlPoolElement'
        unitSeconds: string
        principalToken: string
        baseToken: string
        id: string
        address: string
        name: string
        version: number
        owner: string
        decimals: number
        factory?: string | null
        symbol: string
        createTime: number
        type: GqlPoolType
        chain: GqlChain
        tokens: Array<{
          __typename: 'GqlPoolToken'
          id: string
          index: number
          name: string
          symbol: string
          balance: string
          address: string
          priceRate: string
          decimals: number
          weight?: string | null
          totalBalance: string
        }>
        dynamicData: {
          __typename: 'GqlPoolDynamicData'
          poolId: string
          swapEnabled: boolean
          totalLiquidity: string
          totalLiquidity24hAgo: string
          totalShares: string
          totalShares24hAgo: string
          fees24h: string
          swapFee: string
          volume24h: string
          fees48h: string
          volume48h: string
          lifetimeVolume: string
          lifetimeSwapFees: string
          holdersCount: string
          swapsCount: string
          sharePriceAth: string
          sharePriceAthTimestamp: number
          sharePriceAtl: string
          sharePriceAtlTimestamp: number
          totalLiquidityAth: string
          totalLiquidityAthTimestamp: number
          totalLiquidityAtl: string
          totalLiquidityAtlTimestamp: number
          volume24hAth: string
          volume24hAthTimestamp: number
          volume24hAtl: string
          volume24hAtlTimestamp: number
          fees24hAth: string
          fees24hAthTimestamp: number
          fees24hAtl: string
          fees24hAtlTimestamp: number
          yieldCapture24h: string
          yieldCapture48h: string
          apr: {
            __typename: 'GqlPoolApr'
            hasRewardApr: boolean
            swapApr: string
            thirdPartyApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            nativeRewardApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            apr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            items: Array<{
              __typename: 'GqlBalancePoolAprItem'
              id: string
              title: string
              apr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string }
              subItems?: Array<{
                __typename: 'GqlBalancePoolAprSubItem'
                id: string
                title: string
                apr:
                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                  | { __typename: 'GqlPoolAprTotal'; total: string }
              }> | null
            }>
          }
        }
        allTokens: Array<{
          __typename: 'GqlPoolTokenExpanded'
          id: string
          address: string
          name: string
          symbol: string
          decimals: number
          isNested: boolean
          isPhantomBpt: boolean
          isMainToken: boolean
        }>
        displayTokens: Array<{
          __typename: 'GqlPoolTokenDisplay'
          id: string
          address: string
          name: string
          weight?: string | null
          symbol: string
          nestedTokens?: Array<{
            __typename: 'GqlPoolTokenDisplay'
            id: string
            address: string
            name: string
            weight?: string | null
            symbol: string
          }> | null
        }>
        staking?: {
          __typename: 'GqlPoolStaking'
          id: string
          type: GqlPoolStakingType
          chain: GqlChain
          address: string
          gauge?: {
            __typename: 'GqlPoolStakingGauge'
            id: string
            gaugeAddress: string
            version: number
            status: GqlPoolStakingGaugeStatus
            workingSupply: string
            otherGauges?: Array<{
              __typename: 'GqlPoolStakingOtherGauge'
              gaugeAddress: string
              version: number
              status: GqlPoolStakingGaugeStatus
              id: string
              rewards: Array<{
                __typename: 'GqlPoolStakingGaugeReward'
                id: string
                tokenAddress: string
                rewardPerSecond: string
              }>
            }> | null
            rewards: Array<{
              __typename: 'GqlPoolStakingGaugeReward'
              id: string
              rewardPerSecond: string
              tokenAddress: string
            }>
          } | null
        } | null
        investConfig: {
          __typename: 'GqlPoolInvestConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolInvestOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        withdrawConfig: {
          __typename: 'GqlPoolWithdrawConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolWithdrawOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        userBalance?: {
          __typename: 'GqlPoolUserBalance'
          stakedBalance: string
          totalBalance: string
          walletBalance: string
          stakedBalanceUsd: number
          walletBalanceUsd: number
          totalBalanceUsd: number
        } | null
      }
    | {
        __typename: 'GqlPoolGyro'
        alpha: string
        beta: string
        type: GqlPoolType
        nestingType: GqlPoolNestingType
        id: string
        address: string
        name: string
        version: number
        owner: string
        decimals: number
        factory?: string | null
        symbol: string
        createTime: number
        chain: GqlChain
        tokens: Array<
          | {
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }
          | {
              __typename: 'GqlPoolTokenComposableStable'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              weight?: string | null
              priceRate: string
              decimals: number
              totalBalance: string
              pool: {
                __typename: 'GqlPoolComposableStableNested'
                id: string
                type: GqlPoolType
                version: number
                name: string
                symbol: string
                address: string
                owner: string
                factory?: string | null
                createTime: number
                totalShares: string
                totalLiquidity: string
                nestingType: GqlPoolNestingType
                swapFee: string
                amp: string
                bptPriceRate: string
                tokens: Array<
                  | {
                      __typename: 'GqlPoolToken'
                      id: string
                      index: number
                      name: string
                      symbol: string
                      balance: string
                      address: string
                      priceRate: string
                      decimals: number
                      weight?: string | null
                      totalBalance: string
                    }
                  | {
                      __typename: 'GqlPoolTokenLinear'
                      id: string
                      index: number
                      name: string
                      symbol: string
                      balance: string
                      address: string
                      priceRate: string
                      decimals: number
                      weight?: string | null
                      mainTokenBalance: string
                      wrappedTokenBalance: string
                      totalMainTokenBalance: string
                      totalBalance: string
                      pool: {
                        __typename: 'GqlPoolLinearNested'
                        id: string
                        type: GqlPoolType
                        version: number
                        name: string
                        symbol: string
                        address: string
                        owner: string
                        factory?: string | null
                        createTime: number
                        wrappedIndex: number
                        mainIndex: number
                        upperTarget: string
                        lowerTarget: string
                        totalShares: string
                        totalLiquidity: string
                        bptPriceRate: string
                        tokens: Array<{
                          __typename: 'GqlPoolToken'
                          id: string
                          index: number
                          name: string
                          symbol: string
                          balance: string
                          address: string
                          priceRate: string
                          decimals: number
                          weight?: string | null
                          totalBalance: string
                        }>
                      }
                    }
                >
              }
            }
          | {
              __typename: 'GqlPoolTokenLinear'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              mainTokenBalance: string
              wrappedTokenBalance: string
              totalMainTokenBalance: string
              totalBalance: string
              pool: {
                __typename: 'GqlPoolLinearNested'
                id: string
                type: GqlPoolType
                version: number
                name: string
                symbol: string
                address: string
                owner: string
                factory?: string | null
                createTime: number
                wrappedIndex: number
                mainIndex: number
                upperTarget: string
                lowerTarget: string
                totalShares: string
                totalLiquidity: string
                bptPriceRate: string
                tokens: Array<{
                  __typename: 'GqlPoolToken'
                  id: string
                  index: number
                  name: string
                  symbol: string
                  balance: string
                  address: string
                  priceRate: string
                  decimals: number
                  weight?: string | null
                  totalBalance: string
                }>
              }
            }
        >
        dynamicData: {
          __typename: 'GqlPoolDynamicData'
          poolId: string
          swapEnabled: boolean
          totalLiquidity: string
          totalLiquidity24hAgo: string
          totalShares: string
          totalShares24hAgo: string
          fees24h: string
          swapFee: string
          volume24h: string
          fees48h: string
          volume48h: string
          lifetimeVolume: string
          lifetimeSwapFees: string
          holdersCount: string
          swapsCount: string
          sharePriceAth: string
          sharePriceAthTimestamp: number
          sharePriceAtl: string
          sharePriceAtlTimestamp: number
          totalLiquidityAth: string
          totalLiquidityAthTimestamp: number
          totalLiquidityAtl: string
          totalLiquidityAtlTimestamp: number
          volume24hAth: string
          volume24hAthTimestamp: number
          volume24hAtl: string
          volume24hAtlTimestamp: number
          fees24hAth: string
          fees24hAthTimestamp: number
          fees24hAtl: string
          fees24hAtlTimestamp: number
          yieldCapture24h: string
          yieldCapture48h: string
          apr: {
            __typename: 'GqlPoolApr'
            hasRewardApr: boolean
            swapApr: string
            thirdPartyApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            nativeRewardApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            apr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            items: Array<{
              __typename: 'GqlBalancePoolAprItem'
              id: string
              title: string
              apr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string }
              subItems?: Array<{
                __typename: 'GqlBalancePoolAprSubItem'
                id: string
                title: string
                apr:
                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                  | { __typename: 'GqlPoolAprTotal'; total: string }
              }> | null
            }>
          }
        }
        allTokens: Array<{
          __typename: 'GqlPoolTokenExpanded'
          id: string
          address: string
          name: string
          symbol: string
          decimals: number
          isNested: boolean
          isPhantomBpt: boolean
          isMainToken: boolean
        }>
        displayTokens: Array<{
          __typename: 'GqlPoolTokenDisplay'
          id: string
          address: string
          name: string
          weight?: string | null
          symbol: string
          nestedTokens?: Array<{
            __typename: 'GqlPoolTokenDisplay'
            id: string
            address: string
            name: string
            weight?: string | null
            symbol: string
          }> | null
        }>
        staking?: {
          __typename: 'GqlPoolStaking'
          id: string
          type: GqlPoolStakingType
          chain: GqlChain
          address: string
          gauge?: {
            __typename: 'GqlPoolStakingGauge'
            id: string
            gaugeAddress: string
            version: number
            status: GqlPoolStakingGaugeStatus
            workingSupply: string
            otherGauges?: Array<{
              __typename: 'GqlPoolStakingOtherGauge'
              gaugeAddress: string
              version: number
              status: GqlPoolStakingGaugeStatus
              id: string
              rewards: Array<{
                __typename: 'GqlPoolStakingGaugeReward'
                id: string
                tokenAddress: string
                rewardPerSecond: string
              }>
            }> | null
            rewards: Array<{
              __typename: 'GqlPoolStakingGaugeReward'
              id: string
              rewardPerSecond: string
              tokenAddress: string
            }>
          } | null
        } | null
        investConfig: {
          __typename: 'GqlPoolInvestConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolInvestOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        withdrawConfig: {
          __typename: 'GqlPoolWithdrawConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolWithdrawOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        userBalance?: {
          __typename: 'GqlPoolUserBalance'
          stakedBalance: string
          totalBalance: string
          walletBalance: string
          stakedBalanceUsd: number
          walletBalanceUsd: number
          totalBalanceUsd: number
        } | null
      }
    | {
        __typename: 'GqlPoolLinear'
        mainIndex: number
        wrappedIndex: number
        lowerTarget: string
        upperTarget: string
        bptPriceRate: string
        id: string
        address: string
        name: string
        version: number
        owner: string
        decimals: number
        factory?: string | null
        symbol: string
        createTime: number
        type: GqlPoolType
        chain: GqlChain
        tokens: Array<{
          __typename: 'GqlPoolToken'
          id: string
          index: number
          name: string
          symbol: string
          balance: string
          address: string
          priceRate: string
          decimals: number
          weight?: string | null
          totalBalance: string
        }>
        dynamicData: {
          __typename: 'GqlPoolDynamicData'
          poolId: string
          swapEnabled: boolean
          totalLiquidity: string
          totalLiquidity24hAgo: string
          totalShares: string
          totalShares24hAgo: string
          fees24h: string
          swapFee: string
          volume24h: string
          fees48h: string
          volume48h: string
          lifetimeVolume: string
          lifetimeSwapFees: string
          holdersCount: string
          swapsCount: string
          sharePriceAth: string
          sharePriceAthTimestamp: number
          sharePriceAtl: string
          sharePriceAtlTimestamp: number
          totalLiquidityAth: string
          totalLiquidityAthTimestamp: number
          totalLiquidityAtl: string
          totalLiquidityAtlTimestamp: number
          volume24hAth: string
          volume24hAthTimestamp: number
          volume24hAtl: string
          volume24hAtlTimestamp: number
          fees24hAth: string
          fees24hAthTimestamp: number
          fees24hAtl: string
          fees24hAtlTimestamp: number
          yieldCapture24h: string
          yieldCapture48h: string
          apr: {
            __typename: 'GqlPoolApr'
            hasRewardApr: boolean
            swapApr: string
            thirdPartyApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            nativeRewardApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            apr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            items: Array<{
              __typename: 'GqlBalancePoolAprItem'
              id: string
              title: string
              apr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string }
              subItems?: Array<{
                __typename: 'GqlBalancePoolAprSubItem'
                id: string
                title: string
                apr:
                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                  | { __typename: 'GqlPoolAprTotal'; total: string }
              }> | null
            }>
          }
        }
        allTokens: Array<{
          __typename: 'GqlPoolTokenExpanded'
          id: string
          address: string
          name: string
          symbol: string
          decimals: number
          isNested: boolean
          isPhantomBpt: boolean
          isMainToken: boolean
        }>
        displayTokens: Array<{
          __typename: 'GqlPoolTokenDisplay'
          id: string
          address: string
          name: string
          weight?: string | null
          symbol: string
          nestedTokens?: Array<{
            __typename: 'GqlPoolTokenDisplay'
            id: string
            address: string
            name: string
            weight?: string | null
            symbol: string
          }> | null
        }>
        staking?: {
          __typename: 'GqlPoolStaking'
          id: string
          type: GqlPoolStakingType
          chain: GqlChain
          address: string
          gauge?: {
            __typename: 'GqlPoolStakingGauge'
            id: string
            gaugeAddress: string
            version: number
            status: GqlPoolStakingGaugeStatus
            workingSupply: string
            otherGauges?: Array<{
              __typename: 'GqlPoolStakingOtherGauge'
              gaugeAddress: string
              version: number
              status: GqlPoolStakingGaugeStatus
              id: string
              rewards: Array<{
                __typename: 'GqlPoolStakingGaugeReward'
                id: string
                tokenAddress: string
                rewardPerSecond: string
              }>
            }> | null
            rewards: Array<{
              __typename: 'GqlPoolStakingGaugeReward'
              id: string
              rewardPerSecond: string
              tokenAddress: string
            }>
          } | null
        } | null
        investConfig: {
          __typename: 'GqlPoolInvestConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolInvestOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        withdrawConfig: {
          __typename: 'GqlPoolWithdrawConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolWithdrawOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        userBalance?: {
          __typename: 'GqlPoolUserBalance'
          stakedBalance: string
          totalBalance: string
          walletBalance: string
          stakedBalanceUsd: number
          walletBalanceUsd: number
          totalBalanceUsd: number
        } | null
      }
    | {
        __typename: 'GqlPoolLiquidityBootstrapping'
        name: string
        nestingType: GqlPoolNestingType
        id: string
        address: string
        version: number
        owner: string
        decimals: number
        factory?: string | null
        symbol: string
        createTime: number
        type: GqlPoolType
        chain: GqlChain
        tokens: Array<
          | {
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }
          | {
              __typename: 'GqlPoolTokenComposableStable'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              weight?: string | null
              priceRate: string
              decimals: number
              totalBalance: string
              pool: {
                __typename: 'GqlPoolComposableStableNested'
                id: string
                type: GqlPoolType
                version: number
                name: string
                symbol: string
                address: string
                owner: string
                factory?: string | null
                createTime: number
                totalShares: string
                totalLiquidity: string
                nestingType: GqlPoolNestingType
                swapFee: string
                amp: string
                bptPriceRate: string
                tokens: Array<
                  | {
                      __typename: 'GqlPoolToken'
                      id: string
                      index: number
                      name: string
                      symbol: string
                      balance: string
                      address: string
                      priceRate: string
                      decimals: number
                      weight?: string | null
                      totalBalance: string
                    }
                  | {
                      __typename: 'GqlPoolTokenLinear'
                      id: string
                      index: number
                      name: string
                      symbol: string
                      balance: string
                      address: string
                      priceRate: string
                      decimals: number
                      weight?: string | null
                      mainTokenBalance: string
                      wrappedTokenBalance: string
                      totalMainTokenBalance: string
                      totalBalance: string
                      pool: {
                        __typename: 'GqlPoolLinearNested'
                        id: string
                        type: GqlPoolType
                        version: number
                        name: string
                        symbol: string
                        address: string
                        owner: string
                        factory?: string | null
                        createTime: number
                        wrappedIndex: number
                        mainIndex: number
                        upperTarget: string
                        lowerTarget: string
                        totalShares: string
                        totalLiquidity: string
                        bptPriceRate: string
                        tokens: Array<{
                          __typename: 'GqlPoolToken'
                          id: string
                          index: number
                          name: string
                          symbol: string
                          balance: string
                          address: string
                          priceRate: string
                          decimals: number
                          weight?: string | null
                          totalBalance: string
                        }>
                      }
                    }
                >
              }
            }
          | {
              __typename: 'GqlPoolTokenLinear'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              mainTokenBalance: string
              wrappedTokenBalance: string
              totalMainTokenBalance: string
              totalBalance: string
              pool: {
                __typename: 'GqlPoolLinearNested'
                id: string
                type: GqlPoolType
                version: number
                name: string
                symbol: string
                address: string
                owner: string
                factory?: string | null
                createTime: number
                wrappedIndex: number
                mainIndex: number
                upperTarget: string
                lowerTarget: string
                totalShares: string
                totalLiquidity: string
                bptPriceRate: string
                tokens: Array<{
                  __typename: 'GqlPoolToken'
                  id: string
                  index: number
                  name: string
                  symbol: string
                  balance: string
                  address: string
                  priceRate: string
                  decimals: number
                  weight?: string | null
                  totalBalance: string
                }>
              }
            }
        >
        dynamicData: {
          __typename: 'GqlPoolDynamicData'
          poolId: string
          swapEnabled: boolean
          totalLiquidity: string
          totalLiquidity24hAgo: string
          totalShares: string
          totalShares24hAgo: string
          fees24h: string
          swapFee: string
          volume24h: string
          fees48h: string
          volume48h: string
          lifetimeVolume: string
          lifetimeSwapFees: string
          holdersCount: string
          swapsCount: string
          sharePriceAth: string
          sharePriceAthTimestamp: number
          sharePriceAtl: string
          sharePriceAtlTimestamp: number
          totalLiquidityAth: string
          totalLiquidityAthTimestamp: number
          totalLiquidityAtl: string
          totalLiquidityAtlTimestamp: number
          volume24hAth: string
          volume24hAthTimestamp: number
          volume24hAtl: string
          volume24hAtlTimestamp: number
          fees24hAth: string
          fees24hAthTimestamp: number
          fees24hAtl: string
          fees24hAtlTimestamp: number
          yieldCapture24h: string
          yieldCapture48h: string
          apr: {
            __typename: 'GqlPoolApr'
            hasRewardApr: boolean
            swapApr: string
            thirdPartyApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            nativeRewardApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            apr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            items: Array<{
              __typename: 'GqlBalancePoolAprItem'
              id: string
              title: string
              apr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string }
              subItems?: Array<{
                __typename: 'GqlBalancePoolAprSubItem'
                id: string
                title: string
                apr:
                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                  | { __typename: 'GqlPoolAprTotal'; total: string }
              }> | null
            }>
          }
        }
        allTokens: Array<{
          __typename: 'GqlPoolTokenExpanded'
          id: string
          address: string
          name: string
          symbol: string
          decimals: number
          isNested: boolean
          isPhantomBpt: boolean
          isMainToken: boolean
        }>
        displayTokens: Array<{
          __typename: 'GqlPoolTokenDisplay'
          id: string
          address: string
          name: string
          weight?: string | null
          symbol: string
          nestedTokens?: Array<{
            __typename: 'GqlPoolTokenDisplay'
            id: string
            address: string
            name: string
            weight?: string | null
            symbol: string
          }> | null
        }>
        staking?: {
          __typename: 'GqlPoolStaking'
          id: string
          type: GqlPoolStakingType
          chain: GqlChain
          address: string
          gauge?: {
            __typename: 'GqlPoolStakingGauge'
            id: string
            gaugeAddress: string
            version: number
            status: GqlPoolStakingGaugeStatus
            workingSupply: string
            otherGauges?: Array<{
              __typename: 'GqlPoolStakingOtherGauge'
              gaugeAddress: string
              version: number
              status: GqlPoolStakingGaugeStatus
              id: string
              rewards: Array<{
                __typename: 'GqlPoolStakingGaugeReward'
                id: string
                tokenAddress: string
                rewardPerSecond: string
              }>
            }> | null
            rewards: Array<{
              __typename: 'GqlPoolStakingGaugeReward'
              id: string
              rewardPerSecond: string
              tokenAddress: string
            }>
          } | null
        } | null
        investConfig: {
          __typename: 'GqlPoolInvestConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolInvestOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        withdrawConfig: {
          __typename: 'GqlPoolWithdrawConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolWithdrawOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        userBalance?: {
          __typename: 'GqlPoolUserBalance'
          stakedBalance: string
          totalBalance: string
          walletBalance: string
          stakedBalanceUsd: number
          walletBalanceUsd: number
          totalBalanceUsd: number
        } | null
      }
    | {
        __typename: 'GqlPoolMetaStable'
        amp: string
        id: string
        address: string
        name: string
        version: number
        owner: string
        decimals: number
        factory?: string | null
        symbol: string
        createTime: number
        type: GqlPoolType
        chain: GqlChain
        tokens: Array<{
          __typename: 'GqlPoolToken'
          id: string
          index: number
          name: string
          symbol: string
          balance: string
          address: string
          priceRate: string
          decimals: number
          weight?: string | null
          totalBalance: string
        }>
        dynamicData: {
          __typename: 'GqlPoolDynamicData'
          poolId: string
          swapEnabled: boolean
          totalLiquidity: string
          totalLiquidity24hAgo: string
          totalShares: string
          totalShares24hAgo: string
          fees24h: string
          swapFee: string
          volume24h: string
          fees48h: string
          volume48h: string
          lifetimeVolume: string
          lifetimeSwapFees: string
          holdersCount: string
          swapsCount: string
          sharePriceAth: string
          sharePriceAthTimestamp: number
          sharePriceAtl: string
          sharePriceAtlTimestamp: number
          totalLiquidityAth: string
          totalLiquidityAthTimestamp: number
          totalLiquidityAtl: string
          totalLiquidityAtlTimestamp: number
          volume24hAth: string
          volume24hAthTimestamp: number
          volume24hAtl: string
          volume24hAtlTimestamp: number
          fees24hAth: string
          fees24hAthTimestamp: number
          fees24hAtl: string
          fees24hAtlTimestamp: number
          yieldCapture24h: string
          yieldCapture48h: string
          apr: {
            __typename: 'GqlPoolApr'
            hasRewardApr: boolean
            swapApr: string
            thirdPartyApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            nativeRewardApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            apr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            items: Array<{
              __typename: 'GqlBalancePoolAprItem'
              id: string
              title: string
              apr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string }
              subItems?: Array<{
                __typename: 'GqlBalancePoolAprSubItem'
                id: string
                title: string
                apr:
                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                  | { __typename: 'GqlPoolAprTotal'; total: string }
              }> | null
            }>
          }
        }
        allTokens: Array<{
          __typename: 'GqlPoolTokenExpanded'
          id: string
          address: string
          name: string
          symbol: string
          decimals: number
          isNested: boolean
          isPhantomBpt: boolean
          isMainToken: boolean
        }>
        displayTokens: Array<{
          __typename: 'GqlPoolTokenDisplay'
          id: string
          address: string
          name: string
          weight?: string | null
          symbol: string
          nestedTokens?: Array<{
            __typename: 'GqlPoolTokenDisplay'
            id: string
            address: string
            name: string
            weight?: string | null
            symbol: string
          }> | null
        }>
        staking?: {
          __typename: 'GqlPoolStaking'
          id: string
          type: GqlPoolStakingType
          chain: GqlChain
          address: string
          gauge?: {
            __typename: 'GqlPoolStakingGauge'
            id: string
            gaugeAddress: string
            version: number
            status: GqlPoolStakingGaugeStatus
            workingSupply: string
            otherGauges?: Array<{
              __typename: 'GqlPoolStakingOtherGauge'
              gaugeAddress: string
              version: number
              status: GqlPoolStakingGaugeStatus
              id: string
              rewards: Array<{
                __typename: 'GqlPoolStakingGaugeReward'
                id: string
                tokenAddress: string
                rewardPerSecond: string
              }>
            }> | null
            rewards: Array<{
              __typename: 'GqlPoolStakingGaugeReward'
              id: string
              rewardPerSecond: string
              tokenAddress: string
            }>
          } | null
        } | null
        investConfig: {
          __typename: 'GqlPoolInvestConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolInvestOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        withdrawConfig: {
          __typename: 'GqlPoolWithdrawConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolWithdrawOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        userBalance?: {
          __typename: 'GqlPoolUserBalance'
          stakedBalance: string
          totalBalance: string
          walletBalance: string
          stakedBalanceUsd: number
          walletBalanceUsd: number
          totalBalanceUsd: number
        } | null
      }
    | {
        __typename: 'GqlPoolStable'
        amp: string
        id: string
        address: string
        name: string
        version: number
        owner: string
        decimals: number
        factory?: string | null
        symbol: string
        createTime: number
        type: GqlPoolType
        chain: GqlChain
        tokens: Array<{
          __typename: 'GqlPoolToken'
          id: string
          index: number
          name: string
          symbol: string
          balance: string
          address: string
          priceRate: string
          decimals: number
          weight?: string | null
          totalBalance: string
        }>
        dynamicData: {
          __typename: 'GqlPoolDynamicData'
          poolId: string
          swapEnabled: boolean
          totalLiquidity: string
          totalLiquidity24hAgo: string
          totalShares: string
          totalShares24hAgo: string
          fees24h: string
          swapFee: string
          volume24h: string
          fees48h: string
          volume48h: string
          lifetimeVolume: string
          lifetimeSwapFees: string
          holdersCount: string
          swapsCount: string
          sharePriceAth: string
          sharePriceAthTimestamp: number
          sharePriceAtl: string
          sharePriceAtlTimestamp: number
          totalLiquidityAth: string
          totalLiquidityAthTimestamp: number
          totalLiquidityAtl: string
          totalLiquidityAtlTimestamp: number
          volume24hAth: string
          volume24hAthTimestamp: number
          volume24hAtl: string
          volume24hAtlTimestamp: number
          fees24hAth: string
          fees24hAthTimestamp: number
          fees24hAtl: string
          fees24hAtlTimestamp: number
          yieldCapture24h: string
          yieldCapture48h: string
          apr: {
            __typename: 'GqlPoolApr'
            hasRewardApr: boolean
            swapApr: string
            thirdPartyApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            nativeRewardApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            apr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            items: Array<{
              __typename: 'GqlBalancePoolAprItem'
              id: string
              title: string
              apr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string }
              subItems?: Array<{
                __typename: 'GqlBalancePoolAprSubItem'
                id: string
                title: string
                apr:
                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                  | { __typename: 'GqlPoolAprTotal'; total: string }
              }> | null
            }>
          }
        }
        allTokens: Array<{
          __typename: 'GqlPoolTokenExpanded'
          id: string
          address: string
          name: string
          symbol: string
          decimals: number
          isNested: boolean
          isPhantomBpt: boolean
          isMainToken: boolean
        }>
        displayTokens: Array<{
          __typename: 'GqlPoolTokenDisplay'
          id: string
          address: string
          name: string
          weight?: string | null
          symbol: string
          nestedTokens?: Array<{
            __typename: 'GqlPoolTokenDisplay'
            id: string
            address: string
            name: string
            weight?: string | null
            symbol: string
          }> | null
        }>
        staking?: {
          __typename: 'GqlPoolStaking'
          id: string
          type: GqlPoolStakingType
          chain: GqlChain
          address: string
          gauge?: {
            __typename: 'GqlPoolStakingGauge'
            id: string
            gaugeAddress: string
            version: number
            status: GqlPoolStakingGaugeStatus
            workingSupply: string
            otherGauges?: Array<{
              __typename: 'GqlPoolStakingOtherGauge'
              gaugeAddress: string
              version: number
              status: GqlPoolStakingGaugeStatus
              id: string
              rewards: Array<{
                __typename: 'GqlPoolStakingGaugeReward'
                id: string
                tokenAddress: string
                rewardPerSecond: string
              }>
            }> | null
            rewards: Array<{
              __typename: 'GqlPoolStakingGaugeReward'
              id: string
              rewardPerSecond: string
              tokenAddress: string
            }>
          } | null
        } | null
        investConfig: {
          __typename: 'GqlPoolInvestConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolInvestOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        withdrawConfig: {
          __typename: 'GqlPoolWithdrawConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolWithdrawOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        userBalance?: {
          __typename: 'GqlPoolUserBalance'
          stakedBalance: string
          totalBalance: string
          walletBalance: string
          stakedBalanceUsd: number
          walletBalanceUsd: number
          totalBalanceUsd: number
        } | null
      }
    | {
        __typename: 'GqlPoolWeighted'
        nestingType: GqlPoolNestingType
        id: string
        address: string
        name: string
        version: number
        owner: string
        decimals: number
        factory?: string | null
        symbol: string
        createTime: number
        type: GqlPoolType
        chain: GqlChain
        tokens: Array<
          | {
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }
          | {
              __typename: 'GqlPoolTokenComposableStable'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              weight?: string | null
              priceRate: string
              decimals: number
              totalBalance: string
              pool: {
                __typename: 'GqlPoolComposableStableNested'
                id: string
                type: GqlPoolType
                version: number
                name: string
                symbol: string
                address: string
                owner: string
                factory?: string | null
                createTime: number
                totalShares: string
                totalLiquidity: string
                nestingType: GqlPoolNestingType
                swapFee: string
                amp: string
                bptPriceRate: string
                tokens: Array<
                  | {
                      __typename: 'GqlPoolToken'
                      id: string
                      index: number
                      name: string
                      symbol: string
                      balance: string
                      address: string
                      priceRate: string
                      decimals: number
                      weight?: string | null
                      totalBalance: string
                    }
                  | {
                      __typename: 'GqlPoolTokenLinear'
                      id: string
                      index: number
                      name: string
                      symbol: string
                      balance: string
                      address: string
                      priceRate: string
                      decimals: number
                      weight?: string | null
                      mainTokenBalance: string
                      wrappedTokenBalance: string
                      totalMainTokenBalance: string
                      totalBalance: string
                      pool: {
                        __typename: 'GqlPoolLinearNested'
                        id: string
                        type: GqlPoolType
                        version: number
                        name: string
                        symbol: string
                        address: string
                        owner: string
                        factory?: string | null
                        createTime: number
                        wrappedIndex: number
                        mainIndex: number
                        upperTarget: string
                        lowerTarget: string
                        totalShares: string
                        totalLiquidity: string
                        bptPriceRate: string
                        tokens: Array<{
                          __typename: 'GqlPoolToken'
                          id: string
                          index: number
                          name: string
                          symbol: string
                          balance: string
                          address: string
                          priceRate: string
                          decimals: number
                          weight?: string | null
                          totalBalance: string
                        }>
                      }
                    }
                >
              }
            }
          | {
              __typename: 'GqlPoolTokenLinear'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              mainTokenBalance: string
              wrappedTokenBalance: string
              totalMainTokenBalance: string
              totalBalance: string
              pool: {
                __typename: 'GqlPoolLinearNested'
                id: string
                type: GqlPoolType
                version: number
                name: string
                symbol: string
                address: string
                owner: string
                factory?: string | null
                createTime: number
                wrappedIndex: number
                mainIndex: number
                upperTarget: string
                lowerTarget: string
                totalShares: string
                totalLiquidity: string
                bptPriceRate: string
                tokens: Array<{
                  __typename: 'GqlPoolToken'
                  id: string
                  index: number
                  name: string
                  symbol: string
                  balance: string
                  address: string
                  priceRate: string
                  decimals: number
                  weight?: string | null
                  totalBalance: string
                }>
              }
            }
        >
        dynamicData: {
          __typename: 'GqlPoolDynamicData'
          poolId: string
          swapEnabled: boolean
          totalLiquidity: string
          totalLiquidity24hAgo: string
          totalShares: string
          totalShares24hAgo: string
          fees24h: string
          swapFee: string
          volume24h: string
          fees48h: string
          volume48h: string
          lifetimeVolume: string
          lifetimeSwapFees: string
          holdersCount: string
          swapsCount: string
          sharePriceAth: string
          sharePriceAthTimestamp: number
          sharePriceAtl: string
          sharePriceAtlTimestamp: number
          totalLiquidityAth: string
          totalLiquidityAthTimestamp: number
          totalLiquidityAtl: string
          totalLiquidityAtlTimestamp: number
          volume24hAth: string
          volume24hAthTimestamp: number
          volume24hAtl: string
          volume24hAtlTimestamp: number
          fees24hAth: string
          fees24hAthTimestamp: number
          fees24hAtl: string
          fees24hAtlTimestamp: number
          yieldCapture24h: string
          yieldCapture48h: string
          apr: {
            __typename: 'GqlPoolApr'
            hasRewardApr: boolean
            swapApr: string
            thirdPartyApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            nativeRewardApr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            apr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
            items: Array<{
              __typename: 'GqlBalancePoolAprItem'
              id: string
              title: string
              apr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string }
              subItems?: Array<{
                __typename: 'GqlBalancePoolAprSubItem'
                id: string
                title: string
                apr:
                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                  | { __typename: 'GqlPoolAprTotal'; total: string }
              }> | null
            }>
          }
        }
        allTokens: Array<{
          __typename: 'GqlPoolTokenExpanded'
          id: string
          address: string
          name: string
          symbol: string
          decimals: number
          isNested: boolean
          isPhantomBpt: boolean
          isMainToken: boolean
        }>
        displayTokens: Array<{
          __typename: 'GqlPoolTokenDisplay'
          id: string
          address: string
          name: string
          weight?: string | null
          symbol: string
          nestedTokens?: Array<{
            __typename: 'GqlPoolTokenDisplay'
            id: string
            address: string
            name: string
            weight?: string | null
            symbol: string
          }> | null
        }>
        staking?: {
          __typename: 'GqlPoolStaking'
          id: string
          type: GqlPoolStakingType
          chain: GqlChain
          address: string
          gauge?: {
            __typename: 'GqlPoolStakingGauge'
            id: string
            gaugeAddress: string
            version: number
            status: GqlPoolStakingGaugeStatus
            workingSupply: string
            otherGauges?: Array<{
              __typename: 'GqlPoolStakingOtherGauge'
              gaugeAddress: string
              version: number
              status: GqlPoolStakingGaugeStatus
              id: string
              rewards: Array<{
                __typename: 'GqlPoolStakingGaugeReward'
                id: string
                tokenAddress: string
                rewardPerSecond: string
              }>
            }> | null
            rewards: Array<{
              __typename: 'GqlPoolStakingGaugeReward'
              id: string
              rewardPerSecond: string
              tokenAddress: string
            }>
          } | null
        } | null
        investConfig: {
          __typename: 'GqlPoolInvestConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolInvestOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        withdrawConfig: {
          __typename: 'GqlPoolWithdrawConfig'
          singleAssetEnabled: boolean
          proportionalEnabled: boolean
          options: Array<{
            __typename: 'GqlPoolWithdrawOption'
            poolTokenIndex: number
            poolTokenAddress: string
            tokenOptions: Array<{
              __typename: 'GqlPoolToken'
              id: string
              index: number
              name: string
              symbol: string
              balance: string
              address: string
              priceRate: string
              decimals: number
              weight?: string | null
              totalBalance: string
            }>
          }>
        }
        userBalance?: {
          __typename: 'GqlPoolUserBalance'
          stakedBalance: string
          totalBalance: string
          walletBalance: string
          stakedBalanceUsd: number
          walletBalanceUsd: number
          totalBalanceUsd: number
        } | null
      }
}

export type GetPoolSwapsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  where?: InputMaybe<GqlPoolSwapFilter>
}>

export type GetPoolSwapsQuery = {
  __typename: 'Query'
  swaps: Array<{
    __typename: 'GqlPoolSwap'
    id: string
    poolId: string
    timestamp: number
    tokenAmountIn: string
    tokenAmountOut: string
    tokenIn: string
    tokenOut: string
    tx: string
    userAddress: string
    valueUSD: number
  }>
}

export type GetPoolJoinExitsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  poolId: Scalars['String']['input']
}>

export type GetPoolJoinExitsQuery = {
  __typename: 'Query'
  joinExits: Array<{
    __typename: 'GqlPoolJoinExit'
    id: string
    timestamp: number
    tx: string
    type: GqlPoolJoinExitType
    poolId: string
    valueUSD?: string | null
    amounts: Array<{ __typename: 'GqlPoolJoinExitAmount'; address: string; amount: string }>
  }>
}

export type GetPoolBptPriceChartDataQueryVariables = Exact<{
  address: Scalars['String']['input']
  range: GqlTokenChartDataRange
}>

export type GetPoolBptPriceChartDataQuery = {
  __typename: 'Query'
  prices: Array<{
    __typename: 'GqlTokenPriceChartDataItem'
    id: string
    price: string
    timestamp: number
  }>
}

export type GetPoolUserJoinExitsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  poolId: Scalars['String']['input']
}>

export type GetPoolUserJoinExitsQuery = {
  __typename: 'Query'
  joinExits: Array<{
    __typename: 'GqlPoolJoinExit'
    id: string
    timestamp: number
    tx: string
    type: GqlPoolJoinExitType
    poolId: string
    valueUSD?: string | null
    amounts: Array<{ __typename: 'GqlPoolJoinExitAmount'; address: string; amount: string }>
  }>
}

export type GetUserSwapsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  poolId: Scalars['String']['input']
}>

export type GetUserSwapsQuery = {
  __typename: 'Query'
  swaps: Array<{
    __typename: 'GqlPoolSwap'
    id: string
    poolId: string
    timestamp: number
    tokenAmountIn: string
    tokenAmountOut: string
    tokenIn: string
    tokenOut: string
    tx: string
    valueUSD: number
  }>
}

export type GetPoolSnapshotsQueryVariables = Exact<{
  poolId: Scalars['String']['input']
  range: GqlPoolSnapshotDataRange
}>

export type GetPoolSnapshotsQuery = {
  __typename: 'Query'
  snapshots: Array<{
    __typename: 'GqlPoolSnapshot'
    id: string
    timestamp: number
    totalLiquidity: string
    volume24h: string
    fees24h: string
    sharePrice: string
  }>
}

export type GetPoolTokensDynamicDataQueryVariables = Exact<{
  addresses: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type GetPoolTokensDynamicDataQuery = {
  __typename: 'Query'
  staticData: Array<{
    __typename: 'GqlTokenData'
    id: string
    tokenAddress: string
    description?: string | null
    discordUrl?: string | null
    telegramUrl?: string | null
    twitterUsername?: string | null
    websiteUrl?: string | null
  }>
  dynamicData: Array<
    { __typename: 'GqlTokenDynamicData' } & {
      ' $fragmentRefs'?: { GqlTokenDynamicDataFragment: GqlTokenDynamicDataFragment }
    }
  >
}

export type GetPoolJoinsExitsSwapsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  poolId: Scalars['String']['input']
  chainId: GqlChain
}>

export type GetPoolJoinsExitsSwapsQuery = {
  __typename: 'Query'
  swaps: Array<{
    __typename: 'GqlPoolSwap'
    id: string
    poolId: string
    timestamp: number
    tokenAmountIn: string
    tokenAmountOut: string
    tokenIn: string
    tokenOut: string
    tx: string
    userAddress: string
    valueUSD: number
  }>
  joinExits: Array<{
    __typename: 'GqlPoolJoinExit'
    id: string
    timestamp: number
    tx: string
    type: GqlPoolJoinExitType
    poolId: string
    valueUSD?: string | null
    amounts: Array<{ __typename: 'GqlPoolJoinExitAmount'; address: string; amount: string }>
  }>
}

export type GetPoolsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<GqlPoolOrderBy>
  orderDirection?: InputMaybe<GqlPoolOrderDirection>
  where?: InputMaybe<GqlPoolFilter>
  textSearch?: InputMaybe<Scalars['String']['input']>
}>

export type GetPoolsQuery = {
  __typename: 'Query'
  count: number
  pools: Array<{
    __typename: 'GqlPoolMinimal'
    address: string
    chain: GqlChain
    createTime: number
    decimals: number
    factory?: string | null
    id: string
    name: string
    owner?: string | null
    symbol: string
    type: GqlPoolType
    displayTokens: Array<{
      __typename: 'GqlPoolTokenDisplay'
      id: string
      address: string
      name: string
      weight?: string | null
      symbol: string
      nestedTokens?: Array<{
        __typename: 'GqlPoolTokenDisplay'
        id: string
        address: string
        name: string
        weight?: string | null
        symbol: string
      }> | null
    }>
    dynamicData: {
      __typename: 'GqlPoolDynamicData'
      totalLiquidity: string
      lifetimeVolume: string
      lifetimeSwapFees: string
      volume24h: string
      fees24h: string
      holdersCount: string
      swapFee: string
      swapsCount: string
      totalShares: string
      apr: {
        __typename: 'GqlPoolApr'
        hasRewardApr: boolean
        swapApr: string
        apr:
          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
          | { __typename: 'GqlPoolAprTotal'; total: string }
        thirdPartyApr:
          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
          | { __typename: 'GqlPoolAprTotal'; total: string }
        nativeRewardApr:
          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
          | { __typename: 'GqlPoolAprTotal'; total: string }
        items: Array<{
          __typename: 'GqlBalancePoolAprItem'
          id: string
          title: string
          apr:
            | { __typename: 'GqlPoolAprRange'; min: string; max: string }
            | { __typename: 'GqlPoolAprTotal'; total: string }
          subItems?: Array<{
            __typename: 'GqlBalancePoolAprSubItem'
            id: string
            title: string
            apr:
              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename: 'GqlPoolAprTotal'; total: string }
          }> | null
        }>
      }
    }
    userBalance?: {
      __typename: 'GqlPoolUserBalance'
      totalBalance: string
      totalBalanceUsd: number
      stakedBalance: string
      walletBalance: string
    } | null
  }>
}

export type GetSorSwapsQueryVariables = Exact<{
  tokenIn: Scalars['String']['input']
  tokenOut: Scalars['String']['input']
  swapType: GqlSorSwapType
  swapAmount: Scalars['BigDecimal']['input']
  chain: GqlChain
  swapOptions: GqlSorSwapOptionsInput
}>

export type GetSorSwapsQuery = {
  __typename: 'Query'
  swaps: {
    __typename: 'GqlSorGetSwapsResponse'
    tokenIn: string
    tokenOut: string
    swapAmount: string
    swapAmountForSwaps?: string | null
    returnAmount: string
    returnAmountFromSwaps?: string | null
    returnAmountConsideringFees: string
    marketSp: string
    tokenAddresses: Array<string>
    swaps: Array<{
      __typename: 'GqlSorSwap'
      amount: string
      assetInIndex: number
      assetOutIndex: number
      poolId: string
      userData: string
    }>
  }
}

export type GqlTokenDynamicDataFragment = {
  __typename: 'GqlTokenDynamicData'
  id: string
  tokenAddress: string
  ath: number
  atl: number
  marketCap?: string | null
  fdv?: string | null
  priceChange24h: number
  priceChangePercent24h: number
  priceChangePercent7d?: number | null
  priceChangePercent14d?: number | null
  priceChangePercent30d?: number | null
  high24h: number
  low24h: number
  updatedAt: string
} & { ' $fragmentName'?: 'GqlTokenDynamicDataFragment' }

export const GqlTokenDynamicDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'GqlTokenDynamicData' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GqlTokenDynamicData' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tokenAddress' } },
          { kind: 'Field', name: { kind: 'Name', value: 'ath' } },
          { kind: 'Field', name: { kind: 'Name', value: 'atl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'marketCap' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fdv' } },
          { kind: 'Field', name: { kind: 'Name', value: 'priceChange24h' } },
          { kind: 'Field', name: { kind: 'Name', value: 'priceChangePercent24h' } },
          { kind: 'Field', name: { kind: 'Name', value: 'priceChangePercent7d' } },
          { kind: 'Field', name: { kind: 'Name', value: 'priceChangePercent14d' } },
          { kind: 'Field', name: { kind: 'Name', value: 'priceChangePercent30d' } },
          { kind: 'Field', name: { kind: 'Name', value: 'high24h' } },
          { kind: 'Field', name: { kind: 'Name', value: 'low24h' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GqlTokenDynamicDataFragment, unknown>
export const GetAppGlobalPollingDataDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetAppGlobalPollingData' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tokenGetCurrentPrices' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'protocolMetricsChain' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalLiquidity' } },
                { kind: 'Field', name: { kind: 'Name', value: 'totalSwapVolume' } },
                { kind: 'Field', name: { kind: 'Name', value: 'totalSwapFee' } },
                { kind: 'Field', name: { kind: 'Name', value: 'poolCount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'swapFee24h' } },
                { kind: 'Field', name: { kind: 'Name', value: 'swapVolume24h' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'blocksGetBlocksPerDay' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blocksGetAverageBlockTime' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetAppGlobalPollingDataQuery, GetAppGlobalPollingDataQueryVariables>
export const GetTokensDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetTokens' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'chains' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: { kind: 'NamedType', name: { kind: 'Name', value: 'GqlChain' } },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'tokens' },
            name: { kind: 'Name', value: 'tokenGetTokens' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'chains' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'chains' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                { kind: 'Field', name: { kind: 'Name', value: 'chain' } },
                { kind: 'Field', name: { kind: 'Name', value: 'chainId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'logoURI' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priority' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tradable' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTokensQuery, GetTokensQueryVariables>
export const GetTokenPricesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetTokenPrices' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'chains' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: { kind: 'NamedType', name: { kind: 'Name', value: 'GqlChain' } },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'tokenPrices' },
            name: { kind: 'Name', value: 'tokenGetCurrentPrices' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'chains' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'chains' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                { kind: 'Field', name: { kind: 'Name', value: 'chain' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTokenPricesQuery, GetTokenPricesQueryVariables>
export const GetTokensDynamicDataDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetTokensDynamicData' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'addresses' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'dynamicData' },
            name: { kind: 'Name', value: 'tokenGetTokensDynamicData' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'addresses' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'addresses' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'ath' } },
                { kind: 'Field', name: { kind: 'Name', value: 'atl' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fdv' } },
                { kind: 'Field', name: { kind: 'Name', value: 'high24h' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'low24h' } },
                { kind: 'Field', name: { kind: 'Name', value: 'marketCap' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceChange24h' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceChangePercent7d' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceChangePercent14d' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceChangePercent24h' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceChangePercent30d' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenAddress' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTokensDynamicDataQuery, GetTokensDynamicDataQueryVariables>
export const GetBlocksPerDayDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetBlocksPerDay' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'blocksPerDay' },
            name: { kind: 'Name', value: 'blocksGetBlocksPerDay' },
          },
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'avgBlockTime' },
            name: { kind: 'Name', value: 'blocksGetAverageBlockTime' },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetBlocksPerDayQuery, GetBlocksPerDayQueryVariables>
export const GetPoolDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPool' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'chain' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'GqlChain' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'userAddress' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'pool' },
            name: { kind: 'Name', value: 'poolGetPool' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'chain' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'chain' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'userAddress' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'userAddress' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'version' } },
                { kind: 'Field', name: { kind: 'Name', value: 'owner' } },
                { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                { kind: 'Field', name: { kind: 'Name', value: 'factory' } },
                { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createTime' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'chain' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'dynamicData' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'poolId' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'swapEnabled' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'totalLiquidity' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'totalLiquidity24hAgo' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'totalShares' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'totalShares24hAgo' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fees24h' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'swapFee' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'volume24h' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fees48h' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'volume48h' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lifetimeVolume' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lifetimeSwapFees' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'holdersCount' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'swapsCount' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'sharePriceAth' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'sharePriceAthTimestamp' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'sharePriceAtl' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'sharePriceAtlTimestamp' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'totalLiquidityAth' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalLiquidityAthTimestamp' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'totalLiquidityAtl' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalLiquidityAtlTimestamp' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'volume24hAth' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'volume24hAthTimestamp' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'volume24hAtl' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'volume24hAtlTimestamp' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fees24hAth' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fees24hAthTimestamp' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fees24hAtl' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fees24hAtlTimestamp' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'yieldCapture24h' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'yieldCapture48h' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'apr' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'hasRewardApr' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'thirdPartyApr' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'GqlPoolAprTotal' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'GqlPoolAprRange' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'min' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'max' } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'nativeRewardApr' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'GqlPoolAprTotal' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'GqlPoolAprRange' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'min' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'max' } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'swapApr' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'apr' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'GqlPoolAprTotal' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'GqlPoolAprRange' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'min' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'max' } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'items' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'apr' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'InlineFragment',
                                          typeCondition: {
                                            kind: 'NamedType',
                                            name: { kind: 'Name', value: 'GqlPoolAprTotal' },
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'total' },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: 'InlineFragment',
                                          typeCondition: {
                                            kind: 'NamedType',
                                            name: { kind: 'Name', value: 'GqlPoolAprRange' },
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'min' },
                                              },
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'max' },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'subItems' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'apr' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'GqlPoolAprTotal' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'total' },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'GqlPoolAprRange' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'min' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'max' },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'allTokens' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'isNested' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'isPhantomBpt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'isMainToken' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'displayTokens' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'nestedTokens' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'staking' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'chain' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'gauge' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'gaugeAddress' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'version' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'workingSupply' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'otherGauges' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'gaugeAddress' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'version' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'rewards' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'tokenAddress' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'rewardPerSecond' },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'rewards' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'rewardPerSecond' },
                                  },
                                  { kind: 'Field', name: { kind: 'Name', value: 'tokenAddress' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'investConfig' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'singleAssetEnabled' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'proportionalEnabled' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'options' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'poolTokenIndex' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'poolTokenAddress' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'tokenOptions' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'GqlPoolToken' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'priceRate' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'decimals' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalBalance' },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'withdrawConfig' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'singleAssetEnabled' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'proportionalEnabled' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'options' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'poolTokenIndex' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'poolTokenAddress' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'tokenOptions' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'GqlPoolToken' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'priceRate' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'decimals' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalBalance' },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'userBalance' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'stakedBalance' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'walletBalance' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'stakedBalanceUsd' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'walletBalanceUsd' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'totalBalanceUsd' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'GqlPoolWeighted' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'nestingType' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tokens' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolToken' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                ],
                              },
                            },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolTokenLinear' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'mainTokenBalance' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'wrappedTokenBalance' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'totalMainTokenBalance' },
                                  },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pool' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'version' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'owner' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'factory' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'createTime' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'wrappedIndex' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'mainIndex' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'upperTarget' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'lowerTarget' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalShares' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalLiquidity' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'bptPriceRate' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'tokens' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'GqlPoolToken' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'index' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'name' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'symbol' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'balance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'address' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'priceRate' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'decimals' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'weight' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'totalBalance' },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolTokenComposableStable' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pool' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'version' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'owner' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'factory' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'createTime' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalShares' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalLiquidity' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'nestingType' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'swapFee' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'amp' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'bptPriceRate' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'tokens' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'GqlPoolToken' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'index' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'name' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'symbol' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'balance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'address' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'priceRate' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'decimals' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'weight' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'totalBalance' },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: {
                                                    kind: 'Name',
                                                    value: 'GqlPoolTokenLinear',
                                                  },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'index' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'name' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'symbol' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'balance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'address' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'priceRate' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'decimals' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'weight' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'mainTokenBalance',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'wrappedTokenBalance',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'totalMainTokenBalance',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'totalBalance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'pool' },
                                                      selectionSet: {
                                                        kind: 'SelectionSet',
                                                        selections: [
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'type' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'version',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'name' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'symbol' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'address',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'owner' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'factory',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'createTime',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'wrappedIndex',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'mainIndex',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'upperTarget',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'lowerTarget',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'totalShares',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'totalLiquidity',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'bptPriceRate',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tokens' },
                                                            selectionSet: {
                                                              kind: 'SelectionSet',
                                                              selections: [
                                                                {
                                                                  kind: 'InlineFragment',
                                                                  typeCondition: {
                                                                    kind: 'NamedType',
                                                                    name: {
                                                                      kind: 'Name',
                                                                      value: 'GqlPoolToken',
                                                                    },
                                                                  },
                                                                  selectionSet: {
                                                                    kind: 'SelectionSet',
                                                                    selections: [
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'id',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'index',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'name',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'symbol',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'balance',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'address',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'priceRate',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'decimals',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'weight',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'totalBalance',
                                                                        },
                                                                      },
                                                                    ],
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'GqlPoolStable' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'amp' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tokens' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolToken' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'GqlPoolMetaStable' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'amp' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tokens' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolToken' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'GqlPoolElement' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'unitSeconds' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'principalToken' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'baseToken' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tokens' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolToken' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'GqlPoolComposableStable' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'amp' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'nestingType' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'bptPriceRate' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tokens' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolToken' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                ],
                              },
                            },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolTokenLinear' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'mainTokenBalance' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'wrappedTokenBalance' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'totalMainTokenBalance' },
                                  },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pool' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'version' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'owner' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'factory' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'createTime' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'wrappedIndex' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'mainIndex' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'upperTarget' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'lowerTarget' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalShares' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalLiquidity' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'bptPriceRate' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'tokens' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'GqlPoolToken' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'index' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'name' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'symbol' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'balance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'address' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'priceRate' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'decimals' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'weight' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'totalBalance' },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolTokenComposableStable' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pool' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'version' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'owner' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'factory' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'createTime' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalShares' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalLiquidity' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'nestingType' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'swapFee' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'amp' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'bptPriceRate' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'tokens' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'GqlPoolToken' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'index' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'name' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'symbol' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'balance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'address' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'priceRate' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'decimals' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'weight' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'totalBalance' },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: {
                                                    kind: 'Name',
                                                    value: 'GqlPoolTokenLinear',
                                                  },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'index' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'name' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'symbol' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'balance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'address' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'priceRate' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'decimals' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'weight' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'mainTokenBalance',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'wrappedTokenBalance',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'totalMainTokenBalance',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'totalBalance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'pool' },
                                                      selectionSet: {
                                                        kind: 'SelectionSet',
                                                        selections: [
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'type' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'version',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'name' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'symbol' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'address',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'owner' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'factory',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'createTime',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'wrappedIndex',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'mainIndex',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'upperTarget',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'lowerTarget',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'totalShares',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'totalLiquidity',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'bptPriceRate',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tokens' },
                                                            selectionSet: {
                                                              kind: 'SelectionSet',
                                                              selections: [
                                                                {
                                                                  kind: 'InlineFragment',
                                                                  typeCondition: {
                                                                    kind: 'NamedType',
                                                                    name: {
                                                                      kind: 'Name',
                                                                      value: 'GqlPoolToken',
                                                                    },
                                                                  },
                                                                  selectionSet: {
                                                                    kind: 'SelectionSet',
                                                                    selections: [
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'id',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'index',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'name',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'symbol',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'balance',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'address',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'priceRate',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'decimals',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'weight',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'totalBalance',
                                                                        },
                                                                      },
                                                                    ],
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'GqlPoolLinear' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'mainIndex' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'wrappedIndex' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lowerTarget' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'upperTarget' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'bptPriceRate' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tokens' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolToken' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'GqlPoolLiquidityBootstrapping' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'nestingType' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tokens' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolToken' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                ],
                              },
                            },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolTokenLinear' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'mainTokenBalance' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'wrappedTokenBalance' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'totalMainTokenBalance' },
                                  },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pool' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'version' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'owner' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'factory' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'createTime' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'wrappedIndex' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'mainIndex' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'upperTarget' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'lowerTarget' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalShares' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalLiquidity' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'bptPriceRate' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'tokens' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'GqlPoolToken' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'index' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'name' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'symbol' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'balance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'address' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'priceRate' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'decimals' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'weight' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'totalBalance' },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolTokenComposableStable' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pool' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'version' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'owner' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'factory' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'createTime' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalShares' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalLiquidity' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'nestingType' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'swapFee' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'amp' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'bptPriceRate' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'tokens' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'GqlPoolToken' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'index' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'name' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'symbol' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'balance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'address' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'priceRate' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'decimals' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'weight' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'totalBalance' },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: {
                                                    kind: 'Name',
                                                    value: 'GqlPoolTokenLinear',
                                                  },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'index' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'name' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'symbol' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'balance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'address' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'priceRate' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'decimals' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'weight' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'mainTokenBalance',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'wrappedTokenBalance',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'totalMainTokenBalance',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'totalBalance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'pool' },
                                                      selectionSet: {
                                                        kind: 'SelectionSet',
                                                        selections: [
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'type' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'version',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'name' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'symbol' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'address',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'owner' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'factory',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'createTime',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'wrappedIndex',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'mainIndex',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'upperTarget',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'lowerTarget',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'totalShares',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'totalLiquidity',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'bptPriceRate',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tokens' },
                                                            selectionSet: {
                                                              kind: 'SelectionSet',
                                                              selections: [
                                                                {
                                                                  kind: 'InlineFragment',
                                                                  typeCondition: {
                                                                    kind: 'NamedType',
                                                                    name: {
                                                                      kind: 'Name',
                                                                      value: 'GqlPoolToken',
                                                                    },
                                                                  },
                                                                  selectionSet: {
                                                                    kind: 'SelectionSet',
                                                                    selections: [
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'id',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'index',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'name',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'symbol',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'balance',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'address',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'priceRate',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'decimals',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'weight',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'totalBalance',
                                                                        },
                                                                      },
                                                                    ],
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'GqlPoolGyro' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'alpha' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'beta' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'nestingType' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tokens' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolToken' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                ],
                              },
                            },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolTokenLinear' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'mainTokenBalance' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'wrappedTokenBalance' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'totalMainTokenBalance' },
                                  },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pool' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'version' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'owner' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'factory' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'createTime' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'wrappedIndex' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'mainIndex' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'upperTarget' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'lowerTarget' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalShares' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalLiquidity' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'bptPriceRate' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'tokens' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'GqlPoolToken' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'index' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'name' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'symbol' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'balance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'address' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'priceRate' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'decimals' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'weight' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'totalBalance' },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'GqlPoolTokenComposableStable' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'priceRate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pool' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'version' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'owner' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'factory' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'createTime' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalShares' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'totalLiquidity' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'nestingType' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'swapFee' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'amp' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'bptPriceRate' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'tokens' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'GqlPoolToken' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'index' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'name' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'symbol' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'balance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'address' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'priceRate' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'decimals' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'weight' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'totalBalance' },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: {
                                                    kind: 'Name',
                                                    value: 'GqlPoolTokenLinear',
                                                  },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'index' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'name' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'symbol' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'balance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'address' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'priceRate' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'decimals' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'weight' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'mainTokenBalance',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'wrappedTokenBalance',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'totalMainTokenBalance',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'totalBalance' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'pool' },
                                                      selectionSet: {
                                                        kind: 'SelectionSet',
                                                        selections: [
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'type' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'version',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'name' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'symbol' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'address',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'owner' },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'factory',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'createTime',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'wrappedIndex',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'mainIndex',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'upperTarget',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'lowerTarget',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'totalShares',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'totalLiquidity',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'bptPriceRate',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tokens' },
                                                            selectionSet: {
                                                              kind: 'SelectionSet',
                                                              selections: [
                                                                {
                                                                  kind: 'InlineFragment',
                                                                  typeCondition: {
                                                                    kind: 'NamedType',
                                                                    name: {
                                                                      kind: 'Name',
                                                                      value: 'GqlPoolToken',
                                                                    },
                                                                  },
                                                                  selectionSet: {
                                                                    kind: 'SelectionSet',
                                                                    selections: [
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'id',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'index',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'name',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'symbol',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'balance',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'address',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'priceRate',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'decimals',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'weight',
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: 'Field',
                                                                        name: {
                                                                          kind: 'Name',
                                                                          value: 'totalBalance',
                                                                        },
                                                                      },
                                                                    ],
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPoolQuery, GetPoolQueryVariables>
export const GetPoolSwapsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPoolSwaps' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'where' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'GqlPoolSwapFilter' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'swaps' },
            name: { kind: 'Name', value: 'poolGetSwaps' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'where' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'poolId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenAmountIn' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenAmountOut' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenIn' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenOut' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tx' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userAddress' } },
                { kind: 'Field', name: { kind: 'Name', value: 'valueUSD' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPoolSwapsQuery, GetPoolSwapsQueryVariables>
export const GetPoolJoinExitsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPoolJoinExits' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'poolId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'joinExits' },
            name: { kind: 'Name', value: 'poolGetJoinExits' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'poolIdIn' },
                      value: {
                        kind: 'ListValue',
                        values: [{ kind: 'Variable', name: { kind: 'Name', value: 'poolId' } }],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tx' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'poolId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'valueUSD' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'amounts' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPoolJoinExitsQuery, GetPoolJoinExitsQueryVariables>
export const GetPoolBptPriceChartDataDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPoolBptPriceChartData' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'address' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'range' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'GqlTokenChartDataRange' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'prices' },
            name: { kind: 'Name', value: 'tokenGetPriceChartData' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'address' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'address' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'range' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'range' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPoolBptPriceChartDataQuery, GetPoolBptPriceChartDataQueryVariables>
export const GetPoolUserJoinExitsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPoolUserJoinExits' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'poolId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'joinExits' },
            name: { kind: 'Name', value: 'userGetPoolJoinExits' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'poolId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'poolId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tx' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'poolId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'valueUSD' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'amounts' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPoolUserJoinExitsQuery, GetPoolUserJoinExitsQueryVariables>
export const GetUserSwapsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetUserSwaps' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'poolId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'swaps' },
            name: { kind: 'Name', value: 'userGetSwaps' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'poolId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'poolId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'poolId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenAmountIn' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenAmountOut' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenIn' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenOut' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tx' } },
                { kind: 'Field', name: { kind: 'Name', value: 'valueUSD' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUserSwapsQuery, GetUserSwapsQueryVariables>
export const GetPoolSnapshotsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPoolSnapshots' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'poolId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'range' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'GqlPoolSnapshotDataRange' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'snapshots' },
            name: { kind: 'Name', value: 'poolGetSnapshots' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'poolId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'range' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'range' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                { kind: 'Field', name: { kind: 'Name', value: 'totalLiquidity' } },
                { kind: 'Field', name: { kind: 'Name', value: 'volume24h' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fees24h' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sharePrice' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPoolSnapshotsQuery, GetPoolSnapshotsQueryVariables>
export const GetPoolTokensDynamicDataDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPoolTokensDynamicData' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'addresses' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'staticData' },
            name: { kind: 'Name', value: 'tokenGetTokensData' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'addresses' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'addresses' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenAddress' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'discordUrl' } },
                { kind: 'Field', name: { kind: 'Name', value: 'telegramUrl' } },
                { kind: 'Field', name: { kind: 'Name', value: 'twitterUsername' } },
                { kind: 'Field', name: { kind: 'Name', value: 'websiteUrl' } },
              ],
            },
          },
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'dynamicData' },
            name: { kind: 'Name', value: 'tokenGetTokensDynamicData' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'addresses' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'addresses' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'GqlTokenDynamicData' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'GqlTokenDynamicData' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GqlTokenDynamicData' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tokenAddress' } },
          { kind: 'Field', name: { kind: 'Name', value: 'ath' } },
          { kind: 'Field', name: { kind: 'Name', value: 'atl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'marketCap' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fdv' } },
          { kind: 'Field', name: { kind: 'Name', value: 'priceChange24h' } },
          { kind: 'Field', name: { kind: 'Name', value: 'priceChangePercent24h' } },
          { kind: 'Field', name: { kind: 'Name', value: 'priceChangePercent7d' } },
          { kind: 'Field', name: { kind: 'Name', value: 'priceChangePercent14d' } },
          { kind: 'Field', name: { kind: 'Name', value: 'priceChangePercent30d' } },
          { kind: 'Field', name: { kind: 'Name', value: 'high24h' } },
          { kind: 'Field', name: { kind: 'Name', value: 'low24h' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPoolTokensDynamicDataQuery, GetPoolTokensDynamicDataQueryVariables>
export const GetPoolJoinsExitsSwapsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPoolJoinsExitsSwaps' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'poolId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'chainId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'GqlChain' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'swaps' },
            name: { kind: 'Name', value: 'poolGetSwaps' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'poolIdIn' },
                      value: {
                        kind: 'ListValue',
                        values: [{ kind: 'Variable', name: { kind: 'Name', value: 'poolId' } }],
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'chainIn' },
                      value: {
                        kind: 'ListValue',
                        values: [{ kind: 'Variable', name: { kind: 'Name', value: 'chainId' } }],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'poolId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenAmountIn' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenAmountOut' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenIn' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenOut' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tx' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userAddress' } },
                { kind: 'Field', name: { kind: 'Name', value: 'valueUSD' } },
              ],
            },
          },
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'joinExits' },
            name: { kind: 'Name', value: 'poolGetJoinExits' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'poolIdIn' },
                      value: {
                        kind: 'ListValue',
                        values: [{ kind: 'Variable', name: { kind: 'Name', value: 'poolId' } }],
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'chainIn' },
                      value: {
                        kind: 'ListValue',
                        values: [{ kind: 'Variable', name: { kind: 'Name', value: 'chainId' } }],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tx' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'poolId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'valueUSD' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'amounts' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPoolJoinsExitsSwapsQuery, GetPoolJoinsExitsSwapsQueryVariables>
export const GetPoolsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPools' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'GqlPoolOrderBy' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderDirection' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'GqlPoolOrderDirection' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'where' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'GqlPoolFilter' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'textSearch' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'pools' },
            name: { kind: 'Name', value: 'poolGetPools' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderDirection' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'orderDirection' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'where' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'textSearch' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'textSearch' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                { kind: 'Field', name: { kind: 'Name', value: 'chain' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createTime' } },
                { kind: 'Field', name: { kind: 'Name', value: 'decimals' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'displayTokens' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'nestedTokens' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'dynamicData' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'totalLiquidity' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lifetimeVolume' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lifetimeSwapFees' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'volume24h' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fees24h' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'holdersCount' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'swapFee' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'swapsCount' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'totalShares' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'apr' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'apr' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'GqlPoolAprTotal' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'GqlPoolAprRange' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'min' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'max' } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'hasRewardApr' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'thirdPartyApr' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'GqlPoolAprTotal' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'GqlPoolAprRange' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'min' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'max' } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'nativeRewardApr' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'GqlPoolAprTotal' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'GqlPoolAprRange' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'min' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'max' } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'swapApr' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'items' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'apr' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'InlineFragment',
                                          typeCondition: {
                                            kind: 'NamedType',
                                            name: { kind: 'Name', value: 'GqlPoolAprTotal' },
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'total' },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: 'InlineFragment',
                                          typeCondition: {
                                            kind: 'NamedType',
                                            name: { kind: 'Name', value: 'GqlPoolAprRange' },
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'min' },
                                              },
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'max' },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'subItems' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'apr' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'GqlPoolAprTotal' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'total' },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'GqlPoolAprRange' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'min' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'max' },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'factory' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'owner' } },
                { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'userBalance' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'totalBalance' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'totalBalanceUsd' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'stakedBalance' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'walletBalance' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'count' },
            name: { kind: 'Name', value: 'poolGetPoolsCount' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderDirection' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'orderDirection' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'where' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'textSearch' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'textSearch' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPoolsQuery, GetPoolsQueryVariables>
export const GetSorSwapsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSorSwaps' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'tokenIn' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'tokenOut' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'swapType' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'GqlSorSwapType' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'swapAmount' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'BigDecimal' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'chain' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'GqlChain' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'swapOptions' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'GqlSorSwapOptionsInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'swaps' },
            name: { kind: 'Name', value: 'sorGetSwaps' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'tokenIn' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'tokenIn' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'tokenOut' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'tokenOut' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'swapType' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'swapType' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'swapAmount' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'swapAmount' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'chain' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'chain' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'swapOptions' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'swapOptions' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'tokenIn' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenOut' } },
                { kind: 'Field', name: { kind: 'Name', value: 'swapAmount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'swapAmountForSwaps' } },
                { kind: 'Field', name: { kind: 'Name', value: 'returnAmount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'returnAmountFromSwaps' } },
                { kind: 'Field', name: { kind: 'Name', value: 'returnAmountConsideringFees' } },
                { kind: 'Field', name: { kind: 'Name', value: 'marketSp' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'swaps' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'assetInIndex' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'assetOutIndex' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'poolId' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'userData' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'tokenAddresses' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSorSwapsQuery, GetSorSwapsQueryVariables>
