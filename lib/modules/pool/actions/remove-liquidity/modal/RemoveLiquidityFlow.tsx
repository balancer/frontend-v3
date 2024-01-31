import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { useIterateSteps } from '../../useIterateSteps'
import { RemoveLiquidityButton } from '../RemoveLiquidityButton'
import { RemoveLiquidityTimeout } from './RemoveLiquidityTimeout'

export function RemoveLiquidityFlow() {
  const [removeLiquidityTxState, setRemoveLiquidityTxState] = useState<TransactionState>()

  interface RemoveLiquidityConfig {
    type: 'removeLiquidity'
    // no props
  }

  const removeLiquidityConfig: RemoveLiquidityConfig = {
    type: 'removeLiquidity',
  }
  const stepConfigs = [removeLiquidityConfig]

  const { currentStep } = useIterateSteps(stepConfigs)

  return (
    <VStack w="full">
      <RemoveLiquidityTimeout removeLiquidityTxState={removeLiquidityTxState} />

      {currentStep.type === 'removeLiquidity' && (
        <RemoveLiquidityButton
          onTransactionStateUpdate={setRemoveLiquidityTxState}
        ></RemoveLiquidityButton>
      )}
    </VStack>
  )
}
