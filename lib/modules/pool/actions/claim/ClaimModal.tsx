import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalProps,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useClaiming } from './useClaiming'
import { Address } from 'viem'
import { PoolListItem } from '../../pool.types'
import { FireworksOverlay } from '@/lib/shared/components/modals/FireworksOverlay'
import { HumanAmount } from '@balancer/sdk'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
import { TokenRowGroup } from '@/lib/modules/tokens/TokenRow/TokenRowGroup'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/step-tracker.utils'
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { TransactionModalHeader } from '@/lib/shared/components/modals/TransactionModalHeader'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  gaugeAddresses: Address[]
  pool: PoolListItem
}

export function ClaimModal({
  isOpen,
  onClose,
  pool,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const { isDesktop, isMobile } = useBreakpoints()
  const { transactionSteps, hasNoRewards, claimTxHash, allClaimableRewards, totalClaimableUsd } =
    useClaiming([pool])

  const rewards = allClaimableRewards
    .map(reward => ({
      humanAmount: (reward?.humanBalance || '0') as HumanAmount,
      tokenAddress: (reward?.tokenAddress || '') as Address,
    }))
    .filter(Boolean)

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered {...rest}>
      <FireworksOverlay startFireworks={!!claimTxHash} />

      <ModalContent {...getStylesForModalContentWithStepTracker(isDesktop)}>
        {isDesktop && <DesktopStepTracker transactionSteps={transactionSteps} chain={pool.chain} />}
        <TransactionModalHeader label="Claim rewards" txHash={claimTxHash} chain={pool.chain} />
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="sm">
            {isMobile && (
              <MobileStepTracker transactionSteps={transactionSteps} chain={pool.chain} />
            )}
            {hasNoRewards ? (
              <Text>Nothing to claim</Text>
            ) : (
              <Card variant="modalSubSection">
                <TokenRowGroup
                  amounts={rewards}
                  chain={pool.chain}
                  label="You'll get"
                  totalUSDValue={totalClaimableUsd}
                />
              </Card>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <VStack w="full">
            {hasNoRewards ? (
              <Button size="lg" onClick={onClose}>
                Close
              </Button>
            ) : (
              transactionSteps.currentStep?.renderAction()
            )}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
