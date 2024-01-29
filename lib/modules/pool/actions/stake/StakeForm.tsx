import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { Card, CardBody, CardFooter, CardHeader, Center, Heading, Skeleton } from '@chakra-ui/react'
import { usePool } from '../../usePool'
import { Address } from 'viem'
import { StakeFlowButton } from './StakeFlowButton'

export function StakeForm() {
  const { pool, isLoading } = usePool()

  return (
    <Center h="full" w="full" maxW="lg" mx="auto">
      <Card variant="level3" shadow="xl" w="full" p="md">
        <CardHeader>
          <Heading fontWeight="bold" size="h5">
            Stake
          </Heading>
        </CardHeader>
        <CardBody>
          <Card variant="level0" p="md" shadow="sm" w="full">
            {isLoading ? (
              <Skeleton />
            ) : (
              <TokenRow
                address={pool.address as Address}
                value={pool.userBalance?.walletBalance || '0'}
                usdValue={pool.userBalance?.walletBalanceUsd.toString()}
                chain={pool.chain}
              />
            )}
          </Card>
        </CardBody>
        <CardFooter>
          <StakeFlowButton />
        </CardFooter>
      </Card>
    </Center>
  )
}
