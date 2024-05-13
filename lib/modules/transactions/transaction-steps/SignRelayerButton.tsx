'use client'

import { useSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { Alert, Button, VStack } from '@chakra-ui/react'
import { TransactionStep } from './lib'
import { SignRelayerState } from '../../relayer/useRelayerSignature'
import { useMemo } from 'react'

export const signRelayerStepTitle = 'Sign relayer'

/**
  The sign relayer step is an edge-case step where there's no transaction
  but we still need a Step (with no render) to display the step in the StepTracker
 */
export const signRelayerStep = { labels: { title: signRelayerStepTitle }, render: () => <></> }

export function useSignRelayerStep(): TransactionStep {
  const { isConnected } = useUserAccount()
  const { signRelayer, signRelayerState, isLoading, isDisabled, buttonLabel, error } =
    useSignRelayerApproval()

  const SignRelayerButton = () => (
    <VStack width="full">
      {error && (
        <Alert rounded="md" status="error">
          {error}
        </Alert>
      )}
      {!isConnected && <ConnectWallet />}
      {isConnected && (
        <Button
          width="full"
          w="full"
          size="lg"
          variant="primary"
          isDisabled={isDisabled}
          isLoading={isLoading}
          onClick={signRelayer}
          loadingText={buttonLabel}
        >
          {buttonLabel}
        </Button>
      )}
    </VStack>
  )

  const isComplete = () => signRelayerState === SignRelayerState.Completed

  return useMemo(
    () => ({
      id: 'sign-relayer',
      stepType: 'signBatchRelayer',
      labels: {
        title: 'Sign relayer',
        init: 'Sign relayer',
        tooltip: 'Sign relayer',
      },
      isComplete,
      renderAction: () => <SignRelayerButton />,
    }),
    [signRelayerState]
  )
}

export function SignRelayerButton() {
  const { isConnected } = useUserAccount()
  const { signRelayer, isLoading, isDisabled, buttonLabel, error } = useSignRelayerApproval()

  return (
    <VStack width="full">
      {error && (
        <Alert rounded="md" status="error">
          {error}
        </Alert>
      )}
      {!isConnected && <ConnectWallet />}
      {isConnected && (
        <Button
          width="full"
          w="full"
          size="lg"
          variant="primary"
          isDisabled={isDisabled}
          isLoading={isLoading}
          onClick={signRelayer}
          loadingText={buttonLabel}
        >
          {buttonLabel}
        </Button>
      )}
    </VStack>
  )
}
