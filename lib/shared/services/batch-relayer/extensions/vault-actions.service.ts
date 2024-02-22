import { encodeFunctionData } from 'viem'
import { EncodeExitPoolInput } from '../relayer-types'
import { balancerV2BatchRelayerLibraryABI } from '@/lib/modules/web3/contracts/abi/generated'

export class VaultActionsService {
  public encodeExitPool(params: EncodeExitPoolInput): string {
    return encodeFunctionData({
      abi: balancerV2BatchRelayerLibraryABI,
      functionName: 'exitPool',
      args: [
        params.poolId,
        params.poolKind,
        params.sender,
        params.recipient,
        params.exitPoolRequest,
        params.outputReferences,
      ],
    })
  }
}
