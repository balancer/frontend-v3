import { Pool } from '../pool/usePool'
import { GaugeService } from '@/lib/shared/services/staking/gauge.service'
import { BatchRelayerService } from '@/lib/shared/services/batch-relayer/batch-relayer.service'
import { getNetworkConfig } from '@/lib/config/app.config'
import { gaugeActionsService } from '@/lib/shared/services/batch-relayer/extensions/gauge-actions.service'

export function selectStakingService(pool: Pool) {
  const networkConfig = getNetworkConfig(pool.chain)
  const batchRelayerService = new BatchRelayerService(
    networkConfig.contracts.balancer.relayerV6,
    gaugeActionsService
  )

  if (pool.staking?.type === 'GAUGE') {
    return new GaugeService(batchRelayerService)
  }
}
