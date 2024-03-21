import { Pool } from '../../../usePool'
import { ProportionalRemoveLiquidityHandler } from './ProportionalRemoveLiquidity.handler'

/*
 A recovery exit is just a Proportional one but with Recovery kind (see implementation)
 Having this explicit class improves sentry errors
*/

export class RecoveryRemoveLiquidityHandler extends ProportionalRemoveLiquidityHandler {
  constructor(pool: Pool) {
    const recoveryMode = true
    super(pool, recoveryMode)
  }
}
