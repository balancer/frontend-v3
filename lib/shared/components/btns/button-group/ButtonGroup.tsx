import { Button, HStack } from '@chakra-ui/react'
import React from 'react'

export type ButtonGroupOption = {
  id: string
  label: string
}

type Props = {
  value: ButtonGroupOption
  options: ButtonGroupOption[]
  onChange: (option: ButtonGroupOption) => void
}

export default function ButtonGroup({ value, options, onChange }: Props) {
  return (
    <HStack
      rounded="md"
      p="1"
      backgroundColor="elevatedBackground"
      spacing="1"
      borderColor="borderColor"
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
          >
            {option.label}
          </Button>
        )
      })}
    </HStack>
  )
}
