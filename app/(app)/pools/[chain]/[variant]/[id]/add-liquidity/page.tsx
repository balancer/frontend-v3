'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { usePool } from '@/lib/modules/pool/usePool'

export default function AddLiquidityPage() {
  const { pool } = usePool()

  return <PoolActionsLayout pool={pool}>Content</PoolActionsLayout>
}
