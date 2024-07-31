'use client'

import { MobileStepTracker } from '@/lib/modules/transactions/transaction-steps/step-tracker/MobileStepTracker'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { Card, VStack, Button, Text, useDisclosure } from '@chakra-ui/react'
import { usePool } from '../../../PoolProvider'
import { PoolActionsPriceImpactDetails } from '../../PoolActionsPriceImpactDetails'
import { useAddLiquidity } from '../AddLiquidityProvider'
import { QuoteBptOut, ReceiptBptOut } from './BptOut'
import { TokenRowGroup } from '@/lib/modules/tokens/TokenRow/TokenRowGroup'
import { HumanTokenAmountWithAddress } from '@/lib/modules/tokens/token.types'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { useAddLiquidityReceipt } from '@/lib/modules/transactions/transaction-steps/useTransactionLogsQuery'
import { BalAlert } from '@/lib/shared/components/alerts/BalAlert'
import { StakingOptions } from './StakingOptions'
import { isVebalPool } from '../../../pool.helpers'
import { VebalRedirectModal } from '@/lib/modules/vebal/VebalRedirectModal'
import { AnimateHeightChange } from '@/lib/shared/components/modals/AnimatedModalBody'
import { CardPopAnim } from '@/lib/shared/components/animations/CardPopAnim'

export function AddLiquiditySummary() {
  const {
    totalUSDValue,
    simulationQuery,
    transactionSteps,
    humanAmountsIn,
    hasQuoteContext,
    tokens,
    addLiquidityTxHash,
    addLiquidityTxSuccess,
  } = useAddLiquidity()
  const { pool } = usePool()
  const { isMobile } = useBreakpoints()
  const { userAddress, isLoading: isUserAddressLoading } = useUserAccount()
  const vebalRedirectModal = useDisclosure()
  const {
    isLoading: isLoadingReceipt,
    error,
    sentTokens,
    receivedBptUnits,
  } = useAddLiquidityReceipt({
    txHash: addLiquidityTxHash,
    userAddress,
  })

  // Order amountsIn like the form inputs which uses the tokens array.
  const amountsIn = tokens
    .map(token => humanAmountsIn.find(amount => amount.tokenAddress === token?.address))
    .filter(Boolean) as HumanTokenAmountWithAddress[]

  if (!isUserAddressLoading && !userAddress) {
    return <BalAlert status="warning" content="User is not connected" />
  }
  if (addLiquidityTxSuccess && error) {
    return <BalAlert status="warning" content="We were unable to find this transaction hash" />
  }
  if (addLiquidityTxSuccess && !isLoadingReceipt && !sentTokens.length) {
    return (
      <BalAlert
        status="warning"
        content="We were unable to find logs for this transaction hash and the connected account"
      />
    )
  }

  const shouldShowReceipt = addLiquidityTxHash && !isLoadingReceipt && sentTokens.length > 0

  return (
    <AnimateHeightChange spacing="sm">
      {isMobile && hasQuoteContext && (
        <MobileStepTracker chain={pool.chain} transactionSteps={transactionSteps} />
      )}

      <Card variant="modalSubSection">
        <TokenRowGroup
          label={shouldShowReceipt ? 'You added' : "You're adding"}
          amounts={shouldShowReceipt ? sentTokens : amountsIn}
          totalUSDValue={shouldShowReceipt ? undefined : totalUSDValue}
          chain={pool.chain}
          isLoading={shouldShowReceipt ? isLoadingReceipt : false}
        />
      </Card>

      <Card variant="modalSubSection">
        {shouldShowReceipt ? (
          <ReceiptBptOut actualBptOut={receivedBptUnits} isLoading={isLoadingReceipt} />
        ) : (
          <QuoteBptOut />
        )}
      </Card>

      {shouldShowReceipt ? (
        <CardPopAnim key="staking-options">
          {pool.staking && (
            <Card variant="modalSubSection" w="full">
              <StakingOptions />
            </Card>
          )}
          {isVebalPool(pool.id) && (
            <Card variant="modalSubSection">
              <VStack align="start" w="full" spacing="md">
                <Text>Get extra incentives with veBAL</Text>
                <Button variant="primary" size="lg" onClick={vebalRedirectModal.onOpen} w="full">
                  Lock to get veBAL
                </Button>
              </VStack>

              <VebalRedirectModal
                isOpen={vebalRedirectModal.isOpen}
                onClose={vebalRedirectModal.onClose}
              />
            </Card>
          )}
        </CardPopAnim>
      ) : (
        <CardPopAnim key="price-impact-details">
          <Card variant="modalSubSection">
            <VStack align="start" spacing="sm">
              <PoolActionsPriceImpactDetails
                totalUSDValue={totalUSDValue}
                bptAmount={simulationQuery.data?.bptOut.amount}
                isAddLiquidity
              />
            </VStack>
          </Card>
        </CardPopAnim>
      )}
    </AnimateHeightChange>
  )
}
