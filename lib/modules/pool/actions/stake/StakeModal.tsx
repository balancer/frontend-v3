'use client'

import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalProps,
  VStack,
} from '@chakra-ui/react'
import { RefObject, useRef } from 'react'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/step-tracker.utils'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { FireworksOverlay } from '@/lib/shared/components/modals/FireworksOverlay'
import { useStake } from './StakeProvider'
import { usePool } from '../../usePool'
import { TransactionModalHeader } from '../PoolActionModalHeader'
import { PoolActionModalFooter } from '../PoolActionModalFooter'
import { StakePreview } from './StakePreview'
import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
}

export function StakeModal({
  isOpen,
  onClose,
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const { isDesktop } = useBreakpoints()
  const initialFocusRef = useRef(null)
  const { transactionSteps, stakeTxHash, quoteAmountIn, quoteAmountInUsd } = useStake()
  const { pool } = usePool()
  const { isMobile } = useBreakpoints()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isCentered
      {...rest}
    >
      <FireworksOverlay startFireworks={!!stakeTxHash} />

      <ModalContent {...getStylesForModalContentWithStepTracker(isDesktop)}>
        {isDesktop && <DesktopStepTracker chain={pool.chain} transactionSteps={transactionSteps} />}
        <TransactionModalHeader label="Stake LP tokens" txHash={stakeTxHash} chain={pool.chain} />
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="sm" w="full">
            {isMobile && (
              <MobileStepTracker chain={pool.chain} transactionSteps={transactionSteps} />
            )}
            <StakePreview stakableBalance={quoteAmountIn} stakableBalanceUsd={quoteAmountInUsd} />
          </VStack>
        </ModalBody>
        <PoolActionModalFooter
          isSuccess={!!stakeTxHash}
          currentStep={transactionSteps.currentStep}
        />
      </ModalContent>
    </Modal>
  )
}
