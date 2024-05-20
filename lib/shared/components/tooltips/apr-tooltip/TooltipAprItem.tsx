import { fNum } from '@/lib/shared/utils/numbers'
import { BoxProps, TextProps, Box, HStack, Text, Tooltip } from '@chakra-ui/react'

const tooltipTextDecorationStyles: TextProps = {
  textDecoration: 'underline',
  textDecorationStyle: 'dotted',
  textUnderlineOffset: '4px',
  textDecorationColor: 'font.secondaryAlpha50',
}

interface PopoverAprItemProps extends BoxProps {
  fontWeight?: number
  fontColor?: string

  title: string
  apr: number
  aprOpacity?: number

  boxBackground?: string
  textBackground?: string
  textBackgroundClip?: string
  tooltipText?: string
  textVariant?: string
  children?: React.ReactNode
}

export function TooltipAprItem({
  title,
  apr,
  aprOpacity,
  boxBackground,
  textBackground,
  textBackgroundClip,
  children,
  fontWeight,
  fontColor,
  textVariant,
  tooltipText,
  ...props
}: PopoverAprItemProps) {
  return (
    <Box fontSize="sm" background={boxBackground} {...props}>
      <HStack justifyContent="space-between">
        <Text
          fontWeight={fontWeight}
          fontSize="sm"
          color={fontColor}
          variant={textVariant}
          background={textBackground}
          backgroundClip={textBackgroundClip}
        >
          {title}
        </Text>
        <Tooltip label={tooltipText} fontSize="sm">
          <Text
            fontWeight={fontWeight}
            fontSize="sm"
            opacity={aprOpacity}
            color={fontColor}
            variant={textVariant}
            {...(tooltipText ? tooltipTextDecorationStyles : {})}
          >
            {fNum('apr', apr.toString())}
          </Text>
        </Tooltip>
      </HStack>
      {children}
    </Box>
  )
}
