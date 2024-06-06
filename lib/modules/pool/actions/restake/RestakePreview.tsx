import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { Card, VStack } from '@chakra-ui/react'
import { Address } from 'viem'
import { usePool } from '../../PoolProvider'
import { useRestake } from './RestakeProvider'

export function RestakePreview() {
  const { pool } = usePool()
  const { restakeTxHash, restakeAmount } = useRestake()

  return (
    <VStack spacing="sm" w="full">
      <Card variant="subSection">
        <TokenRow
          label={restakeTxHash ? 'Staked LP tokens migrated' : 'Staked LP tokens to migrate'}
          address={pool.address as Address}
          value={restakeAmount}
          chain={pool.chain}
          pool={pool}
          isBpt
        />
      </Card>
    </VStack>
  )
}
