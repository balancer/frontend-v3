import PoolListWrapper from '@/app/(app)/pools/_components/PoolListWrapper'

//import PoolListWrapper from '@/app/(app)/pools/_components/PoolListWrapper'

interface Props {
  searchParams: {
    first?: string
    skip?: string
    orderBy?: string
    orderDirection?: string
    poolTypes?: string
    networks?: string
    textSearch?: string
    userAddress?: string
  }
}

export default async function PoolList({ searchParams }: Props) {
  return <PoolListWrapper searchParams={searchParams} />
}
