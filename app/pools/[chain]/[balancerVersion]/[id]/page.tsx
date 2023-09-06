'use client'
import { usePool } from '@/lib/modules/pool/usePool'

export default function PoolPage() {
  const { pool } = usePool()

  return (
    <>
      {pool.name}: {pool.id}
    </>
  )
}
