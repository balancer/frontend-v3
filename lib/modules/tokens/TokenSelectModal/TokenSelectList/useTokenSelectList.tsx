import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useTokens } from '../../useTokens'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { orderBy } from 'lodash'
import { useTokenBalances } from '../../useTokenBalances'
import { exclNativeAssetFilter, nativeAssetFilter } from '@/lib/config/tokens.config'

export function useTokenSelectList(
  chain: GqlChain,
  tokens: GqlToken[],
  excludeNativeAsset: boolean,
  pinNativeAsset: boolean,
  searchTerm?: string
) {
  const { usdValueForToken } = useTokens()
  const { balanceFor } = useTokenBalances()

  const symbolMatch = (token: GqlToken, searchTerm: string) =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())

  const nameMatch = (token: GqlToken, searchTerm: string) =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())

  const getFilteredTokens = () => {
    let filteredTokens = tokens

    if (excludeNativeAsset) {
      filteredTokens = filteredTokens.filter(exclNativeAssetFilter(chain))
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
    const nativeAsset = orderedTokens.find(nativeAssetFilter(chain))

    if (nativeAsset) {
      orderedTokens = [nativeAsset, ...orderedTokens.filter(exclNativeAssetFilter(chain))]
    }
  }

  return {
    orderedTokens,
  }
}
