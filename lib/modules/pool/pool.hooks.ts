/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/navigation'
import { getPoolPath } from './pool.utils'
import { Pool, usePool } from './usePool'
import { useEffect, useState } from 'react'
import { useCurrentFlowStep } from '../transactions/transaction-steps/useCurrentFlowStep'

export function usePoolRedirect(pool: Pool) {
  const router = useRouter()

  /**
   * Redirects user to pool page and respects ctrl/cmd clicks to open in new tab.
   */
  function redirectToPoolPage(event?: React.MouseEvent<HTMLElement>) {
    const path = getPoolPath({ id: pool.id, chain: pool.chain })

    if (event && (event.ctrlKey || event.metaKey)) {
      window.open(path, '_blank')
    } else {
      router.push(path)
    }
  }
  return { redirectToPoolPage }
}

export function useRefetchPoolOnFlowComplete() {
  const [didRefetchPool, setDidRefetchPool] = useState(false)
  const { isFlowComplete } = useCurrentFlowStep()
  const { refetch } = usePool()

  useEffect(() => {
    async function reFetchPool() {
      await refetch()
      setDidRefetchPool(true)
    }
    if (isFlowComplete) reFetchPool()
  }, [isFlowComplete])

  return { didRefetchPool, isFlowComplete }
}
