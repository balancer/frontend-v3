import { useAppzi } from '@/lib/shared/hooks/useAppzi'
import { Button, Divider, HStack, ModalFooter, VStack } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { CornerDownLeft, MessageSquare, ThumbsUp } from 'react-feather'
import { TransactionStep } from '../../../modules/transactions/transaction-steps/lib'

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
  returnLabel: string
  returnAction: () => void
  urlTxHash?: string
}

export function ActionModalFooter({
  isSuccess,
  currentStep,
  returnLabel,
  returnAction,
  urlTxHash,
}: Props) {
  // Avoid animations when displaying an historic receipt
  if (urlTxHash) {
    return (
      <ModalFooter>
        <SuccessActions returnLabel={returnLabel} returnAction={returnAction} />
      </ModalFooter>
    )
  }
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
            <VStack w="full">{currentStep.renderAction()}</VStack>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalFooter>
  )
}
