'use client'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Card,
  Text,
} from '@chakra-ui/react'

import { ClaimTotal } from '@/lib/modules/portfolio/PortfolioClaim/ClaimTotal'
import { usePortfolio } from '@/lib/modules/portfolio/usePortfolio'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Hex } from 'viem'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { useClaimProtocolRewardsStepConfigs } from '../useClaimProtocolRewardsStepConfigs'
import { useIterateSteps } from '../../transactions/transaction-steps/useIterateSteps'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { DesktopStepTracker } from '../../transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { MobileStepTracker } from '../../transactions/transaction-steps/step-tracker/MobileStepTracker'

type Props = {
  isOpen: boolean
  onClose(): void
}

export default function ClaimProtocolRevenueModal({ isOpen, onClose }: Props) {
  const { protocolRewardsData, protocolRewardsBalance } = usePortfolio()
  const { toCurrency } = useCurrency()
  const { isDesktop, isMobile } = useBreakpoints()

  const { stepConfigs } = useClaimProtocolRewardsStepConfigs()
  const { currentStep, currentStepIndex, useOnStepCompleted } = useIterateSteps(stepConfigs)

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        {isDesktop && (
          <DesktopStepTracker
            currentStepIndex={currentStepIndex}
            stepConfigs={stepConfigs}
            chain={GqlChain.Mainnet}
          />
        )}
        <ModalHeader>Balancer protocol revenue</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="sm">
            <Card variant="modalSubSection">
              <VStack align="start" spacing="md">
                <Text color="grayText">You&apos;ll get</Text>
                {protocolRewardsData?.map((reward, idx) => (
                  <TokenRow
                    key={idx}
                    address={reward.tokenAddress as Hex}
                    value={reward.formattedBalance}
                    chain={GqlChain.Mainnet}
                  />
                ))}
              </VStack>
            </Card>
            <ClaimTotal total={toCurrency(protocolRewardsBalance)} />

            {isMobile && (
              <MobileStepTracker
                currentStepIndex={currentStepIndex}
                stepConfigs={stepConfigs}
                chain={GqlChain.Mainnet}
              />
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <VStack w="full">{currentStep.render(useOnStepCompleted)}</VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
