import { Box, Center, ModalOverlay } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const rippleVariants = (delay: number) => ({
  hidden: {
    scale: 0.1,
    opacity: 0.6,
    repeat: 3,
  },
  visible: {
    scale: 4,
    opacity: 0,
    transition: {
      duration: 4, // Duration of the ripple effect
      ease: 'easeOut',
      repeat: 3,
      delay,
    },
  },
})

export function SuccessOverlay({ startAnimation }: { startAnimation?: boolean }) {
  return (
    <ModalOverlay>
      {startAnimation && (
        <Center position="absolute" h="full" w="full">
          <Box
            as={motion.div}
            position="absolute"
            width="300px"
            height="300px"
            bg="rgba(255, 255, 255, 0.4)" // Adjust color as needed
            borderRadius="50%"
            pointerEvents="none" // Ensure it doesn't interfere with user interactions
            initial="hidden"
            animate="visible"
            variants={rippleVariants(0)}
          />
          <Box
            as={motion.div}
            position="absolute"
            width="300px"
            height="300px"
            bg="rgba(255, 255, 255, 0.3)" // Adjust color as needed
            borderRadius="50%"
            pointerEvents="none" // Ensure it doesn't interfere with user interactions
            initial="hidden"
            animate="visible"
            variants={rippleVariants(1)}
          />
          <Box
            as={motion.div}
            position="absolute"
            width="300px"
            height="300px"
            bg="rgba(255, 255, 255, 0.2)" // Adjust color as needed
            borderRadius="50%"
            pointerEvents="none" // Ensure it doesn't interfere with user interactions
            initial="hidden"
            animate="visible"
            variants={rippleVariants(2)}
          />
        </Center>
      )}
    </ModalOverlay>
  )
}
