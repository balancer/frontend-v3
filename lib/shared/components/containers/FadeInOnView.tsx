'use client'

import { motion, useInView, cubicBezier } from 'framer-motion'
import { useRef } from 'react'

interface FadeInOnViewProps {
  children: React.ReactNode
  animateOnce?: boolean
}

const FadeInOnView: React.FC<FadeInOnViewProps> = ({ children, animateOnce = true }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: animateOnce })
  const easing = cubicBezier(0.17, 0.67, 0.53, 1.05)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, translateY: 5, scale: 0.98 }}
      animate={{
        opacity: isInView ? 1 : 0,
        translateY: isInView ? 0 : 8,
        scale: isInView ? 1 : 0.98,
      }}
      transition={{ duration: 1, ease: easing }}
    >
      {children}
    </motion.div>
  )
}

export default FadeInOnView
