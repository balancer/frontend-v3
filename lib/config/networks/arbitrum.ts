import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { NetworkConfig } from '../config.types'
import { convertHexToLowerCase } from '@/lib/shared/utils/objects'
import { PoolIssue } from '@/lib/modules/pool/alerts/pool-issues/PoolIssue.type'
import { CSP_ISSUE_POOL_IDS } from '@/lib/shared/data/csp-issue'

const networkConfig: NetworkConfig = {
  chainId: 42161,
  name: 'Arbitrum One',
  shortName: 'Arbitrum',
  chain: GqlChain.Arbitrum,
  iconPath: '/images/chains/ARBITRUM.svg',
  rpcUrl: 'https://arbitrum-mainnet.infura.io/v3/77ab387b59ac47ee8acf46916b4d7c23',
  blockExplorerBaseUrl: 'https://arbiscan.io',
  tokens: {
    addresses: {
      bal: '0x040d1edc9569d4bab2d15287dc5a4f10f56a56b8',
      wNativeAsset: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
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
    multicall2: '0x80c7dd17b01855a6d2347444a0fcc36136a314de',
    balancer: {
      vaultV2: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      relayerV6: '0x9B892E515D2Ab8869F17488d64B3b918731cc70d',
      minter: '0xc3ccacE87f6d3A81724075ADcb5ddd85a8A1bB68',
    },
  },
  pools: convertHexToLowerCase({
    issues: {
      [PoolIssue.PoolOwnerVulnWarningGovernance]: [
        '0x5a5884fc31948d59df2aeccca143de900d49e1a300000000000000000000006f',
      ],
      [PoolIssue.PoolOwnerVulnWarningEcosystem]: [
        '0x0510ccf9eb3ab03c1508d3b9769e8ee2cfd6fdcf00000000000000000000005d',
      ],
      [PoolIssue.CspPoolVulnWarning]: CSP_ISSUE_POOL_IDS[GqlChain.Arbitrum],
    },
  }),
}

export default networkConfig
