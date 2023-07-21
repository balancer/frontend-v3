'use client'

import { motion } from 'framer-motion'
import { GqlPoolMinimalFragmentDoc } from '@/lib/services/api/generated/graphql'
import { FragmentType } from '@/lib/services/api/generated'
import { PoolListItem } from '@/lib/modules/pools/PoolListItem'

interface Props {
  pools: FragmentType<typeof GqlPoolMinimalFragmentDoc>[]
  page: number
  perPage: number
}

export function PoolsList({ pools, perPage, page }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 1 }}
      layout
      layoutId={`pools-table-${perPage}-${page}`}
    >
      <ul>
        {pools.map((pool, index) => (
          <PoolListItem item={pool} key={index} />
        ))}
      </ul>
    </motion.div>
  )
}
