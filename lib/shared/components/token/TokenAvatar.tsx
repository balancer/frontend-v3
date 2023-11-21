import { useTokens } from '@/lib/modules/tokens/useTokens'
import { Avatar, AvatarProps, Circle } from '@chakra-ui/react'
import { GqlChain } from '../../services/api/generated/graphql'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { zeroAddress } from 'viem'

interface Props extends AvatarProps {
  address?: string | null
  logoURI?: string
  chain: GqlChain
}

function TokenAvatar({ address, size, logoURI, chain, ...rest }: Props) {
  const { getToken } = useTokens()
  const token = address ? getToken(address, chain) : null

  return (
    <Avatar
      {...rest}
      size={size}
      src={logoURI || token?.logoURI || undefined}
      bg={'transparent'}
      icon={
        token?.logoURI ? (
          <Circle size="32px" backgroundColor="whiteAlpha.200" />
        ) : (
          <Jazzicon
            seed={jsNumberForAddress(address || zeroAddress)}
            paperStyles={{ width: '100%', height: '100%' }}
          />
        )
      }
    />
  )
}

export default TokenAvatar
