'use client'

import { TokenSelectModal } from '@/lib/modules/tokens/TokenSelectModal/TokenSelectModal'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { Button, useDisclosure } from '@chakra-ui/react'
import { useRef } from 'react'

export default function TokenSelectPage() {
  const tokenSelectBtn = useRef(null)
  const tokenSelectDisclosure = useDisclosure()
  const { getTokensByChain } = useTokens()

  return (
    <div>
      <h1>TokenSelectPage</h1>
      <Button ref={tokenSelectBtn} onClick={tokenSelectDisclosure.onOpen}>
        Open modal
      </Button>
      <TokenSelectModal
        tokens={getTokensByChain(1)}
        finalFocusRef={tokenSelectBtn}
        isOpen={tokenSelectDisclosure.isOpen}
        onOpen={tokenSelectDisclosure.onOpen}
        onClose={tokenSelectDisclosure.onClose}
      />
    </div>
  )
}
