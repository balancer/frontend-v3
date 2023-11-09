import { Button, HStack } from '@chakra-ui/react'
import React, { useState } from 'react'

type Option = {
  id: string
  label: string
}

type Props = {
  value: Option
  options: Option[]
}

export default function ButtonGroup({ value, options }: Props) {
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
