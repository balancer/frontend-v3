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
  Stack,
  VStack,
} from '@chakra-ui/react'
import { BalTokenReward } from '@/lib/modules/portfolio/useBalRewards'
import { ClaimableReward } from '@/lib/modules/portfolio/claim/useClaimableBalances'
import { useClaimStepConfigs } from './useClaimStepConfigs'
import { PoolListItem } from '../../pool.types'
import { useIterateSteps } from '../../../transactions/transaction-steps/useIterateSteps'

type Props = {
  isOpen: boolean
  onClose?(): void
  onOpen?(): void
  pools: PoolListItem[]
  balRewards?: BalTokenReward
  nonBalRewards?: ClaimableReward[]
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

export function ClaimRewardsModal({
  isOpen,
  onClose,
  balRewards,
  nonBalRewards,
  pools,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const stepConfigs = useClaimStepConfigs(pools)

  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)
  const hasNoRewards = !nonBalRewards?.length && !balRewards

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered {...rest}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontWeight="bold" size="h5">
            [{pools[0].chain}] Claim rewards
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            {balRewards && <RewardTokenRow reward={balRewards} />}

            {nonBalRewards &&
              nonBalRewards.map((reward, idx) => <RewardTokenRow key={idx} reward={reward} />)}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <VStack w="full">
            {hasNoRewards ? (
              <Button w="full" size="lg" onClick={onClose}>
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
