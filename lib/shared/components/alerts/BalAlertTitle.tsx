'use client'

import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Box, HStack, Tooltip } from '@chakra-ui/react'
import { PropsWithChildren, ReactNode } from 'react'

type AlertTitleProps = {
  title: string
  description?: ReactNode | string
  tooltipLabel?: string
}
export function BalAlertTitle({
  tooltipLabel,
  children,
  title,
  description,
}: PropsWithChildren<AlertTitleProps>) {
  return (
    <HStack w="full" flexWrap="wrap" justifyContent="space-between">
      <HStack maxWidth="80%" flexWrap="wrap">
        <HStack>
          <Box>{title}</Box>
          {description && <Box fontWeight="normal">{description}</Box>}
        </HStack>
        {tooltipLabel && (
          <Box>
            <Tooltip label={tooltipLabel}>
              <InfoOutlineIcon fontSize="sm" color="gray" />
            </Tooltip>
          </Box>
        )}
      </HStack>
      <Box>{children}</Box>
    </HStack>
  )
}
