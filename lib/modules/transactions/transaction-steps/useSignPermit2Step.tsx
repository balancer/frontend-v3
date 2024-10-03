'use client'

import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { BalAlert } from '@/lib/shared/components/alerts/BalAlert'
import { Button, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import {
  AddLiquidityPermit2Params,
  useSignPermit2Transfer,
} from '../../tokens/approvals/permit2/useSignPermit2Transfer'
import { useChainSwitch } from '../../web3/useChainSwitch'
import { SubSteps, TransactionStep } from './lib'
import { usePermit2Nonces } from '../../tokens/approvals/permit2/usePermit2Nonces'
import { getChainId } from '@/lib/config/app.config'
import { SignatureState } from '../../web3/signatures/signature.helpers'
import { getTokenAddresses, getTokenSymbols } from '../../pool/actions/LiquidityActionHelpers'
import { useTokens } from '../../tokens/TokensProvider'

export function useSignPermit2Step(params: AddLiquidityPermit2Params): TransactionStep {
  const { isConnected, userAddress } = useUserAccount()
  const { getToken } = useTokens()

  const { isLoadingNonces, nonces } = usePermit2Nonces({
    chainId: getChainId(params.pool.chain),
    tokenAddresses: getTokenAddresses(params.queryOutput),
    owner: userAddress,
    enabled: params.isPermit2,
  })

  const {
    signPermit2,
    signPermit2State,
    isLoading: isLoadingTransfer,
    isDisabled,
    buttonLabel,
    error,
  } = useSignPermit2Transfer({ ...params, nonces })
  const { shouldChangeNetwork, NetworkSwitchButton, networkSwitchButtonProps } = useChainSwitch(
    getChainId(params.pool.chain)
  )

  const isLoading =
    isLoadingTransfer || isLoadingNonces || signPermit2State === SignatureState.Confirming

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
          onClick={() => signPermit2(params.pool)}
          loadingText={buttonLabel}
        >
          {buttonLabel}
        </Button>
      )}
    </VStack>
  )

  const isComplete = () => signPermit2State === SignatureState.Completed

  const subSteps: SubSteps = {
    gasless: true,
    tokens: getTokenSymbols(getToken, params.pool.chain, params.queryOutput),
  }

  return useMemo(
    () => ({
      id: 'sign-permit2',
      stepType: 'signPermit2',
      subSteps,
      labels: {
        title: getTitle(subSteps),
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

function getTitle(subSteps?: SubSteps): string {
  if (!subSteps?.tokens) return `Permit on balancer`
  if (subSteps.tokens.length === 1) return `${subSteps.tokens[0]}: Permit on balancer`
  return 'Permit tokens on balancer'
}
