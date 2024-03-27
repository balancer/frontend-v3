'use client'

import {
  Button,
  HStack,
  Heading,
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
import { fNum } from '@/lib/shared/utils/numbers'
import { Settings } from 'react-feather'
import { CurrencySelect } from './CurrencySelect'
import { useIsMounted } from '@/lib/shared/hooks/useIsMounted'
import { SlippageInput } from './UserSettings'

export function TransactionSettings(props: ButtonProps) {
  const isMounted = useIsMounted()
  const { slippage } = useUserSettings()

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button variant="tertiary" {...props}>
          <HStack textColor="grayText">
            <Text color="grayText" fontSize="xs">
              {isMounted ? fNum('slippage', slippage) : '100%'}
            </Text>
            <Settings size={16} />
          </HStack>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow bg="background.level3" />
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
              <CurrencySelect id="transaction-settings-currency-select" />
            </VStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
