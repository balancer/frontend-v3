'use client'

import { Box, BoxProps, HStack, Skeleton, Text, forwardRef } from '@chakra-ui/react'
import { BalInput } from '../../../shared/components/inputs/BalInput'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import Image from 'next/image'
import { useTokens } from '../useTokens'
import { useTokenBalances } from '../useTokenBalances'
import { tokenFormat, useNumbers } from '@/lib/shared/hooks/useNumbers'
import { TbWallet } from 'react-icons/tb'
import { blockInvalidNumberInput, useTokenInput } from './useTokenInput'
import { HiChevronDown } from 'react-icons/hi'

type TokenInputSelectorProps = {
  token: GqlToken | undefined
  weight?: string
  toggleTokenSelect?: () => void
}

function TokenInputSelector({ token, weight, toggleTokenSelect }: TokenInputSelectorProps) {
  return (
    <Box
      py="xs"
      px="sm"
      bg="sand.50"
      borderRadius="md"
      onClick={toggleTokenSelect}
      cursor={toggleTokenSelect ? 'pointer' : 'default'}
    >
      <HStack spacing="xs">
        {token?.logoURI && <Image src={token?.logoURI} alt={token.symbol} width={24} height={24} />}
        <Text fontWeight="bold">{token?.symbol}</Text>
        {weight && <Text fontWeight="normal">{weight}%</Text>}
        {toggleTokenSelect && (
          <Box fontSize="xl" color="sand.500">
            <HiChevronDown />
          </Box>
        )}
      </HStack>
    </Box>
  )
}

type TokenInputFooterProps = {
  token: GqlToken | undefined
  updateValue: (value: string) => void
}

function TokenInputFooter({ token, updateValue }: TokenInputFooterProps) {
  const { balanceFor, isBalancesLoading } = useTokenBalances()
  const { usdValueForToken } = useTokens()
  const { toCurrency } = useNumbers()

  const balance = token ? balanceFor(token?.address) : undefined
  const userBalance = token ? balance?.formatted || '0' : '0'
  const usdValue = userBalance && token ? usdValueForToken(token, userBalance) : '0'

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
          <Text fontSize="sm" color="red.500">
            {tokenFormat(userBalance)}
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
  address: string
  chain: GqlChain | number
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
    }: Props,
    ref
  ) => {
    const { getToken } = useTokens()
    const token = getToken(address, chain)
    const { handleOnChange, updateValue } = useTokenInput(token, onChange)

    const tokenInputSelector = TokenInputSelector({ token, weight, toggleTokenSelect })
    const footer = hideFooter ? undefined : TokenInputFooter({ token, updateValue })

    return (
      <BalInput
        ref={ref}
        value={value}
        type="number"
        placeholder="0.00"
        inputMode="decimal"
        autoComplete="off"
        autoCorrect="off"
        min={0}
        footerSlot={footer}
        rightSlot={tokenInputSelector}
        boxProps={boxProps}
        onChange={handleOnChange}
        onKeyDown={blockInvalidNumberInput}
      />
    )
  }
)
