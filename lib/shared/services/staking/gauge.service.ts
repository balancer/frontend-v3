import { Address } from 'viem'
import { BatchRelayerService } from '../batch-relayer/batch-relayer.service'
import {
  EncodeGaugeClaimRewardsInput,
  EncodeGaugeMintInput,
  EncodeGaugeWithdrawInput,
} from '../batch-relayer/relayer-types'

export class GaugeService {
  constructor(private readonly batchRelayerService: BatchRelayerService) {}

  public getGaugeClaimRewardsAndWithdrawContractCallData({
    hasPendingNonBALRewards,
    hasPendingBalRewards,
    gauges,
    sender,
    recipient,
    amount,
    outputReference,
  }: {
    hasPendingNonBALRewards: boolean
    hasPendingBalRewards: boolean
    gauges: Address[]
    sender: Address
    recipient: Address
    amount: bigint
    outputReference: bigint
  }) {
    const calls: `0x${string}`[] = []

    const rewardsCalls = this.getGaugeClaimRewardsContractCallData({
      hasPendingNonBALRewards,
      hasPendingBalRewards,
      gauges,
      outputReference,
    })

    if (rewardsCalls.length) {
      calls.push(...rewardsCalls)
    }

    calls.push(this.getGaugeEncodeWithdrawCallData({ gauge: gauges[0], sender, recipient, amount }))

    return calls
  }

  public getGaugeClaimRewardsContractCallData({
    hasPendingNonBALRewards,
    hasPendingBalRewards,
    gauges,
    outputReference,
  }: {
    hasPendingNonBALRewards: boolean
    hasPendingBalRewards: boolean
    gauges: Address[]
    outputReference: bigint
  }) {
    const calls: `0x${string}`[] = []

    if (hasPendingNonBALRewards) {
      calls.push(this.getGaugeEncodeClaimRewardsCallData({ gauges }))
    }

    if (hasPendingBalRewards) {
      calls.push(this.getGaugeEncodeMintCallData({ gauges, outputReference }))
    }

    return calls
  }

  private getGaugeEncodeWithdrawCallData({
    gauge,
    sender,
    recipient,
    amount,
  }: EncodeGaugeWithdrawInput): `0x${string}` {
    return this.batchRelayerService.gaugeEncodeWithdraw({ gauge, sender, recipient, amount })
  }

  public getGaugeEncodeClaimRewardsCallData({
    gauges,
  }: EncodeGaugeClaimRewardsInput): `0x${string}` {
    return this.batchRelayerService.gaugeEncodeClaimRewards({ gauges })
  }

  public getGaugeEncodeMintCallData({
    gauges,
    outputReference,
  }: EncodeGaugeMintInput): `0x${string}` {
    return this.batchRelayerService.gaugeEncodeMint({ gauges, outputReference })
  }
}
