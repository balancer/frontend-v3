'use client'

import { usePortfolio } from '@/lib/modules/portfolio/usePortfolio'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'

import { PoolListItem } from '@/lib/modules/pool/pool.types'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react'
import { ClaimTotal } from './ClaimTotal'
import { BalTokenReward } from './useBalRewards'
import { ClaimableReward } from './useClaimableBalances'
// eslint-disable-next-line max-len
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/step-tracker.utils'
import { useClaiming } from '../../pool/actions/claim/useClaiming'
import { isZero } from '@/lib/shared/utils/numbers'

type Props = {
  isOpen: boolean
  onClose(): void
  pools: PoolListItem[]
}

function RewardTokenRow({ reward }: { reward: ClaimableReward | BalTokenReward }) {
  if (isZero(reward.humanBalance)) return null
  return (
    <TokenRow address={reward.tokenAddress} value={reward.humanBalance} chain={reward.pool.chain} />
  )
}

export function ClaimPortfolioModal({ isOpen, onClose, pools, ...rest }: Props) {
  const { poolRewardsMap } = usePortfolio()
  const { toCurrency } = useCurrency()
  const { isDesktop, isMobile } = useBreakpoints()

  const title = pools.length > 1 ? `Review claim: ${pools[0].chain}` : `Review claim`
  const balRewards = pools.map(pool => poolRewardsMap?.[pool.id]?.balReward)

  const nonBalRewards = pools.flatMap(pool => poolRewardsMap?.[pool.id]?.claimableRewards || [])

  const { transactionSteps } = useClaiming(pools)

  const hasNoRewards = !nonBalRewards?.length && !balRewards.length
  const chain = pools[0]?.chain

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered {...rest}>
      <ModalOverlay />
      <ModalContent {...getStylesForModalContentWithStepTracker(isDesktop)}>
        {isDesktop && <DesktopStepTracker transactionSteps={transactionSteps} chain={chain} />}

        <ModalHeader>{title}</ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <VStack spacing="sm">
            <Card variant="modalSubSection">
              <VStack align="start" spacing="md">
                <Text color="grayText">You&apos;ll get</Text>
                {balRewards &&
                  balRewards.map(
                    reward =>
                      reward && (
                        <RewardTokenRow
                          key={`${reward?.tokenAddress}-${reward?.gaugeAddress}`}
                          reward={reward}
                        />
                      )
                  )}

                {nonBalRewards &&
                  nonBalRewards.map((reward, idx) => <RewardTokenRow key={idx} reward={reward} />)}
              </VStack>
            </Card>

            <ClaimTotal
              total={toCurrency(
                poolRewardsMap[pools[0].id]?.totalFiatClaimBalance?.toNumber() || 0
              )}
            />
            {isMobile && <MobileStepTracker transactionSteps={transactionSteps} chain={chain} />}
          </VStack>
        </ModalBody>

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
