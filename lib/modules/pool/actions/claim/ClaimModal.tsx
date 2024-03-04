import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useClaiming } from './useClaiming'
import { Address } from 'wagmi'
import { BalTokenReward } from '@/lib/modules/portfolio/useBalRewards'
import { ClaimableReward } from '@/lib/modules/portfolio/claim/useClaimableBalances'
import { PoolListItem } from '../../pool.types'

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
  const { currentStep, useOnStepCompleted, nonBalRewards, balRewards, hasNoRewards } =
    useClaiming(pool)

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered {...rest}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontWeight="bold" size="h5">
            Claim rewards
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {hasNoRewards && <Text>Nothing to claim</Text>}
          {balRewards.map((reward, idx) => (
            <RewardTokenRow key={idx} reward={reward} />
          ))}
          {nonBalRewards.map((reward, idx) => (
            <RewardTokenRow key={idx} reward={reward} />
          ))}
        </ModalBody>
        <ModalFooter>
          <VStack w="full">
            {hasNoRewards ? (
              <Button size="lg" onClick={onClose}>
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
