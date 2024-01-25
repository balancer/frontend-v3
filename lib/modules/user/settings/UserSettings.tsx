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
  Select,
  VStack,
  Text,
} from '@chakra-ui/react'
import { HiOutlineCog6Tooth } from 'react-icons/hi2'
import { useUserSettings } from './useUserSettings'
import { SupportedCurrency } from '@/lib/shared/utils/currencies'
import { FiPercent } from 'react-icons/fi'
import { blockInvalidNumberInput } from '@/lib/shared/utils/numbers'

function CurrencySelect() {
  const { currency, setCurrency } = useUserSettings()
  const options = Object.values(SupportedCurrency)

  return (
    <Select onChange={e => setCurrency(e.target.value as SupportedCurrency)} value={currency}>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
  )
}

function SlippageInput() {
  const { slippage, setSlippage } = useUserSettings()
  const presetOpts = ['0.5', '1', '2']

  return (
    <VStack align="start" w="full">
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
          <FiPercent color="GrayText" />
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

export function UserSettings() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="tertiary">
          <HiOutlineCog6Tooth />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          <Heading size="md">Settings</Heading>
        </PopoverHeader>
        <PopoverBody>
          <VStack align="start">
            <Heading size="sm">Currency</Heading>
            <CurrencySelect />
            <Heading size="sm">Slippage</Heading>
            <SlippageInput />
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
