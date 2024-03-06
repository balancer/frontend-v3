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
  return (
    <>
      <Box {...commonProps} />
      <Box {...commonProps} transform="scale(1.1)" />
      <Box {...commonProps} transform="scale(1.2)" />
      <Box {...commonProps} transform="scale(1.3)" />
      <Box {...commonProps} transform="scale(1.4)" />
      <Box {...commonProps} transform="scale(1.5)" />
    </>
  )
}
