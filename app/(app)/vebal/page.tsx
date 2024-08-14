'use client'

import { VebalMainInfo } from '@/lib/modules/vebal/VebalMainInfo'
import { Stack } from '@chakra-ui/react'

export default function VebalPage() {
  return (
    <Stack gap={4}>
      <VebalMainInfo />
    </Stack>
  )
}
