import { useState } from 'react'
import { Address } from 'viem'

export type CompletedApprovalState = ReturnType<typeof useCompletedApprovalsState>

/*
  State to track the completion of the approval step list in a given approval flow
*/
export function useCompletedApprovalsState() {
  const [completedApprovals, setCompletedApprovals] = useState<Address[]>([])
  const saveCompletedApprovals = (address: Address) => {
    setCompletedApprovals([...completedApprovals, address])
  }

  return { completedApprovals, saveCompletedApprovals }
}
