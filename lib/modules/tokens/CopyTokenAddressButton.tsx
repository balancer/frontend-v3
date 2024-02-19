'use client'

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
    <IconButton
      size="xs"
      isRound
      variant="ghost"
      aria-label="Copy token address"
      icon={isCopied ? <CheckCircleIcon /> : <CopyIcon />}
      onClick={copyToClipboard}
      {...rest}
    />
  )
}
