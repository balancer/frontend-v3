/* eslint-disable react-hooks/exhaustive-deps */
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
import { useTokenInput } from './useTokenInput'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { blockInvalidNumberInput, fNum } from '@/lib/shared/utils/numbers'
import { TokenIcon } from '../TokenIcon'
import { useTokenInputsValidation } from '../useTokenInputsValidation'
import { ChevronDown } from 'react-feather'
import { WalletIcon } from '@/lib/shared/components/icons/WalletIcon'
import { usePriceImpact } from '@/lib/shared/hooks/usePriceImpact'
import { useEffect, useState } from 'react'

type TokenInputSelectorProps = {
  token: GqlToken | undefined
  weight?: string
  toggleTokenSelect?: () => void
}

type TokenConfigProps = {
  label: string
  variant: string
  showIcon: boolean
}

function TokenInputSelector({ token, weight, toggleTokenSelect }: TokenInputSelectorProps) {
  const [tokenConfig, setTokenConfig] = useState<TokenConfigProps | undefined>(undefined)

  useEffect(() => {
    if (token) {
      setTokenConfig({ label: token.symbol, variant: 'tertiary', showIcon: true })
    } else if (toggleTokenSelect) {
      setTokenConfig({ label: 'Select token', variant: 'secondary', showIcon: false })
    }
  }, [token])

  return tokenConfig ? (
    <Button
      variant={tokenConfig.variant}
      onClick={toggleTokenSelect}
      cursor={toggleTokenSelect ? 'pointer' : 'default'}
    >
      {tokenConfig && tokenConfig.showIcon && (
        <Box mr="sm">
          <TokenIcon logoURI={token?.logoURI} alt={tokenConfig.label} size={22} loading="lazy" />
        </Box>
      )}
      {tokenConfig && tokenConfig.label}
      {weight && <Text fontWeight="normal">{weight}%</Text>}
      {toggleTokenSelect && (
        <Box ml="sm">
          <ChevronDown size={16} />
        </Box>
      )}
    </Button>
  ) : (
    <Skeleton height="40px" width="110px" />
  )
}

type TokenInputFooterProps = {
  token: GqlToken | undefined
  value?: string
  updateValue: (value: string) => void
  hasPriceImpact?: boolean
  isLoadingPriceImpact?: boolean
}

function TokenInputFooter({
  token,
  value,
  updateValue,
  hasPriceImpact,
  isLoadingPriceImpact,
}: TokenInputFooterProps) {
  const { balanceFor, isBalancesLoading } = useTokenBalances()
  const { usdValueForToken } = useTokens()
  const { toCurrency } = useCurrency()
  const { hasValidationError, getValidationError } = useTokenInputsValidation()
  const { priceImpact, priceImpactColor, priceImpactLevel } = usePriceImpact()

  const hasError = hasValidationError(token)
  // TODO: replace input.fontHintError with proper theme color
  const inputLabelColor = hasError ? 'input.fontHintError' : 'grayText'

  const balance = token ? balanceFor(token?.address) : undefined
  const userBalance = token ? balance?.formatted || '0' : '0'
  const usdValue = value && token ? usdValueForToken(token, value) : '0'

  const showPriceImpact = !isLoadingPriceImpact && hasPriceImpact && priceImpact

  return (
    <HStack h="4" w="full" justify="space-between">
      {isBalancesLoading ? (
        <Skeleton w="12" h="full" />
      ) : (
        <Text
          variant="secondary"
          fontSize="sm"
          color={showPriceImpact ? priceImpactColor : 'gray.400'}
        >
          {toCurrency(usdValue, { abbreviated: false })}
          {showPriceImpact &&
            priceImpactLevel !== 'unknown' &&
            ` (-${fNum('priceImpact', priceImpact)})`}
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
          <Box color={hasError ? 'input.fontHintError' : 'icon.base'}>
            <WalletIcon size={16} />
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
  hasPriceImpact?: boolean
  isLoadingPriceImpact?: boolean
  disableBalanceValidation?: boolean
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
      hasPriceImpact = false,
      isLoadingPriceImpact = false,
      disableBalanceValidation = false,
      ...inputProps
    }: InputProps & Props,
    ref
  ) => {
    const { colors } = useTheme()
    const { getToken } = useTokens()
    const token = address && chain ? getToken(address, chain) : undefined
    const { hasValidationError } = useTokenInputsValidation()

    const { handleOnChange, updateValue, validateInput } = useTokenInput({
      token,
      onChange,
      disableBalanceValidation,
    })

    const tokenInputSelector = TokenInputSelector({ token, weight, toggleTokenSelect })
    const footer = hideFooter
      ? undefined
      : TokenInputFooter({ token, value, updateValue, hasPriceImpact, isLoadingPriceImpact })

    const boxShadow = hasValidationError(token) ? `0 0 0 1px ${colors.red[500]}` : undefined

    useEffect(() => {
      validateInput(value || '')
    }, [value])

    return (
      <Box
        borderRadius="md"
        p={['ms', 'md']}
        shadow="innerBase"
        bg="background.level0"
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
                bgGradient="linear(to-r, transparent, background.level0 70%)"
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
