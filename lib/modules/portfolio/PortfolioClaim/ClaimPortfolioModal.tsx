'use client'

import { usePortfolio } from '@/lib/modules/portfolio/PortfolioProvider'
import { PoolListItem } from '@/lib/modules/pool/pool.types'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { Card, Modal, ModalBody, ModalCloseButton, ModalContent, VStack } from '@chakra-ui/react'
// eslint-disable-next-line max-len
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/step-tracker.utils'
import { useClaiming } from '../../pool/actions/claim/useClaiming'
import { HumanTokenAmountWithAddress } from '../../tokens/token.types'
import { HumanAmount } from '@balancer/sdk'
import { Address } from 'viem'
import { TokenRowGroup } from '../../tokens/TokenRow/TokenRowGroup'
import { ActionModalFooter } from '@/lib/shared/components/modals/ActionModalFooter'
import { useRouter } from 'next/navigation'
import { TransactionModalHeader } from '@/lib/shared/components/modals/TransactionModalHeader'
import { SuccessOverlay } from '@/lib/shared/components/modals/SuccessOverlay'

type Props = {
  isOpen: boolean
  onClose(): void
  pools: PoolListItem[]
}

export function ClaimPortfolioModal({ isOpen, onClose, pools, ...rest }: Props) {
  const { poolRewardsMap } = usePortfolio()
  const { isDesktop, isMobile } = useBreakpoints()
  const router = useRouter()

  const balRewards: HumanTokenAmountWithAddress[] = pools
    .map(pool => poolRewardsMap?.[pool.id]?.balReward)
    .map(reward => ({
      humanAmount: (reward?.humanBalance || '0') as HumanAmount,
      tokenAddress: (reward?.tokenAddress || '') as Address,
    }))
    .filter(Boolean)

  const nonBalRewards: HumanTokenAmountWithAddress[] = pools
    .flatMap(pool => poolRewardsMap?.[pool.id]?.claimableRewards || [])
    .map(reward => ({
      humanAmount: (reward?.humanBalance || '0') as HumanAmount,
      tokenAddress: (reward?.tokenAddress || '') as Address,
    }))
    .filter(Boolean)

  const rewards = [...balRewards, ...nonBalRewards]

  const totalValueUsd = poolRewardsMap[pools[0].id]?.totalFiatClaimBalance?.toString() || '0'

  const { transactionSteps, claimTxHash } = useClaiming(pools)

  const chain = pools[0]?.chain

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered {...rest}>
      <SuccessOverlay startAnimation={!!claimTxHash} />

      <ModalContent {...getStylesForModalContentWithStepTracker(isDesktop)}>
        {isDesktop && <DesktopStepTracker transactionSteps={transactionSteps} chain={chain} />}

        <TransactionModalHeader label="Claim rewards" txHash={claimTxHash} chain={chain} />

        <ModalCloseButton />

        <ModalBody>
          <VStack spacing="sm">
            {isMobile && <MobileStepTracker transactionSteps={transactionSteps} chain={chain} />}
            <Card variant="modalSubSection">
              <TokenRowGroup
                amounts={rewards}
                chain={chain}
                label="You'll get"
                totalUSDValue={totalValueUsd}
              />
            </Card>
          </VStack>
        </ModalBody>

        <ActionModalFooter
          isSuccess={!!claimTxHash}
          currentStep={transactionSteps.currentStep}
          returnLabel="Return to portfolio"
          returnAction={() => router.push('/portfolio')}
        />
      </ModalContent>
    </Modal>
  )
}
