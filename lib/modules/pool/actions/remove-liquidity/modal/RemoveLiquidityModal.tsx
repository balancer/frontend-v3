'use client'

import {
  HStack,
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
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { RemoveLiquidityTimeout } from './RemoveLiquidityTimeout'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/step-tracker.utils'
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { RemoveLiquidityPreview } from './RemoveLiquidityPreview'
import { FireworksOverlay } from '@/lib/shared/components/modals/FireworksOverlay'
import { TransactionModalHeader } from '../../PoolActionModalHeader'
import { AnimatePresence, motion } from 'framer-motion'

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isCentered
      {...rest}
    >
      <FireworksOverlay startFireworks={!!removeLiquidityTxHash && hasQuoteContext} />

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
                {/* <AddLiquidityReceipt txHash={removeLiquidityTxHash} /> */}
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
        <ModalFooter>
          <VStack w="full">{transactionSteps.currentStep?.renderAction()}</VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
