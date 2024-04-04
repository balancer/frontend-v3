'use client'

import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { isSameAddress } from '@balancer/sdk'
import { Button, Card, Flex, Heading, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import { Address, formatUnits } from 'viem'
import { BPT_DECIMALS } from '../../../pool.constants'
import { usePool } from '../../../usePool'
import { HumanAmountIn } from '../../liquidity-types'
import { useAddLiquidity } from '../useAddLiquidity'
import { PoolActionsPriceImpactDetails } from '../../PoolActionsPriceImpactDetails'
import { ArrowUpRight, Check } from 'react-feather'
import { getBlockExplorerName, getBlockExplorerTxUrl } from '@/lib/shared/hooks/useBlockExplorer'
import { useCurrentFlowStep } from '@/lib/modules/transactions/transaction-steps/useCurrentFlowStep'
import { getAprLabel } from '../../../pool.utils'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

function StakingOptions() {
  const { pool } = usePool()
  const pathname = usePathname()

  const stakePath = pathname.replace('/add-liquidity', '/stake')
  const canStake = !!pool.staking

  return (
    <>
      <Heading fontWeight="bold" size="h6" mt="4">
        Staking options
      </Heading>
      <HStack w="full" justify="space-between" alignItems="stretch">
        <Card variant="modalSubSection" position="relative">
          <VStack align="left" spacing="md">
            <Text color="grayText">Balancer</Text>
            <HStack>
              <Text fontWeight="bold" color="font.primary" fontSize="md">
                {/* SHOULD WE USE MAX APR instead of the range?? */}
                {/* {fNum('apr', totalApr)} */}
                {getAprLabel(pool.dynamicData.apr.apr)}
              </Text>
              <Icon as={StarsIcon} width="20px" height="20px" />
            </HStack>

            <Flex position="absolute" top={3} right={2}>
              <Image src="/images/protocols/balancer.svg" width={30} height={30} alt="balancer" />
            </Flex>

            <Button
              as={Link}
              href={stakePath}
              w="full"
              variant={canStake ? 'primary' : 'disabled'}
              isDisabled={!canStake}
              prefetch={true}
            >
              Stake
            </Button>
          </VStack>
        </Card>

        <Card variant="modalSubSection" position="relative">
          <VStack align="left" spacing="md">
            <Text color="grayText">Aura</Text>
            <HStack>
              <Text fontWeight="bold" color="font.primary" fontSize="md" opacity={0.2}>
                Support coming soon
              </Text>
            </HStack>

            <Flex position="absolute" top={3} right={2}>
              <Image src="/images/protocols/aura.svg" width={30} height={30} alt="balancer" />
            </Flex>

            <Button
              as={Link}
              target="_blank"
              href={'https://aura.finance/'}
              w="full"
              variant={'secondary'}
              isDisabled
            >
              Learn more
            </Button>
          </VStack>
        </Card>
      </HStack>
    </>
  )
}

function ExplorerLink() {
  const { flowStep } = useCurrentFlowStep()
  const { pool } = usePool()

  const transactionHash = flowStep?.result.data?.transactionHash || ''

  return (
    <Card variant="modalSubSection" border="1px" borderColor="font.highlight">
      <HStack justify="space-between" w="full">
        <HStack justify="flex-start" color="font.highlight">
          <Check size={20} />
          <Text color="font.highlight">Success</Text>
        </HStack>
        <Link target="_blank" href={getBlockExplorerTxUrl(transactionHash, pool.chain)}>
          <HStack color="grayText">
            <Text fontSize="sm" variant="secondary">
              View on {getBlockExplorerName(pool.chain)}
            </Text>
            <ArrowUpRight size={14} />
          </HStack>
        </Link>
        )
      </HStack>
    </Card>
  )
}

export function AddLiquidityPreview({ success = false }: { success?: boolean }) {
  const { humanAmountsIn, totalUSDValue, tokens, simulationQuery } = useAddLiquidity()
  const { pool } = usePool()
  const { toCurrency } = useCurrency()

  const bptOut = simulationQuery?.data?.bptOut
  const bptOutLabel = bptOut ? formatUnits(bptOut.amount, BPT_DECIMALS) : '0'

  return (
    <VStack spacing="sm" align="start">
      {success && <ExplorerLink />}

      <Card variant="modalSubSection">
        <VStack align="start" spacing="md">
          <HStack justify="space-between" w="full">
            <Text color="grayText">{"You're adding"}</Text>
            <Text>{toCurrency(totalUSDValue, { abbreviated: false })}</Text>
          </HStack>
          {tokens.map(token => {
            if (!token) return <div>Missing token</div>

            const amountIn = humanAmountsIn.find(amountIn =>
              isSameAddress(amountIn.tokenAddress, token?.address as Address)
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

      {!success && (
        <Card variant="modalSubSection">
          <VStack align="start" spacing="sm">
            <PoolActionsPriceImpactDetails
              totalUSDValue={totalUSDValue}
              bptAmount={simulationQuery.data?.bptOut.amount}
              isAddLiquidity
            />
          </VStack>
        </Card>
      )}

      {success && <StakingOptions />}
    </VStack>
  )
}
