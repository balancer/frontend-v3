import { shouldUseNestedLiquidity } from '../pool/actions/LiquidityActionHelpers'
import { usePool } from '../pool/PoolProvider'
import { useUserSettings } from '../user/settings/UserSettingsProvider'
import { useUserAccount } from '../web3/UserAccountProvider'

type RelayerMode = 'signRelayer' | 'approveRelayer' | 'no-relayer-needed'

export function useRelayerMode(): RelayerMode {
  const { connector } = useUserAccount()
  const { pool } = usePool()
  const { enableSignatures } = useUserSettings()

  if (!shouldUseNestedLiquidity(pool)) return 'no-relayer-needed'

  if (enableSignatures === 'no') return 'approveRelayer'
  if (connector?.id === 'walletConnect') return 'approveRelayer'
  if (connector?.id === 'gnosis') return 'approveRelayer'
  if (connector?.id === 'safe') return 'approveRelayer'
  return 'signRelayer'
}
