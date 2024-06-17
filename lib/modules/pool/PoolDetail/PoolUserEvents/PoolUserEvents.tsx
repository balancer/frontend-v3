import {
  Card,
  VStack,
  Heading,
  Divider,
  Grid,
  GridItem,
  Text,
  Box,
  HStack,
  Link,
} from '@chakra-ui/react'
import { usePool } from '../../PoolProvider'
import { useLayoutEffect, useState } from 'react'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { TokenIcon } from '@/lib/modules/tokens/TokenIcon'
import { formatDistanceToNow, secondsToMilliseconds } from 'date-fns'
import { useBlockExplorer } from '@/lib/shared/hooks/useBlockExplorer'
import { ArrowUpRight } from 'react-feather'
import { PoolEventItem } from '../../usePoolEvents'
import { calcTotalStakedBalance, getUserTotalBalance } from '../../user-balance.helpers'
import { fNum, bn } from '@/lib/shared/utils/numbers'


type PoolEventRowProps = {
  poolEvent: PoolEventItem
  usdValue: string
  chain: GqlChain
  txUrl: string
}

const GRID_COLUMNS = '100px 150px 100px 1fr'

function PoolEventRow({ poolEvent, usdValue, chain, txUrl }: PoolEventRowProps) {
  if (poolEvent.__typename !== 'GqlPoolAddRemoveEventV3') {
    return null
  }

  const isTypeAdd = poolEvent.type === 'ADD'

  const Action = () => (
    <HStack>
      <Box
        as="span"
        h="8px"
        w="8px"
        borderRadius="50%"
        display="inline-block"
        backgroundColor={isTypeAdd ? 'green.500' : 'red.500'}
      ></Box>
      <Text>{isTypeAdd ? 'Add' : 'Remove'}</Text>
    </HStack>
  )

  const Tokens = () =>
    poolEvent.tokens.map(token => (
      <HStack gap={['xs', 'sm']} key={token.address} mb="sm">
        <TokenIcon chain={chain} address={token.address} size={24} alt={token.address} />
        <Text textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
          {token.amount}
        </Text>
      </HStack>
    ))

  return (
    <Grid
      w="full"
      templateColumns={{ base: 'fit-content(150px) 50px 1fr', md: GRID_COLUMNS }}
      templateAreas={{
        base: `"action value time"
               "tokens tokens tokens"`,
        md: `"action tokens value time"`,
      }}
      gap={{ base: '2', md: '4' }}
      mb="4"
    >
      <GridItem area="action">
        <Action />
      </GridItem>
      <GridItem area="tokens">
        <Tokens />
      </GridItem>
      <GridItem area="value" textAlign={{ base: 'left', md: 'right' }}>
        <Text>{usdValue}</Text>
      </GridItem>
      <GridItem area="time" mr="sm">
        <HStack justifyContent="flex-end" gap="1">
          <Text color="grayText">
            {formatDistanceToNow(new Date(secondsToMilliseconds(poolEvent.timestamp)), {
              addSuffix: true,
            })}
          </Text>
          <Link href={txUrl} target="_blank" color="grayText">
            <ArrowUpRight size={16} />
          </Link>
        </HStack>
      </GridItem>
    </Grid>
  )
}

export default function PoolUserEvents({ poolEvents }: { poolEvents: PoolEventItem[] }) {
  const { myLiquiditySectionRef, chain, pool } = usePool()
  const [height, setHeight] = useState(0)
  const { toCurrency } = useCurrency()
  const { getBlockExplorerTxUrl } = useBlockExplorer(chain)

  // keep this card the same height as the 'My liquidity' section
  useLayoutEffect(() => {
    if (myLiquiditySectionRef && myLiquiditySectionRef.current) {
      setHeight(myLiquiditySectionRef.current.offsetHeight)
    }
  }, [])

  function getStakedPercentage() {
    const totalBalance = getUserTotalBalance(pool)
    const stakedBalance = calcTotalStakedBalance(pool)

    // TODO: api returns double zero, will be fixed
    if (totalBalance === '00') {
      return fNum('percentage', 0)
    } else if (totalBalance === stakedBalance) {
      return fNum('percentage', 100)
    } else {
      return fNum('stakedPercentage', bn(stakedBalance).div(totalBalance).times(100))
    }
  }

  return (
    <Card h={height}>
      <VStack spacing="md" w="full" h="full" alignItems="flex-start">
        <Heading
          bg="font.special"
          backgroundClip="text"
          fontWeight="bold"
          size="h5"
          lineHeight="34px" // to align with 'My liquidity'
        >
          My transactions
        </Heading>
        <Divider />
        <Box display={{ base: 'none', md: 'block' }} w="full">
          <Grid w="full" templateColumns={{ base: '1fr', md: GRID_COLUMNS }} gap="4">
            {['Action', 'Tokens', 'Value', 'Time'].map((label, index) => (
              <GridItem
                key={index}
                textAlign={index > 1 ? 'right' : 'left'}
                mr={index === 3 ? 'md' : 0}
              >
                <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
                  {label}
                </Text>
              </GridItem>
            ))}
          </Grid>
          <Divider mt="md" />
        </Box>
        <Box w="full" overflowY="auto">
          {poolEvents.map(poolEvent => (
            <PoolEventRow
              poolEvent={poolEvent}
              key={poolEvent.id}
              usdValue={toCurrency(poolEvent.valueUSD)}
              chain={chain}
              txUrl={getBlockExplorerTxUrl(poolEvent.tx)}
            />
          ))}
        </Box>
        <Divider />
        <HStack spacing="4">
          <Text variant="secondary" fontSize="0.85rem">
            {`${getStakedPercentage()} staked`}
          </Text>
          <Text variant="secondary" fontSize="0.85rem">
            &middot;
          </Text>
          <Text variant="secondary" fontSize="0.85rem">
            boost
          </Text>
        </HStack>
      </VStack>
    </Card>
  )
}