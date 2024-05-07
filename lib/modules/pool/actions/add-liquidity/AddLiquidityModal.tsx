'use client'

import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { SignRelayerButton } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
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
import { usePool } from '../../usePool'
import { useAddLiquidity } from './useAddLiquidity'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/useStepTrackerProps'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import Image from 'next/image'
import { AddLiquidityPreview } from './modal/AddLiquidityPreview'
import { AddLiquidityTimeout } from './modal/AddLiquidityTimeout'
import { getNetworkConfig } from '@/lib/config/app.config'
import { AddLiquiditySubmitted } from './AddLiquiditySubmitted'
import { ActionCompleteModalFooter } from '../ActionCompleteModalFooter'
import { useTransactionFlow } from '@/lib/modules/transactions/transaction-steps/TransactionFlowProvider'

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
  const { currentStep, currentStepIndex } = useAddLiquidity()
  const { pool, chainId } = usePool()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)
  const { isFlowComplete, isFlowConfirming } = useTransactionFlow()
  const networkConfig = getNetworkConfig(pool.chain)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isCentered
      {...rest}
    >
      <ModalOverlay />
      <ModalContent {...getStylesForModalContentWithStepTracker(isDesktop)}>
        {isDesktop && (
          <DesktopStepTracker
            currentStepIndex={currentStepIndex}
            stepConfigs={stepConfigs}
            chain={pool.chain}
          />
        )}
        <ModalHeader>
          <HStack justify="space-between" w="full" pr="lg">
            {isFlowComplete || isFlowConfirming ? (
              <Image
                src={networkConfig.iconPath}
                width="24"
                height="24"
                alt={networkConfig.shortName}
              />
            ) : (
              <span>Add liquidity</span>
            )}
            <AddLiquidityTimeout />
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isFlowComplete || isFlowConfirming ? <AddLiquiditySubmitted /> : <AddLiquidityPreview />}
        </ModalBody>
        <ModalFooter>
          {isFlowComplete || isFlowConfirming ? (
            <ActionCompleteModalFooter />
          ) : shouldSignRelayerApproval ? (
            <SignRelayerButton />
          ) : (
            <VStack w="full">{currentStep.renderAction()}</VStack>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
