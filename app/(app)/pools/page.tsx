import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { PoolSearchParams } from '@/lib/modules/pool/pool.types'
import { FeaturedPools } from '@/lib/modules/featuredPools/FeaturedPools'

export const revalidate = 30

interface Props {
  searchParams: PoolSearchParams
}

export default async function Pools({ searchParams }: Props) {
  return (
    <>
      <FeaturedPools mb="xl" />
      <PoolList searchParams={searchParams} />
    </>
  )
}
