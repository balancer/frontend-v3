import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useWalletClient } from 'wagmi'
import { signRelayerApproval } from './signRelayerApproval'
import { useHasApprovedRelayer } from './useHasApprovedRelayer'
import { useRelayerMode } from './useRelayerMode'
import { SignRelayerState, useRelayerSignature } from './useRelayerSignature'
import { SupportedChainId } from '@/lib/config/config.types'

export function useShouldSignRelayerApproval(chainId: SupportedChainId) {
  const relayerMode = useRelayerMode()
  const { hasApprovedRelayer } = useHasApprovedRelayer(chainId)
  const { relayerApprovalSignature } = useRelayerSignature()

  return relayerMode === 'signRelayer' && !relayerApprovalSignature && !hasApprovedRelayer
}

export function useSignRelayerApproval() {
  const toast = useToast()
  const { userAddress } = useUserAccount()

  const { setRelayerApprovalSignature, signRelayerState, setSignRelayerState } =
    useRelayerSignature()

  const [error, setError] = useState<string | undefined>()

  const { data: walletClient } = useWalletClient()

  useEffect(() => {
    if (walletClient === undefined) {
      setSignRelayerState(SignRelayerState.Preparing)
    } else {
      setSignRelayerState(SignRelayerState.Ready)
    }
  }, [setSignRelayerState, walletClient])

  async function signRelayer() {
    setSignRelayerState(SignRelayerState.Confirming)
    setError(undefined)

    try {
      const signature = await signRelayerApproval(userAddress, walletClient)

      if (signature) {
        setSignRelayerState(SignRelayerState.Completed)
        toast({
          title: '🎉 Relayer approval signed',
          description: '',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } else {
        setSignRelayerState(SignRelayerState.Ready)
      }

      setRelayerApprovalSignature(signature)
    } catch (error) {
      // TODO: refactor when we define a global error handling UX pattern
      console.error(error)
      setError('Error in relayer signature call')
      setSignRelayerState(SignRelayerState.Ready)
    }
  }

  return {
    signRelayer,
    signRelayerState,
    buttonLabel: getButtonLabel(signRelayerState),
    isLoading: isLoading(signRelayerState),
    isDisabled: isDisabled(signRelayerState),
    error,
  }
}

function isDisabled(signRelayerState: SignRelayerState) {
  return (
    signRelayerState === SignRelayerState.Confirming ||
    signRelayerState === SignRelayerState.Completed
  )
}

function isLoading(signRelayerState: SignRelayerState) {
  return (
    signRelayerState === SignRelayerState.Confirming ||
    signRelayerState === SignRelayerState.Preparing
  )
}

function getButtonLabel(signRelayerState: SignRelayerState) {
  if (signRelayerState === SignRelayerState.Ready) return '✏️ Sign relayer'
  if (signRelayerState === SignRelayerState.Confirming) return 'Confirm relayer signature in wallet'
  if (signRelayerState === SignRelayerState.Preparing) return 'Preparing'
  if (signRelayerState === SignRelayerState.Completed) return '🎉 Relayer Signed'
  return ''
}
