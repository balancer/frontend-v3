'use client'

import { createContext, PropsWithChildren } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { makeVar, useReactiveVar } from '@apollo/client'
import { usePool } from '../../usePool'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken, GqlTokenAmountHumanReadable } from '@/lib/shared/services/api/generated/graphql'

export type UseRemoveLiquidityResponse = ReturnType<typeof _useRemoveLiquidity>
export const RemoveLiquidityContext = createContext<UseRemoveLiquidityResponse | null>(null)

type RemoveLiquidityType = 'PROPORTIONAL' | 'SINGLE_ASSET'

interface RemoveLiquidityState {
  type: RemoveLiquidityType
  singleToken: GqlTokenAmountHumanReadable | null
  proportionalPercent: number
  selectedOptions: { [poolTokenIndex: string]: string }
  proportionalAmounts: GqlTokenAmountHumanReadable[] | null
}

export const removeliquidityStateVar = makeVar<RemoveLiquidityState>({
  type: 'PROPORTIONAL',
  proportionalPercent: 50,
  singleToken: null,
  selectedOptions: {},
  proportionalAmounts: null,
})

export function _useRemoveLiquidity() {
  const { pool } = usePool()
  const { getToken, usdValueForToken } = useTokens()

  async function setProportionalPercent(value: number) {
    removeliquidityStateVar({ ...removeliquidityStateVar(), proportionalPercent: value })
  }

  function setProportional() {
    removeliquidityStateVar({
      ...removeliquidityStateVar(),
      type: 'PROPORTIONAL',
      singleToken: null,
    })
  }

  function setProportionalAmounts(proportionalAmounts: GqlTokenAmountHumanReadable[]) {
    removeliquidityStateVar({ ...removeliquidityStateVar(), proportionalAmounts })
  }

  function setSingleToken(address: string) {
    removeliquidityStateVar({
      ...removeliquidityStateVar(),
      type: 'SINGLE_ASSET',
      singleToken: { address, amount: '' },
    })
  }

  function setSingleTokenAmount(tokenAmount: GqlTokenAmountHumanReadable) {
    removeliquidityStateVar({
      ...removeliquidityStateVar(),
      singleToken: tokenAmount,
    })
  }

  function setSelectedOption(poolTokenIndex: number, tokenAddress: string) {
    const state = removeliquidityStateVar()

    removeliquidityStateVar({
      ...state,
      selectedOptions: {
        ...state.selectedOptions,
        [`${poolTokenIndex}`]: tokenAddress,
      },
    })
  }

  function clearRemoveLiquidityState() {
    removeliquidityStateVar({
      type: 'PROPORTIONAL',
      proportionalPercent: 50,
      singleToken: null,
      selectedOptions: {},
      proportionalAmounts: null,
    })
  }

  const removeliquidityState = useReactiveVar(removeliquidityStateVar)

  const tokens = pool.allTokens.map(token => getToken(token.address, pool.chain))
  const validTokens = tokens.filter((token): token is GqlToken => !!token)

  // // When the amounts in change we should fetch the expected output.
  // useEffect(() => {
  //   queryRemoveLiquidity()
  // }, [amountsOut])

  // // TODO: Call underlying SDK query function
  // function queryRemoveLiquidity() {
  //   console.log('amountsOut', amountsOut)
  // }

  // // TODO: Call underlying SDK execution function
  // function executeRemoveLiquidity() {
  //   console.log('amountsOut', amountsOut)
  // }

  return {
    tokens,
    validTokens,
    selectedRemoveLiquidityType: removeliquidityState.type,
    singleToken: removeliquidityState.singleToken,
    proportionalPercent: removeliquidityState.proportionalPercent,
    selectedOptions: removeliquidityState.selectedOptions,
    proportionalAmounts: removeliquidityState.proportionalAmounts,
    setProportionalPercent,
    setProportional,
    setSingleToken,
    setSingleTokenAmount,
    setSelectedOption,
    clearRemoveLiquidityState,
    setProportionalAmounts,
    //executeRemoveLiquidity,
  }
}

export function RemoveLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useRemoveLiquidity()
  return <RemoveLiquidityContext.Provider value={hook}>{children}</RemoveLiquidityContext.Provider>
}

export const useRemoveLiquidity = (): UseRemoveLiquidityResponse =>
  useMandatoryContext(RemoveLiquidityContext, 'RemoveLiquidity')
