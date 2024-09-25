import {
  AddLiquidityHandler,
  Permit2AddLiquidityInput,
} from '@/lib/modules/pool/actions/add-liquidity/handlers/AddLiquidity.handler'
import { ensureError } from '@/lib/shared/utils/errors'
import { Permit2, PublicWalletClient } from '@balancer/sdk'
import { NoncesByTokenAddress } from './usePermit2Nonces'

type SignPermit2Params = {
  handler: AddLiquidityHandler //TODO: generalize to other handlers?
  sdkClient?: PublicWalletClient
  permit2Input: Permit2AddLiquidityInput
  nonces: NoncesByTokenAddress
}
export async function signPermit2TokenTransfer({
  handler,
  sdkClient,
  permit2Input,
  nonces,
}: SignPermit2Params): Promise<Permit2 | undefined> {
  if (!sdkClient) return undefined

  try {
    if (!handler.signPermit2) throw new Error('Handler does not implement signPermit2 method')
    const signature = await handler.signPermit2(permit2Input, sdkClient, nonces)
    return signature
  } catch (e: unknown) {
    const error = ensureError(e)
    console.log(error)
    // When the user explicitly rejects in the wallet we return undefined to ignore the error and do nothing
    if (error.name === 'UserRejectedRequestError') return
    throw error
  }
}
