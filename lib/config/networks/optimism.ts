import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { NetworkConfig } from '../config.types'
import { convertHexToLowerCase } from '@/lib/shared/utils/objects'
import { CSP_ISSUE_POOL_IDS } from '@/lib/shared/data/csp-issue'
import { PoolIssue } from '@/lib/modules/pool/alerts/pool-issues/PoolIssue.type'

const networkConfig: NetworkConfig = {
  chainId: 10,
  name: 'Optimism Mainnet',
  shortName: 'Optimism',
  chain: GqlChain.Optimism,
  iconPath: '/images/chains/OPTIMISM.svg',
  rpcUrl: 'https://optimism-mainnet.infura.io/v3/77ab387b59ac47ee8acf46916b4d7c23',
  blockExplorer: {
    baseUrl: 'https://optimistic.etherscan.io',
    name: 'Etherscan',
  },
  tokens: {
    addresses: {
      bal: '0xfe8b128ba8c78aabc59d4c64cee7ff28e9379921',
      wNativeAsset: '0x4200000000000000000000000000000000000006',
    },
    nativeAsset: {
      name: 'Ether',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'ETH',
      decimals: 18,
    },
    defaultSwapTokens: {
      tokenIn: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
  },
  contracts: {
    multicall2: '0x2dc0e2aa608532da689e89e237df582b783e552c',
    balancer: {
      vaultV2: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      relayerV6: '0x015ACA20a1422F3c729086c17f15F10e0CfbC75A',
      minter: '0x4fb47126Fa83A8734991E41B942Ac29A3266C968',
    },
  },
  pools: convertHexToLowerCase({
    issues: {
      [PoolIssue.CspPoolVulnWarning]: CSP_ISSUE_POOL_IDS[GqlChain.Optimism],
    },
  }),
}

export default networkConfig
