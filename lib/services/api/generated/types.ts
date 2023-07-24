import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
const defaultOptions = {} as const
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
  JSON: { input: any; output: any }
}

export type GqlBalancePoolAprItem = {
  __typename?: 'GqlBalancePoolAprItem'
  apr: GqlPoolAprValue
  id: Scalars['ID']['output']
  subItems?: Maybe<Array<GqlBalancePoolAprSubItem>>
  title: Scalars['String']['output']
}

export type GqlBalancePoolAprSubItem = {
  __typename?: 'GqlBalancePoolAprSubItem'
  apr: GqlPoolAprValue
  id: Scalars['ID']['output']
  title: Scalars['String']['output']
}

export enum GqlChain {
  Arbitrum = 'ARBITRUM',
  Avalanche = 'AVALANCHE',
  Fantom = 'FANTOM',
  Gnosis = 'GNOSIS',
  Mainnet = 'MAINNET',
  Optimism = 'OPTIMISM',
  Polygon = 'POLYGON',
  Zkevm = 'ZKEVM',
}

export type GqlContentNewsItem = {
  __typename?: 'GqlContentNewsItem'
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

export type GqlFeaturePoolGroupItemExternalLink = {
  __typename?: 'GqlFeaturePoolGroupItemExternalLink'
  buttonText: Scalars['String']['output']
  buttonUrl: Scalars['String']['output']
  id: Scalars['ID']['output']
  image: Scalars['String']['output']
}

export type GqlHistoricalTokenPrice = {
  __typename?: 'GqlHistoricalTokenPrice'
  address: Scalars['String']['output']
  prices: Array<GqlHistoricalTokenPriceEntry>
}

export type GqlHistoricalTokenPriceEntry = {
  __typename?: 'GqlHistoricalTokenPriceEntry'
  price: Scalars['Float']['output']
  timestamp: Scalars['String']['output']
}

export type GqlLatestSyncedBlocks = {
  __typename?: 'GqlLatestSyncedBlocks'
  poolSyncBlock: Scalars['BigInt']['output']
  userStakeSyncBlock: Scalars['BigInt']['output']
  userWalletSyncBlock: Scalars['BigInt']['output']
}

export type GqlPoolApr = {
  __typename?: 'GqlPoolApr'
  apr: GqlPoolAprValue
  hasRewardApr: Scalars['Boolean']['output']
  items: Array<GqlBalancePoolAprItem>
  nativeRewardApr: GqlPoolAprValue
  swapApr: Scalars['BigDecimal']['output']
  thirdPartyApr: GqlPoolAprValue
}

export type GqlPoolAprRange = {
  __typename?: 'GqlPoolAprRange'
  max: Scalars['BigDecimal']['output']
  min: Scalars['BigDecimal']['output']
}

export type GqlPoolAprTotal = {
  __typename?: 'GqlPoolAprTotal'
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
  withdrawConfig: GqlPoolWithdrawConfig
}

export type GqlPoolBatchSwap = {
  __typename?: 'GqlPoolBatchSwap'
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
  __typename?: 'GqlPoolBatchSwapPool'
  id: Scalars['ID']['output']
  tokens: Array<Scalars['String']['output']>
}

export type GqlPoolBatchSwapSwap = {
  __typename?: 'GqlPoolBatchSwapSwap'
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

export type GqlPoolDynamicData = {
  __typename?: 'GqlPoolDynamicData'
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
  __typename?: 'GqlPoolElement'
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
  unitSeconds: Scalars['BigInt']['output']
  withdrawConfig: GqlPoolWithdrawConfig
}

export type GqlPoolFeaturedPoolGroup = {
  __typename?: 'GqlPoolFeaturedPoolGroup'
  icon: Scalars['String']['output']
  id: Scalars['ID']['output']
  items: Array<GqlPoolFeaturedPoolGroupItem>
  title: Scalars['String']['output']
}

export type GqlPoolFeaturedPoolGroupItem =
  | GqlFeaturePoolGroupItemExternalLink
  | GqlPoolMinimal

export type GqlPoolFilter = {
  categoryIn?: InputMaybe<Array<GqlPoolFilterCategory>>
  categoryNotIn?: InputMaybe<Array<GqlPoolFilterCategory>>
  chainIn?: InputMaybe<Array<GqlChain>>
  chainNotIn?: InputMaybe<Array<GqlChain>>
  filterIn?: InputMaybe<Array<Scalars['String']['input']>>
  filterNotIn?: InputMaybe<Array<Scalars['String']['input']>>
  idIn?: InputMaybe<Array<Scalars['String']['input']>>
  idNotIn?: InputMaybe<Array<Scalars['String']['input']>>
  poolTypeIn?: InputMaybe<Array<GqlPoolFilterType>>
  poolTypeNotIn?: InputMaybe<Array<GqlPoolFilterType>>
  tokensIn?: InputMaybe<Array<Scalars['String']['input']>>
  tokensNotIn?: InputMaybe<Array<Scalars['String']['input']>>
}

export enum GqlPoolFilterCategory {
  BlackListed = 'BLACK_LISTED',
  Incentivized = 'INCENTIVIZED',
}

export type GqlPoolFilterDefinition = {
  __typename?: 'GqlPoolFilterDefinition'
  id: Scalars['ID']['output']
  title: Scalars['String']['output']
}

export enum GqlPoolFilterType {
  Element = 'ELEMENT',
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

export type GqlPoolGyro = GqlPoolBase & {
  __typename?: 'GqlPoolGyro'
  address: Scalars['Bytes']['output']
  allTokens: Array<GqlPoolTokenExpanded>
  alpha: Scalars['String']['output']
  beta: Scalars['String']['output']
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
  type: Scalars['String']['output']
  withdrawConfig: GqlPoolWithdrawConfig
}

export type GqlPoolInvestConfig = {
  __typename?: 'GqlPoolInvestConfig'
  options: Array<GqlPoolInvestOption>
  proportionalEnabled: Scalars['Boolean']['output']
  singleAssetEnabled: Scalars['Boolean']['output']
}

export type GqlPoolInvestOption = {
  __typename?: 'GqlPoolInvestOption'
  poolTokenAddress: Scalars['String']['output']
  poolTokenIndex: Scalars['Int']['output']
  tokenOptions: Array<GqlPoolToken>
}

export type GqlPoolJoinExit = {
  __typename?: 'GqlPoolJoinExit'
  amounts: Array<GqlPoolJoinExitAmount>
  id: Scalars['ID']['output']
  poolId: Scalars['String']['output']
  sender: Scalars['String']['output']
  timestamp: Scalars['Int']['output']
  tx: Scalars['String']['output']
  type: GqlPoolJoinExitType
  valueUSD?: Maybe<Scalars['String']['output']>
}

export type GqlPoolJoinExitAmount = {
  __typename?: 'GqlPoolJoinExitAmount'
  address: Scalars['String']['output']
  amount: Scalars['String']['output']
}

export type GqlPoolJoinExitFilter = {
  poolIdIn?: InputMaybe<Array<Scalars['String']['input']>>
}

export enum GqlPoolJoinExitType {
  Exit = 'Exit',
  Join = 'Join',
}

export type GqlPoolLinear = GqlPoolBase & {
  __typename?: 'GqlPoolLinear'
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
  upperTarget: Scalars['BigInt']['output']
  withdrawConfig: GqlPoolWithdrawConfig
  wrappedIndex: Scalars['Int']['output']
}

export type GqlPoolLinearNested = {
  __typename?: 'GqlPoolLinearNested'
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
  upperTarget: Scalars['BigInt']['output']
  wrappedIndex: Scalars['Int']['output']
}

export type GqlPoolLinearPoolData = {
  __typename?: 'GqlPoolLinearPoolData'
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
  __typename?: 'GqlPoolLinearPoolMainToken'
  address: Scalars['String']['output']
  balance: Scalars['String']['output']
  decimals: Scalars['Int']['output']
  index: Scalars['Int']['output']
  name: Scalars['String']['output']
  symbol: Scalars['String']['output']
  totalSupply: Scalars['String']['output']
}

export type GqlPoolLinearPoolWrappedToken = {
  __typename?: 'GqlPoolLinearPoolWrappedToken'
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
  __typename?: 'GqlPoolLiquidityBootstrapping'
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
  withdrawConfig: GqlPoolWithdrawConfig
}

export type GqlPoolMetaStable = GqlPoolBase & {
  __typename?: 'GqlPoolMetaStable'
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
  withdrawConfig: GqlPoolWithdrawConfig
}

export type GqlPoolMinimal = {
  __typename?: 'GqlPoolMinimal'
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
  type: GqlPoolMinimalType
  version: Scalars['Int']['output']
}

export enum GqlPoolMinimalType {
  Element = 'ELEMENT',
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

export type GqlPoolNestedUnion =
  | GqlPoolLinearNested
  | GqlPoolPhantomStableNested

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
  Volume24h = 'volume24h',
}

export enum GqlPoolOrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type GqlPoolPhantomStable = GqlPoolBase & {
  __typename?: 'GqlPoolPhantomStable'
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
  withdrawConfig: GqlPoolWithdrawConfig
}

export type GqlPoolPhantomStableNested = {
  __typename?: 'GqlPoolPhantomStableNested'
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
  tokens: Array<GqlPoolTokenPhantomStableNestedUnion>
  totalLiquidity: Scalars['BigDecimal']['output']
  totalShares: Scalars['BigDecimal']['output']
}

export type GqlPoolSnapshot = {
  __typename?: 'GqlPoolSnapshot'
  amounts: Array<Scalars['String']['output']>
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
  __typename?: 'GqlPoolStable'
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
  withdrawConfig: GqlPoolWithdrawConfig
}

export type GqlPoolStablePhantomPoolData = {
  __typename?: 'GqlPoolStablePhantomPoolData'
  address: Scalars['String']['output']
  balance: Scalars['String']['output']
  id: Scalars['ID']['output']
  symbol: Scalars['String']['output']
  tokens: Array<GqlPoolToken>
  totalSupply: Scalars['String']['output']
}

export type GqlPoolStaking = {
  __typename?: 'GqlPoolStaking'
  address: Scalars['String']['output']
  gauge?: Maybe<GqlPoolStakingGauge>
  id: Scalars['ID']['output']
  type: GqlPoolStakingType
}

export type GqlPoolStakingGauge = {
  __typename?: 'GqlPoolStakingGauge'
  gaugeAddress: Scalars['String']['output']
  id: Scalars['ID']['output']
  otherGauges?: Maybe<Array<GqlPoolStakingOtherGauge>>
  rewards: Array<GqlPoolStakingGaugeReward>
  status: GqlPoolStakingGaugeStatus
  version: Scalars['Int']['output']
}

export type GqlPoolStakingGaugeReward = {
  __typename?: 'GqlPoolStakingGaugeReward'
  id: Scalars['ID']['output']
  rewardPerSecond: Scalars['String']['output']
  tokenAddress: Scalars['String']['output']
}

export enum GqlPoolStakingGaugeStatus {
  Active = 'ACTIVE',
  Killed = 'KILLED',
  Preferred = 'PREFERRED',
}

export type GqlPoolStakingOtherGauge = {
  __typename?: 'GqlPoolStakingOtherGauge'
  gaugeAddress: Scalars['String']['output']
  id: Scalars['ID']['output']
  rewards: Array<GqlPoolStakingGaugeReward>
  status: GqlPoolStakingGaugeStatus
  version: Scalars['Int']['output']
}

export enum GqlPoolStakingType {
  Gauge = 'GAUGE',
}

export type GqlPoolSwap = {
  __typename?: 'GqlPoolSwap'
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
  poolIdIn?: InputMaybe<Array<Scalars['String']['input']>>
  tokenInIn?: InputMaybe<Array<Scalars['String']['input']>>
  tokenOutIn?: InputMaybe<Array<Scalars['String']['input']>>
}

export type GqlPoolToken = GqlPoolTokenBase & {
  __typename?: 'GqlPoolToken'
  address: Scalars['String']['output']
  balance: Scalars['BigDecimal']['output']
  decimals: Scalars['Int']['output']
  id: Scalars['ID']['output']
  index: Scalars['Int']['output']
  name: Scalars['String']['output']
  priceRate: Scalars['BigDecimal']['output']
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
  symbol: Scalars['String']['output']
  totalBalance: Scalars['BigDecimal']['output']
  weight?: Maybe<Scalars['BigDecimal']['output']>
}

export type GqlPoolTokenDisplay = {
  __typename?: 'GqlPoolTokenDisplay'
  address: Scalars['String']['output']
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  nestedTokens?: Maybe<Array<GqlPoolTokenDisplay>>
  symbol: Scalars['String']['output']
  weight?: Maybe<Scalars['BigDecimal']['output']>
}

export type GqlPoolTokenExpanded = {
  __typename?: 'GqlPoolTokenExpanded'
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
  __typename?: 'GqlPoolTokenLinear'
  address: Scalars['String']['output']
  balance: Scalars['BigDecimal']['output']
  decimals: Scalars['Int']['output']
  id: Scalars['ID']['output']
  index: Scalars['Int']['output']
  mainTokenBalance: Scalars['BigDecimal']['output']
  name: Scalars['String']['output']
  pool: GqlPoolLinearNested
  priceRate: Scalars['BigDecimal']['output']
  symbol: Scalars['String']['output']
  totalBalance: Scalars['BigDecimal']['output']
  totalMainTokenBalance: Scalars['BigDecimal']['output']
  weight?: Maybe<Scalars['BigDecimal']['output']>
  wrappedTokenBalance: Scalars['BigDecimal']['output']
}

export type GqlPoolTokenPhantomStable = GqlPoolTokenBase & {
  __typename?: 'GqlPoolTokenPhantomStable'
  address: Scalars['String']['output']
  balance: Scalars['BigDecimal']['output']
  decimals: Scalars['Int']['output']
  id: Scalars['ID']['output']
  index: Scalars['Int']['output']
  name: Scalars['String']['output']
  pool: GqlPoolPhantomStableNested
  priceRate: Scalars['BigDecimal']['output']
  symbol: Scalars['String']['output']
  totalBalance: Scalars['BigDecimal']['output']
  weight?: Maybe<Scalars['BigDecimal']['output']>
}

export type GqlPoolTokenPhantomStableNestedUnion =
  | GqlPoolToken
  | GqlPoolTokenLinear

export type GqlPoolTokenUnion =
  | GqlPoolToken
  | GqlPoolTokenLinear
  | GqlPoolTokenPhantomStable

export type GqlPoolUnion =
  | GqlPoolElement
  | GqlPoolGyro
  | GqlPoolLinear
  | GqlPoolLiquidityBootstrapping
  | GqlPoolMetaStable
  | GqlPoolPhantomStable
  | GqlPoolStable
  | GqlPoolWeighted

export type GqlPoolUserSwapVolume = {
  __typename?: 'GqlPoolUserSwapVolume'
  swapVolumeUSD: Scalars['BigDecimal']['output']
  userAddress: Scalars['String']['output']
}

export type GqlPoolWeighted = GqlPoolBase & {
  __typename?: 'GqlPoolWeighted'
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
  withdrawConfig: GqlPoolWithdrawConfig
}

export type GqlPoolWithdrawConfig = {
  __typename?: 'GqlPoolWithdrawConfig'
  options: Array<GqlPoolWithdrawOption>
  proportionalEnabled: Scalars['Boolean']['output']
  singleAssetEnabled: Scalars['Boolean']['output']
}

export type GqlPoolWithdrawOption = {
  __typename?: 'GqlPoolWithdrawOption'
  poolTokenAddress: Scalars['String']['output']
  poolTokenIndex: Scalars['Int']['output']
  tokenOptions: Array<GqlPoolToken>
}

export type GqlProtocolMetricsAggregated = {
  __typename?: 'GqlProtocolMetricsAggregated'
  chains: Array<GqlProtocolMetricsChain>
  numLiquidityProviders: Scalars['BigInt']['output']
  poolCount: Scalars['BigInt']['output']
  swapFee7d: Scalars['BigDecimal']['output']
  swapFee24h: Scalars['BigDecimal']['output']
  swapVolume7d: Scalars['BigDecimal']['output']
  swapVolume24h: Scalars['BigDecimal']['output']
  totalLiquidity: Scalars['BigDecimal']['output']
  totalSwapFee: Scalars['BigDecimal']['output']
  totalSwapVolume: Scalars['BigDecimal']['output']
  yieldCapture24h: Scalars['BigDecimal']['output']
}

export type GqlProtocolMetricsChain = {
  __typename?: 'GqlProtocolMetricsChain'
  chainId: Scalars['String']['output']
  numLiquidityProviders: Scalars['BigInt']['output']
  poolCount: Scalars['BigInt']['output']
  swapFee7d: Scalars['BigDecimal']['output']
  swapFee24h: Scalars['BigDecimal']['output']
  swapVolume7d: Scalars['BigDecimal']['output']
  swapVolume24h: Scalars['BigDecimal']['output']
  totalLiquidity: Scalars['BigDecimal']['output']
  totalSwapFee: Scalars['BigDecimal']['output']
  totalSwapVolume: Scalars['BigDecimal']['output']
  yieldCapture24h: Scalars['BigDecimal']['output']
}

export type GqlSorGetBatchSwapForTokensInResponse = {
  __typename?: 'GqlSorGetBatchSwapForTokensInResponse'
  assets: Array<Scalars['String']['output']>
  swaps: Array<GqlSorSwap>
  tokenOutAmount: Scalars['AmountHumanReadable']['output']
}

export type GqlSorGetSwapsResponse = {
  __typename?: 'GqlSorGetSwapsResponse'
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
  __typename?: 'GqlSorSwap'
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
  __typename?: 'GqlSorSwapRoute'
  hops: Array<GqlSorSwapRouteHop>
  share: Scalars['Float']['output']
  tokenIn: Scalars['String']['output']
  tokenInAmount: Scalars['BigDecimal']['output']
  tokenOut: Scalars['String']['output']
  tokenOutAmount: Scalars['BigDecimal']['output']
}

export type GqlSorSwapRouteHop = {
  __typename?: 'GqlSorSwapRouteHop'
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

export type GqlToken = {
  __typename?: 'GqlToken'
  address: Scalars['String']['output']
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
  __typename?: 'GqlTokenCandlestickChartDataItem'
  close: Scalars['AmountHumanReadable']['output']
  high: Scalars['AmountHumanReadable']['output']
  id: Scalars['ID']['output']
  low: Scalars['AmountHumanReadable']['output']
  open: Scalars['AmountHumanReadable']['output']
  timestamp: Scalars['Int']['output']
}

export enum GqlTokenChartDataRange {
  SevenDay = 'SEVEN_DAY',
  ThirtyDay = 'THIRTY_DAY',
}

export type GqlTokenData = {
  __typename?: 'GqlTokenData'
  description?: Maybe<Scalars['String']['output']>
  discordUrl?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  telegramUrl?: Maybe<Scalars['String']['output']>
  tokenAddress: Scalars['String']['output']
  twitterUsername?: Maybe<Scalars['String']['output']>
  websiteUrl?: Maybe<Scalars['String']['output']>
}

export type GqlTokenDynamicData = {
  __typename?: 'GqlTokenDynamicData'
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
  __typename?: 'GqlTokenPrice'
  address: Scalars['String']['output']
  price: Scalars['Float']['output']
}

export type GqlTokenPriceChartDataItem = {
  __typename?: 'GqlTokenPriceChartDataItem'
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

export type GqlUserPoolBalance = {
  __typename?: 'GqlUserPoolBalance'
  poolId: Scalars['String']['output']
  stakedBalance: Scalars['AmountHumanReadable']['output']
  tokenAddress: Scalars['String']['output']
  tokenPrice: Scalars['Float']['output']
  totalBalance: Scalars['AmountHumanReadable']['output']
  walletBalance: Scalars['AmountHumanReadable']['output']
}

export type GqlUserSwapVolumeFilter = {
  poolIdIn?: InputMaybe<Array<Scalars['String']['input']>>
  tokenInIn?: InputMaybe<Array<Scalars['String']['input']>>
  tokenOutIn?: InputMaybe<Array<Scalars['String']['input']>>
}

export type Mutation = {
  __typename?: 'Mutation'
  balancerMutationTest: Scalars['String']['output']
  cacheAverageBlockTime: Scalars['String']['output']
  poolBlackListAddPool: Scalars['String']['output']
  poolBlackListRemovePool: Scalars['String']['output']
  poolDeletePool: Scalars['String']['output']
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
  poolSyncAllPoolVersions: Scalars['String']['output']
  poolSyncAllPoolsFromSubgraph: Array<Scalars['String']['output']>
  poolSyncLatestSnapshotsForAllPools: Scalars['String']['output']
  poolSyncNewPoolsFromSubgraph: Array<Scalars['String']['output']>
  poolSyncPool: Scalars['String']['output']
  poolSyncPoolAllTokensRelationship: Scalars['String']['output']
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
  tokenDeletePrice: Scalars['Boolean']['output']
  tokenDeleteTokenType: Scalars['String']['output']
  tokenInitChartData: Scalars['String']['output']
  tokenReloadAllTokenTypes: Scalars['String']['output']
  tokenReloadTokenPrices?: Maybe<Scalars['Boolean']['output']>
  tokenSyncTokenDefinitions: Scalars['String']['output']
  tokenSyncTokenDynamicData: Scalars['String']['output']
  userInitStakedBalances: Scalars['String']['output']
  userInitWalletBalancesForAllPools: Scalars['String']['output']
  userInitWalletBalancesForPool: Scalars['String']['output']
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
  __typename?: 'Query'
  balancerQueryTest: Scalars['String']['output']
  blocksGetAverageBlockTime: Scalars['Float']['output']
  blocksGetBlocksPerDay: Scalars['Float']['output']
  blocksGetBlocksPerSecond: Scalars['Float']['output']
  blocksGetBlocksPerYear: Scalars['Float']['output']
  contentGetNewsItems: Array<GqlContentNewsItem>
  latestSyncedBlocks: GqlLatestSyncedBlocks
  poolGetAllPoolsSnapshots: Array<GqlPoolSnapshot>
  poolGetBatchSwaps: Array<GqlPoolBatchSwap>
  poolGetFeaturedPoolGroups: Array<GqlPoolFeaturedPoolGroup>
  poolGetJoinExits: Array<GqlPoolJoinExit>
  poolGetLinearPools: Array<GqlPoolLinear>
  poolGetPool: GqlPoolBase
  poolGetPoolFilters: Array<GqlPoolFilterDefinition>
  poolGetPools: Array<GqlPoolMinimal>
  poolGetPoolsCount: Scalars['Int']['output']
  poolGetSnapshots: Array<GqlPoolSnapshot>
  poolGetSwaps: Array<GqlPoolSwap>
  poolGetUserSwapVolume: Array<GqlPoolUserSwapVolume>
  protocolMetricsAggregated: GqlProtocolMetricsAggregated
  protocolMetricsChain: GqlProtocolMetricsChain
  sorGetBatchSwapForTokensIn: GqlSorGetBatchSwapForTokensInResponse
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
  userGetPoolBalances: Array<GqlUserPoolBalance>
  userGetPoolJoinExits: Array<GqlPoolJoinExit>
  userGetStaking: Array<GqlPoolStaking>
  userGetSwaps: Array<GqlPoolSwap>
  veBalGetTotalSupply: Scalars['AmountHumanReadable']['output']
  veBalGetUserBalance: Scalars['AmountHumanReadable']['output']
}

export type QueryPoolGetAllPoolsSnapshotsArgs = {
  range: GqlPoolSnapshotDataRange
}

export type QueryPoolGetBatchSwapsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  where?: InputMaybe<GqlPoolSwapFilter>
}

export type QueryPoolGetJoinExitsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  where?: InputMaybe<GqlPoolJoinExitFilter>
}

export type QueryPoolGetPoolArgs = {
  id: Scalars['String']['input']
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
  id: Scalars['String']['input']
  range: GqlPoolSnapshotDataRange
}

export type QueryPoolGetSwapsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  where?: InputMaybe<GqlPoolSwapFilter>
}

export type QueryPoolGetUserSwapVolumeArgs = {
  first?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  where?: InputMaybe<GqlUserSwapVolumeFilter>
}

export type QueryProtocolMetricsAggregatedArgs = {
  chainIds: Array<Scalars['String']['input']>
}

export type QuerySorGetBatchSwapForTokensInArgs = {
  swapOptions: GqlSorSwapOptionsInput
  tokenOut: Scalars['String']['input']
  tokensIn: Array<GqlTokenAmountHumanReadable>
}

export type QuerySorGetSwapsArgs = {
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

export type QueryTokenGetTokensDataArgs = {
  addresses: Array<Scalars['String']['input']>
}

export type QueryTokenGetTokensDynamicDataArgs = {
  addresses: Array<Scalars['String']['input']>
}

export type QueryUserGetPoolJoinExitsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>
  poolId: Scalars['String']['input']
  skip?: InputMaybe<Scalars['Int']['input']>
}

export type QueryUserGetSwapsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>
  poolId: Scalars['String']['input']
  skip?: InputMaybe<Scalars['Int']['input']>
}

export type GetPoolsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<GqlPoolOrderBy>
  orderDirection?: InputMaybe<GqlPoolOrderDirection>
  where?: InputMaybe<GqlPoolFilter>
}>

export type GetPoolsQuery = {
  __typename?: 'Query'
  pools: Array<{
    __typename?: 'GqlPoolMinimal'
    address: string
    chain: GqlChain
    createTime: number
    decimals: number
    factory?: string | null
    id: string
    name: string
    owner?: string | null
    symbol: string
    type: GqlPoolMinimalType
    allTokens: Array<{
      __typename?: 'GqlPoolTokenExpanded'
      address: string
      weight?: string | null
    }>
    displayTokens: Array<{
      __typename?: 'GqlPoolTokenDisplay'
      address: string
    }>
    dynamicData: {
      __typename?: 'GqlPoolDynamicData'
      totalLiquidity: string
      lifetimeVolume: string
      lifetimeSwapFees: string
      volume24h: string
      fees24h: string
      holdersCount: string
      swapFee: string
      swapsCount: string
      apr: {
        __typename?: 'GqlPoolApr'
        hasRewardApr: boolean
        swapApr: string
        apr:
          | { __typename?: 'GqlPoolAprRange'; min: string; max: string }
          | { __typename?: 'GqlPoolAprTotal'; total: string }
        thirdPartyApr:
          | { __typename?: 'GqlPoolAprRange'; min: string; max: string }
          | { __typename?: 'GqlPoolAprTotal'; total: string }
        nativeRewardApr:
          | { __typename?: 'GqlPoolAprRange'; min: string; max: string }
          | { __typename?: 'GqlPoolAprTotal'; total: string }
        items: Array<{
          __typename?: 'GqlBalancePoolAprItem'
          id: string
          title: string
          apr:
            | { __typename?: 'GqlPoolAprRange'; min: string; max: string }
            | { __typename?: 'GqlPoolAprTotal'; total: string }
          subItems?: Array<{
            __typename?: 'GqlBalancePoolAprSubItem'
            id: string
            title: string
            apr:
              | { __typename?: 'GqlPoolAprRange'; min: string; max: string }
              | { __typename?: 'GqlPoolAprTotal'; total: string }
          }> | null
        }>
      }
    }
  }>
}

export const GetPoolsDocument = gql`
  query GetPools(
    $first: Int
    $skip: Int
    $orderBy: GqlPoolOrderBy
    $orderDirection: GqlPoolOrderDirection
    $where: GqlPoolFilter
  ) {
    pools: poolGetPools(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      address
      allTokens {
        address
        weight
      }
      chain
      createTime
      decimals
      displayTokens {
        address
      }
      dynamicData {
        totalLiquidity
        lifetimeVolume
        lifetimeSwapFees
        volume24h
        fees24h
        holdersCount
        swapFee
        swapsCount
        apr {
          apr {
            ... on GqlPoolAprTotal {
              total
            }
            ... on GqlPoolAprRange {
              min
              max
            }
          }
          hasRewardApr
          thirdPartyApr {
            ... on GqlPoolAprTotal {
              total
            }
            ... on GqlPoolAprRange {
              min
              max
            }
          }
          nativeRewardApr {
            ... on GqlPoolAprTotal {
              total
            }
            ... on GqlPoolAprRange {
              min
              max
            }
          }
          swapApr
          items {
            id
            title
            apr {
              ... on GqlPoolAprTotal {
                total
              }
              ... on GqlPoolAprRange {
                min
                max
              }
            }
            subItems {
              id
              title
              apr {
                ... on GqlPoolAprTotal {
                  total
                }
                ... on GqlPoolAprRange {
                  min
                  max
                }
              }
            }
          }
        }
      }
      factory
      id
      name
      owner
      symbol
      type
    }
  }
`

/**
 * __useGetPoolsQuery__
 *
 * To run a query within a React component, call `useGetPoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPoolsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetPoolsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetPoolsQuery, GetPoolsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetPoolsQuery, GetPoolsQueryVariables>(
    GetPoolsDocument,
    options
  )
}
export function useGetPoolsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPoolsQuery,
    GetPoolsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetPoolsQuery, GetPoolsQueryVariables>(
    GetPoolsDocument,
    options
  )
}
export type GetPoolsQueryHookResult = ReturnType<typeof useGetPoolsQuery>
export type GetPoolsLazyQueryHookResult = ReturnType<
  typeof useGetPoolsLazyQuery
>
export type GetPoolsQueryResult = Apollo.QueryResult<
  GetPoolsQuery,
  GetPoolsQueryVariables
>
