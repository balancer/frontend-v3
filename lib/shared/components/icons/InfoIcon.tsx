import { Box, BoxProps, forwardRef } from '@chakra-ui/react'
import { Info } from 'react-feather'

export const InfoIcon = forwardRef(({ ...props }: BoxProps) => {
  return (
    <Box color="grayText" {...props}>
      <Info size={16} />
    </Box>
  )
})
