'use client'

/* eslint-disable react-hooks/exhaustive-deps */
import {
  CoreStepId,
  FlowStep,
  TransactionState,
  getTransactionState,
  isCoreStep,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { Card, HStack, Text } from '@chakra-ui/react'
import { PropsWithChildren, createContext, useEffect, useState } from 'react'
import { ArrowUpRight, Check } from 'react-feather'
import Link from 'next/link'
import { getBlockExplorerName, getBlockExplorerTxUrl } from '@/lib/shared/hooks/useBlockExplorer'

export function _useCurrentFlowStep() {
  const [flowStep, setCurrentFlowStep] = useState<FlowStep | undefined>()

  const isFlowComplete: boolean = isCoreStep(flowStep?.id) && !!flowStep?.result.isSuccess

  /*
    We are only interested in the state of the flow step if it is a concrete CoreStepId
  */
  function getCoreTransactionState(coreStepId: CoreStepId) {
    if (flowStep?.id !== coreStepId) return TransactionState.Ready
    return getTransactionState(flowStep)
  }

  function clearCurrentFlowStep() {
    setCurrentFlowStep(undefined)
  }

  function SuccessCard({ chain }: { chain: GqlChain }) {
    const transactionHash = flowStep?.result.data?.transactionHash || ''

    return (
      <Card variant="modalSubSection" border="1px" borderColor="font.highlight">
        <HStack justify="space-between" w="full">
          <HStack justify="flex-start" color="font.highlight">
            <Check size={20} />
            <Text color="font.highlight">Success</Text>
          </HStack>
          <Link target="_blank" href={getBlockExplorerTxUrl(transactionHash, chain)}>
            <HStack color="grayText">
              <Text fontSize="sm" variant="secondary">
                View on {getBlockExplorerName(chain)}
              </Text>
              <ArrowUpRight size={14} />
            </HStack>
          </Link>
          )
        </HStack>
      </Card>
    )
  }

  return {
    flowStep,
    isFlowComplete,
    SuccessCard,
    setCurrentFlowStep,
    clearCurrentFlowStep,
    getCoreTransactionState,
  }
}

export type Result = ReturnType<typeof _useCurrentFlowStep>
export const CurrentFlowStepContext = createContext<Result | null>(null)

export function CurrentFlowStepProvider({ children }: PropsWithChildren) {
  const validation = _useCurrentFlowStep()

  return (
    <CurrentFlowStepContext.Provider value={validation}>{children}</CurrentFlowStepContext.Provider>
  )
}

export const useCurrentFlowStep = (): Result =>
  useMandatoryContext(CurrentFlowStepContext, 'CurrentFlowStep')

export function useSyncCurrentFlowStep(step: FlowStep): FlowStep {
  const { setCurrentFlowStep } = useCurrentFlowStep()
  useEffect(() => {
    setCurrentFlowStep(step)
  }, [step.id, step.simulation.status, step.execution.status, step.result.status])
  return step
}
