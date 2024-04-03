'use client'

import {
  Button,
  Card,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  VStack,
} from '@chakra-ui/react'
import { RefObject, useRef } from 'react'
import { fNum } from '@/lib/shared/utils/numbers'
import { usePool } from '../../../usePool'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { Address, parseUnits } from 'viem'
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { RemoveLiquidityTimeout } from './RemoveLiquidityTimeout'
import { SignRelayerButton } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { shouldUseRecoveryRemoveLiquidity } from '../../LiquidityActionHelpers'
import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/useStepTrackerProps'
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { PoolActionsPriceImpactDetails } from '../../PoolActionsPriceImpactDetails'
import { usePoolRedirect, useRefetchPoolOnFlowComplete } from '../../../pool.hooks'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
}

export function RemoveLiquidityModal({
  isOpen,
  onClose,
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const { isDesktop, isMobile } = useBreakpoints()
  const initialFocusRef = useRef(null)
  const {
    tokens,
    isProportional,
    isSingleToken,
    singleTokenOutAddress,
    stepConfigs,
    currentStep,
    currentStepIndex,
    quoteBptIn,
    totalUSDValue,
    amountOutForToken,
    useOnStepCompleted,
  } = useRemoveLiquidity()
  const { pool, chainId } = usePool()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)
  const { slippage } = useUserSettings()
  const { redirectToPoolPage } = usePoolRedirect(pool)
  const { didRefetchPool, isFlowComplete } = useRefetchPoolOnFlowComplete()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isCentered
      {...rest}
    >
      <ModalOverlay />
      <ModalContent {...getStylesForModalContentWithStepTracker(isDesktop)}>
        {isDesktop && (
          <DesktopStepTracker
            currentStepIndex={currentStepIndex}
            stepConfigs={stepConfigs}
            chain={pool.chain}
          />
        )}
        <ModalHeader>
          <HStack justify="space-between" w="full" pr="lg">
            <span>Remove liquidity</span>
            <RemoveLiquidityTimeout />
          </HStack>
        </ModalHeader>

        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="sm" align="start">
            {isMobile && (
              <MobileStepTracker
                currentStepIndex={currentStepIndex}
                stepConfigs={stepConfigs}
                chain={pool.chain}
              />
            )}
            <Card variant="modalSubSection">
              <VStack align="start" spacing="md">
                <Text fontWeight="bold" fontSize="sm">
                  You&apos;re removing
                </Text>
                <TokenRow
                  value={quoteBptIn}
                  address={pool.address as Address}
                  chain={pool.chain}
                  isBpt={true}
                  pool={pool}
                />
              </VStack>
            </Card>
            <Card variant="modalSubSection">
              <VStack align="start" spacing="md">
                <HStack justify="space-between" w="full">
                  <Text fontWeight="bold" fontSize="sm">
                    You&apos;ll get at least
                  </Text>
                  <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
                    With max slippage: {fNum('slippage', slippage)}
                  </Text>
                </HStack>
                {isProportional &&
                  tokens.map(
                    token =>
                      token && (
                        <TokenRow
                          key={token.address}
                          address={token.address as Address}
                          chain={pool.chain}
                          value={amountOutForToken(token.address as Address)}
                        />
                      )
                  )}
                {isSingleToken && (
                  <TokenRow
                    address={singleTokenOutAddress as Address}
                    chain={pool.chain}
                    value={amountOutForToken(singleTokenOutAddress as Address)}
                  />
                )}
              </VStack>
            </Card>
            <Card variant="modalSubSection">
              <VStack align="start" spacing="sm">
                <PoolActionsPriceImpactDetails
                  totalUSDValue={totalUSDValue}
                  bptAmount={BigInt(parseUnits(quoteBptIn, 18))}
                />
              </VStack>
            </Card>
          </VStack>
        </ModalBody>
        <ModalFooter>
          {shouldSignRelayerApproval && !shouldUseRecoveryRemoveLiquidity(pool) ? (
            <SignRelayerButton />
          ) : (
            <VStack w="full">
              {isFlowComplete ? (
                <Button w="full" size="lg" onClick={redirectToPoolPage} isLoading={!didRefetchPool}>
                  Return to pool
                </Button>
              ) : (
                currentStep.render(useOnStepCompleted)
              )}
            </VStack>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
