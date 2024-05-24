'use client'

import {
  Box,
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
  PopoverTrigger,
  VStack,
  Text,
  Tooltip,
  Switch,
} from '@chakra-ui/react'
import { useUserSettings } from './UserSettingsProvider'
import { blockInvalidNumberInput } from '@/lib/shared/utils/numbers'
import { Percent, Settings } from 'react-feather'
import { CurrencySelect } from './CurrencySelect'
import { InfoIcon } from '@/lib/shared/components/icons/InfoIcon'

export function SlippageInput() {
  const { slippage, setSlippage } = useUserSettings()
  const presetOpts = ['0.5', '1', '2']

  return (
    <VStack align="start" w="full">
      <InputGroup>
        <Input
          value={slippage}
          type="number"
          bg="background.level1"
          autoComplete="off"
          autoCorrect="off"
          min={0}
          onChange={e => setSlippage(e.currentTarget.value)}
          onKeyDown={blockInvalidNumberInput}
        />
        <InputRightElement pointerEvents="none">
          <Percent color="grayText" size="20px" />
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

function EnableSignaturesSelect() {
  const { enableSignatures, setEnableSignatures } = useUserSettings()

  const handleChange = () => {
    setEnableSignatures(enableSignatures === 'yes' ? 'no' : 'yes')
  }

  return <Switch isChecked={enableSignatures === 'yes'} onChange={handleChange} />
}

// eslint-disable-next-line max-len
const signaturesTooltipLabel = `It's recommended to turn on signatures for gas-free transactions, where possible. However, if your wallet doesn't support the signing of signatures, you can turn it off.`

export function UserSettings() {
  return (
    <Popover isLazy>
      <PopoverTrigger>
        <Button variant="tertiary" p="0">
          <Settings size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow bg="background.level3" />
        <PopoverCloseButton />
        <PopoverBody p="0">
          <HStack color="font.special" p="md" pb="0">
            <Settings size={20} />
            <Heading size="md" variant="special">
              Settings
            </Heading>
          </HStack>
          <VStack align="start" spacing="24px" p="md">
            <Box w="full">
              <Heading size="sm" pb="2">
                Currency
              </Heading>
              <CurrencySelect id="user-settings-currency-select" />
            </Box>
            <Box w="full">
              <Heading size="sm" pb="2">
                Slippage
              </Heading>
              <SlippageInput />
            </Box>
            <Box w="full">
              <HStack>
                <Heading size="sm" pb="2">
                  Use Signatures
                </Heading>
                <Tooltip label={signaturesTooltipLabel} fontSize="sm">
                  <InfoIcon />
                </Tooltip>
              </HStack>
              <EnableSignaturesSelect />
            </Box>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
