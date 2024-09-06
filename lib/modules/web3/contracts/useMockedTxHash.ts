import { useState } from 'react'
import { Hash } from 'viem'
import { getRandomTransactionHash } from '@/lib/shared/utils/existingTransactions'

export function useMockedTxHash() {
  // simulate transaction success using existing transaction (dev only)
  // tried https://github.com/Byont-Ventures/mocketh, but it doesn't work...
  const [mockedTxHash, setMockedTxHash] = useState<Hash | undefined>(undefined)

  function _setMockedTxHash(txHash?: Hash) {
    if (txHash) {
      setMockedTxHash(txHash)
      return txHash
    }

    const transactionHash = prompt(
      `Provide existing transaction hash to skip transaction? e.g. ${getRandomTransactionHash()}`
    )

    if (transactionHash) {
      setMockedTxHash(transactionHash as Hash)
      return transactionHash
    }

    return undefined
  }

  return { mockedTxHash, setMockedTxHash: _setMockedTxHash }
}
