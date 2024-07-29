'use client'

import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalProps } from '@chakra-ui/react'
import { RefObject, useEffect, useRef } from 'react'
import { DesktopStepTracker } from '../../transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { useSwap } from '../SwapProvider'
import { SwapTimeout } from './SwapTimeout'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { AnimatePresence } from 'framer-motion'
import { capitalize } from 'lodash'
import { ActionModalFooter } from '../../../shared/components/modals/ActionModalFooter'
import { TransactionModalHeader } from '../../../shared/components/modals/TransactionModalHeader'
import { chainToSlugMap } from '../../pool/pool.utils'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '../../transactions/transaction-steps/step-tracker/step-tracker.utils'
import { SwapModalBody } from './SwapModalBody'
import { SuccessOverlay } from '@/lib/shared/components/modals/SuccessOverlay'
import { useUserAccount } from '../../web3/UserAccountProvider'
import { useIsMounted } from '@/lib/shared/hooks/useIsMounted'
import { useResetStepIndexOnOpen } from '../../pool/actions/useResetStepIndexOnOpen'

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
  const { userAddress } = useUserAccount()
  const isMounted = useIsMounted()
  const initialFocusRef = useRef(null)

  const { transactionSteps, swapAction, isWrap, selectedChain, swapTxHash, hasQuoteContext } =
    useSwap()

  useResetStepIndexOnOpen(isOpen, transactionSteps)

  useEffect(() => {
    if (!isWrap && swapTxHash && !window.location.pathname.includes(swapTxHash)) {
      window.history.pushState({}, '', `/swap/${chainToSlugMap[selectedChain]}/${swapTxHash}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapTxHash])

  useEffect(() => {
    if (isMounted) {
      onClose()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress])

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
      <SuccessOverlay startAnimation={!!swapTxHash && hasQuoteContext} />

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
            <SwapModalBody />
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
