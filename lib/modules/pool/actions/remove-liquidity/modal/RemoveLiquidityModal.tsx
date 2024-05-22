'use client'

import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalProps } from '@chakra-ui/react'
import { RefObject, useEffect, useRef } from 'react'
import { usePool } from '../../../usePool'
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { RemoveLiquidityTimeout } from './RemoveLiquidityTimeout'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/step-tracker.utils'
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { RemoveLiquidityPreview } from './RemoveLiquidityPreview'
import { SuccessOverlay } from '@/lib/shared/components/modals/SuccessOverlay'
import { AnimatePresence, motion } from 'framer-motion'
import { ActionModalFooter } from '../../../../../shared/components/modals/ActionModalFooter'
import { RemoveLiquidityReceipt } from './RemoveLiquidityReceipt'
import { usePoolRedirect } from '../../../pool.hooks'
import { TransactionModalHeader } from '@/lib/shared/components/modals/TransactionModalHeader'

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
  const { transactionSteps, removeLiquidityTxHash, hasQuoteContext } = useRemoveLiquidity()
  const { pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  useEffect(() => {
    if (removeLiquidityTxHash && !window.location.pathname.includes(removeLiquidityTxHash)) {
      window.history.replaceState({}, '', `./remove-liquidity/${removeLiquidityTxHash}`)
    }
  }, [removeLiquidityTxHash])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isCentered
      {...rest}
    >
      <SuccessOverlay startAnimation={!!removeLiquidityTxHash && hasQuoteContext} />

      <ModalContent {...getStylesForModalContentWithStepTracker(isDesktop)}>
        {isDesktop && hasQuoteContext && (
          <DesktopStepTracker transactionSteps={transactionSteps} chain={pool.chain} />
        )}

        <TransactionModalHeader
          label="Remove liquidity"
          timeout={<RemoveLiquidityTimeout />}
          txHash={removeLiquidityTxHash}
          chain={pool.chain}
        />

        <ModalCloseButton />
        <ModalBody>
          <AnimatePresence mode="wait" initial={false}>
            {removeLiquidityTxHash ? (
              <motion.div
                key="receipt"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <RemoveLiquidityReceipt txHash={removeLiquidityTxHash} />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <RemoveLiquidityPreview />
              </motion.div>
            )}
          </AnimatePresence>
        </ModalBody>
        <ActionModalFooter
          isSuccess={!!removeLiquidityTxHash}
          currentStep={transactionSteps.currentStep}
          returnLabel="Return to pool"
          returnAction={redirectToPoolPage}
        />
      </ModalContent>
    </Modal>
  )
}
