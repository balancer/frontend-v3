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
  Tooltip,
  Switch,
} from '@chakra-ui/react'
import { HiOutlineCog6Tooth } from 'react-icons/hi2'
import { useUserSettings } from './useUserSettings'
import { SupportedCurrency } from '@/lib/shared/utils/currencies'
import { FiPercent } from 'react-icons/fi'
import { blockInvalidNumberInput } from '@/lib/shared/utils/numbers'
import { InfoOutlineIcon } from '@chakra-ui/icons'

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
          <FiPercent color="grayText" />
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
            <HStack>
              <Heading size="sm">Use Signatures</Heading>
              <Tooltip label={signaturesTooltipLabel} fontSize="sm">
                <InfoOutlineIcon color="grayText" />
              </Tooltip>
            </HStack>
            <EnableSignaturesSelect />
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
