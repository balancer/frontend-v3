'use client'

import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalProps } from '@chakra-ui/react'
import { RefObject, useRef } from 'react'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/step-tracker.utils'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { FireworksOverlay } from '@/lib/shared/components/modals/FireworksOverlay'
import { useStaking } from './useStaking'
import { usePool } from '../../usePool'
import { TransactionModalHeader } from '../PoolActionModalHeader'
import { PoolActionModalFooter } from '../PoolActionModalFooter'
import { StakePreview } from './StakePreview'

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
  const { transactionSteps, stakeTxHash } = useStaking()
  const { pool } = usePool()

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

      <ModalContent {...getStylesForModalContentWithStepTracker(isDesktop && !stakeTxHash)}>
        {isDesktop && <DesktopStepTracker chain={pool.chain} transactionSteps={transactionSteps} />}
        <TransactionModalHeader label="Stake LP tokens" txHash={stakeTxHash} chain={pool.chain} />
        <ModalCloseButton />
        <ModalBody>
          <StakePreview />
        </ModalBody>
        <PoolActionModalFooter
          isSuccess={!!stakeTxHash}
          currentStep={transactionSteps.currentStep}
        />
      </ModalContent>
    </Modal>
  )
}
