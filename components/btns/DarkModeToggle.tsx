'use client'

import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Button, useColorMode } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'

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
    <Button onClick={toggleColorMode}>
      <AnimatePresence initial={false}>
        {colorMode === 'light' ? (
          <motion.i {...animationSun}>
            <SunIcon />
          </motion.i>
        ) : (
          <motion.i {...animationMoon}>
            <MoonIcon />
          </motion.i>
        )}
      </AnimatePresence>
    </Button>
  )
}
