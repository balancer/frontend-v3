'use client'

import {
  Box,
  BoxProps,
  HStack,
  Input,
  InputProps,
  forwardRef,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react'
import { blockInvalidNumberInput } from '@/lib/shared/utils/numbers'

type Props = {
  value?: string
  boxProps?: BoxProps
  setValue?: any
}

export const InputWithSlider = forwardRef(
  ({ value, boxProps, setValue, children, ...inputProps }: InputProps & Props, ref) => {
    return (
      <>
        {children && (
          <HStack w="full" justifyContent="space-between">
            {children}
          </HStack>
        )}
        <Box
          borderRadius="md"
          py="sm"
          px="md"
          shadow="innerBase"
          bg="background.card.level1"
          border="white"
          w="full"
          ref={ref}
          {...boxProps}
        >
          <HStack align="start" spacing="md">
            <Input
              type="number"
              placeholder="0.00"
              autoComplete="off"
              autoCorrect="off"
              min={0}
              border="transparent"
              bg="transparent"
              shadow="none"
              p="0"
              fontSize="xl"
              fontWeight="medium"
              value={value}
              title={String(value)}
              onKeyDown={blockInvalidNumberInput}
              _hover={{
                borderColor: 'transparent',
                boxShadow: 'none',
              }}
              _focus={{
                outline: 'none',
                borderColor: 'transparent',
                boxShadow: 'none',
              }}
              w="50%"
              {...inputProps}
            />
            <Box w="50%" pr="sm" alignSelf="center">
              <Slider aria-label="slider" defaultValue={100} onChange={setValue}>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
          </HStack>
        </Box>
      </>
    )
  }
)
