'use client'

import {
  Button,
  Heading,
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

export function UserSettings() {
  const { currency, setCurrency } = useUserSettings()
  const options = Object.values(SupportedCurrency)

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
            <Select
              onChange={e => setCurrency(e.target.value as SupportedCurrency)}
              value={currency}
            >
              {options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
