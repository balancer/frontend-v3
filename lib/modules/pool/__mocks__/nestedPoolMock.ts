/* eslint-disable max-len */

import { GqlPoolElement } from '@/lib/shared/services/api/generated/graphql'

export const nestedPoolMock: GqlPoolElement = {
  id: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0',
  address: '0x08775ccb6674d6bdceb0797c364c2653ed84f384',
  name: 'Balancer 50WETH-50-3pool',
  version: 3,
  owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
  decimals: 18,
  factory: '0x5dd94da3644ddd055fcf6b3e1aa310bb7801eb8b',
  symbol: '50WETH-50-3pool',
  createTime: 1680364331,
  type: 'WEIGHTED',
  chain: 'MAINNET',
  vaultVersion: 2,
  dynamicData: {
    poolId: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0',
    swapEnabled: true,
    totalLiquidity: '730464.73',
    totalShares: '12717.167303596608336473',
    fees24h: '221.06',
    swapFee: '0.003',
    volume24h: '73687.14',
    holdersCount: '28',
    isInRecoveryMode: false,
    isPaused: false,
    apr: {
      hasRewardApr: false,
      thirdPartyApr: { total: '0' },
      nativeRewardApr: { total: '0' },
      swapApr: '0.05523019717106877',
      apr: { total: '0.07108191520245759' },
      items: [
        {
          id: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0-0x79c58f70905f734641735bc61e45c19dd9ad60bc0000000000000000000004e7-swap-apr',
          title: 'USDC-DAI-USDT APR',
          apr: { total: '0.01585171803138882' },
          subItems: [],
        },
        {
          id: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0-swap-apr',
          title: 'Swap fees APR',
          apr: { total: '0.05523019717106877' },
          subItems: [],
        },
      ],
    },
  },
  allTokens: [
    {
      id: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      isNested: false,
      isPhantomBpt: false,
      isMainToken: true,
    },
    {
      id: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0-0xdac17f958d2ee523a2206206994597c13d831ec7',
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      isNested: true,
      isPhantomBpt: false,
      isMainToken: true,
    },
    {
      id: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0-0x6b175474e89094c44da98b954eedeac495271d0f',
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      decimals: 18,
      isNested: true,
      isPhantomBpt: false,
      isMainToken: true,
    },
    {
      id: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0-0x79c58f70905f734641735bc61e45c19dd9ad60bc',
      address: '0x79c58f70905f734641735bc61e45c19dd9ad60bc',
      name: 'Balancer USDC-DAI-USDT Stable Pool',
      symbol: 'USDC-DAI-USDT',
      decimals: 18,
      isNested: false,
      isPhantomBpt: false,
      isMainToken: false,
    },
    {
      id: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      isNested: true,
      isPhantomBpt: false,
      isMainToken: true,
    },
  ],
  displayTokens: [
    {
      id: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0-0x79c58f70905f734641735bc61e45c19dd9ad60bc',
      address: '0x79c58f70905f734641735bc61e45c19dd9ad60bc',
      name: 'Balancer USDC-DAI-USDT Stable Pool',
      weight: '0.5',
      symbol: 'USDC-DAI-USDT',
      nestedTokens: [
        {
          id: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0-0x79c58f70905f734641735bc61e45c19dd9ad60bc-0x6b175474e89094c44da98b954eedeac495271d0f',
          address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          name: 'Dai Stablecoin',
          weight: null,
          symbol: 'DAI',
        },
        {
          id: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0-0x79c58f70905f734641735bc61e45c19dd9ad60bc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          name: 'USD Coin',
          weight: null,
          symbol: 'USDC',
        },
        {
          id: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0-0x79c58f70905f734641735bc61e45c19dd9ad60bc-0xdac17f958d2ee523a2206206994597c13d831ec7',
          address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          name: 'Tether USD',
          weight: null,
          symbol: 'USDT',
        },
      ],
    },
    {
      id: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      name: 'Wrapped Ether',
      weight: '0.5',
      symbol: 'WETH',
      nestedTokens: null,
    },
  ],
  staking: {
    id: '0xd9cde95efed2d426f2741e2c44de9573116b8f07',
    type: 'GAUGE',
    chain: 'MAINNET',
    address: '0xd9cde95efed2d426f2741e2c44de9573116b8f07',
    gauge: {
      id: '0xd9cde95efed2d426f2741e2c44de9573116b8f07',
      gaugeAddress: '0xd9cde95efed2d426f2741e2c44de9573116b8f07',
      version: 1,
      status: 'PREFERRED',
      workingSupply: '5058.371638322646388307',
      otherGauges: [],
      rewards: [
        {
          id: '0xd9cde95efed2d426f2741e2c44de9573116b8f07-0xba100000625a3754423978a60c9317c58a424e3d',
          rewardPerSecond: '0.000000000000000000',
          tokenAddress: '0xba100000625a3754423978a60c9317c58a424e3d',
        },
      ],
    },
  },
  userBalance: {
    stakedBalance: '0',
    totalBalance: '0.0',
    walletBalance: '0',
    stakedBalanceUsd: 0,
    walletBalanceUsd: 0,
    totalBalanceUsd: 0,
  },
  nestingType: 'HAS_SOME_PHANTOM_BPT',
  poolTokens: [
    {
      id: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0-0x79c58f70905f734641735bc61e45c19dd9ad60bc',
      index: 0,
      name: 'Balancer USDC-DAI-USDT Stable Pool',
      symbol: 'USDC-DAI-USDT',
      balance: '359956.577799243207902923',
      address: '0x79c58f70905f734641735bc61e45c19dd9ad60bc',
      priceRate: '1.0',
      decimals: 18,
      weight: '0.5',
      hasNestedPool: true,
      nestedPool: {
        id: '0x79c58f70905f734641735bc61e45c19dd9ad60bc0000000000000000000004e7',
        address: '0x79c58f70905f734641735bc61e45c19dd9ad60bc',
        type: 'COMPOSABLE_STABLE',
        tokens: [
          { index: 0, address: '0x6b175474e89094c44da98b954eedeac495271d0f', decimals: 18 },
          { index: 1, address: '0x79c58f70905f734641735bc61e45c19dd9ad60bc', decimals: 18 },
          { index: 2, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: 6 },
          { index: 3, address: '0xdac17f958d2ee523a2206206994597c13d831ec7', decimals: 6 },
        ],
      },
    },
    {
      id: '0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      index: 1,
      name: 'Wrapped Ether',
      symbol: 'WETH',
      balance: '115.170360444472237336',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      priceRate: '1.0',
      decimals: 18,
      weight: '0.5',
      hasNestedPool: false,
      nestedPool: null,
    },
  ],
} as unknown as GqlPoolElement
