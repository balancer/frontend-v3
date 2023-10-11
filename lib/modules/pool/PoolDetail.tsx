'use client'
import { usePool } from '@/lib/modules/pool/usePool'

export function PoolDetail() {
  const { pool, loading } = usePool()

  return <>{loading ? 'Loading...' : `${pool?.name}:${pool?.id}`}</>
}
