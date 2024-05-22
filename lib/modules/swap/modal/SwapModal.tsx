'use client'

import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalProps } from '@chakra-ui/react'
import { RefObject, useEffect, useRef } from 'react'
import { DesktopStepTracker } from '../../transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { useSwap } from '../useSwap'
import { SwapTimeout } from './SwapTimeout'
import { FireworksOverlay } from '@/lib/shared/components/modals/FireworksOverlay'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { AnimatePresence, motion } from 'framer-motion'
import { capitalize } from 'lodash'
import { ActionModalFooter } from '../../../shared/components/modals/ActionModalFooter'
import { TransactionModalHeader } from '../../../shared/components/modals/TransactionModalHeader'
import { chainToSlugMap } from '../../pool/pool.utils'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '../../transactions/transaction-steps/step-tracker/step-tracker.utils'
import { SwapPreview } from './SwapPreview'
import { SwapReceipt } from './SwapReceipt'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
}

export function SwapPreviewModal({
  isOpen,
  onClose,
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const { isDesktop } = useBreakpoints()
  const initialFocusRef = useRef(null)

  const { transactionSteps, swapAction, selectedChain, swapTxHash, hasQuoteContext } = useSwap()

  useEffect(() => {
    if (swapTxHash && !window.location.pathname.includes(swapTxHash)) {
      window.history.pushState({}, '', `/swap/${chainToSlugMap[selectedChain]}/${swapTxHash}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapTxHash])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isCentered
      {...rest}
    >
      <FireworksOverlay startFireworks={!!swapTxHash && hasQuoteContext} />

      <ModalContent {...getStylesForModalContentWithStepTracker(isDesktop && hasQuoteContext)}>
        {isDesktop && hasQuoteContext && (
          <DesktopStepTracker transactionSteps={transactionSteps} chain={selectedChain} />
        )}
        <TransactionModalHeader
          label={`Review ${capitalize(swapAction)}`}
          timeout={<SwapTimeout />}
          txHash={swapTxHash}
          chain={selectedChain}
        />
        <ModalCloseButton />
        <ModalBody>
          <AnimatePresence mode="wait" initial={false}>
            {swapTxHash ? (
              <motion.div
                key="receipt"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <SwapReceipt txHash={swapTxHash} />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <SwapPreview />
              </motion.div>
            )}
          </AnimatePresence>
        </ModalBody>
        <ActionModalFooter
          isSuccess={!!swapTxHash}
          currentStep={transactionSteps.currentStep}
          returnLabel="Swap again"
          returnAction={onClose}
        />
      </ModalContent>
    </Modal>
  )
}
