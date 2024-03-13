import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { NetworkConfig } from '../config.types'
import { convertHexToLowerCase } from '@/lib/shared/utils/objects'
import { PoolIssue } from '@/lib/modules/pool/alerts/pool-issues/PoolIssue.type'
import { CSP_ISSUE_POOL_IDS } from '@/lib/shared/data/csp-issue'

const networkConfig: NetworkConfig = {
  chainId: 1101,
  name: 'Polygon zkEVM Mainnet',
  shortName: 'zkEVM',
  chain: GqlChain.Zkevm,
  iconPath: '/images/chains/ZKEVM.svg',
  rpcUrl: 'https://polygonzkevm-mainnet.g.alchemy.com/v2/cQGZUiTLRCFsQS7kbRxPJK4eH4fTTu88',
  blockExplorerBaseUrl: 'https://zkevm.polygonscan.com',
  tokens: {
    addresses: {
      bal: '0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9',
      wNativeAsset: '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9',
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
    multicall2: '0xca11bde05977b3631167028862be2a173976ca11',
    balancer: {
      vaultV2: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      relayerV6: '0x8e620FfCa2580ed87241D7e10F85EE75d0a906F5',
      minter: '0x475D18169BE8a89357A9ee3Ab00ca386d20fA229',
    },
  },
  pools: convertHexToLowerCase({
    issues: { [PoolIssue.CspPoolVulnWarning]: CSP_ISSUE_POOL_IDS[GqlChain.Zkevm] },
  }),
}

export default networkConfig
