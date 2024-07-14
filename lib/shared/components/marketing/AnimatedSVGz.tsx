import React, { useRef } from 'react'
import { Box } from '@chakra-ui/react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

interface AnimatedSVGzProps {}

export const AnimatedSVGz: React.FC<AnimatedSVGzProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const pathLength: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [0, 1])
  const pathD: MotionValue<string> = useTransform(
    scrollYProgress,
    [0, 1],
    ['m 0 0 l 221.231 1.533 l 125.303 79.738 l 202.761 -66.069 l 127.581 -70.624 l 6.834 161.755 l 325.786 -107.078', 'm 0 0 l 136.937 -57.701 l 129.859 27.339 l 93.407 107.076 l 127.581 -70.624 l 113.91 -68.347 l 200.484 59.234']
  )

  return (
    <Box ref={containerRef} w="100%" h="500px" position="relative">
      <svg width="100%" height="auto" viewBox="0 0 100 10" preserveAspectRatio="none">
        <motion.path fill="transparent" stroke="#fff" d={pathD} style={{ pathLength }} strokeWidth={0.1} />
      </svg>
    </Box>
  )
}

export default AnimatedSVGz
