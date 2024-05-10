'use client'

import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { Card, CardBody, CardFooter, CardHeader, Center, Heading, VStack } from '@chakra-ui/react'
import { usePool } from '../../usePool'
import { Address } from 'viem'
import { useStaking } from './useStaking'

export function StakeForm() {
  const { pool } = usePool()
  const { transactionSteps } = useStaking()

  return (
    <Center h="full" w="full" maxW="lg" mx="auto">
      <Card>
        <CardHeader>
          <Heading fontWeight="bold" size="h5">
            Stake
          </Heading>
        </CardHeader>
        <CardBody>
          <Card variant="subSection">
            <TokenRow
              address={pool.address as Address}
              value={pool.userBalance?.walletBalance || '0'}
              usdValue={pool.userBalance?.walletBalanceUsd.toString()}
              chain={pool.chain}
              pool={pool}
              isBpt
            />
          </Card>
        </CardBody>
        <CardFooter>
          <VStack w="full">{transactionSteps.currentStep?.renderAction()}</VStack>
        </CardFooter>
      </Card>
    </Center>
  )
}
