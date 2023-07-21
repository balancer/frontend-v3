import { FragmentType, useFragment } from '@/lib/services/api/generated'
import { GqlPoolMinimalFragmentDoc } from '@/lib/services/api/generated/graphql'
import Link from 'next/link'

interface Props {
  item: FragmentType<typeof GqlPoolMinimalFragmentDoc>
}
export function PoolListItem({ item }: Props) {
  const pool = useFragment(GqlPoolMinimalFragmentDoc, item)

  return (
    <li>
      <Link href={`/pools/${pool.id}`}>{pool.name}</Link>
    </li>
  )
}
