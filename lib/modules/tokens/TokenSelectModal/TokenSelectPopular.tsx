/* eslint-disable react-hooks/exhaustive-deps */
import { getNetworkConfig } from '@/lib/config/app.config'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { HStack, Tag, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { useTokens } from '../useTokens'
import { useMemo } from 'react'
import { TokenIcon } from '../TokenIcon'

type Props = {
  chain: GqlChain
  excludeNativeAsset?: boolean
  onTokenSelect: (token: GqlToken) => void
}

export function TokenSelectPopular({ chain, excludeNativeAsset, onTokenSelect }: Props) {
  const {
    tokens: { popularTokens },
  } = getNetworkConfig(chain)
  const { getToken, nativeAssetFilter } = useTokens()

  const tokens = useMemo(() => {
    const tokens = popularTokens?.map(token => getToken(token, chain)).filter(Boolean) as GqlToken[]
    return excludeNativeAsset ? tokens.filter(nativeAssetFilter) : tokens
  }, [popularTokens, excludeNativeAsset, chain])

  return (
    <Wrap>
      {tokens?.map(token => (
        <WrapItem key={token.address}>
          <Tag
            key={token.address}
            onClick={() => onTokenSelect(token)}
            size="lg"
            pl="xs"
            cursor="pointer"
          >
            <HStack>
              <TokenIcon address={token.address} chain={chain} size={22} alt={token.symbol} />
              <Text>{token.symbol}</Text>
            </HStack>
          </Tag>
        </WrapItem>
      ))}
    </Wrap>
  )
}
