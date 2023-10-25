'use client'

import { noUserAddress } from '@/lib/contracts/wagmi-helpers'
import { Address, useQuery } from 'wagmi'
import { JoinPayload } from './JoinPayload'
import { getDefaultSdkTestUtils } from '@/test/integration/sdk-utils'
import { parseUnits } from 'viem'

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useJoinPoolConfig(joinPayload: JoinPayload, account?: Address) {
  const joinQuery = useQuery(
    [`useJoinPool:${account}:${joinPayload.queryKey}`],
    async () => {
      if (joinPayload.joinType === 'singleAsset') {
        // Temporary hack to simulate that account has wsETH balance
        const utils = await getDefaultSdkTestUtils(joinPayload.poolId, account)
        const wstETHAdress = '0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f'
        await utils.setupToken('100', wstETHAdress)
        joinPayload.setAmountIn('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '1')
      }
      return await joinPayload.buildSdkJoinTxConfig(account || noUserAddress)
    },
    {
      enabled: !!account,
    }
  )

  return {
    data: joinQuery.data,
    isLoading: joinQuery.isLoading,
    isError: joinQuery.isError,
    error: joinQuery.error,
  }
}
