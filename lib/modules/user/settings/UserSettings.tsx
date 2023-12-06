'use client'

import {
  Button,
  Heading,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  VStack,
} from '@chakra-ui/react'
import { HiOutlineCog6Tooth } from 'react-icons/hi2'
import { useUserSettings } from './useUserSettings'
import { SupportedCurrency } from '@/lib/shared/utils/currencies'
import { useEffect } from 'react'

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

  useEffect(() => {
    console.log('slippage', slippage)
  }, [slippage])

  return <Input value={slippage} onChange={e => setSlippage(e.currentTarget.value)} />
}

export function UserSettings() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button>
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
