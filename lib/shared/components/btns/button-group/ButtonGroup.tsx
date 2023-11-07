import { Button, HStack } from '@chakra-ui/react'
import React from 'react'

type Option = {
  id: string
  label: string
}

type Props = {
  options: Option[]
}

export default function ButtonGroup({ options }: Props) {
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
        return (
          <Button variant="activeSelector" id={`button-group-${option.id}`}>
            {option.label}
          </Button>
        )
      })}
    </HStack>
  )
}
