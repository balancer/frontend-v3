import { VStack } from '@chakra-ui/react'
import { useIterateSteps } from '../../useIterateSteps'
import { RemoveLiquidityButton } from '../RemoveLiquidityButton'
import { useRemoveLiquidity } from '../useRemoveLiquidity'

export function RemoveLiquidityFlow() {
  const { setRemoveLiquidityTxState } = useRemoveLiquidity()
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
      {currentStep.type === 'removeLiquidity' && (
        <RemoveLiquidityButton
          onTransactionStateUpdate={setRemoveLiquidityTxState}
        ></RemoveLiquidityButton>
      )}
    </VStack>
  )
}
