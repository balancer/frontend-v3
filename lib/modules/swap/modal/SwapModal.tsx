'use client'

import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalProps } from '@chakra-ui/react'
import { RefObject, useEffect, useRef } from 'react'
import { DesktopStepTracker } from '../../transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { useSwap } from '../SwapProvider'
import { SwapTimeout } from './SwapTimeout'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { capitalize } from 'lodash'
import { ActionModalFooter } from '../../../shared/components/modals/ActionModalFooter'
import { TransactionModalHeader } from '../../../shared/components/modals/TransactionModalHeader'
import { chainToSlugMap } from '../../pool/pool.utils'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '../../transactions/transaction-steps/step-tracker/step-tracker.utils'
import { SuccessOverlay } from '@/lib/shared/components/modals/SuccessOverlay'
import { useResetStepIndexOnOpen } from '../../pool/actions/useResetStepIndexOnOpen'
import { useOnUserAccountChanged } from '../../web3/useOnUserAccountChanged'
import { SwapSummary } from './SwapSummary'

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

  const { transactionSteps, swapAction, isWrap, selectedChain, swapTxHash, hasQuoteContext } =
    useSwap()

  useResetStepIndexOnOpen(isOpen, transactionSteps)

  useEffect(() => {
    if (!isWrap && swapTxHash && !window.location.pathname.includes(swapTxHash)) {
      window.history.pushState({}, '', `/swap/${chainToSlugMap[selectedChain]}/${swapTxHash}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapTxHash])

  useOnUserAccountChanged(onClose)

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
          <SwapSummary />
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
