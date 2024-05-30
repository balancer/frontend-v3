/* eslint-disable max-len */
import { BatchRelayerService } from '../batch-relayer/batch-relayer.service'
import mainnetNetworkConfig from '@/lib/config/networks/mainnet'
import { GaugeService } from './gauge.service'
import { gaugeActionsService } from '../batch-relayer/extensions/gauge-actions.service'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'

test('gauge service build call data for a gauge withdraw (unstake)', () => {
  const batchRelayerService = new BatchRelayerService(
    mainnetNetworkConfig.contracts.balancer.relayerV6,
    gaugeActionsService
  )
  const service = new GaugeService(batchRelayerService)

  const gaugeAddress = '0xe99a452a65e5bb316febac5de83a1ca59f6a3a94' as const
  const inputData = {
    hasPendingNonBalRewards: false,
    hasPendingBalRewards: false,
    gauges: [gaugeAddress],
    sender: defaultTestUserAccount,
    recipient: defaultTestUserAccount,
    amount: 10n,
    outputReference: 0n,
  }
  const callDataList = service.getGaugeClaimRewardsAndWithdrawContractCallData(inputData)

  expect(callDataList).toMatchInlineSnapshot([
    '0x65ca4804000000000000000000000000e99a452a65e5bb316febac5de83a1ca59f6a3a94000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000000000000000000a',
  ])
})
