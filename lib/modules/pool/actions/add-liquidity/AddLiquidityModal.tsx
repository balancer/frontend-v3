/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
'use client'

import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { SignRelayerButton } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import {
  Box,
  Button,
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
import { RefObject, useEffect, useRef, useState } from 'react'
import { usePool } from '../../usePool'
import { useAddLiquidity } from './useAddLiquidity'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/useStepTrackerProps'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { AddLiquidityPreview } from './modal/AddLiquidityPreview'
import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
import { AddLiquiditySuccess } from './modal/AddLiquiditySuccess'
import { useCurrentFlowStep } from '@/lib/modules/transactions/transaction-steps/useCurrentFlowStep'
import { usePoolRedirect } from '../../pool.hooks'

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
  const [didRefetchPool, setDidRefetchPool] = useState(false)
  const { isDesktop, isMobile } = useBreakpoints()
  const initialFocusRef = useRef(null)
  const { stepConfigs, currentStep, currentStepIndex, useOnStepCompleted } = useAddLiquidity()
  const { isFlowComplete } = useCurrentFlowStep()
  const { pool, chainId, refetch } = usePool()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)
  const { redirectToPoolPage } = usePoolRedirect(pool)

  function onModalClose() {
    if (isFlowComplete) {
      if (isLoadingAfterSuccess) return
      return redirectToPoolPage()
    }
    onClose()
  }

  async function handleRedirectToPoolPage(event: React.MouseEvent<HTMLElement>) {
    redirectToPoolPage(event)
  }

  const isLoadingAfterSuccess = isFlowComplete && !didRefetchPool

  useEffect(() => {
    async function reFetchPool() {
      await refetch()
      setDidRefetchPool(true)
    }
    if (isFlowComplete) reFetchPool()
  }, [isFlowComplete])

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
            <VStack w="full">
              {isFlowComplete ? (
                /* TODO: implement system to enforce that the new pool balance is loaded in the portfolio
                  <Button as={Link} w="full" size="lg" isLoading={!didRefetchPool} href="/portfolio">
                    Visit portfolio
                  </Button>
                */
                <Button
                  w="full"
                  size="lg"
                  onClick={handleRedirectToPoolPage}
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
