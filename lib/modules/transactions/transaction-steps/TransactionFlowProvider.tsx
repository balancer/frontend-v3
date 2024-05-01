'use client'

/* eslint-disable react-hooks/exhaustive-deps */
import {
  CoreStepId,
  FlowStep,
  TransactionState,
  getTransactionState,
  isCoreStep,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { BlockExplorerLink } from '@/lib/shared/components/BlockExplorerLink'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { Card, HStack, Text } from '@chakra-ui/react'
import { PropsWithChildren, createContext, useEffect, useState } from 'react'
import { Check } from 'react-feather'

export function _useTransactionFlow() {
  const [flowStep, setFlowStep] = useState<FlowStep | undefined>()
  const [txHash, setTxHash] = useState<string | undefined>()

  const isFlowComplete: boolean = isCoreStep(flowStep?.id) && !!flowStep?.result.isSuccess
  const isFlowConfirming: boolean = isCoreStep(flowStep?.id) && !!flowStep?.result.isLoading

  useEffect(() => {
    if (!flowStep) return
    setTxHash(flowStep.result.data?.transactionHash)
  }, [flowStep?.result.data?.transactionHash])

  /*
    We are only interested in the state of the flow step if it is a concrete CoreStepId
  */
  function getCoreTransactionState(coreStepId: CoreStepId) {
    if (flowStep?.id !== coreStepId) return TransactionState.Ready
    return getTransactionState(flowStep)
  }

  //TODO: this success card will be deleted when we implement Receipt pages in Remove and Swap flows
  function SuccessCard({ chain }: { chain: GqlChain }) {
    const transactionHash = flowStep?.result.data?.transactionHash

    return (
      <Card variant="modalSubSection" border="1px" borderColor="font.highlight">
        <HStack justify="space-between" w="full">
          <HStack justify="flex-start" color="font.highlight">
            <Check size={20} />
            <Text color="font.highlight">Success</Text>
          </HStack>
          <BlockExplorerLink chain={chain} transactionHash={transactionHash} />)
        </HStack>
      </Card>
    )
  }

  return {
    flowStep,
    isFlowComplete,
    isFlowConfirming,
    txHash,
    setFlowStep,
    SuccessCard,
    getCoreTransactionState,
  }
}

export type Result = ReturnType<typeof _useTransactionFlow>
export const TransactionFlowContext = createContext<Result | null>(null)

export function TransactionFlowProvider({ children }: PropsWithChildren) {
  const validation = _useTransactionFlow()

  return (
    <TransactionFlowContext.Provider value={validation}>{children}</TransactionFlowContext.Provider>
  )
}

export const useTransactionFlow = (): Result =>
  useMandatoryContext(TransactionFlowContext, 'TransactionFlow')

export function useSyncTransactionFlowStep(step: FlowStep): FlowStep {
  const { setFlowStep } = useTransactionFlow()
  useEffect(() => {
    setFlowStep(step)
  }, [step.id, step.simulation.status, step.execution.status, step.result.status])
  return step
}
