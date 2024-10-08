import { Pool } from '@/lib/modules/pool/PoolProvider'
import { ensureError } from '@/lib/shared/utils/errors'
import { get24HoursFromNowInSecs } from '@/lib/shared/utils/time'
import {
  AddLiquidityBaseQueryOutput,
  AddLiquidityQueryOutput,
  Address,
  MaxAllowanceTransferAmount,
  Permit2,
  Permit2Helper,
  PublicWalletClient,
  TokenAmount,
} from '@balancer/sdk'
import { HumanTokenAmountWithAddress } from '../../token.types'
import { NoncesByTokenAddress } from './usePermit2Allowance'
import { constructBaseBuildCallInput } from '@/lib/modules/pool/actions/add-liquidity/handlers/add-liquidity.utils'

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
export async function signPermit2Token(params: SignPermit2Params): Promise<Permit2 | undefined> {
  try {
    const signature = await sign(params)
    return signature
  } catch (e: unknown) {
    const error = ensureError(e)
    console.log(error)
    // When the user explicitly rejects in the wallet we return undefined to ignore the error and do nothing
    if (error.name === 'UserRejectedRequestError') return
    throw error
  }
}

async function sign({
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
    amountsIn: maximizePositiveAmounts(baseInput.amountsIn),
    // Permit2 allowance expires in 24H
    expirations: baseInput.amountsIn.map(() => get24HoursFromNowInSecs()),
  })
  return signature
}

// Maximize amounts for permit2 approval for amounts > 0n
function maximizePositiveAmounts(amountsIn: TokenAmount[]): TokenAmount[] {
  return amountsIn.map(
    item =>
      ({
        ...item,
        amount: item.amount > 0n ? MaxAllowanceTransferAmount : item.amount,
      } as TokenAmount)
  )
}
