'use client'
import { WriteExampleFive } from '@/lib/contracts/writeExampleFive'
import { usePool } from '@/lib/modules/pool/usePool'

export default function PoolPage() {
  const { pool } = usePool()
  return <WriteExampleFive></WriteExampleFive>
}
