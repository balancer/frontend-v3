'use client'

import { getChainId } from '@/lib/config/app.config'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { BalAlert } from '@/lib/shared/components/alerts/BalAlert'
import { Button, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { getTokenAddresses } from '../../pool/actions/LiquidityActionHelpers'
import { usePermit2Allowance } from '../../tokens/approvals/permit2/usePermit2Allowance'
import {
  AddLiquidityPermit2Params,
  useSignPermit2Transfer,
} from '../../tokens/approvals/permit2/useSignPermit2Transfer'
import { SignatureState } from '../../web3/signatures/signature.helpers'
import { useChainSwitch } from '../../web3/useChainSwitch'
import { TransactionStep } from './lib'
import { hasValidPermit2 } from '../../tokens/approvals/permit2/permit2.helpers'

/*
  Returns a transaction step to sign a permit2 transfer for the given pool and token amounts
  If the permit2 allowance is expired for one of the positive token amounts in: returns undefined
 */
export function useSignPermit2Step(params: AddLiquidityPermit2Params): TransactionStep | undefined {
  const { isConnected, userAddress } = useUserAccount()

  const { isLoadingPermit2Allowances, nonces, expirations, allowedAmounts } = usePermit2Allowance({
    chainId: getChainId(params.pool.chain),
    tokenAddresses: getTokenAddresses(params.queryOutput),
    owner: userAddress,
    enabled: params.isPermit2,
  })

  const isValidPermit2 = hasValidPermit2(params.queryOutput, expirations, allowedAmounts)

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

  const isLoading = isLoadingTransfer || isLoadingPermit2Allowances

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

  const isComplete = () => signPermit2State === SignatureState.Completed || isValidPermit2

  return useMemo(
    () => ({
      id: 'sign-permit2',
      stepType: 'signPermit2',
      labels: {
        title: `Permit on balancer`,
        init: `Permit transfer`,
        tooltip: 'Sign permit2 transfer',
      },
      isComplete,
      renderAction: () => <SignPermitButton />,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signPermit2State, isLoading, isConnected, isValidPermit2]
  )
}
