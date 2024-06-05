import { Box, Image } from '@chakra-ui/react'
import { useParams } from 'next/navigation'
import { PoolVariant } from '@/lib/modules/pool/pool.types'

type Placement = 'header' | 'footer'

export function PoolBanner({ placement }: { placement: Placement }) {
  const { variant } = useParams<{ variant?: PoolVariant }>()
  const imageName = `${variant}-${placement}`
  const imagePath = `/images/partners/${imageName}.svg`

  function hasBanner(variant: PoolVariant) {
    switch (variant) {
      case PoolVariant.cow:
        return true
      case PoolVariant.gyro:
      case PoolVariant.v2:
      case PoolVariant.v3:
      default:
        return false
    }
  }

  return variant && hasBanner(variant) ? (
    <Box w="full">
      <Image src={imagePath} alt={imageName} />
    </Box>
  ) : null
}
