/* eslint-disable max-len */

import { GqlChain, GqlPoolElement, GqlPoolType } from '@/lib/shared/services/api/generated/graphql'

export const metaStablePoolMock: GqlPoolElement = {
  id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080',
  address: '0x32296969ef14eb0c6d29669c550d4a0449130230',
  name: 'Balancer stETH Stable Pool',
  version: 1,
  owner: '0x0000000000000000000000000000000000000000',
  decimals: 18,
  factory: '0x67d27634e44793fe63c467035e31ea8635117cd4',
  symbol: 'B-stETH-STABLE',
  createTime: 1628875520,
  type: GqlPoolType.MetaStable,
  chain: GqlChain.Mainnet,
  vaultVersion: 2,
  dynamicData: {
    poolId: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080',
    swapEnabled: true,
    totalLiquidity: '4231064.42',
    totalLiquidity24hAgo: '4465026.33',
    totalShares: '1210.985811488519013365',
    totalShares24hAgo: '1210.985811488519013365',
    fees24h: '12.56',
    swapFee: '0.0004',
    volume24h: '31406.35',
    fees48h: '12.56',
    volume48h: '31406.35',
    lifetimeVolume: '2483309376.42',
    lifetimeSwapFees: '993323.75',
    holdersCount: '1420',
    isInRecoveryMode: false,
    isPaused: false,
    swapsCount: '27094',
    sharePriceAth: '4931.378125358028',
    sharePriceAthTimestamp: 1636416000,
    sharePriceAtl: '965.4592230373505',
    sharePriceAtlTimestamp: 1655510400,
    totalLiquidityAth: '549417907.19',
    totalLiquidityAthTimestamp: 1650499200,
    totalLiquidityAtl: '3230.37',
    totalLiquidityAtlTimestamp: 1628812800,
    volume24hAth: '61136595.29',
    volume24hAthTimestamp: 1678665600,
    volume24hAtl: '0.00',
    volume24hAtlTimestamp: 1628812800,
    fees24hAth: '24454.64',
    fees24hAthTimestamp: 1678665600,
    fees24hAtl: '0.00',
    fees24hAtlTimestamp: 1628812800,
    yieldCapture24h: '207.08',
    yieldCapture48h: '425.27',
    apr: {
      hasRewardApr: false,
      thirdPartyApr: { total: '0' },
      nativeRewardApr: { total: '0' },
      swapApr: '0.0005418645008309938',
      apr: { total: '0.009229765323129689' },
      items: [
        {
          id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080-wstETH-yield-apr',
          title: 'wstETH APR',
          apr: { total: '0.008687900822298695' },
          subItems: [],
        },
        {
          id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080-swap-apr',
          title: 'Swap fees APR',
          apr: { total: '0.0005418645008309938' },
          subItems: [],
        },
      ],
    },
  },
  allTokens: [
    {
      id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080-0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
      address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
      name: 'Wrapped liquid staked Ether 2.0',
      symbol: 'wstETH',
      decimals: 18,
      isNested: false,
      isPhantomBpt: false,
      isMainToken: true,
    },
    {
      id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      isNested: false,
      isPhantomBpt: false,
      isMainToken: true,
    },
  ],
  displayTokens: [
    {
      id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080-0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
      address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
      name: 'Wrapped liquid staked Ether 2.0',
      weight: null,
      symbol: 'wstETH',
      nestedTokens: null,
    },
    {
      id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      name: 'Wrapped Ether',
      weight: null,
      symbol: 'WETH',
      nestedTokens: null,
    },
  ],
  staking: {
    id: '0xcd4722b7c24c29e0413bdcd9e51404b4539d14ae',
    type: 'GAUGE',
    chain: 'MAINNET',
    address: '0xcd4722b7c24c29e0413bdcd9e51404b4539d14ae',
    gauge: {
      id: '0xcd4722b7c24c29e0413bdcd9e51404b4539d14ae',
      gaugeAddress: '0xcd4722b7c24c29e0413bdcd9e51404b4539d14ae',
      version: 1,
      status: 'KILLED',
      workingSupply: '178.934980276860593645',
      otherGauges: [],
      rewards: [
        {
          id: '0xcd4722b7c24c29e0413bdcd9e51404b4539d14ae-0xba100000625a3754423978a60c9317c58a424e3d',
          rewardPerSecond: '0.000000000000000000',
          tokenAddress: '0xba100000625a3754423978a60c9317c58a424e3d',
        },
        {
          id: '0xcd4722b7c24c29e0413bdcd9e51404b4539d14ae-0x5a98fcbea516cf06857215779fd812ca3bef1b32',
          rewardPerSecond: '0.0',
          tokenAddress: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
        },
      ],
    },
  },
  investConfig: {
    singleAssetEnabled: true,
    proportionalEnabled: false,
    options: [
      {
        poolTokenIndex: 0,
        poolTokenAddress: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
        tokenOptions: [
          {
            id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080-0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
            index: 0,
            name: 'Wrapped liquid staked Ether 2.0',
            symbol: 'wstETH',
            balance: '554.231313877726282907',
            address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
            priceRate: '1.16107749091599594',
            decimals: 18,
            weight: null,
            totalBalance: '554.231313877726282907',
          },
        ],
      },
      {
        poolTokenIndex: 1,
        poolTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        tokenOptions: [
          {
            id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            index: 1,
            name: 'Wrapped Ether',
            symbol: 'WETH',
            balance: '620.795240782376289612',
            address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            priceRate: '1.0',
            decimals: 18,
            weight: null,
            totalBalance: '620.795240782376289612',
          },
          {
            id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            index: 1,
            name: 'Ether',
            symbol: 'ETH',
            balance: '620.795240782376289612',
            address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            priceRate: '1.0',
            decimals: 18,
            weight: null,
            totalBalance: '620.795240782376289612',
          },
        ],
      },
    ],
  },
  withdrawConfig: {
    singleAssetEnabled: true,
    proportionalEnabled: true,
    options: [
      {
        poolTokenIndex: 0,
        poolTokenAddress: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
        tokenOptions: [
          {
            id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080-0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
            index: 0,
            name: 'Wrapped liquid staked Ether 2.0',
            symbol: 'wstETH',
            balance: '554.231313877726282907',
            address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
            priceRate: '1.16107749091599594',
            decimals: 18,
            weight: null,
            totalBalance: '554.231313877726282907',
          },
        ],
      },
      {
        poolTokenIndex: 1,
        poolTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        tokenOptions: [
          {
            id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            index: 1,
            name: 'Wrapped Ether',
            symbol: 'WETH',
            balance: '620.795240782376289612',
            address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            priceRate: '1.0',
            decimals: 18,
            weight: null,
            totalBalance: '620.795240782376289612',
          },
        ],
      },
    ],
  },
  userBalance: {
    stakedBalance: '0',
    totalBalance: '0.0',
    walletBalance: '0',
    stakedBalanceUsd: 0,
    walletBalanceUsd: 0,
    totalBalanceUsd: 0,
  },
  amp: '50.0',
  tokens: [
    {
      id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080-0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
      index: 0,
      name: 'Wrapped liquid staked Ether 2.0',
      symbol: 'wstETH',
      balance: '554.231313877726282907',
      address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
      priceRate: '1.16107749091599594',
      decimals: 18,
      weight: null,
      totalBalance: '554.231313877726282907',
    },
    {
      id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      index: 1,
      name: 'Wrapped Ether',
      symbol: 'WETH',
      balance: '620.795240782376289612',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      priceRate: '1.0',
      decimals: 18,
      weight: null,
      totalBalance: '620.795240782376289612',
    },
  ],
} as unknown as GqlPoolElement
