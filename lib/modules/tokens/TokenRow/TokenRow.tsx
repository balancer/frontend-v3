/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Box, Button, HStack, Heading, Skeleton, Text, VStack } from '@chakra-ui/react'
import { Address } from 'viem'
import { useTokens } from '../useTokens'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { ReactNode, useEffect, useState } from 'react'
import { TokenIcon } from '../TokenIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { Numberish, fNum, isZero } from '@/lib/shared/utils/numbers'
import { Pool } from '../../pool/usePool'
import { bptUsdValue } from '../../pool/pool.helpers'
import { TokenInfoPopover } from '../TokenInfoPopover'
import { ChevronDown } from 'react-feather'

type Props = {
  label?: string | ReactNode
  address: Address
  chain: GqlChain
  value: Numberish
  usdValue?: string
  customRender?: (token: GqlToken) => ReactNode | ReactNode[]
  disabled?: boolean
  isLoading?: boolean
  abbreviated?: boolean
  isBpt?: boolean
  pool?: Pool
  toggleTokenSelect?: () => void
  showZeroAmountAsDash?: boolean
}

type TemplateProps = {
  address: Address
  chain: GqlChain
  token?: GqlToken
  pool?: Pool
  disabled?: boolean
  showSelect?: boolean
  showInfoPopover?: boolean
}

function TokenRowTemplate({
  address,
  chain,
  token,
  pool,
  disabled,
  showSelect = false,
  showInfoPopover = true,
}: TemplateProps) {
  return (
    <HStack spacing="sm">
      <TokenIcon chain={chain} address={address} size={40} alt={token?.symbol || address} />
      <VStack spacing="none" alignItems="flex-start">
        <HStack spacing="none">
          <Heading
            fontWeight="bold"
            as="h6"
            fontSize="lg"
            variant={disabled ? 'secondary' : 'primary'}
          >
            {token?.symbol || pool?.symbol}
          </Heading>
          {showInfoPopover && <TokenInfoPopover tokenAddress={address} chain={chain} />}
        </HStack>
        <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
          {token?.name || pool?.name}
        </Text>
      </VStack>
      {showSelect && (
        <Box ml="sm">
          <ChevronDown size={16} />
        </Box>
      )}
    </HStack>
  )
}

export default function TokenRow({
  label,
  address,
  value,
  customRender,
  chain,
  disabled,
  isLoading,
  abbreviated = true,
  isBpt,
  pool,
  toggleTokenSelect,
  showZeroAmountAsDash = false,
}: Props) {
  const { getToken, usdValueForToken } = useTokens()
  const { toCurrency } = useCurrency()
  const [amount, setAmount] = useState<string>('')
  const [usdValue, setUsdValue] = useState<string | undefined>(undefined)
  const token = getToken(address, chain)

  // TokenRowTemplate default props
  const props = {
    address,
    chain,
    token,
    pool,
    disabled,
  }

  useEffect(() => {
    if (value) {
      if (isBpt && pool) {
        setUsdValue(bptUsdValue(pool, value))
      } else if (token) {
        setUsdValue(usdValueForToken(token, value))
      }

      setAmount(fNum('token', value, { abbreviated }))
    }
  }, [value])

  return (
    <VStack align="start" w="full" spacing="md">
      {label && typeof label === 'string' ? <Text color="grayText">{label}</Text> : label}
      <HStack width="full" justifyContent="space-between">
        {toggleTokenSelect ? (
          <Button variant="tertiary" onClick={toggleTokenSelect} cursor="pointer" size="xl" p="2">
            <TokenRowTemplate {...props} showInfoPopover={false} showSelect />
          </Button>
        ) : (
          <TokenRowTemplate {...props} />
        )}

        <HStack spacing="8">
          <VStack spacing="2px" alignItems="flex-end">
            {isLoading ? (
              <>
                <Skeleton w="10" h="4" />
                <Skeleton w="10" h="4" />
              </>
            ) : (
              <>
                <Heading fontWeight="bold" as="h6" fontSize="lg">
                  {isZero(amount) && showZeroAmountAsDash ? '-' : amount ? amount : '0'}
                </Heading>
                <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
                  {showZeroAmountAsDash && usdValue && isZero(usdValue)
                    ? '-'
                    : toCurrency(usdValue ?? '0', { abbreviated })}
                </Text>
              </>
            )}
          </VStack>
          {customRender && token && customRender(token)}
        </HStack>
      </HStack>
    </VStack>
  )
}
