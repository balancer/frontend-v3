import { Box, Icon, IconProps } from '@chakra-ui/react'

type Props = {
  sizePx: string
  as: any
}
export function ElevatedIcon({ sizePx, ...rest }: Props & IconProps) {
  return (
    <Box
      rounded="full"
      width={sizePx}
      height={sizePx}
      background="elevation.level2"
      shadow="2xl"
      display="flex"
      justifyContent="center"
      alignItems="center"
      color="font.secondary"
    >
      <Icon {...rest} />
    </Box>
  )
}
