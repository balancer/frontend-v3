import { Button, ButtonProps, HStack } from '@chakra-ui/react'
import React from 'react'

export type ButtonGroupOption = {
  id: string
  label: string
}

type Props = {
  value: ButtonGroupOption
  options: ButtonGroupOption[]
  onChange: (option: ButtonGroupOption) => void
  size?: ButtonProps['size']
}

export default function ButtonGroup({ value, options, onChange, size }: Props) {
  return (
    <HStack
      rounded="md"
      p="1"
      backgroundColor="background.card.level5"
      spacing="1"
      borderColor="borderColor"
      shadow="sm"
      borderWidth={1}
    >
      {options.map(option => {
        const isActive = value.id === option.id
        return (
          <Button
            onClick={() => onChange(option)}
            key={`button-group-option-${option.id}`}
            variant={isActive ? 'buttonGroupActive' : 'buttonGroupInactive'}
            id={`button-group-${option.id}`}
            size={size}
          >
            {option.label}
          </Button>
        )
      })}
    </HStack>
  )
}
