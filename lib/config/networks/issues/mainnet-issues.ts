import { PoolIssue } from '@/lib/modules/pool/alerts/pool-issues/PoolIssue.type'
import { IssuesConfig } from '../../config.types'
import { CSP_ISSUE_POOL_IDS } from '../common/csp-issue'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { convertHexKeysToLowerCase } from '@/lib/shared/utils/objects'

const _mainnetIssues: IssuesConfig = {
  PoolIssues: {
    [PoolIssue.PoolProtocolFeeVulnWarning]: [
      '0x5b3240b6be3e7487d61cd1afdfc7fe4fa1d81e6400000000000000000000037b',
    ],
    [PoolIssue.PoolOwnerVulnWarningGovernanceMigrate]: [
      '0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000063',
    ],
    [PoolIssue.PoolOwnerVulnWarningGovernanceWithdraw]: [
      '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb20000000000000000000000fe',
    ],
    [PoolIssue.PoolOwnerVulnWarningGovernance]: [
      '0x9f19a375709baf0e8e35c2c5c65aca676c4c719100000000000000000000006e',
    ],
    [PoolIssue.PoolOwnerVulnWarningEcosystem]: [
      '0xe7b1d394f3b40abeaa0b64a545dbcf89da1ecb3f00010000000000000000009a',
      '0x3b40d7d5ae25df2561944dd68b252016c4c7b2800001000000000000000000c2',
      '0xccf5575570fac94cec733a58ff91bb3d073085c70002000000000000000000af',
    ],
    [PoolIssue.RenBTCWarning]: [
      '0xfeadd389a5c427952d8fdb8057d6c8ba1156cc56000000000000000000000066',
      '0xad6a8c18b62eb914604ec1eec7fbcf132799fe090001000000000000000003f6',
    ],
    [PoolIssue.EulerBoostedWarning]: [
      '0x50cf90b954958480b8df7958a9e965752f62712400000000000000000000046f',
    ],
    [PoolIssue.EulerRecoveryModeWarning]: [
      '0x133d241f225750d2c92948e464a5a80111920331000000000000000000000476',
      '0x00c2a4be503869fa751c2dbcb7156cc970b5a8da000000000000000000000477',
      '0x483006684f422a9448023b2382615c57c5ecf18f000000000000000000000488',
      '0xb5e3de837f869b0248825e0175da73d4e8c3db6b000200000000000000000474',
      '0xa718042e5622099e5f0ace4e7122058ab39e1bbe000200000000000000000475',
      '0x4fd4687ec38220f805b6363c3c1e52d0df3b5023000200000000000000000473',
    ],
    [PoolIssue.CspPoolVulnWarning]: CSP_ISSUE_POOL_IDS[GqlChain.Mainnet],
    [PoolIssue.FxPoolVulnWarning]: [
      '0x55bec22f8f6c69137ceaf284d9b441db1b9bfedc0002000000000000000003cd',
      '0x66bb9d104c55861feb3ec3559433f01f6373c9660002000000000000000003cf',
      '0xad0e5e0778cac28f1ff459602b31351871b5754a0002000000000000000003ce',
    ],
  },
}

export const mainnetIssues: IssuesConfig = convertHexKeysToLowerCase(_mainnetIssues)
