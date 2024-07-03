import { Button, ButtonProps } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

export function PoolAlertButton({ onClick, children }: PropsWithChildren<ButtonProps>) {
  return (
    <Button
      onClick={onClick}
      borderColor="font.dark"
      color="font.dark"
      textColor="font.dark"
      variant="outline"
    >
      {children}
    </Button>
  )
}
