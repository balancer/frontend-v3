import { useAppzi } from '@/lib/shared/hooks/useAppzi'
import { Button, Divider, HStack, ModalFooter, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { CornerDownLeft, MessageSquare, ThumbsUp } from 'react-feather'
import { usePool } from '../usePool'
import { usePoolRedirect } from '../pool.hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { TransactionStep } from '../../transactions/transaction-steps/lib'

export function SuccessActions() {
  const { pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)
  const { openNpsModal } = useAppzi()

  return (
    <VStack w="full">
      <Divider />
      <HStack justify="space-between" w="full">
        <Button
          variant="ghost"
          leftIcon={<CornerDownLeft size="14" />}
          size="xs"
          onClick={redirectToPoolPage}
        >
          Return to pool
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

export function PoolActionModalFooter({
  isSuccess,
  currentStep,
}: {
  isSuccess: boolean
  currentStep: TransactionStep
}) {
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
            <SuccessActions />
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
            <VStack w="full">{currentStep?.renderAction()}</VStack>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalFooter>
  )
}
