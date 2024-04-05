'use client'

import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { SignRelayerButton } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
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
import { usePool } from '../../usePool'
import { useAddLiquidity } from './useAddLiquidity'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/useStepTrackerProps'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { AddLiquidityPreview } from './modal/AddLiquidityPreview'
import { usePoolRedirect, useRefetchPoolOnFlowComplete } from '../../pool.hooks'
import { AddLiquidityTimeout } from './modal/AddLiquidityTimeout'
import { SuccessFireworks } from '@/lib/shared/components/SuccessFireworks'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
}

export function AddLiquidityModal({
  isOpen,
  onClose,
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const { isDesktop } = useBreakpoints()
  const initialFocusRef = useRef(null)
  const { stepConfigs, currentStep, currentStepIndex, useOnStepCompleted } = useAddLiquidity()
  const { pool, chainId } = usePool()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)
  const { redirectToPoolPage } = usePoolRedirect(pool)
  const { didRefetchPool, isFlowComplete } = useRefetchPoolOnFlowComplete()

  function onModalClose() {
    if (isFlowComplete) {
      if (isLoadingAfterSuccess) return
      return redirectToPoolPage()
    }
    onClose()
  }

  const isLoadingAfterSuccess = isFlowComplete && !didRefetchPool

  return (
    <Modal
      isOpen={isOpen}
      onClose={onModalClose}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isCentered
      {...rest}
    >
      {isFlowComplete && <SuccessFireworks />}
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
            <span>Add liquidity</span>
            <AddLiquidityTimeout />
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AddLiquidityPreview />
        </ModalBody>
        <ModalFooter>
          {shouldSignRelayerApproval ? (
            <SignRelayerButton />
          ) : (
            <VStack w="full">
              {isFlowComplete ? (
                /* TODO: implement system to enforce that the new pool balance is loaded in the portfolio
                  <Button as={Link} w="full" size="lg" isLoading={!didRefetchPool} href="/portfolio">
                    Visit portfolio
                  </Button>
                */
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
