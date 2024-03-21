import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useTokens } from '../../useTokens'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { orderBy } from 'lodash'
import { useTokenBalances } from '../../useTokenBalances'

export function useTokenSelectList(
  tokens: GqlToken[],
  excludeNativeAsset: boolean,
  pinNativeAsset: boolean,
  searchTerm?: string
) {
  const { usdValueForToken, exclNativeAssetFilter, nativeAssetFilter } = useTokens()
  const { balanceFor } = useTokenBalances()

  const symbolMatch = (token: GqlToken, searchTerm: string) =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())

  const nameMatch = (token: GqlToken, searchTerm: string) =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())

  const getFilteredTokens = () => {
    let filteredTokens = tokens

    if (excludeNativeAsset) {
      filteredTokens = filteredTokens.filter(exclNativeAssetFilter)
    }

    if (searchTerm) {
      filteredTokens = filteredTokens.filter(token => {
        return (
          isSameAddress(token.address, searchTerm) ||
          symbolMatch(token, searchTerm) ||
          nameMatch(token, searchTerm)
        )
      })
    }

    return filteredTokens
  }

  let orderedTokens = orderBy(
    getFilteredTokens(),
    [
      token => {
        const userBalance = balanceFor(token)
        return userBalance ? Number(usdValueForToken(token, userBalance?.formatted || 0)) : 0
      },
    ],
    ['desc', 'desc']
  )

  if (pinNativeAsset) {
    const nativeAsset = orderedTokens.find(nativeAssetFilter)

    if (nativeAsset) {
      orderedTokens = [nativeAsset, ...orderedTokens.filter(exclNativeAssetFilter)]
    }
  }

  return {
    orderedTokens,
  }
}
