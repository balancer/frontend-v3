import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { Card, CardBody, CardFooter, CardHeader, Center, Heading, Skeleton } from '@chakra-ui/react'
import { usePool } from '../../usePool'
import { Address } from 'viem'
import { UnstakeFlowButton } from './UnstakeFlowButton'

export function UnstakeForm() {
  const { pool, isLoading } = usePool()

  return (
    <Center h="full" w="full" maxW="lg" mx="auto">
      <Card variant="level3" shadow="xl" w="full" p="md">
        <CardHeader>
          <Heading fontWeight="bold" size="h5">
            Unstake
          </Heading>
        </CardHeader>
        <CardBody>
          <Card variant="level0" p="md" shadow="sm" w="full">
            <TokenRow
              address={pool.address as Address}
              value={pool.userBalance?.stakedBalance || '0'}
              usdValue={pool.userBalance?.stakedBalanceUsd.toString()}
              chain={pool.chain}
              pool={pool}
              isBpt
            />
          </Card>
        </CardBody>
        <CardFooter>
          <UnstakeFlowButton />
        </CardFooter>
      </Card>
    </Center>
  )
}
