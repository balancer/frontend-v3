'use client'

import {
  Box,
  BoxProps,
  Button,
  HStack,
  Input,
  InputGroup,
  InputProps,
  InputRightAddon,
  Skeleton,
  Text,
  VStack,
  forwardRef,
  useTheme,
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
import { useTokenInputsValidation } from '../useTokenInputsValidation'

type TokenInputSelectorProps = {
  token: GqlToken | undefined
  weight?: string
  toggleTokenSelect?: () => void
}

function TokenInputSelector({ token, weight, toggleTokenSelect }: TokenInputSelectorProps) {
  const label = token ? token?.symbol : toggleTokenSelect ? 'Select token' : 'No token'
  return (
    <Button
      variant={token ? 'tertiary' : 'secondary'}
      onClick={toggleTokenSelect}
      cursor={toggleTokenSelect ? 'pointer' : 'default'}
    >
      {token && (
        <Box mr="sm">
          <TokenIcon logoURI={token?.logoURI} alt={token?.symbol || 'token icon'} size={22} />
        </Box>
      )}
      {label}
      {weight && <Text fontWeight="normal">{weight}%</Text>}
      {toggleTokenSelect && (
        <Box ml="sm">
          <HiChevronDown />
        </Box>
      )}
    </Button>
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
  const { hasValidationError, getValidationError } = useTokenInputsValidation()

  const hasError = hasValidationError(token)
  // TODO: replace input.fontHintError with proper theme color
  const inputLabelColor = hasError ? 'input.fontHintError' : 'current'

  const balance = token ? balanceFor(token?.address) : undefined
  const userBalance = token ? balance?.formatted || '0' : '0'
  const usdValue = value && token ? usdValueForToken(token, value) : '0'

  return (
    <HStack h="4" w="full" justify="space-between">
      {isBalancesLoading ? (
        <Skeleton w="12" h="full" />
      ) : (
        <Text variant="secondary" fontSize="sm">
          {toCurrency(usdValue, { abbreviated: false })}
        </Text>
      )}
      {isBalancesLoading ? (
        <Skeleton w="12" h="full" />
      ) : (
        <HStack cursor="pointer" onClick={() => updateValue(userBalance)}>
          {hasError && (
            <Text variant="secondary" fontSize="sm" color={inputLabelColor}>
              {getValidationError(token)}
            </Text>
          )}
          <Text fontSize="sm" variant="secondary" color={inputLabelColor}>
            {fNum('token', userBalance, { abbreviated: false })}
          </Text>
          <Box color={hasError ? 'input.fontHintError' : 'secondary'}>
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
    const { colors } = useTheme()
    const { getToken } = useTokens()
    const token = address && chain ? getToken(address, chain) : undefined
    const { hasValidationError } = useTokenInputsValidation()

    const { handleOnChange, updateValue } = useTokenInput(token, onChange)

    const tokenInputSelector = TokenInputSelector({ token, weight, toggleTokenSelect })
    const footer = hideFooter ? undefined : TokenInputFooter({ token, value, updateValue })

    // TODO: replace 'red[600' with proper theme color
    const boxShadow = hasValidationError(token) ? `0 0 0 1px ${colors.red[600]}` : undefined

    return (
      <Box
        borderRadius="md"
        p="md"
        shadow="innerBase"
        bg="background.card.level1"
        border="white"
        boxShadow={boxShadow}
        w="full"
        {...boxProps}
      >
        <VStack align="start" spacing="md">
          <InputGroup border="transparent" background="transparent">
            <Box w="full" position="relative">
              <Input
                ref={ref}
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
