'use client'
import {
  PoolListProvider,
  usePoolListSeedCacheQuery,
} from '@/lib/modules/pool/PoolList/usePoolList'
import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { Box } from '@chakra-ui/react'
import { useUserData } from '@/lib/modules/user/useUserData'
import { useEffect } from 'react'

export const dynamic = 'force-dynamic'

export default function Home() {
  usePoolListSeedCacheQuery()
  const { balances } = useUserData()

  useEffect(() => {
    console.log('balances', balances)
  }, [balances])

  return (
    <PoolListProvider>
      <Box p="md">
        <PoolList />
      </Box>
    </PoolListProvider>
  )
}
