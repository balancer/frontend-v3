import { useVebalBoost } from '@/lib/modules/vebal/useVebalBoost'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import { useMemo } from 'react'
import { Pool } from '../../PoolProvider'
import { Text } from '@chakra-ui/react'

export interface BoostTextProps {
  pool: Pool
}

export function BoostText({ pool }: BoostTextProps) {
  const { veBalBoostMap } = useVebalBoost([pool])

  const boost = useMemo(() => {
    const boost = veBalBoostMap[pool.id]

    if (!boost || boost === '1') {
      return '1.00'
    }

    return fNum('boost', bn(boost))
  }, [veBalBoostMap, pool])

  return (
    <>
      <Text variant="secondary" fontSize="0.85rem">
        &middot;
      </Text>
      <Text variant="secondary" fontSize="0.85rem">
        {`${boost}x boost`}
      </Text>
    </>
  )
}
