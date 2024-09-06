'use client'

import { StackProps, VStack } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { PropsWithChildren } from 'react'
import useMeasure from 'react-use-measure'

export function AnimatedModalBody({ children, ...rest }: PropsWithChildren & StackProps) {
  const [ref, { height }] = useMeasure()

  return (
    <motion.div animate={{ height: height || 'auto ' }}>
      <AnimatePresence mode="wait" initial={false}>
        <VStack ref={ref} spacing="sm" align="start" {...rest}>
          {children}
        </VStack>
      </AnimatePresence>
    </motion.div>
  )
}
