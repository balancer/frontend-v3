import { HumanAmountIn } from './add-liquidity.types'

export const isEmptyAmount = (amountIn: HumanAmountIn) =>
  !amountIn.humanAmount || amountIn.humanAmount === '0'

export const areEmptyAmounts = (humanAmountsIn: HumanAmountIn[]) =>
  humanAmountsIn.every(isEmptyAmount)
