'use client'

import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { Modal, ModalCloseButton, ModalContent, ModalProps } from '@chakra-ui/react'
import { RefObject, useEffect, useRef } from 'react'
import { usePool } from '../../../PoolProvider'
import { useAddLiquidity } from '../AddLiquidityProvider'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/step-tracker.utils'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { AddLiquidityPreview } from './AddLiquidityPreview'
import { AddLiquidityTimeout } from './AddLiquidityTimeout'
import { AddLiquidityReceipt } from './AddLiquidityReceipt'
import { ActionModalFooter } from '../../../../../shared/components/modals/ActionModalFooter'
import { motion } from 'framer-motion'
import { SuccessOverlay } from '@/lib/shared/components/modals/SuccessOverlay'
import { usePoolRedirect } from '../../../pool.hooks'
import { TransactionModalHeader } from '@/lib/shared/components/modals/TransactionModalHeader'
import { useResetStepIndexOnOpen } from '../../useResetStepIndexOnOpen'
import { useOnUserAccountChanged } from '@/lib/modules/web3/useOnUserAccountChanged'
import { AnimatedModalBody } from '@/lib/shared/components/modals/AnimatedModalBody'

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
  const { transactionSteps, addLiquidityTxHash, hasQuoteContext, setInitialHumanAmountsIn } =
    useAddLiquidity()
  const { pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  useResetStepIndexOnOpen(isOpen, transactionSteps)

  useEffect(() => {
    if (addLiquidityTxHash && !window.location.pathname.includes(addLiquidityTxHash)) {
      window.history.replaceState({}, '', `./add-liquidity/${addLiquidityTxHash}`)
    }
  }, [addLiquidityTxHash])

  useOnUserAccountChanged(() => {
    setInitialHumanAmountsIn()
    onClose()
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isCentered
      preserveScrollBarGap
      {...rest}
    >
      <SuccessOverlay startAnimation={!!addLiquidityTxHash && hasQuoteContext} />

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
        <AnimatedModalBody>
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
        </AnimatedModalBody>
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
