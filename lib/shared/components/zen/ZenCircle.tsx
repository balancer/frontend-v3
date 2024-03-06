import { Box, BoxProps } from '@chakra-ui/react'
type Props = {
  sizePx: string
}

export function ZenCircle({ sizePx }: Props) {
  const commonProps: BoxProps = {
    position: 'absolute',
    left: '0',
    right: '0',
    marginX: 'auto',
    rounded: 'full',
    height: sizePx,
    width: sizePx,
    shadow: 'md',
  }

  return [...Array(8).keys()].map((_, i) => (
    <Box key={`zen-square-${i}`} {...commonProps} transform={`scale(1.${i})`} />
  ))
}
