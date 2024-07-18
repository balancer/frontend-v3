/* eslint-disable max-len */
'use client'

import { Box } from '@chakra-ui/react'

import { V3Hero } from '@/lib/shared/components/marketing/build/v3/V3Hero'
import { V3About } from '@/lib/shared/components/marketing/build/v3/V3About'
import { V3UseCases } from '@/lib/shared/components/marketing/build/v3/V3UseCases'
import { V3Technical } from '@/lib/shared/components/marketing/build/v3/V3Technical'
import { V3Grants } from '@/lib/shared/components/marketing/build/v3/V3Grants'
import { V3VideoTutorial } from '@/lib/shared/components/marketing/build/v3/V3VideoTutorial'

export default function Home() {
  return (
    <Box className="build">
      <V3Hero />
      <V3VideoTutorial />
      <V3About />
      <V3UseCases />
      <V3Technical />
      <V3Grants />
    </Box>
  )
}
