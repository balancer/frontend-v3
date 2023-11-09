'use client'

import {
  Box,
  BoxProps,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftAddon,
  InputProps,
  InputRightAddon,
  VStack,
  forwardRef,
} from '@chakra-ui/react'
import { ReactNode } from 'react'

export type Props = {
  rightSlot?: ReactNode
  leftSlot?: ReactNode
  headerSlot?: ReactNode
  footerSlot?: ReactNode
  boxProps?: BoxProps
  inputGroupProps?: InputGroupProps
}

export const BalInput = forwardRef(
  (
    {
      rightSlot,
      leftSlot,
      headerSlot,
      footerSlot,
      boxProps,
      inputGroupProps,
      ...inputProps
    }: InputProps & Props,
    ref
  ) => {
    return (
      <Box shadow="md" borderRadius="md" p="sm" ref={ref} {...boxProps}>
        <VStack align="start">
          {headerSlot && headerSlot}
          <InputGroup border="transparent" background="transparent" {...inputGroupProps}>
            {leftSlot && <InputLeftAddon bg="transparent">{leftSlot}</InputLeftAddon>}
            <Input
              border="transparent"
              bg="transparent"
              p="0"
              fontSize="lg"
              fontWeight="medium"
              _hover={{
                borderColor: 'transparent',
                boxShadow: 'none',
              }}
              _focus={{
                outline: 'none',
                borderColor: 'transparent',
                boxShadow: 'none',
              }}
              {...inputProps}
            />
            {rightSlot && (
              <InputRightAddon bg="transparent" p="0">
                {rightSlot}
              </InputRightAddon>
            )}
          </InputGroup>
          {footerSlot && footerSlot}
        </VStack>
      </Box>
    )
  }
)
