import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { PoolSearchParams } from '@/lib/modules/pool/pool.types'
import { Suspense } from 'react'

export const revalidate = 30

interface Props {
  searchParams: PoolSearchParams
}

export default async function Pools({ searchParams }: Props) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <PoolList searchParams={searchParams} />
      </Suspense>
    </>
  )
}
