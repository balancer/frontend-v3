'use client'

import {
  Box,
  BoxProps,
  HStack,
  forwardRef,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputProps,
  NumberInputField,
} from '@chakra-ui/react'
import { blockInvalidNumberInput } from '@/lib/shared/utils/numbers'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'

type Props = {
  value?: string
  boxProps?: BoxProps
  setValue?: any
  isNumberInputDisabled?: boolean
}

export const InputWithSlider = forwardRef(
  (
    {
      value,
      boxProps,
      setValue,
      children,
      isNumberInputDisabled,
      ...numberInputProps
    }: NumberInputProps & Props,
    ref
  ) => {
    const { formatCurrency, parseCurrency } = useCurrency()

    function handleChange(value: string | number) {
      if (typeof value === 'string') {
        setValue(parseCurrency(value))
      } else {
        setValue(value)
      }
    }

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
            <NumberInput
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
              value={formatCurrency(value)}
              onKeyDown={blockInvalidNumberInput}
              onChange={handleChange}
              w="50%"
              isDisabled={isNumberInputDisabled}
              {...numberInputProps}
            >
              <NumberInputField
                pl="0"
                _focusVisible={{
                  borderColor: 'transparent',
                  boxShadow: 'none',
                }}
                _hover={{
                  borderColor: 'transparent',
                  boxShadow: 'none',
                }}
              />
            </NumberInput>
            <Box w="50%" pr="sm" alignSelf="center">
              <Slider
                aria-label="slider"
                defaultValue={100}
                onChange={handleChange}
                value={parseFloat(value || '')}
                focusThumbOnChange={false} // this is so the NumberInput won't lose focus after input
              >
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
