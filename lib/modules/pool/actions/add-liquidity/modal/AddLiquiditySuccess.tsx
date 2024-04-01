'use client'

import { TokenIcon } from '@/lib/modules/tokens/TokenIcon'
import { TransactionDetailsAccordion } from '@/lib/shared/components/accordion/TransactionDetailsAccordion'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import { isSameAddress } from '@balancer/sdk'
import Link from 'next/link'
import {
  Button,
  Card,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Check, ExternalLink } from 'react-feather'
import { Address, formatUnits } from 'viem'
import { BPT_DECIMALS } from '../../../pool.constants'
import { usePool } from '../../../usePool'
import { useAddLiquidity } from '../useAddLiquidity'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { usePathname } from 'next/navigation'
import { getBlockExplorerTxUrl, getBlockExplorerName } from '@/lib/shared/hooks/useBlockExplorer'

import { useCurrentFlowStep } from '@/lib/modules/transactions/transaction-steps/useCurrentFlowStep'

export function AddLiquiditySuccess() {
  const pathname = usePathname()
  const { humanAmountsIn, tokens, simulationQuery } = useAddLiquidity()
  const { pool, totalApr } = usePool()
  const { flowStep } = useCurrentFlowStep()

  const segments = pathname.split('/')
  const stakePath = segments.slice(0, segments.length - 1).join('/') + '/stake'
  const canStake = pool.staking

  const bptOut = simulationQuery?.data?.bptOut
  const bptOutLabel = bptOut ? formatUnits(bptOut.amount, BPT_DECIMALS) : '0'

  const tokensWithAmountIn = humanAmountsIn
    .filter(a => bn(a.humanAmount).gt(0))
    .map(amountIn => {
      const token = tokens.find(token =>
        isSameAddress(amountIn.tokenAddress, (token?.address as Address) ?? '-')
      )
      return {
        ...token,
        humanAmountIn: amountIn.humanAmount,
      }
    })

  const transactionHash = flowStep?.result.data?.transactionHash || ''

  return (
    <VStack spacing="sm" align="start">
      <Card variant="modalSubSection" border="1px" borderColor="font.highlight">
        <HStack justify="space-between" w="full">
          <HStack justify="flex-start">
            <CircularProgress
              value={100}
              trackColor="border.base"
              thickness="7"
              size="7"
              color="font.highlight"
            >
              <CircularProgressLabel fontSize="md" color="font.highlight" pl={1.5}>
                <Check size={15} strokeWidth={4} />
              </CircularProgressLabel>
            </CircularProgress>

            <Text color="font.highlight">Success</Text>
          </HStack>
          <Link target="_blank" href={getBlockExplorerTxUrl(transactionHash, pool.chain)}>
            <HStack color="grayText">
              <Text fontSize="sm" variant="secondary">
                View on {getBlockExplorerName(pool.chain)}
              </Text>
              <ExternalLink size={14} />
            </HStack>
          </Link>
          )
        </HStack>
      </Card>

      <HStack justify="space-between" alignItems="stretch" w="full">
        <Card variant="modalSubSection">
          <VStack alignContent="center" h="full">
            <Text color="grayText">You added</Text>
            <HStack>
              {tokensWithAmountIn.map(token => {
                return (
                  <TokenIcon
                    key={token.address}
                    chain={token.chain}
                    address={token.address}
                    size={30}
                    alt={token.symbol ?? 'unknown'}
                  />
                )
              })}
            </HStack>
            <VStack align="start" spacing="0">
              {tokensWithAmountIn.map((token, index) => (
                <Text key={token.symbol}>
                  {token.humanAmountIn} {token.symbol}{' '}
                  {index === tokensWithAmountIn.length - 1 ? '' : '+'}
                </Text>
              ))}
            </VStack>
          </VStack>
        </Card>

        <Card variant="modalSubSection">
          <VStack align="center">
            <Text color="grayText">You got</Text>
            <TokenIcon chain={pool.chain} address={pool.address} size={30} alt={pool.symbol} />
            <VStack spacing="0">
              <Text>{fNum('token', bptOutLabel)}</Text>
              <Text>{pool.symbol}</Text>
            </VStack>
          </VStack>
        </Card>
      </HStack>

      <TransactionDetailsAccordion />

      <Heading fontWeight="bold" size="h6">
        Staking options
      </Heading>
      <HStack w="full" justify="space-between">
        <Card variant="modalSubSection" position="relative">
          <VStack align="left" spacing="2">
            <Text color="grayText">Balancer</Text>
            <HStack>
              <Text fontWeight="bold" color="font.primary" fontSize="md">
                {fNum('apr', totalApr)}
                {/* SHOULD WE USE RANGE INSTEAD?? */}
                {/* {getAprLabel(pool.dynamicData.apr.apr)} */}
              </Text>
              <Icon as={StarsIcon} width="20px" height="20px" />
            </HStack>

            <Flex position="absolute" top={4} right={2}>
              <TokenIcon
                chain={GqlChain.Mainnet}
                // TODO: how do we handle this?
                address={'0xba100000625a3754423978a60c9317c58a424e3d'}
                size={27}
                alt="Bal"
              />
            </Flex>

            <Button
              as={Link}
              href={stakePath}
              w="full"
              size="lg"
              variant={canStake ? 'primary' : 'disabled'}
              isDisabled={!canStake}
              prefetch={true}
            >
              Stake
            </Button>
          </VStack>
        </Card>

        <Card variant="modalSubSection" position="relative">
          <VStack align="left" spacing="2">
            <Text color="grayText">Aura</Text>
            <HStack>
              <Text fontWeight="bold" color="font.primary" fontSize="md">
                16.00% TODO
              </Text>
              <Icon as={StarsIcon} width="20px" height="20px" />
            </HStack>

            <Flex position="absolute" top={3} right={2}>
              <TokenIcon
                chain={GqlChain.Mainnet}
                address={'0xc0c293ce456ff0ed870add98a0828dd4d2903dbf'}
                size={27}
                alt="Bal"
              />
            </Flex>

            <Button
              as={Link}
              target="_blank"
              href={'https://aura.finance/'}
              w="full"
              size="lg"
              variant={'secondary'}
            >
              Learn more
            </Button>
          </VStack>
        </Card>
      </HStack>
    </VStack>
  )
}
