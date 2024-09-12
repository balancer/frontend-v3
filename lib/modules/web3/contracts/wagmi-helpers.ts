// Helpers for wagmi transactions
import { Address } from 'viem'
import { TransactionBundle } from './contract.types'
import { polygon } from 'viem/chains'
import { secs } from '@/lib/shared/utils/time'

export function getHashFromTransaction(transactionBundle?: TransactionBundle): Address | undefined {
  if (!transactionBundle) return
  if (transactionBundle.execution) return transactionBundle.execution.data
}

export const noUserAddress = '0xNoUser' // We use this value to avoid TS inference problems in wagmi hooks
export const nullAddress = '0xNull'
export const emptyAddress = '' as Address

export function isValidUserAddress(userAddress?: Address) {
  if (!userAddress) return false
  if (userAddress === noUserAddress) return false
  return true
}

/*
  Returns timeout to be used in useWaitForTransactionReceipt options
  By default all react queries retry 3 times
  More info: https://tanstack.com/query/v5/docs/framework/react/guides/query-retries
 */
export function getWaitForReceiptTimeout(chainId: number) {
  // In polygon there will be 3 retries of 25 seconds until we throw the timeout error
  if (chainId === polygon.id) return secs(25).toMs()

  // In other chains there will be 3 retries of 15 seconds until we throw the timeout error
  return secs(15).toMs()
}

/*
  For a given tx simulation, we don't want background refetches.
  We already have an explicit timeout mechanism (see useShouldFreezeQuote) to run refetch queries every 30 seconds.

  Example where background refetches can be harmful:
    Polygon:
    1. The user is waiting for a Tx confirmation and goes to another tab
    2. The tx is confirmed but has less than minConfirmations
    3. The user comes back to balancer tab, which triggers a background react-query for the simulation (only if staleTime: 0)
    5. The new simulation background query fails cause the tx is already confirmed (we get misleading sentry errors cause there was not a real error)
    6. The tx reaches > minConfirmations so the flow can be finished successfully (however, point 5. can temporarily alter the UI and send wrong Sentry logs)

  Setting staleTime to infinity will avoid background refetches like the ones in the previous example.

  More info:
  https://wagmi.sh/react/api/hooks/useSimulateContract#staletime
  https://tkdodo.eu/blog/practical-react-query
*/
export function getTxSimulationStaleTime() {
  return Infinity
}

/*
  See comments of getTxSimulationStaleTime above
  This prevents issues in polygon when the user navigates away from the page while waiting for a tx confirmation.
  If the unstake + claim has less than minConfirmations, claimed and rewards queries would be refetched and return zero claimable data, breaking the flow.
*/
export function getClaimableQueryStaleTime() {
  return Infinity
}
