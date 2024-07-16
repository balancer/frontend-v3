'use client'

import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalProps } from '@chakra-ui/react'
import { RefObject, useEffect, useRef, useState } from 'react'
import { usePool } from '../../../PoolProvider'
import { useAddLiquidity } from '../AddLiquidityProvider'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/step-tracker.utils'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { AddLiquidityPreview } from './AddLiquidityPreview'
import { AddLiquidityTimeout } from './AddLiquidityTimeout'
import { AddLiquidityReceipt } from './AddLiquidityReceipt'
import { ActionModalFooter } from '../../../../../shared/components/modals/ActionModalFooter'
import { AnimatePresence, motion } from 'framer-motion'
import { SuccessOverlay } from '@/lib/shared/components/modals/SuccessOverlay'
import { usePoolRedirect } from '../../../pool.hooks'
import { TransactionModalHeader } from '@/lib/shared/components/modals/TransactionModalHeader'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { useIsMounted } from '@/lib/shared/hooks/useIsMounted'
import { useResetStepIndexOnOpen } from '../../useResetStepIndexOnOpen'

type Props = {
  finalFocusRef?: RefObject<HTMLInputElement>
}

export function AddLiquidityModal({
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, 'children' | 'isOpen' | 'onClose'>) {
  const [modalHeight, setModalHeight] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)

  const { isDesktop } = useBreakpoints()
  const initialFocusRef = useRef(null)
  const {
    previewModalDisclosure,
    transactionSteps,
    addLiquidityTxHash,
    hasQuoteContext,
    setInitialHumanAmountsIn,
  } = useAddLiquidity()
  const { pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)
  const isMounted = useIsMounted()
  const { userAddress } = useUserAccount()

  useResetStepIndexOnOpen(previewModalDisclosure.isOpen, transactionSteps)

  useEffect(() => {
    if (addLiquidityTxHash && !window.location.pathname.includes(addLiquidityTxHash)) {
      window.history.replaceState({}, '', `./add-liquidity/${addLiquidityTxHash}`)
    }
  }, [addLiquidityTxHash])

  useEffect(() => {
    if (isMounted) {
      setInitialHumanAmountsIn()
      previewModalDisclosure.onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress])

  // Set modal height to prevent content from jumping when changing to success state.
  useEffect(() => {
    if (modalHeight === 0 && modalRef.current) {
      setModalHeight(modalRef.current.clientHeight)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalRef.current])

  return (
    <Modal
      isOpen={previewModalDisclosure.isOpen}
      onClose={previewModalDisclosure.onClose}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isCentered
      {...rest}
    >
      <SuccessOverlay startAnimation={!!addLiquidityTxHash && hasQuoteContext} />

      <ModalContent
        ref={modalRef}
        minH={modalRef.current ? `${modalHeight}px` : 'auto'}
        {...getStylesForModalContentWithStepTracker(isDesktop && hasQuoteContext)}
      >
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
        <ActionModalFooter
          isSuccess={!!addLiquidityTxHash}
          currentStep={transactionSteps.currentStep}
          returnLabel="Return to pool"
          returnAction={redirectToPoolPage}
        />
      </ModalContent>
    </Modal>
  )
}
