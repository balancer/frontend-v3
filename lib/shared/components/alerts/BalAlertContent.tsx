'use client'

import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Box, HStack, Tooltip } from '@chakra-ui/react'
import { PropsWithChildren, ReactNode } from 'react'

type AlertContentProps = {
  title?: string
  description?: ReactNode | string
  tooltipLabel?: string
}

// Utility component to display a title, description, optional tooltip and other nested components (buttons, links...) within an alert
export function BalAlertContent({
  title,
  description,
  tooltipLabel,
  children,
}: PropsWithChildren<AlertContentProps>) {
  return (
    <HStack w="full" flexWrap="wrap" justifyContent="space-between">
      <HStack maxWidth="80%" flexWrap="wrap">
        <HStack>
          {title && <Box>{title}</Box>}
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
