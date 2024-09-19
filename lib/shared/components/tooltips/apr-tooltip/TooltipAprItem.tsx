import {
  BoxProps,
  Box,
  HStack,
  Text,
  Portal,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@chakra-ui/react'
import BigNumber from 'bignumber.js'

interface PopoverAprItemProps extends BoxProps {
  fontWeight?: number
  fontColor?: string

  title: string
  apr: BigNumber
  aprOpacity?: number
  displayValueFormatter: (value: BigNumber) => string

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
  aprOpacity = 1,
  displayValueFormatter,
  boxBackground,
  bg = 'background.level3',
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
    <Box fontSize="sm" background={boxBackground} bg={bg} {...props}>
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
        {tooltipText ? (
          <Popover trigger="hover">
            <PopoverTrigger>
              <Text
                fontWeight={fontWeight}
                fontSize="sm"
                opacity={aprOpacity}
                color={fontColor}
                variant={textVariant}
                className="tooltip-dashed-underline"
              >
                {displayValueFormatter(apr)}
              </Text>
            </PopoverTrigger>
            <Portal>
              <Box zIndex={100} position="relative">
                <PopoverContent p="sm" w="auto" maxW="300px">
                  <Text fontSize="sm" variant="secondary">
                    {tooltipText}
                  </Text>
                </PopoverContent>
              </Box>
            </Portal>
          </Popover>
        ) : (
          <Text
            fontWeight={fontWeight}
            fontSize="sm"
            opacity={aprOpacity}
            color={fontColor}
            variant={textVariant}
          >
            {displayValueFormatter(apr)}
          </Text>
        )}
      </HStack>
      {children}
    </Box>
  )
}
