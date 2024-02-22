import { Address, Hex } from 'viem'
import { BatchRelayerService } from '../batch-relayer/batch-relayer.service'
import {
  EncodeGaugeClaimRewardsInput,
  EncodeGaugeMintInput,
  EncodeGaugeWithdrawInput,
} from '../batch-relayer/relayer-types'

interface ClaimCallDataArgs {
  hasPendingNonBalRewards: boolean
  hasPendingBalRewards: boolean
  gauges: Address[]
  outputReference: bigint
}

interface ClaimAndWithdrawCallDataArgs extends ClaimCallDataArgs {
  sender: Address
  recipient: Address
  amount: bigint
}

export class GaugeService {
  constructor(private readonly batchRelayerService: BatchRelayerService) {}

  public getGaugeClaimRewardsAndWithdrawContractCallData({
    hasPendingNonBalRewards,
    hasPendingBalRewards,
    gauges,
    sender,
    recipient,
    amount,
    outputReference,
  }: ClaimAndWithdrawCallDataArgs) {
    const calls: Hex[] = []

    const rewardsCalls = this.getGaugeClaimRewardsContractCallData({
      hasPendingNonBalRewards,
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
    hasPendingNonBalRewards,
    hasPendingBalRewards,
    gauges,
    outputReference,
  }: ClaimCallDataArgs) {
    const calls: Hex[] = []

    if (hasPendingNonBalRewards) {
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
  }: EncodeGaugeWithdrawInput): Hex {
    return this.batchRelayerService.gaugeEncodeWithdraw({ gauge, sender, recipient, amount })
  }

  public getGaugeEncodeClaimRewardsCallData({ gauges }: EncodeGaugeClaimRewardsInput): Hex {
    return this.batchRelayerService.gaugeEncodeClaimRewards({ gauges })
  }

  public getGaugeEncodeMintCallData({ gauges, outputReference }: EncodeGaugeMintInput): Hex {
    return this.batchRelayerService.gaugeEncodeMint({ gauges, outputReference })
  }
}
