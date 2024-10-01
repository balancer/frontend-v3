'use client'

import { VebalInfo } from '@/lib/modules/vebal/VebalInfo'
import { Stack } from '@chakra-ui/react'
import { CrossChainBoost } from '@/lib/modules/vebal/cross-chain/CrossChainBoost'

export default function VebalPage() {
  return (
    <Stack gap="lg">
      <VebalInfo />
      <CrossChainBoost />
    </Stack>
  )
}
