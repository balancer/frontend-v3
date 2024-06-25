import { useAppzi } from '@/lib/shared/hooks/useAppzi'
import { Button, Divider, HStack, ModalFooter, VStack } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import { CornerDownLeft, MessageSquare, ThumbsUp } from 'react-feather'
import { TransactionStep } from '../../../modules/transactions/transaction-steps/lib'
import { useBatchTransactions } from '@/lib/modules/web3/useBatchTransactions'
import { TransactionStepsResponse } from '@/lib/modules/transactions/transaction-steps/useTransactionSteps'
import { buildTxBatch } from '@/lib/modules/transactions/transaction-steps/batchableTransactions'

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

export function ActionModalFooter({
  isSuccess,
  currentStep,
  transactionSteps,
  returnLabel,
  returnAction,
}: Props) {
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
              <RenderActionButton steps={transactionSteps as TransactionStepsResponse} />
            </VStack>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalFooter>
  )
}

function RenderActionButton({ steps }: PropsWithChildren<{ steps: TransactionStepsResponse }>) {
  const currentStep = steps.currentStep!
  // Pass this as a prop from upper layer
  const arbitrumChainId = 42161
  const { isLoadingBatchTransactions, supportsBatchTransactions } =
    useBatchTransactions(arbitrumChainId)
  if (isLoadingBatchTransactions) return null
  if (currentStep.isBatchEnd && supportsBatchTransactions) {
    const txBatch = buildTxBatch(currentStep)
    if (txBatch.length === 1) return currentStep?.renderAction()
    console.log({ txBatch })
    return currentStep?.renderBatchAction?.(txBatch)
  }
  return currentStep?.renderAction()
}
