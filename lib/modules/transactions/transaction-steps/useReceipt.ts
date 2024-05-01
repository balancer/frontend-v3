import { useTransactionFlow } from '@/lib/modules/transactions/transaction-steps/TransactionFlowProvider'
import { getLastSegment } from '@/lib/shared/utils/paths'
import { usePathname, useRouter } from 'next/navigation'
import { Address } from 'viem'

export function useReceipt() {
  const pathname = usePathname()
  const router = useRouter()

  const { isFlowComplete, flowStep } = useTransactionFlow()
  const isReceiptPage =
    pathname.includes('/add-liquidity/0x') ||
    pathname.includes('/remove-liquidity/0x') ||
    pathname.includes('/swap/0x')

  // The receipt url can be explicity loaded when the flow state is not available anymore
  const keepsFlowState = isFlowComplete

  const txHash = (getLastSegment(pathname) || '') as Address

  function navigateToReceipt() {
    const receiptPathname = `./${getFlowUrlSegment(pathname)}/${
      flowStep?.result.data?.transactionHash
    }`
    router.push(receiptPathname)
  }

  return {
    isReceiptPage,
    isFlowComplete,
    keepsFlowState,
    txHash,
    navigateToReceipt,
  }
}

type FlowUrlSegment = 'add-liquidity' | 'remove-liquidity' | 'swap'
export function getFlowUrlSegment(pathname: string): FlowUrlSegment | undefined {
  if (pathname.includes('/add-liquidity')) return 'add-liquidity'
  if (pathname.includes('/remove-liquidity')) return 'remove-liquidity'
  if (pathname.includes('/swap')) return 'swap'
}
