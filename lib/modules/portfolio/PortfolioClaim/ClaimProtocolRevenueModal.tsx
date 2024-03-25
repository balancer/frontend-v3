'use client'
import {
  Heading,
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
  Stack,
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
        <ModalHeader>
          <Heading fontWeight="bold" size="h5">
            Balancer protocol revenue
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack gap={4}>
            <Card variant="level2" gap={4} p="md" shadow="xl" flex="1" width="100%">
              <Text fontWeight="700">You`ll get</Text>
              {protocolRewardsData?.map((reward, idx) => (
                <TokenRow
                  key={idx}
                  address={reward.tokenAddress as Hex}
                  value={reward.formattedBalance}
                  chain={GqlChain.Mainnet}
                />
              ))}
            </Card>
            <ClaimTotal total={toCurrency(protocolRewardsBalance)} />

            {isMobile && (
              <MobileStepTracker
                currentStepIndex={currentStepIndex}
                stepConfigs={stepConfigs}
                chain={GqlChain.Mainnet}
              />
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <VStack w="full">{currentStep.render(useOnStepCompleted)}</VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
