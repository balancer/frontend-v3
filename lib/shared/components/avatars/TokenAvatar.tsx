import { Avatar, AvatarProps, Circle } from '@chakra-ui/react'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { AddressZero } from '@ethersproject/constants'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

interface Props extends AvatarProps {
  address: string | null
  logoURI?: string
  chain: GqlChain
}

function TokenAvatar({ address, chain, size, logoURI, ...rest }: Props) {
  const { getToken } = useTokens()
  const token = address ? getToken(address, chain) : null

  return (
    <Avatar
      {...rest}
      size={size}
      src={logoURI || token?.logoURI || undefined}
      bg="transparent"
      icon={
        token?.logoURI ? (
          <Circle size="32px" backgroundColor="whiteAlpha.200" />
        ) : (
          <Jazzicon
            seed={jsNumberForAddress(address || AddressZero)}
            paperStyles={{ width: '100%', height: '100%' }}
          />
        )
      }
    />
  )
}

export default TokenAvatar
