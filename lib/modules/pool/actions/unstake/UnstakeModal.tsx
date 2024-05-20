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
import { usePool } from '../../usePool'
import { TransactionModalHeader } from '../PoolActionModalHeader'
import { PoolActionModalFooter } from '../PoolActionModalFooter'
import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
import { useUnstake } from './UnstakeProvider'
import { UnstakePreview } from './UnstakePreview'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
}

export function UnstakeModal({
  isOpen,
  onClose,
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const { isDesktop } = useBreakpoints()
  const initialFocusRef = useRef(null)
  const {
    transactionSteps,
    unstakeTxHash,
    quoteAmountOut,
    quoteAmountOutUsd,
    quoteRewardAmounts,
    quoteTotalClaimableUsd,
  } = useUnstake()
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
      <FireworksOverlay startFireworks={!!unstakeTxHash} />

      <ModalContent {...getStylesForModalContentWithStepTracker(isDesktop && !unstakeTxHash)}>
        {isDesktop && <DesktopStepTracker chain={pool.chain} transactionSteps={transactionSteps} />}
        <TransactionModalHeader label="Stake LP tokens" txHash={unstakeTxHash} chain={pool.chain} />
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="sm" w="full">
            {isMobile && (
              <MobileStepTracker chain={pool.chain} transactionSteps={transactionSteps} />
            )}
            <UnstakePreview
              stakedBalance={quoteAmountOut}
              stakedBalanceUsd={quoteAmountOutUsd}
              rewardAmounts={quoteRewardAmounts}
              totalClaimableUsd={quoteTotalClaimableUsd}
            />
          </VStack>
        </ModalBody>
        <PoolActionModalFooter
          isSuccess={!!unstakeTxHash}
          currentStep={transactionSteps.currentStep}
        />
      </ModalContent>
    </Modal>
  )
}
