'use client'

import { motion, useInView, cubicBezier } from 'framer-motion'
import { useRef } from 'react'

interface FadeInOnViewProps {
  children: React.ReactNode
}

const FadeInOnView: React.FC<FadeInOnViewProps> = ({ children }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const easing = cubicBezier(0.17, 0.67, 0.53, 1.05)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, translateY: '12px' }}
      animate={{ opacity: isInView ? 1 : 0, translateY: isInView ? '0px' : '12px' }}
      transition={{ duration: 1, ease: easing }}
    >
      {children}
    </motion.div>
  )
}

export default FadeInOnView
