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
import { Address } from 'viem'
import { BalTokenReward } from '@/lib/modules/portfolio/PortfolioClaim/useBalRewards'
import { ClaimableReward } from '@/lib/modules/portfolio/PortfolioClaim/useClaimableBalances'
import { PoolListItem } from '../../pool.types'
import { isZero } from '@/lib/shared/utils/numbers'

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
  const { transactionSteps, nonBalRewards, balRewards, hasNoRewards } = useClaiming([pool])

  function RewardTokenRow({ reward }: { reward: ClaimableReward | BalTokenReward }) {
    if (isZero(reward.humanBalance)) return null
    return (
      <TokenRow
        address={reward.tokenAddress}
        value={reward.humanBalance}
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
              transactionSteps.currentStep?.renderAction()
            )}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
