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
    transform: 'rotate(45deg)',
  }
  return (
    <>
      <Box {...commonProps} />
      <Box {...commonProps} transform="scale(1.1) rotate(45deg)" />
      <Box {...commonProps} transform="scale(1.2) rotate(45deg)" />
      <Box {...commonProps} transform="scale(1.3) rotate(45deg)" />
      <Box {...commonProps} transform="scale(1.4) rotate(45deg)" />
      <Box {...commonProps} transform="scale(1.5) rotate(45deg)" />
    </>
  )
}
