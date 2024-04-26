'use client'

import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
} from '@chakra-ui/react'
import { RefObject, useRef } from 'react'
import { usePool } from '../../../usePool'
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { RemoveLiquidityTimeout } from './RemoveLiquidityTimeout'
import { SignRelayerButton } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { shouldUseRecoveryRemoveLiquidity } from '../../LiquidityActionHelpers'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/useStepTrackerProps'
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { usePoolRedirect, useRefetchPoolOnFlowComplete } from '../../../pool.hooks'
import { RemoveLiquidityPreview } from './RemoveLiquidityPreview'
import { useClearCurrentFlowStepOnUnmount } from '@/lib/modules/transactions/transaction-steps/useCurrentFlowStep'

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
  const { isDesktop } = useBreakpoints()
  const initialFocusRef = useRef(null)
  const { stepConfigs, currentStep, currentStepIndex, useOnStepCompleted } = useRemoveLiquidity()
  const { pool, chainId } = usePool()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)
  const { redirectToPoolPage } = usePoolRedirect(pool)
  const { didRefetchPool, isFlowComplete } = useRefetchPoolOnFlowComplete()
  useClearCurrentFlowStepOnUnmount()

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
          <RemoveLiquidityPreview />
        </ModalBody>
        <ModalFooter>
          {shouldSignRelayerApproval && !shouldUseRecoveryRemoveLiquidity(pool) ? (
            <SignRelayerButton />
          ) : (
            <VStack w="full">
              {isFlowComplete ? (
                <Button
                  variant="tertiary"
                  w="full"
                  size="lg"
                  onClick={redirectToPoolPage}
                  isLoading={!didRefetchPool}
                >
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
