import { Circle, SquareProps } from '@chakra-ui/react'
import { GqlChain } from '../../services/api/generated/graphql'
import { getNetworkConfig } from '@/lib/config/app.config'
import Image from 'next/image'

export function NetworkIcon({ chain, size = 12, ...rest }: { chain: GqlChain } & SquareProps) {
  const { iconPath, shortName } = getNetworkConfig(chain)

  const imageSize = Number(size) * 2 + 8

  return (
    <Circle bg="background.level2" size={size} {...rest}>
      <Image src={iconPath} width={imageSize} height={imageSize} alt={shortName} />
    </Circle>
  )
}
