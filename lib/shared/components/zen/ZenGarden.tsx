import { Box, BoxProps } from '@chakra-ui/react'
import { GqlPoolType } from '../../services/api/generated/graphql'
import { isClp, isStable, isWeighted } from '@/lib/modules/pool/pool.helpers'
type ZenGardenVariant = 'diamond' | 'circle' | 'square' | 'pill'

type Props = {
  sizePx: string
  heightPx?: string
  variant: ZenGardenVariant
  subdued?: boolean
} & BoxProps

const commonProps = (subdued = false) =>
  ({
    position: 'absolute',
    left: '0',
    right: '0',
    top: '50%',
    shadow: subdued ? 'none' : 'zen',
    marginX: 'auto',
    borderWidth: 1,
    transformOrigin: '50% 0',
    borderColor: subdued ? 'border.subduedZen' : 'border.zen',
  } as BoxProps)

function getZenGardenProps(
  variant: ZenGardenVariant,
  widthPx: string,
  heightPx: string,
  subdued = false
) {
  switch (variant) {
    case 'circle':
      return {
        ...commonProps(subdued),
        rounded: 'full',
        height: heightPx,
        width: widthPx,
      }
    case 'pill':
      return {
        ...commonProps(subdued),
        rounded: 'full',
        height: heightPx,
        width: widthPx,
      }
    case 'square':
      return {
        ...commonProps(subdued),
        height: heightPx,
        width: widthPx,
      }
    case 'diamond':
      return {
        ...commonProps(subdued),
        height: heightPx,
        width: widthPx,
      }
    default:
      return {
        ...commonProps(subdued),
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

export function ZenGarden({
  sizePx,
  heightPx,
  variant,
  transform,
  subdued = false,
  ...rest
}: Props) {
  const shapeProps = getZenGardenProps(variant, sizePx, heightPx || sizePx, subdued)

  return [...Array(8).keys()].map((_, i) => (
    <Box
      zIndex={0}
      key={`zen-garden-${variant}-${i}`}
      {...shapeProps}
      {...rest}
      transform={`${getShapeTransform(variant, i)} ${transform || ''}`}
    />
  ))
}

export function PoolZenGarden({
  poolType,
  sizePx,
  subdued = false,
}: {
  poolType?: GqlPoolType
  sizePx: string
  subdued?: boolean
}) {
  if (!poolType) {
    return <ZenGarden subdued={subdued} variant="circle" sizePx={sizePx} zIndex={-1} />
  }
  if (isWeighted(poolType)) {
    return <ZenGarden subdued={subdued} variant="circle" sizePx={sizePx} zIndex={-1} />
  }
  if (isStable(poolType)) {
    return <ZenGarden subdued={subdued} variant="square" sizePx={sizePx} zIndex={-1} />
  }
  if (isClp(poolType)) {
    return <ZenGarden subdued={subdued} variant="diamond" sizePx={sizePx} zIndex={-1} />
  }
}
