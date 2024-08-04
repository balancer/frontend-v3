'use client'

import { VebalAdditionalInfo } from '@/lib/modules/vebal-page/VebalAdditionalInfo'
import { VebalMainInfo } from '@/lib/modules/vebal-page/VebalMainInfo'
import { Stack } from '@chakra-ui/react'

export default function VebalPage() {
  return (
    <Stack gap={4}>
      <VebalMainInfo />
      <VebalAdditionalInfo />
    </Stack>
  )
}
