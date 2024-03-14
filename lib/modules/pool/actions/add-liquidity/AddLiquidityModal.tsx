/* eslint-disable max-len */
'use client'

import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { fNum } from '@/lib/shared/utils/numbers'
import { InfoOutlineIcon } from '@chakra-ui/icons'
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
import { formatUnits } from 'viem'
import { Address } from 'wagmi'
import { BPT_DECIMALS } from '../../pool.constants'
import { usePool } from '../../usePool'
import { HumanAmountIn } from '../liquidity-types'
import { useAddLiquidity } from './useAddLiquidity'
import { AddLiquidityTimeout } from './AddLiquidityTimeout'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { SignRelayerButton } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { useResponsive } from '@/lib/shared/hooks/useResponsive'
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/useStepTrackerProps'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
}

export function AddLiquidityModal({
  isOpen,
  onClose,
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const { isDesktop, isMobile } = useResponsive()
  const initialFocusRef = useRef(null)
  const {
    humanAmountsIn,
    totalUSDValue,
    simulationQuery,
    priceImpactQuery,
    tokens,
    stepConfigs,
    currentStep,
    currentStepIndex,
    useOnStepCompleted,
  } = useAddLiquidity()
  const { toCurrency } = useCurrency()
  const { pool, chainId } = usePool()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)
  const { slippage } = useUserSettings()

  const bptOut = simulationQuery?.data?.bptOut
  const bptOutLabel = bptOut ? formatUnits(bptOut.amount, BPT_DECIMALS) : '0'

  const priceImpact = priceImpactQuery?.data
  const priceImpactLabel = priceImpact !== undefined ? fNum('priceImpact', priceImpact) : '-'

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
          <Heading fontWeight="bold" size="h5">
            Add liquidity
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="md" align="start">
            {isMobile && (
              <Card variant="level3" p="md" shadow="sm" w="full">
                <MobileStepTracker currentStepIndex={currentStepIndex} stepConfigs={stepConfigs} />
              </Card>
            )}
            <Card variant="level3" p="md" shadow="sm" w="full">
              <VStack align="start" spacing="md">
                <HStack justify="space-between" w="full">
                  <Text color="grayText">{"You're adding"}</Text>
                  <NumberText fontSize="lg">
                    {toCurrency(totalUSDValue, { abbreviated: false })}
                  </NumberText>
                </HStack>
                {tokens.map(token => {
                  if (!token) return <div>Missing token</div>

                  const amountIn = humanAmountsIn.find(amountIn =>
                    isSameAddress(amountIn.tokenAddress, token?.address)
                  ) as HumanAmountIn

                  if (!amountIn) return <div key={token.address}>Missing amount in</div>

                  return (
                    <TokenRow
                      key={token.address}
                      value={amountIn.humanAmount}
                      address={amountIn.tokenAddress}
                      chain={pool.chain}
                      abbreviated={false}
                    />
                  )
                })}
              </VStack>
            </Card>

            <Card variant="level3" p="md" shadow="sm" w="full">
              <VStack align="start" spacing="md">
                <HStack justify="space-between" w="full">
                  <Text color="grayText">{"You'll get (if no slippage)"}</Text>
                </HStack>
                <TokenRow
                  value={bptOutLabel}
                  address={pool.address as Address}
                  chain={pool.chain}
                  abbreviated={false}
                  isBpt={true}
                  pool={pool}
                />
              </VStack>
            </Card>

            <Card variant="level2" p="md" shadow="sm" w="full">
              <VStack align="start" spacing="sm">
                <HStack justify="space-between" w="full">
                  <Text>Price impact</Text>
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
                <HStack justify="space-between" w="full">
                  <Text>Max. slippage</Text>
                  <HStack>
                    <NumberText color="grayText">{fNum('slippage', slippage)}</NumberText>
                    <Tooltip
                      label="Your maximum slippage setting. This can be changed in your
                      transaction settings (top right on previous input form)."
                      fontSize="sm"
                    >
                      <InfoOutlineIcon color="grayText" />
                    </Tooltip>
                  </HStack>
                </HStack>
                <AddLiquidityTimeout />
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
