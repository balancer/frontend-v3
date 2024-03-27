'use client'
import { useClaimStepConfigs } from '@/lib/modules/pool/actions/claim/useClaimStepConfigs'

import { usePortfolio } from '@/lib/modules/portfolio/usePortfolio'
import { useIterateSteps } from '@/lib/modules/transactions/transaction-steps/useIterateSteps'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'

import { PoolListItem } from '@/lib/modules/pool/pool.types'
import {
  Button,
  Card,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { BalTokenReward } from './useBalRewards'
import { ClaimableReward } from './useClaimableBalances'
import { ClaimTotal } from './ClaimTotal'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/useStepTrackerProps'
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'

type Props = {
  isOpen: boolean
  onClose(): void
  //   onOpen(): void
  pools: PoolListItem[]
}

function RewardTokenRow({ reward }: { reward: ClaimableReward | BalTokenReward }) {
  if (reward.formattedBalance === '0') return null
  return (
    <TokenRow
      address={reward.tokenAddress}
      value={reward.formattedBalance}
      chain={reward.pool.chain}
    />
  )
}

export function ClaimPortfolioModal({ isOpen, onClose, pools, ...rest }: Props) {
  const { poolRewardsMap } = usePortfolio()
  const { toCurrency } = useCurrency()
  const { isDesktop, isMobile } = useBreakpoints()

  const title = pools.length > 1 ? `Review claim: ${pools[0].chain}` : `Review claim`
  const stepConfigs = useClaimStepConfigs(pools)
  const balRewards = pools.map(pool => poolRewardsMap?.[pool.id]?.balReward)
  const nonBalRewards = pools.flatMap(pool => poolRewardsMap?.[pool.id]?.claimableRewards || [])

  const { currentStep, currentStepIndex, useOnStepCompleted } = useIterateSteps(stepConfigs)
  const hasNoRewards = !nonBalRewards?.length && !balRewards.length
  const chain = pools[0]?.chain
  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered {...rest}>
      <ModalOverlay />
      <ModalContent {...getStylesForModalContentWithStepTracker(isDesktop)}>
        {isDesktop && (
          <DesktopStepTracker
            currentStepIndex={currentStepIndex}
            stepConfigs={stepConfigs}
            chain={chain}
          />
        )}

        <ModalHeader>
          <Heading fontWeight="bold" size="h5">
            {title}
          </Heading>
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <Stack gap={4}>
            <Card variant="level2" gap={4} p="md" shadow="xl" flex="1" width="100%">
              <Text fontWeight="700">You`ll get</Text>
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
            </Card>

            <ClaimTotal
              total={toCurrency(
                poolRewardsMap[pools[0].id]?.totalFiatClaimBalance?.toNumber() || 0
              )}
            />
            {isMobile && (
              <MobileStepTracker
                currentStepIndex={currentStepIndex}
                stepConfigs={stepConfigs}
                chain={chain}
              />
            )}
          </Stack>
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
              currentStep.render(useOnStepCompleted)
            )}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
