'use client'

import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Box, HStack, Tooltip } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

type AlertTitleProps = {
  title: string
  tooltipLabel?: string
}
export function BalAlertTitle({
  tooltipLabel,
  children,
  title,
}: PropsWithChildren<AlertTitleProps>) {
  return (
    <HStack w="full">
      <HStack w="full">
        <Box>{title}</Box>
        {tooltipLabel && (
          <Tooltip label={tooltipLabel}>
            <InfoOutlineIcon fontSize="sm" />
          </Tooltip>
        )}
      </HStack>
      {children}
    </HStack>
  )
}
