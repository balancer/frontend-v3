'use client'

import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalProps } from '@chakra-ui/react'
import { RefObject, useEffect, useRef } from 'react'
import { usePool } from '../../usePool'
import { useAddLiquidity } from './useAddLiquidity'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/step-tracker.utils'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { AddLiquidityPreview } from './modal/AddLiquidityPreview'
import { AddLiquidityTimeout } from './modal/AddLiquidityTimeout'
import { AddLiquidityReceipt } from './AddLiquidityReceipt'
import { PoolActionModalFooter } from '../PoolActionModalFooter'
import { AnimatePresence, motion } from 'framer-motion'
import { FireworksOverlay } from '@/lib/shared/components/modals/FireworksOverlay'
import { TransactionModalHeader } from '../PoolActionModalHeader'

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
  const { transactionSteps, addLiquidityTxHash, hasQuoteContext } = useAddLiquidity()
  const { pool } = usePool()

  useEffect(() => {
    if (addLiquidityTxHash && !window.location.pathname.includes(addLiquidityTxHash)) {
      window.history.replaceState({}, '', `./add-liquidity/${addLiquidityTxHash}`)
    }
  }, [addLiquidityTxHash])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isCentered
      {...rest}
    >
      <FireworksOverlay startFireworks={!!addLiquidityTxHash && hasQuoteContext} />

      <ModalContent {...getStylesForModalContentWithStepTracker(isDesktop && hasQuoteContext)}>
        {isDesktop && hasQuoteContext && (
          <DesktopStepTracker chain={pool.chain} transactionSteps={transactionSteps} />
        )}
        <TransactionModalHeader
          label="Add liquidity"
          timeout={<AddLiquidityTimeout />}
          txHash={addLiquidityTxHash}
          chain={pool.chain}
        />
        <ModalCloseButton />
        <ModalBody>
          <AnimatePresence mode="wait" initial={false}>
            {addLiquidityTxHash ? (
              <motion.div
                key="receipt"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <AddLiquidityReceipt txHash={addLiquidityTxHash} />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <AddLiquidityPreview />
              </motion.div>
            )}
          </AnimatePresence>
        </ModalBody>
        <PoolActionModalFooter
          isSuccess={!!addLiquidityTxHash}
          currentStep={transactionSteps.currentStep}
        />
      </ModalContent>
    </Modal>
  )
}
