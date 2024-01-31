/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { bn, safeSum } from '@/lib/shared/utils/numbers'
import { HumanAmount } from '@balancer/sdk'
import { PropsWithChildren, createContext, useMemo, useState } from 'react'
import { usePool } from '../../usePool'
import { selectRemoveLiquidityHandler } from './handlers/selectRemoveLiquidityHandler'
import { useRemoveLiquiditySimulationQuery } from './queries/useRemoveLiquiditySimulationQuery'
import { useRemoveLiquidityPriceImpactQuery } from './queries/useRemoveLiquidityPriceImpactQuery'
import { RemoveLiquidityType } from './remove-liquidity.types'
import { Address } from 'viem'
import { toHumanAmount } from '../LiquidityActionHelpers'
import { useDisclosure } from '@chakra-ui/hooks'

export type UseRemoveLiquidityResponse = ReturnType<typeof _useRemoveLiquidity>
export const RemoveLiquidityContext = createContext<UseRemoveLiquidityResponse | null>(null)

export function _useRemoveLiquidity() {
  const { pool, bptPrice } = usePool()
  const { getToken, usdValueForToken } = useTokens()
  const { isConnected } = useUserAccount()

  const previewModalDisclosure = useDisclosure()

  const [removalType, setRemovalType] = useState<RemoveLiquidityType>(
    RemoveLiquidityType.Proportional
  )
  const [singleTokenAddress, setSingleTokenAddress] = useState<Address | undefined>(undefined)

  const [humanBptInPercent, setHumanBptInPercent] = useState<number>(100)

  const handler = useMemo(
    () => selectRemoveLiquidityHandler(pool, removalType),
    [pool.id, removalType]
  )

  const maxHumanBptIn: HumanAmount = (pool?.userBalance?.totalBalance || '0') as HumanAmount
  const humanBptIn: HumanAmount = bn(maxHumanBptIn)
    .times(humanBptInPercent / 100)
    .toString() as HumanAmount

  const totalUsdFromBprPrice = bn(humanBptIn).times(bptPrice).toFixed(2)

  const setProportionalType = () => setRemovalType(RemoveLiquidityType.Proportional)
  const setSingleTokenType = () => setRemovalType(RemoveLiquidityType.SingleToken)
  const isSingleToken = removalType === RemoveLiquidityType.SingleToken
  const isProportional = removalType === RemoveLiquidityType.Proportional

  const tokens = pool.allTokens.map(token => getToken(token.address, pool.chain))
  const validTokens = tokens.filter((token): token is GqlToken => !!token)
  const firstTokenAddress = tokens?.[0]?.address as Address

  const singleTokenOutAddress = singleTokenAddress || firstTokenAddress

  /**
   * Simulation queries
   */
  const simulationQuery = useRemoveLiquiditySimulationQuery(
    handler,
    pool.id,
    humanBptIn,
    singleTokenOutAddress
  )

  const priceImpactQuery = useRemoveLiquidityPriceImpactQuery(
    handler,
    pool.id,
    humanBptIn,
    singleTokenOutAddress
  )

  const amountsOut = simulationQuery.data?.amountsOut || []

  const _tokenOutUnitsByAddress: Record<Address, HumanAmount> = {}
  amountsOut.map(tokenAmount => {
    _tokenOutUnitsByAddress[tokenAmount.token.address] = toHumanAmount(tokenAmount)
  })

  const amountOutForToken = (tokenAddress: Address): HumanAmount => {
    const amount = _tokenOutUnitsByAddress[tokenAddress]
    if (!amount) return '0.00'
    return amount
  }

  const _tokenOutUsdByAddress: Record<Address, HumanAmount> = {}
  amountsOut.map(tokenAmount => {
    const tokenAddress: Address = tokenAmount.token.address
    const token = getToken(tokenAddress, pool.chain)
    if (!token) throw new Error(`Token with address ${tokenAddress} was not found`)
    const tokenUnits = amountOutForToken(token.address as Address)
    _tokenOutUsdByAddress[tokenAddress] = usdValueForToken(token, tokenUnits) as HumanAmount
  })

  const usdOutForToken = (tokenAddress: Address): HumanAmount => {
    const usdOut = _tokenOutUsdByAddress[tokenAddress]
    if (!usdOut) return '0.00'
    return usdOut
  }

  const totalUsdValue: string = Object.values(_tokenOutUsdByAddress)
    .reduce((acc, current) => {
      return Number(safeSum([acc, current]))
    }, 0)
    .toString()

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [Number(humanBptIn) === 0, 'You must specify a valid bpt in']
  )

  return {
    tokens,
    validTokens,
    singleTokenOutAddress,
    humanBptIn,
    humanBptInPercent,
    totalUsdFromBprPrice,
    isSingleToken,
    isProportional,
    totalUsdValue,
    simulationQuery,
    priceImpactQuery,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    setRemovalType,
    setHumanBptInPercent,
    setProportionalType,
    setSingleTokenType,
    setSingleTokenAddress,
    amountOutForToken,
    usdOutForToken,
    handler,
  }
}

export function RemoveLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useRemoveLiquidity()
  return <RemoveLiquidityContext.Provider value={hook}>{children}</RemoveLiquidityContext.Provider>
}

export const useRemoveLiquidity = (): UseRemoveLiquidityResponse =>
  useMandatoryContext(RemoveLiquidityContext, 'RemoveLiquidity')
