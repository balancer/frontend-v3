import { Box, BoxProps } from '@chakra-ui/react'
type Props = {
  widthPx: string
  heightPx: string
}

export function ZenDiamond({ widthPx, heightPx }: Props) {
  const commonProps: BoxProps = {
    position: 'absolute',
    left: '0',
    right: '0',
    marginX: 'auto',
    height: widthPx,
    width: heightPx,
    shadow: 'md',
  }

  return [...Array(8).keys()].map((_, i) => (
    <Box key={`zen-square-${i}`} {...commonProps} transform={`scale(1.${i}) rotate(45deg)`} />
  ))
}
