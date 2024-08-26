'use client'

import ReactLenis from '@studio-freight/react-lenis'
import { Box } from '@chakra-ui/react'
import AnimatedSVG from './AnimatedSVG'
import { HomeActivity } from './HomeActivity'
import { HomeBuilders } from './HomeBuilders'
import { HomeHero } from './HomeHero'
import { HomeProtocols } from './HomeProtocols'

export function HomeContent() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      <Box className="homepage" overflowX="hidden">
        <HomeHero />
        <Box height={{ base: '100px', md: '200px' }} zIndex="-1" position="relative">
          <AnimatedSVG />
        </Box>
        <HomeBuilders />
        <HomeProtocols />
        <HomeActivity />
      </Box>
    </ReactLenis>
  )
}
