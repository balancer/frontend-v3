'use client'

import {
  Box,
  VStack,
  useToast,
  ToastProps,
  IconButton,
  BoxProps,
  CircularProgress,
  HStack,
  CircularProgressLabel,
  Text,
} from '@chakra-ui/react'
import { Check, X } from 'react-feather'

export function Toast({ id, status, isClosable, title, description }: ToastProps) {
  const toast = useToast()
  const containerStyles: BoxProps = {
    background: 'background.level3',
    border: 'none',
    rounded: 'md',
    shadow: 'xl',
    zIndex: '1000',
  }

  const statusOverlayStyles: BoxProps = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    w: 'full',
    h: 'full',
    background:
      status === 'loading'
        ? 'orange.300'
        : status === 'success'
        ? 'green.300'
        : status === 'error'
        ? 'red.300'
        : 'transparent',
    opacity: 0.2,
    rounded: 'md',
    zIndex: 1001,
  }

  const contentStyles: BoxProps = {
    w: 'full',
    h: 'full',
    position: 'relative',
    padding: 'md',
    zIndex: 1002,
  }

  function closeToast() {
    if (id) toast.close(id)
  }

  return (
    <Box position="relative" {...containerStyles}>
      <Box {...statusOverlayStyles} />
      <Box {...contentStyles}>
        {isClosable && (
          <IconButton
            onClick={closeToast}
            position="absolute"
            size="xs"
            top="xs"
            right="xs"
            aria-label="Close toast"
            icon={<X size={16} />}
          />
        )}
        <HStack align="start">
          {status === 'loading' && (
            <CircularProgress
              isIndeterminate
              color="orange.300"
              trackColor="border.base"
              size={5}
              mt="1"
            />
          )}
          {status === 'success' && (
            <CircularProgress
              value={100}
              trackColor="border.base"
              size={5}
              color="font.highlight"
              mt="1"
            >
              <CircularProgressLabel fontSize="md" color="font.highlight" pl={1}>
                <Check size={12} strokeWidth={4} />
              </CircularProgressLabel>
            </CircularProgress>
          )}
          {status === 'error' && (
            <CircularProgress value={100} trackColor="border.base" size={5} color="red.500" mt="1">
              <CircularProgressLabel>
                <Text fontWeight="bold" color="red.500" fontSize="xs">
                  !
                </Text>
              </CircularProgressLabel>
            </CircularProgress>
          )}
          <VStack align="start">
            <Box color="font.primary" fontWeight="bold" fontSize="lg">
              {title}
            </Box>
            {description && <Box color="grayText">{description}</Box>}
          </VStack>
        </HStack>
      </Box>
    </Box>
  )
}
