import { motion } from 'framer-motion'
import { PropsWithChildren } from 'react'
import { useSwap } from '../useSwap'
import { SwapPreview } from './SwapPreview'
import { SwapReceipt } from './SwapReceipt'

export function SwapModalBody() {
  const { isWrap, swapTxHash } = useSwap()

  // Wrap and unwrap receipts will not have slippage so we don't need a receipt for them
  if (swapTxHash && !isWrap) {
    return (
      <MotionDiv key="receipt">
        <SwapReceipt txHash={swapTxHash} />
      </MotionDiv>
    )
  }

  return (
    <MotionDiv key="preview">
      <SwapPreview />
    </MotionDiv>
  )
}

function MotionDiv({ key, children }: PropsWithChildren<{ key: string }>) {
  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
