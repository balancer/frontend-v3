import { Box, BoxProps, Card, CardProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

type NoisyCardProps = {
  cardProps?: CardProps
  contentProps?: BoxProps
  children: ReactNode | ReactNode[]
}
export function NoisyCard({ children, cardProps = {}, contentProps = {} }: NoisyCardProps) {
  return (
    <Card
      backgroundImage={`url('/images/background-noise.png')`}
      height="full"
      width="full"
      rounded="sm"
      borderTopRightRadius="none"
      borderBottomRightRadius="none"
      position="relative"
      {...cardProps}
    >
      <Box position="absolute" width="full" height="full" content="" shadow="innerXl" />
      <Box
        width="full"
        height="full"
        backgroundColor="background.elevationN1WithOpacity"
        {...contentProps}
      >
        {children}
      </Box>
    </Card>
  )
}
