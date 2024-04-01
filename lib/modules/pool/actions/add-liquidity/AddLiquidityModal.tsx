/* eslint-disable max-len */
'use client'

import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import {
  Card,
  HStack,
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
import { RefObject, useRef } from 'react'
import { formatUnits } from 'viem'
import { Address } from 'wagmi'
import { BPT_DECIMALS } from '../../pool.constants'
import { usePool } from '../../usePool'
import { HumanAmountIn } from '../liquidity-types'
import { useAddLiquidity } from './useAddLiquidity'
import { AddLiquidityTimeout } from './AddLiquidityTimeout'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { SignRelayerButton } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
import { DesktopStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/DesktopStepTracker'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/useStepTrackerProps'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { PoolActionsPriceImpactDetails } from '../PoolActionsPriceImpactDetails'

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
  const { isDesktop, isMobile } = useBreakpoints()
  const initialFocusRef = useRef(null)
  const {
    humanAmountsIn,
    totalUSDValue,
    simulationQuery,
    tokens,
    stepConfigs,
    currentStep,
    currentStepIndex,
    useOnStepCompleted,
  } = useAddLiquidity()
  const { toCurrency } = useCurrency()
  const { pool, chainId } = usePool()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)

  const bptOut = simulationQuery?.data?.bptOut
  const bptOutLabel = bptOut ? formatUnits(bptOut.amount, BPT_DECIMALS) : '0'

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
          <DesktopStepTracker
            currentStepIndex={currentStepIndex}
            stepConfigs={stepConfigs}
            chain={pool.chain}
          />
        )}
        <ModalHeader>
          <HStack justify="space-between" w="full" pr="lg">
            <span>Add liquidity</span>
            <AddLiquidityTimeout />
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="sm" align="start">
            {isMobile && (
              <MobileStepTracker
                currentStepIndex={currentStepIndex}
                stepConfigs={stepConfigs}
                chain={pool.chain}
              />
            )}
            <Card variant="modalSubSection">
              <VStack align="start" spacing="md">
                <HStack justify="space-between" w="full">
                  <Text color="grayText">{"You're adding"}</Text>
                  <Text>{toCurrency(totalUSDValue, { abbreviated: false })}</Text>
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

            <Card variant="modalSubSection">
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

            <Card variant="modalSubSection">
              <VStack align="start" spacing="sm">
                <PoolActionsPriceImpactDetails
                  totalUSDValue={totalUSDValue}
                  bptAmount={simulationQuery.data?.bptOut.amount}
                  isAddLiquidity
                />
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
