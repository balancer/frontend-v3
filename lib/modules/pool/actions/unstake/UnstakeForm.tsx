import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { Card, CardBody, CardFooter, CardHeader, Center, Heading } from '@chakra-ui/react'
import { usePool } from '../../usePool'
import { Address } from 'viem'
import { useUnstaking } from './useUnstaking'

export function UnstakeForm() {
  const { pool } = usePool()
  const { transactionSteps } = useUnstaking(pool)

  return (
    <Center h="full" w="full" maxW="lg" mx="auto">
      <Card>
        <CardHeader>
          <Heading fontWeight="bold" size="h5">
            Unstake
          </Heading>
        </CardHeader>
        <CardBody>
          <Card variant="subSection">
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
        <CardFooter>{transactionSteps?.currentStep?.renderAction()}</CardFooter>
      </Card>
    </Center>
  )
}
