'use client'

import { Button } from '../_base/Button'
import { HiSun as Sun, HiMoon as Moon } from 'react-icons/hi'
import { useTheme } from 'next-themes'

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button variant="outline" shape="square" size="sm" onClick={toggleTheme}>
      <Sun
        className="
          h-[1.2rem] w-[1.2rem] rotate-0 scale-100 
          transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        className="
          absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0
          transition-all dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
