import { encodeFunctionData } from 'viem'
import { balancerV2BatchRelayerLibraryABI } from '@/lib/modules/web3/contracts/abi/generated'
import {
  EncodeGaugeClaimRewardsInput,
  EncodeGaugeDepositInput,
  EncodeGaugeMintInput,
  EncodeGaugeWithdrawInput,
} from '../relayer-types'

export class GaugeActionsService {
  public encodeDeposit(params: EncodeGaugeDepositInput): `0x${string}` {
    return encodeFunctionData({
      abi: balancerV2BatchRelayerLibraryABI,
      functionName: 'gaugeDeposit',
      args: [params.gauge, params.sender, params.recipient, params.amount],
    })
  }

  public encodeWithdraw(params: EncodeGaugeWithdrawInput): `0x${string}` {
    return encodeFunctionData({
      abi: balancerV2BatchRelayerLibraryABI,
      functionName: 'gaugeWithdraw',
      args: [params.gauge, params.sender, params.recipient, params.amount],
    })
  }

  public encodeClaimRewards(params: EncodeGaugeClaimRewardsInput): `0x${string}` {
    return encodeFunctionData({
      abi: balancerV2BatchRelayerLibraryABI,
      functionName: 'gaugeClaimRewards',
      args: [params.gauges],
    })
  }

  public encodeMint(params: EncodeGaugeMintInput): `0x${string}` {
    return encodeFunctionData({
      abi: balancerV2BatchRelayerLibraryABI,
      functionName: 'gaugeMint',
      args: [params.gauges, params.outputReference],
    })
  }
}

export const gaugeActionsService = new GaugeActionsService()
