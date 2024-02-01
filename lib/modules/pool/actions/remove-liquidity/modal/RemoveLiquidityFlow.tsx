import { VStack } from '@chakra-ui/react'
import { StepConfig, useIterateSteps } from '../../useIterateSteps'
import { RemoveLiquidityButton } from '../RemoveLiquidityButton'
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { OnTransactionStateUpdate } from '@/lib/shared/components/btns/transaction-steps/lib'

export function RemoveLiquidityFlow() {
  const { setRemoveLiquidityTxState } = useRemoveLiquidity()

  function useRemoveLiquidityConfig(
    onTransactionStateUpdate: OnTransactionStateUpdate
  ): StepConfig {
    function render() {
      return (
        <RemoveLiquidityButton
          onTransactionStateUpdate={onTransactionStateUpdate}
        ></RemoveLiquidityButton>
      )
    }
    return { render }
  }
  const stepConfigs = [useRemoveLiquidityConfig(setRemoveLiquidityTxState)]

  const { currentStep } = useIterateSteps(stepConfigs)

  return <VStack w="full">{currentStep.render()}</VStack>
}
