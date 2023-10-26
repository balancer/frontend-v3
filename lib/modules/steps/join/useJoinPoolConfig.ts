'use client'

import { noUserAddress } from '@/lib/contracts/wagmi-helpers'
import { Address, useQuery } from 'wagmi'
import { JoinPayload } from './JoinPayload'
import { getSdkTestUtils } from '@/test/integration/sdk-utils'

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useJoinPoolConfig(joinPayload: JoinPayload, account?: Address) {
  const joinQuery = useQuery(
    [`useJoinPool:${account}:${joinPayload.queryKey}`],
    async () => {
      // Temporary hack to simulate that account has wsETH balance
      // if (joinPayload.joinType === 'singleAsset') {
      //   const utils = await getSdkTestUtils({ poolId: joinPayload.poolId, account })
      //   const wstETHAddress = '0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f'
      //   await utils.setupToken('100', wstETHAddress)
      //   joinPayload.setAmountIn('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '1')
      // } else {
      //   const utils = await getSdkTestUtils({ poolId: joinPayload.poolId, account })
      //   // The anvil account will have balance 100 for the two tokens in the example pool
      //   await utils.setupTokens(['100', '100'])
      // }
      return await joinPayload.buildSdkJoinTxConfig(account || noUserAddress)
    },
    {
      enabled: !!account,
    }
  )

  return joinQuery
}
