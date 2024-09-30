'use client'

import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { BalAlert } from '@/lib/shared/components/alerts/BalAlert'
import { Button, HStack, VStack, Text, Spacer } from '@chakra-ui/react'
import { useMemo } from 'react'
import {
  RemoveLiquidityPermit1Params,
  useSignPermitTransfer as useSignPermitTransfer,
} from '../../tokens/approvals/permit/useSignPermitTransfer'
import { useChainSwitch } from '../../web3/useChainSwitch'
import { TransactionStep } from './lib'
import { getChainId } from '@/lib/config/app.config'
import { SignIcon } from '@/lib/shared/components/icons/SignIcon'
import { primaryTextColor } from '@/lib/shared/services/chakra/themes/bal/colors'
import { SignatureState } from '../../web3/signatures/signature.helpers'

export function useSignPermitStep(params: RemoveLiquidityPermit1Params): TransactionStep {
  const { isConnected } = useUserAccount()

  const { signPermit, signPermitState, isLoading, isDisabled, buttonLabel, error } =
    useSignPermitTransfer({ ...params })
  const { shouldChangeNetwork, NetworkSwitchButton, networkSwitchButtonProps } = useChainSwitch(
    getChainId(params.pool.chain)
  )

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
          onClick={signPermit}
          loadingText={buttonLabel}
        >
          <HStack spacing="sm" width="100%">
            <Text fontWeight="bold" color={primaryTextColor}>
              {buttonLabel}
            </Text>
            <Spacer />
            <SignIcon size={16} />
          </HStack>
        </Button>
      )}
    </VStack>
  )

  const isComplete = () => signPermitState === SignatureState.Completed

  return useMemo(
    () => ({
      id: 'sign-permit',
      stepType: 'signPermit',
      labels: {
        title: `Permit pool token on Balancer`,
        init: `Permit transfer`,
        tooltip: 'Sign permit transfer',
      },
      isComplete,
      renderAction: () => <SignPermitButton />,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signPermitState, isLoading, isConnected]
  )
}
