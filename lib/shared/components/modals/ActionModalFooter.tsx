import { useAppzi } from '@/lib/shared/hooks/useAppzi'
import { Button, Divider, HStack, ModalFooter, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { CornerDownLeft, MessageSquare, ThumbsUp } from 'react-feather'
import { usePool } from '../../../modules/pool/usePool'
import { usePoolRedirect } from '../../../modules/pool/pool.hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { TransactionStep } from '../../../modules/transactions/transaction-steps/lib'
import { PropsWithChildren } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function SuccessActions({ onClose }: { onClose?: () => void }) {
  const { openNpsModal } = useAppzi()
  const router = useRouter()
  const pathname = usePathname()
  const isSwap = pathname.startsWith('/swap')

  return (
    <VStack w="full">
      <Divider />
      <HStack justify="space-between" w="full">
        {isSwap ? (
          <ReturnButton
            onClick={() => {
              // window.history.replaceState({}, '', '/swap')
              // router.push('/swap')
              onClose?.()
            }}
          >
            Return to swap
          </ReturnButton>
        ) : (
          <ReturnToPoolButton />
        )}
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

function ReturnToPoolButton() {
  const { pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)
  return <ReturnButton onClick={redirectToPoolPage}>Return to pool</ReturnButton>
}

type ActionProps = PropsWithChildren<{ onClick: () => void }>
function ReturnButton({ onClick, children }: ActionProps) {
  return (
    <Button variant="ghost" leftIcon={<CornerDownLeft size="14" />} size="xs" onClick={onClick}>
      {children}
    </Button>
  )
}

export function ActionModalFooter({
  isSuccess,
  currentStep,
  onClose,
}: {
  isSuccess: boolean
  currentStep: TransactionStep
  onClose?: () => void
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
            <SuccessActions onClose={onClose} />
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
