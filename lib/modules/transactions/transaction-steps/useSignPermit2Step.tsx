'use client'

import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { BalAlert } from '@/lib/shared/components/alerts/BalAlert'
import { Button, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { SignPermit2State } from '../../tokens/approvals/permit2/Permit2SignatureProvider'
import {
  AddLiquidityPermit2Params,
  useSignPermit2Transfer,
} from '../../tokens/approvals/permit2/useSignPermit2Transfer'
import { useChainSwitch } from '../../web3/useChainSwitch'
import { TransactionStep } from './lib'
import { usePermit2Nonces } from '../../tokens/approvals/permit2/usePermit2Nonces'

export const signRelayerStepTitle = 'Sign relayer'

export function useSignPermit2Step(
  params: AddLiquidityPermit2Params,
  chainId: number,
  enabled = false
): TransactionStep {
  const { isConnected, userAddress } = useUserAccount()

  //TODO: Move this hook into useSignPermit2Transfer?
  //TODO: isLoading state depending on amountsIn (simulation loaded)?
  const { isLoadingNonces, nonces } = usePermit2Nonces({
    chainId,
    tokenAddresses: params.queryOutput?.sdkQueryOutput.amountsIn.map(t => t.token.address),
    owner: userAddress,
    enabled,
  })

  const {
    signPermit2,
    signPermit2State,
    isLoading: isLoadingTransfer,
    isDisabled,
    buttonLabel,
    error,
  } = useSignPermit2Transfer({ ...params, nonces })
  const { shouldChangeNetwork, NetworkSwitchButton, networkSwitchButtonProps } =
    useChainSwitch(chainId)

  const isLoading = isLoadingTransfer || isLoadingNonces

  const SignPermitButton = () => (
    <VStack width="full">
      {error && <BalAlert status="error" content={error} />}
      {!isConnected && <ConnectWallet width="full" isLoading={isLoading} />}
      {shouldChangeNetwork && isConnected && <NetworkSwitchButton {...networkSwitchButtonProps} />}
      {!shouldChangeNetwork && isConnected && (
        <Button
          width="full"
          w="full"
          size="lg"
          variant="primary"
          isDisabled={isDisabled}
          isLoading={isLoading}
          onClick={signPermit2}
          loadingText={buttonLabel}
        >
          {buttonLabel}
        </Button>
      )}
    </VStack>
  )

  const isComplete = () => signPermit2State === SignPermit2State.Completed

  return useMemo(
    () => ({
      id: 'sign-permit2',
      stepType: 'signPermit2',
      labels: {
        // TODO: display token symbol/s
        title: `Permit on balancer`,
        init: `Permit transfer`,
        tooltip: 'Sign permit2 transfer',
      },
      isComplete,
      renderAction: () => <SignPermitButton />,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signPermit2State, isLoading, isConnected]
  )
}
