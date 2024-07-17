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
    <HStack w="full">
      <HStack w="full">
        <Box>{title}</Box>
        {description && <Box fontWeight="normal">{description}</Box>}
        {tooltipLabel && (
          <Box>
            <Tooltip label={tooltipLabel}>
              <InfoOutlineIcon fontSize="sm" color="gray" />
            </Tooltip>
          </Box>
        )}
      </HStack>
      {children}
    </HStack>
  )
}
