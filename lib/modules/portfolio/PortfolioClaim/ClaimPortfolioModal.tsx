'use client'

import { usePortfolio } from '@/lib/modules/portfolio/usePortfolio'
import { PoolListItem } from '@/lib/modules/pool/pool.types'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  VStack,
} from '@chakra-ui/react'
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
import { FireworksOverlay } from '@/lib/shared/components/modals/FireworksOverlay'
import { TransactionModalHeader } from '../../pool/actions/PoolActionModalHeader'

type Props = {
  isOpen: boolean
  onClose(): void
  pools: PoolListItem[]
}

export function ClaimPortfolioModal({ isOpen, onClose, pools, ...rest }: Props) {
  const { poolRewardsMap } = usePortfolio()
  const { isDesktop, isMobile } = useBreakpoints()

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

  const hasNoRewards = !nonBalRewards?.length && !balRewards.length
  const chain = pools[0]?.chain

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered {...rest}>
      <FireworksOverlay startFireworks={!!claimTxHash} />

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

        {/* TODO replace with <ActionModalFooter /> when merged */}
        <ModalFooter>
          <VStack w="full">
            {hasNoRewards ? (
              <Button
                w="full"
                size="lg"
                onClick={() => {
                  onClose()
                }}
              >
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
