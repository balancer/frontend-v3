'use client'
import { usePool } from '@/lib/modules/pool/usePool'

export function PoolDetail() {
  const { pool } = usePool()

  return (
    <>
      {pool.name}: {pool.id}
    </>
  )
}
