'use client'

import { getNetworkConfig } from '@/lib/config/app.config'
import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { usePool } from '@/lib/modules/pool/usePool'
import { CloseIcon } from '@chakra-ui/icons'
import { Card, HStack, IconButton } from '@chakra-ui/react'
import Image from 'next/image'

export default function AddLiquidityPage() {
  const { pool } = usePool()
  const networkConfig = getNetworkConfig(pool.chain)

  return (
    <PoolActionsLayout pool={pool}>
      <HStack>
        <Card variant="level3" p="sm">
          <Image
            src={networkConfig.iconPath}
            width="30"
            height="30"
            alt={networkConfig.shortName}
          />
          <IconButton isRound={true} variant="solid" aria-label="Close" icon={<CloseIcon />} />
        </Card>
      </HStack>
    </PoolActionsLayout>
  )
}
