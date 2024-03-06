'use client'

import {
  Button,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  VStack,
  Text,
  ButtonProps,
} from '@chakra-ui/react'
import { useUserSettings } from './useUserSettings'
import { blockInvalidNumberInput, fNum } from '@/lib/shared/utils/numbers'
import { CurrencySelect } from './UserSettings'
import { Percent, Settings } from 'react-feather'

function SlippageInput() {
  const { slippage, setSlippage } = useUserSettings()
  const presetOpts = ['0.5', '1', '2']

  return (
    <VStack align="end" w="full">
      <InputGroup>
        <Input
          value={slippage}
          type="number"
          autoComplete="off"
          autoCorrect="off"
          min={0}
          onChange={e => setSlippage(e.currentTarget.value)}
          onKeyDown={blockInvalidNumberInput}
        />
        <InputRightElement pointerEvents="none">
          <Percent color="grayText" />
        </InputRightElement>
      </InputGroup>
      <HStack>
        {presetOpts.map(preset => (
          <Button
            key={preset}
            size="xs"
            variant={slippage === preset ? 'outline' : 'solid'}
            onClick={() => setSlippage(preset)}
          >
            <Text>{preset}%</Text>
          </Button>
        ))}
      </HStack>
    </VStack>
  )
}

export function TransactionSettings(props: ButtonProps) {
  const { slippage } = useUserSettings()

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button variant="tertiary" {...props}>
          <HStack>
            <Text color="grayText" fontSize="xs">
              {fNum('slippage', slippage)}
            </Text>
            <Settings color="grayText" />
          </HStack>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          <Heading size="md">Transaction settings</Heading>
        </PopoverHeader>
        <PopoverBody p="md">
          <VStack align="start" w="full" spacing="sm">
            <VStack align="start" w="full">
              <Heading size="sm">Slippage</Heading>
              <SlippageInput />
            </VStack>
            <VStack align="start" w="full">
              <Heading size="sm">Currency</Heading>
              <CurrencySelect />
            </VStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
