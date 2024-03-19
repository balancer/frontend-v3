import { Button, ButtonProps, HStack } from '@chakra-ui/react'
import React from 'react'

export type ButtonGroupOption = {
  value: string
  label: string
}

type Props = {
  currentOption: ButtonGroupOption
  options: ButtonGroupOption[]
  onChange: (option: ButtonGroupOption) => void
  size?: ButtonProps['size']
}

export default function ButtonGroup({ currentOption, options, onChange, size }: Props) {
  return (
    <HStack rounded="md" p="1" spacing="1" background="level0" shadow="innerXl">
      {options.map(option => {
        const isActive = currentOption.value === option.value
        return (
          <Button
            onClick={() => onChange(option)}
            key={`button-group-option-${option.value}`}
            variant={isActive ? 'buttonGroupActive' : 'buttonGroupInactive'}
            id={`button-group-${option.value}`}
            size={size}
          >
            {option.label}
          </Button>
        )
      })}
    </HStack>
  )
}
