'use client'

import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { SignRelayerButton } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import {
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
import { RefObject, useEffect, useRef } from 'react'
import { usePool } from '../../usePool'
import { useAddLiquidity } from './useAddLiquidity'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/useStepTrackerProps'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { sleep } from '@/lib/shared/utils/time'
import { AddLiquidityPreview } from './modal/AddLiquidityPreview'
import { AddLiquidityTimeout } from './modal/AddLiquidityTimeout'
import { useReceipt } from '../../../transactions/transaction-steps/useReceipt'

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
  const { navigateToReceipt, isFlowComplete } = useReceipt()

  useEffect(() => {
    if (isFlowComplete) {
      // Wait to allow animations in the preview modal before navigating to receipt page
      sleep(500).then(() => navigateToReceipt())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlowComplete])

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
            <VStack w="full">{currentStep.render(useOnStepCompleted)}</VStack>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
