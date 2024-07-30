'use client'

import { ModalBody } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { PropsWithChildren } from 'react'
import useMeasure from 'react-use-measure'

export function AnimatedModalBody({ children }: PropsWithChildren) {
  const [ref, { height }] = useMeasure()

  return (
    <motion.div animate={{ height: height || 'auto ' }}>
      <AnimatePresence mode="wait" initial={false}>
        <ModalBody ref={ref}>{children}</ModalBody>
      </AnimatePresence>
    </motion.div>
  )
}
