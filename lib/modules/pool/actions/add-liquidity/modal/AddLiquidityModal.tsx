/* eslint-disable max-len */
'use client'

import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { SignRelayerButton } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import {
  Box,
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
import { useAddLiquidity } from '../useAddLiquidity'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/useStepTrackerProps'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { AddLiquidityPreview } from './AddLiquidityPreview'
import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
import { AddLiquiditySuccess } from './AddLiquiditySuccess'
import { useCurrentFlowStep } from '@/lib/modules/transactions/transaction-steps/useCurrentFlowStep'

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
  const { isDesktop, isMobile } = useBreakpoints()
  const initialFocusRef = useRef(null)
  const { stepConfigs, currentStep, currentStepIndex, useOnStepCompleted } = useAddLiquidity()
  const { isFlowComplete } = useCurrentFlowStep()
  const { pool, chainId } = usePool()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)

  function onModalClose() {
    if (isFlowComplete) {
      console.log('closing modal from success')
      //TODO: decide where to go (porfolio page?)
      return
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onModalClose}
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
        <ModalHeader>Add liquidity</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isMobile && (
            <Box mb="md">
              <MobileStepTracker
                currentStepIndex={currentStepIndex}
                stepConfigs={stepConfigs}
                chain={pool.chain}
              />
            </Box>
          )}
          {isFlowComplete ? <AddLiquiditySuccess /> : <AddLiquidityPreview />}
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
