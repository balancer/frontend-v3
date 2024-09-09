'use client'

import BalTooltip from '@/lib/shared/components/tooltips/BalTooltip'
import { CheckCircleIcon, CopyIcon } from '@chakra-ui/icons'
import { IconButton, IconButtonProps } from '@chakra-ui/react'
import { useState } from 'react'

export function CopyTokenAddressButton({
  tokenAddress,
  ...rest
}: { tokenAddress: string } & Omit<IconButtonProps, 'aria-label'>) {
  const [isCopied, setIsCopied] = useState(false)

  function copyToClipboard() {
    navigator.clipboard.writeText(tokenAddress)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <BalTooltip label="Copy token address">
      <IconButton
        size="xs"
        isRound
        variant="ghost"
        w="6"
        h="6"
        aria-label="Copy token address"
        icon={isCopied ? <CheckCircleIcon /> : <CopyIcon />}
        onClick={copyToClipboard}
        {...rest}
      />
    </BalTooltip>
  )
}
