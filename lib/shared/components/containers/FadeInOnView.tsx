'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { useBreakpointValue } from '@chakra-ui/react'

interface FadeInOnViewProps {
  children: React.ReactNode
  animateOnce?: boolean
}

const FadeInOnView: React.FC<FadeInOnViewProps> = ({ children, animateOnce = true }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: animateOnce })

  // Using Chakra UI's useBreakpointValue to adjust the CSS class based on the breakpoint
  const scaleClass = useBreakpointValue({ base: 'scale-base', md: 'scale-md' }) || 'scale-base'

  const opacityClass =
    useBreakpointValue({ base: 'opacity-base', md: 'opacity-md' }) || 'opacity-base'

  return (
    <div ref={ref} className={`${isInView ? 'visible' : 'hidden'} ${scaleClass} ${opacityClass}`}>
      {children}
    </div>
  )
}

export default FadeInOnView
