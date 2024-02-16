import {
  EncodeGaugeClaimRewardsInput,
  EncodeGaugeDepositInput,
  EncodeGaugeMintInput,
  EncodeGaugeWithdrawInput,
} from './relayer-types'
import { GaugeActionsService } from './extensions/gauge-actions.service'
import { balancerV2BatchRelayerLibraryABI } from '@/lib/modules/web3/contracts/abi/generated'
import { encodeFunctionData } from 'viem'

export class BatchRelayerService {
  constructor(
    public readonly batchRelayerAddress: string,
    private readonly gaugeActionsService: GaugeActionsService
  ) {}

  public encodePeekChainedReferenceValue(reference: bigint): string {
    return encodeFunctionData({
      abi: balancerV2BatchRelayerLibraryABI,
      functionName: 'peekChainedReferenceValue',
      args: [reference],
    })
  }

  public gaugeEncodeDeposit(params: EncodeGaugeDepositInput): `0x${string}` {
    return this.gaugeActionsService.encodeDeposit(params)
  }

  public gaugeEncodeWithdraw(params: EncodeGaugeWithdrawInput): `0x${string}` {
    return this.gaugeActionsService.encodeWithdraw(params)
  }

  public gaugeEncodeClaimRewards(params: EncodeGaugeClaimRewardsInput): `0x${string}` {
    return this.gaugeActionsService.encodeClaimRewards(params)
  }

  public gaugeEncodeMint(params: EncodeGaugeMintInput): `0x${string}` {
    return this.gaugeActionsService.encodeMint(params)
  }
}
