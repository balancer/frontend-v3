import { Box } from '@chakra-ui/react'
import { useRef, ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxImageProps {
  children: ReactNode
  scaleStart?: string
  scaleEnd?: string
  yStart?: string
  yEnd?: string
  transformOrigin?: string
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  children,
  scaleStart = '90%',
  scaleEnd = '110%',
  yStart = '-20%',
  yEnd = '20%',
  transformOrigin = 'bottom',
}) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [yStart, yEnd])
  const scale = useTransform(scrollYProgress, [0, 1], [scaleStart, scaleEnd])

  return (
    <Box overflow="hidden" position="relative">
      <div ref={ref}>
        <Box as={motion.div} style={{ y, scale, transformOrigin }}>
          {children}
        </Box>
      </div>
    </Box>
  )
}
