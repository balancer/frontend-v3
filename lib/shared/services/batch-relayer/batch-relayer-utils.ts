import { BatchRelayerService } from './batch-relayer.service'
import { GaugeActionsService } from './extensions/gauge-actions.service'
import { VaultActionsService } from './extensions/vault-actions.service'

export function getBatchRelayer(batchRelayer: string, wethAddress: string) {
  return new BatchRelayerService(
    batchRelayer,
    wethAddress,
    new VaultActionsService(),
    new GaugeActionsService()
  )
}
