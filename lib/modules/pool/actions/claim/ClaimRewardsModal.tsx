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
import { Pool } from '../../usePool'
import { useClaiming } from './useClaiming'
import { Address } from 'wagmi'
import { BalTokenReward } from '@/lib/modules/portfolio/useBalRewards'
import { ClaimableReward } from '@/lib/modules/portfolio/useClaimableBalances'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  balRewards?: BalTokenReward
  nonBalRewards: ClaimableReward[]
}

export function ClaimRewardsModal({
  isOpen,
  onClose,
  balRewards,
  nonBalRewards,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
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
          {balRewards && <RewardTokenRow reward={balRewards} />}

          {nonBalRewards.map((reward, idx) => (
            <RewardTokenRow key={idx} reward={reward} />
          ))}
        </ModalBody>
        <ModalFooter>
          <VStack w="full">
            {/* {hasNoRewards ? (
              <Button w="full" size="lg" onClick={onClose}>
                Close
              </Button>
            ) : (
              currentStep.render(useOnStepCompleted)
            )} */}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
