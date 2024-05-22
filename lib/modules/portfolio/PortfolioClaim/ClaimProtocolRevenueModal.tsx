'use client'

import { Modal, ModalBody, ModalCloseButton, ModalContent, VStack, Card } from '@chakra-ui/react'

import { usePortfolio } from '@/lib/modules/portfolio/usePortfolio'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Address } from 'viem'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { DesktopStepTracker } from '../../transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { MobileStepTracker } from '../../transactions/transaction-steps/step-tracker/MobileStepTracker'
import { useClaimProtocolRewardsSteps } from '../useClaimProtocolRewardsSteps'
import { useTransactionSteps } from '../../transactions/transaction-steps/useTransactionSteps'
import { bn } from '@/lib/shared/utils/numbers'
import { FireworksOverlay } from '@/lib/shared/components/modals/FireworksOverlay'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '../../transactions/transaction-steps/step-tracker/step-tracker.utils'
import { TransactionModalHeader } from '@/lib/shared/components/modals/TransactionModalHeader'
import { TokenRowGroup } from '../../tokens/TokenRow/TokenRowGroup'
import { HumanTokenAmountWithAddress } from '../../tokens/token.types'
import { ActionModalFooter } from '@/lib/shared/components/modals/ActionModalFooter'

type Props = {
  isOpen: boolean
  onClose(): void
}

export default function ClaimProtocolRevenueModal({ isOpen, onClose }: Props) {
  const { protocolRewardsData, protocolRewardsBalance } = usePortfolio()
  const { isDesktop, isMobile } = useBreakpoints()

  const { steps, isLoadingSteps } = useClaimProtocolRewardsSteps()
  const transactionSteps = useTransactionSteps(steps, isLoadingSteps)

  const claimTxHash = transactionSteps.lastTransaction?.result?.data?.transactionHash

  const rewards: HumanTokenAmountWithAddress[] = protocolRewardsData
    .filter(reward => !bn(reward.balance).isZero())
    .map(reward => ({
      tokenAddress: reward.tokenAddress as Address,
      humanAmount: reward.humanBalance,
    }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <FireworksOverlay startFireworks={!!claimTxHash} />

      <ModalContent {...getStylesForModalContentWithStepTracker(isDesktop)}>
        {isDesktop && (
          <DesktopStepTracker transactionSteps={transactionSteps} chain={GqlChain.Mainnet} />
        )}
        <TransactionModalHeader
          label="Claim protocol rewards"
          txHash={claimTxHash}
          chain={GqlChain.Mainnet}
        />
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="sm" w="full">
            {isMobile && (
              <MobileStepTracker transactionSteps={transactionSteps} chain={GqlChain.Mainnet} />
            )}

            <Card variant="modalSubSection">
              <TokenRowGroup
                label="You'll get"
                amounts={rewards}
                totalUSDValue={protocolRewardsBalance.toString()}
                chain={GqlChain.Mainnet}
              />
            </Card>
          </VStack>
        </ModalBody>
        <ActionModalFooter
          isSuccess={!!claimTxHash}
          currentStep={transactionSteps.currentStep}
          returnLabel="Return to portfolio"
          returnAction={onClose}
        />
      </ModalContent>
    </Modal>
  )
}
