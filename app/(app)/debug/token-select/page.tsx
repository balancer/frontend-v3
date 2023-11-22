'use client'

import { TokenSelectModal } from '@/lib/modules/tokens/TokenSelectModal/TokenSelectModal'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { Button, useDisclosure, Text } from '@chakra-ui/react'
import { useRef, useState } from 'react'

export default function TokenSelectPage() {
  const [selectedToken, setSelectedToken] = useState<GqlToken>()
  const tokenSelectBtn = useRef(null)
  const tokenSelectDisclosure = useDisclosure()
  const { getTokensByChain } = useTokens()

  function handleTokenSelect(token: GqlToken) {
    setSelectedToken(token)
  }

  return (
    <div>
      <h1>TokenSelectPage</h1>
      <Text>Selected token: {selectedToken?.symbol}</Text>
      <Button ref={tokenSelectBtn} onClick={tokenSelectDisclosure.onOpen}>
        Open modal
      </Button>
      <TokenSelectModal
        tokens={getTokensByChain(1)}
        pinNativeAsset
        finalFocusRef={tokenSelectBtn}
        isOpen={tokenSelectDisclosure.isOpen}
        onOpen={tokenSelectDisclosure.onOpen}
        onClose={tokenSelectDisclosure.onClose}
        onTokenSelect={handleTokenSelect}
      />
    </div>
  )
}
