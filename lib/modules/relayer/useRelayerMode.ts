import { shouldUseNestedLiquidity } from '../pool/actions/LiquidityActionHelpers'
import { usePool } from '../pool/usePool'
import { useUserSettings } from '../user/settings/useUserSettings'
import { useUserAccount } from '../web3/useUserAccount'

type RelayerMode = 'signRelayer' | 'approveRelayer' | 'no-relayer-needed'

export function useRelayerMode(): RelayerMode {
  const { connector } = useUserAccount()
  const { pool } = usePool()
  const { enableSignatures } = useUserSettings()

  if (!shouldUseNestedLiquidity(pool)) return 'no-relayer-needed'

  if (enableSignatures === 'no') return 'approveRelayer'
  if (connector?.id === 'walletConnect') return 'approveRelayer'
  //TODO: confirm gnosis safe connector ID
  if (connector?.id === 'gnosisSafe') return 'approveRelayer'
  return 'signRelayer'
}
