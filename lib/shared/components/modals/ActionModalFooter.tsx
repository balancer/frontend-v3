'use client'

import { useAppzi } from '@/lib/shared/hooks/useAppzi'
import { Button, Divider, HStack, ModalFooter, VStack } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { CornerDownLeft, MessageSquare, ThumbsUp } from 'react-feather'
import {
  SafeAppTxCall,
  TransactionStep,
  TxBatch,
} from '../../../modules/transactions/transaction-steps/lib'
import { useBatchTransactions } from '@/lib/modules/web3/useBatchTransactions'
import { TransactionStepsResponse } from '@/lib/modules/transactions/transaction-steps/useTransactionSteps'
import { buildTxBatch } from '@/lib/modules/transactions/transaction-steps/batchableTransactions'
import { PropsWithChildren } from 'react'
import { gnosis } from 'viem/chains'
import { useIsSafeApp } from '@/lib/modules/web3/safe.hooks'

export function SuccessActions({
  returnLabel,
  returnAction,
}: {
  returnLabel?: string
  returnAction?: () => void
}) {
  const { openNpsModal } = useAppzi()

  return (
    <VStack w="full">
      <Divider />
      <HStack justify="space-between" w="full">
        <Button
          variant="ghost"
          leftIcon={<CornerDownLeft size="14" />}
          size="xs"
          onClick={returnAction}
        >
          {returnLabel}
        </Button>
        <Button variant="ghost" leftIcon={<ThumbsUp size="14" />} size="xs" onClick={openNpsModal}>
          Give feedback
        </Button>
        <Button
          as={Link}
          href="https://discord.balancer.fi"
          target="_blank"
          variant="ghost"
          leftIcon={<MessageSquare size="14" />}
          size="xs"
        >
          Ask questions
        </Button>
      </HStack>
    </VStack>
  )
}

type Props = {
  isSuccess: boolean
  currentStep: TransactionStep
  // TODO: refactor all ActionMOdalFooter instances to pass TransactionStepsResponse
  transactionSteps?: TransactionStepsResponse
  returnLabel: string
  returnAction: () => void
}

export function ActionModalFooter({ isSuccess, currentStep, returnLabel, returnAction }: Props) {
  return (
    <ModalFooter>
      <AnimatePresence mode="wait" initial={false}>
        {isSuccess ? (
          <motion.div
            key="footer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%' }}
          >
            <SuccessActions returnLabel={returnLabel} returnAction={returnAction} />
          </motion.div>
        ) : (
          <motion.div
            key="action"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%' }}
          >
            <VStack w="full">
              <RenderActionButton currentStep={currentStep} />
            </VStack>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalFooter>
  )
}

function RenderActionButton({ currentStep }: PropsWithChildren<{ currentStep: TransactionStep }>) {
  const isSafeApp = useIsSafeApp()
  // Pass this as a prop from upper layer
  const gnosisChainId = gnosis.id
  // const { isLoadingBatchTransactions, supportsBatchTransactions } =
  // useBatchTransactions(gnosisChainId)
  // if (isLoadingBatchTransactions) return null
  const supportsBatchTransactions = true // isSafeApp

  if (currentStep.isBatchEnd && supportsBatchTransactions) {
    const txBatch: TxBatch = buildTxBatch(currentStep)
    if (txBatch.length === 1) return currentStep?.renderAction()
    return currentStep?.renderBatchAction?.(txBatch)
  }
  return currentStep?.renderAction()
}
