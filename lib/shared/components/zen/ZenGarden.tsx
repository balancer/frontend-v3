import { Box, BoxProps } from '@chakra-ui/react'
import { GqlPoolType } from '../../services/api/generated/graphql'
import { isClp, isStable, isWeighted } from '@/lib/modules/pool/pool.helpers'
type ZenGardenVariant = 'diamond' | 'circle' | 'square' | 'pill'

type Props = {
  sizePx: string
  heightPx?: string
  variant: ZenGardenVariant
} & BoxProps

const commonProps: BoxProps = {
  position: 'absolute',
  left: '0',
  right: '0',
  top: '50%',
  shadow: 'md',
  marginX: 'auto',
  transformOrigin: '50% 0',
}

function getZenGardenProps(variant: ZenGardenVariant, widthPx: string, heightPx: string) {
  switch (variant) {
    case 'circle':
      return {
        ...commonProps,
        rounded: 'full',
        height: heightPx,
        width: widthPx,
      }
    case 'pill':
      return {
        ...commonProps,
        rounded: 'full',
        height: heightPx,
        width: widthPx,
      }
    case 'square':
      return {
        ...commonProps,
        height: heightPx,
        width: widthPx,
      }
    case 'diamond':
      return {
        ...commonProps,
        height: heightPx,
        width: widthPx,
      }
    default:
      return {
        ...commonProps,
        rounded: 'full',
        height: heightPx,
        width: widthPx,
      }
  }
}

function getShapeTransform(variant: ZenGardenVariant, i: number) {
  if (variant === 'diamond') {
    return `scale(1.${i}) rotate(45deg) translateY(-50%)`
  }
  return `scale(1.${i}) translateY(-50%)`
}

export function ZenGarden({ sizePx, heightPx, variant, transform, ...rest }: Props) {
  const shapeProps = getZenGardenProps(variant, sizePx, heightPx || sizePx)

  return [...Array(8).keys()].map((_, i) => (
    <Box
      key={`zen-garden-${variant}-${i}`}
      {...shapeProps}
      {...rest}
      transform={`${getShapeTransform(variant, i)} ${transform || ''}`}
    />
  ))
}

export function PoolZenGarden({ poolType, sizePx }: { poolType?: GqlPoolType; sizePx: string }) {
  if (!poolType) {
    return <ZenGarden variant="circle" sizePx={sizePx} />
  }
  if (isWeighted(poolType)) {
    return <ZenGarden variant="circle" sizePx={sizePx} />
  }
  if (isStable(poolType)) {
    return <ZenGarden variant="square" sizePx={sizePx} />
  }
  if (isClp(poolType)) {
    return <ZenGarden variant="diamond" sizePx={sizePx} />
  }
}
