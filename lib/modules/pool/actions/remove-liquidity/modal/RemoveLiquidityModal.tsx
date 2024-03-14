'use client'

import {
  Card,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { RefObject, useRef } from 'react'
import { fNum } from '@/lib/shared/utils/numbers'
import { usePool } from '../../../usePool'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { Address } from 'viem'
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { RemoveLiquidityTimeout } from './RemoveLiquidityTimeout'
import { SignRelayerButton } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { useResponsive } from '@/lib/shared/hooks/useResponsive'
import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/useStepTrackerProps'
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
}

export function RemoveLiquidityModal({
  isOpen,
  onClose,
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const { isDesktop, isMobile } = useResponsive()
  const initialFocusRef = useRef(null)
  const {
    tokens,
    isProportional,
    isSingleToken,
    singleTokenOutAddress,
    priceImpactQuery,
    stepConfigs,
    currentStep,
    currentStepIndex,
    quoteBptIn,
    quotePriceImpact,
    amountOutForToken,
    useOnStepCompleted,
  } = useRemoveLiquidity()
  const { pool, chainId } = usePool()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)
  const { slippage } = useUserSettings()

  const priceImpactLabel =
    quotePriceImpact !== undefined ? fNum('priceImpact', quotePriceImpact) : '-'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isCentered
      {...rest}
    >
      <ModalOverlay />
      <ModalContent {...getStylesForModalContentWithStepTracker(isDesktop)}>
        {isDesktop && (
          <DesktopStepTracker currentStepIndex={currentStepIndex} stepConfigs={stepConfigs} />
        )}
        <ModalHeader>
          <HStack>
            <Heading fontWeight="bold" size="h5">
              Remove liquidity
            </Heading>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="md" align="start">
            {isMobile && (
              <Card variant="level4" p="md" shadow="sm" w="full">
                <MobileStepTracker currentStepIndex={currentStepIndex} stepConfigs={stepConfigs} />
              </Card>
            )}
            <Card variant="level4" shadow="sm" p="md" w="full">
              <VStack align="start" spacing="md">
                <Text fontWeight="bold" fontSize="sm">
                  You&apos;re removing
                </Text>
                <TokenRow
                  value={quoteBptIn}
                  address={pool.address as Address}
                  chain={pool.chain}
                  isBpt={true}
                  pool={pool}
                />
              </VStack>
            </Card>
            <Card variant="level4" shadow="sm" p="md" w="full">
              <VStack align="start" spacing="md">
                <HStack justify="space-between" w="full">
                  <Text fontWeight="bold" fontSize="sm">
                    You&apos;ll get at least
                  </Text>
                  <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
                    With max slippage: {fNum('slippage', slippage)}
                  </Text>
                </HStack>
                {isProportional &&
                  tokens.map(
                    token =>
                      token && (
                        <TokenRow
                          key={token.address}
                          address={token.address as Address}
                          chain={pool.chain}
                          value={amountOutForToken(token.address as Address)}
                        />
                      )
                  )}
                {isSingleToken && (
                  <TokenRow
                    address={singleTokenOutAddress as Address}
                    chain={pool.chain}
                    value={amountOutForToken(singleTokenOutAddress as Address)}
                  />
                )}
              </VStack>
            </Card>
            <Card variant="level4" shadow="sm" p="md" w="full">
              <VStack align="start" spacing="sm">
                <HStack justify="space-between" w="full">
                  <Text fontWeight="medium" variant="secondary">
                    Price impact
                  </Text>
                  <HStack>
                    {priceImpactQuery.isLoading ? (
                      <Skeleton w="12" h="full" />
                    ) : (
                      <NumberText color="grayText">{priceImpactLabel}</NumberText>
                    )}
                    <Tooltip label="Price impact" fontSize="sm">
                      <InfoOutlineIcon color="grayText" />
                    </Tooltip>
                  </HStack>
                </HStack>

                <RemoveLiquidityTimeout />
              </VStack>
            </Card>
          </VStack>
        </ModalBody>
        <ModalFooter>
          {shouldSignRelayerApproval ? (
            <SignRelayerButton />
          ) : (
            <VStack w="full">{currentStep.render(useOnStepCompleted)}</VStack>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
