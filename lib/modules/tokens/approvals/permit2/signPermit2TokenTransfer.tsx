import { Pool } from '@/lib/modules/pool/PoolProvider'
import { constructBaseBuildCallInput } from '@/lib/modules/pool/actions/add-liquidity/handlers/v3Helpers'
import { ensureError } from '@/lib/shared/utils/errors'
import {
  AddLiquidityBaseQueryOutput,
  AddLiquidityQueryOutput,
  Address,
  Permit2,
  Permit2Helper,
  PublicWalletClient,
} from '@balancer/sdk'
import { HumanTokenAmountWithAddress } from '../../token.types'
import { NoncesByTokenAddress } from './usePermit2Nonces'

export interface Permit2AddLiquidityInput {
  account: Address
  slippagePercent: string
  sdkQueryOutput: AddLiquidityQueryOutput
}

type SignPermit2Params = {
  sdkClient?: PublicWalletClient
  pool: Pool
  humanAmountsIn: HumanTokenAmountWithAddress[]
  permit2Input: Permit2AddLiquidityInput
  nonces: NoncesByTokenAddress
}
export async function signPermit2TokenTransfer(
  params: SignPermit2Params
): Promise<Permit2 | undefined> {
  if (!params.sdkClient) return undefined

  try {
    const signature = await signPermit2(params)
    return signature
  } catch (e: unknown) {
    const error = ensureError(e)
    console.log(error)
    // When the user explicitly rejects in the wallet we return undefined to ignore the error and do nothing
    if (error.name === 'UserRejectedRequestError') return
    throw error
  }
}

async function signPermit2({
  sdkClient,
  pool,
  humanAmountsIn,
  permit2Input,
  nonces,
}: SignPermit2Params): Promise<Permit2> {
  if (!sdkClient) throw new Error('Missing sdkClient')
  const baseInput = constructBaseBuildCallInput({
    humanAmountsIn,
    slippagePercent: permit2Input.slippagePercent,
    // TODO: generalize for all v3 pool types
    sdkQueryOutput: permit2Input.sdkQueryOutput as AddLiquidityBaseQueryOutput,
    pool,
  })
  const signature = await Permit2Helper.signAddLiquidityApproval({
    ...baseInput,
    client: sdkClient,
    owner: permit2Input.account,
    nonces: baseInput.amountsIn.map(a => nonces[a.token.address]),
  })
  return signature
}
