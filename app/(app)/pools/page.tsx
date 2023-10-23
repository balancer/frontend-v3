import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { NextSearchParams } from '@/lib/global/global.types'

export default function Pools({ searchParams }: { searchParams: NextSearchParams }) {
  console.log('search params', searchParams)

  return <PoolList searchParams={searchParams} />
}
