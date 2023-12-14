'use client'

import {
  Box,
  BoxProps,
  Card,
  HStack,
  Input,
  InputGroup,
  InputProps,
  InputRightAddon,
  Skeleton,
  Text,
  VStack,
  forwardRef,
} from '@chakra-ui/react'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useTokens } from '../useTokens'
import { useTokenBalances } from '../useTokenBalances'
import { TbWallet } from 'react-icons/tb'
import { useTokenInput } from './useTokenInput'
import { HiChevronDown } from 'react-icons/hi'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { blockInvalidNumberInput, fNum } from '@/lib/shared/utils/numbers'
import { TokenIcon } from '../TokenIcon'

type TokenInputSelectorProps = {
  token: GqlToken | undefined
  weight?: string
  toggleTokenSelect?: () => void
}

function TokenInputSelector({ token, weight, toggleTokenSelect }: TokenInputSelectorProps) {
  const label = token ? token?.symbol : toggleTokenSelect ? 'Select token' : 'No token'
  return (
    <Card
      py="xs"
      px="sm"
      variant="level4"
      shadow="md"
      onClick={toggleTokenSelect}
      cursor={toggleTokenSelect ? 'pointer' : 'default'}
    >
      <HStack spacing="xs">
        {token && (
          <TokenIcon logoURI={token?.logoURI} alt={token?.symbol || 'token icon'} size={24} />
        )}
        <Text title={label} fontWeight="bold" noOfLines={1} maxW="36">
          {label}
        </Text>
        {weight && <Text fontWeight="normal">{weight}%</Text>}
        {toggleTokenSelect && (
          <Box fontSize="xl" color="sand.500">
            <HiChevronDown />
          </Box>
        )}
      </HStack>
    </Card>
  )
}

type TokenInputFooterProps = {
  token: GqlToken | undefined
  value?: string
  updateValue: (value: string) => void
}

function TokenInputFooter({ token, value, updateValue }: TokenInputFooterProps) {
  const { balanceFor, isBalancesLoading } = useTokenBalances()
  const { usdValueForToken } = useTokens()
  const { toCurrency } = useCurrency()

  const balance = token ? balanceFor(token?.address) : undefined
  const userBalance = token ? balance?.formatted || '0' : '0'
  const usdValue = value && token ? usdValueForToken(token, value) : '0'

  return (
    <HStack h="4" w="full" justify="space-between">
      {isBalancesLoading ? (
        <Skeleton w="12" h="full" />
      ) : (
        <Text fontSize="sm">{toCurrency(usdValue)}</Text>
      )}
      {isBalancesLoading ? (
        <Skeleton w="12" h="full" />
      ) : (
        <HStack cursor="pointer" onClick={() => updateValue(userBalance)}>
          <Text fontSize="sm" color="salmon.500">
            {fNum('token', userBalance)}
          </Text>
          <Box color="sand.300">
            <TbWallet />
          </Box>
        </HStack>
      )}
    </HStack>
  )
}

type Props = {
  address?: string
  chain?: GqlChain | number
  weight?: string
  value?: string
  hideFooter?: boolean
  boxProps?: BoxProps
  onChange?: (event: { currentTarget: { value: string } }) => void
  toggleTokenSelect?: () => void
}

export const TokenInput = forwardRef(
  (
    {
      address,
      chain,
      weight,
      value,
      boxProps,
      onChange,
      toggleTokenSelect,
      hideFooter = false,
      ...inputProps
    }: InputProps & Props,
    ref
  ) => {
    const { getToken } = useTokens()
    const token = address && chain ? getToken(address, chain) : undefined
    const { handleOnChange, updateValue } = useTokenInput(token, onChange)

    const tokenInputSelector = TokenInputSelector({ token, weight, toggleTokenSelect })
    const footer = hideFooter ? undefined : TokenInputFooter({ token, value, updateValue })

    return (
      <Box
        borderRadius="md"
        p="md"
        shadow="innerBase"
        bg="background.card.level1"
        border="white"
        w="full"
        ref={ref}
        {...boxProps}
      >
        <VStack align="start" spacing="md">
          <InputGroup border="transparent" background="transparent">
            <Box w="full" position="relative">
              <Input
                type="number"
                placeholder="0.00"
                autoComplete="off"
                autoCorrect="off"
                min={0}
                border="transparent"
                bg="transparent"
                shadow="none"
                p="0"
                fontSize="xl"
                fontWeight="medium"
                value={value}
                title={String(value)}
                onChange={handleOnChange}
                onKeyDown={blockInvalidNumberInput}
                _hover={{
                  borderColor: 'transparent',
                  boxShadow: 'none',
                }}
                _focus={{
                  outline: 'none',
                  borderColor: 'transparent',
                  boxShadow: 'none',
                }}
                {...inputProps}
              />
              <Box
                position="absolute"
                bgGradient="linear(to-r, transparent, background.card.level1 70%)"
                w="8"
                h="full"
                top={0}
                right={0}
                zIndex={9999}
              ></Box>
            </Box>

            {tokenInputSelector && (
              <InputRightAddon bg="transparent" border="none" p="0" pl="1">
                {tokenInputSelector}
              </InputRightAddon>
            )}
          </InputGroup>
          {footer && footer}
        </VStack>
      </Box>
    )
  }
)
