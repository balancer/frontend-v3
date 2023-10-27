import { erc20ABI } from 'wagmi'
import { vaultV2ABI } from '../abi/generated'

export const AbiMap = {
  'balancer.vaultV2': vaultV2ABI,
  'balancer.wsETH': erc20ABI,
}
