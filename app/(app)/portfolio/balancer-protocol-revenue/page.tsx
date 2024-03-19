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
} from '@chakra-ui/react'

import { ClaimTotal } from '@/lib/modules/portfolio/PortfolioClaim/ClaimTotal'
import { ClaimAllVebalRewardsButton } from '@/lib/modules/portfolio/PortfolioClaim/ClaimButtons/ClaimAllVebalRewardsButton'
import { usePortfolio } from '@/lib/modules/portfolio/usePortfolio'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Hex } from 'viem'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { useRouter } from 'next/navigation'

export default function BalancerProtocolRevenue() {
  const { protocolRewardsData, protocolRewardsBalance } = usePortfolio()
  const { toCurrency } = useCurrency()

  const router = useRouter()

  function onClose() {
    router.push('/portfolio')
  }
  return (
    <Modal size="xl" isOpen={true} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontWeight="bold" size="h5">
            Balancer protocol revenue
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Card variant="level2" gap={4} p="md" shadow="xl" flex="1" width="100%" mb={4}>
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
        </ModalBody>
        <ModalFooter>
          <VStack w="full">
            <ClaimAllVebalRewardsButton />
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
