'use client'

import { Button, useColorMode } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'react-feather'

export default function DarkModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()

  const animationSun = {
    initial: { rotate: 0, scale: 0, opacity: 0 },
    animate: { rotate: 90, scale: 1, opacity: 1 },
    exit: { rotate: 0, scale: 0, opacity: 0 },
  }

  const animationMoon = {
    initial: { rotate: 90, scale: 0, opacity: 0 },
    animate: { rotate: 0, scale: 1, opacity: 1 },
    exit: { rotate: 90, scale: 0, opacity: 0 },
  }

  return (
    <Button onClick={toggleColorMode} variant="tertiary">
      <AnimatePresence initial={false}>
        {colorMode === 'light' ? (
          <motion.i {...animationSun}>
            <Sun size={18} />
          </motion.i>
        ) : (
          <motion.i {...animationMoon}>
            <Moon size={18} />
          </motion.i>
        )}
      </AnimatePresence>
    </Button>
  )
}
