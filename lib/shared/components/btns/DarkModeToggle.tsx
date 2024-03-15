'use client'

import { Button } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'react-feather'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  function toggleColorMode() {
    setTheme(theme == 'light' ? 'dark' : 'light')
  }

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

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button onClick={toggleColorMode} variant="tertiary">
      <AnimatePresence initial={false}>
        {theme === 'light' ? (
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
