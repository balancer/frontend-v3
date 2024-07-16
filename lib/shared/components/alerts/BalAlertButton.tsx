'use client'

import { Button, ButtonProps } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { useThemeColorMode } from '../../services/chakra/useThemeColorMode'

export function BalAlertButton({ onClick, children }: PropsWithChildren<ButtonProps>) {
  const colorMode = useThemeColorMode()
  const isDark = colorMode === 'dark'

  const customStyles = {
    borderColor: isDark ? 'white' : 'black',
    _hover: {
      transform: 'scale(1.05)',
    },
  }

  return (
    <Button onClick={onClick} h="24px" py="md" my="-2" variant="outline" {...customStyles}>
      {children}
    </Button>
  )
}
