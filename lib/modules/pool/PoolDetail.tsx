'use client'
import { WriteExampleFive } from '@/lib/contracts/writeExampleFive'
import { usePool } from '@/lib/modules/pool/usePool'

export function PoolDetail() {
  const { pool } = usePool()
  return <WriteExampleFive></WriteExampleFive>
}
