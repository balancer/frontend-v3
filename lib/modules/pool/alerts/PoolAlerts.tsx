'use client'

import {
  Alert,
  AlertStatus,
  AlertTitle,
  Box,
  HStack,
  IconButton,
  Link,
  Stack,
} from '@chakra-ui/react'
import { usePool } from '../PoolProvider'

import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'

import { MouseEvent, ReactNode, useCallback } from 'react'
import { AlertTriangle, ArrowRight, XCircle } from 'react-feather'
import { usePoolAlerts } from './usePoolAlerts'

export type PoolAlertProps = {
  title: ReactNode | string
  learnMoreLink?: string
  status: AlertStatus
  isSoftWarning: boolean
  onClose?: (event: MouseEvent) => void
}

export function PoolAlerts() {
  const { pool } = usePool()
  const { poolAlerts, setPoolAlerts } = usePoolAlerts(pool)
  if (poolAlerts.length === 0) return null

  return (
    <Stack width="100%">
      {poolAlerts.map(alert => (
        <PoolAlertDisplay
          key={alert.identifier}
          onClose={e => {
            e.preventDefault()
            setPoolAlerts(poolAlerts.filter(a => a.identifier !== alert.identifier))
          }}
          {...alert}
        />
      ))}
    </Stack>
  )
}

export function PoolAlertDisplay({
  title,
  learnMoreLink,
  status,
  isSoftWarning,
  onClose,
}: PoolAlertProps) {
  const colorMode = useThemeColorMode()

  const tryWrapInLink = useCallback(
    (children: ReactNode) => {
      if (!learnMoreLink) return children

      return (
        <Link
          width="100%"
          display="block"
          href={learnMoreLink}
          target="blank"
          sx={{ textDecoration: 'none !important' }}
        >
          {children}
        </Link>
      )
    },
    [learnMoreLink]
  )

  return tryWrapInLink(
    <Alert
      display="flex"
      justifyContent="space-between"
      bg={colorMode === 'dark' ? 'orange.300' : 'orange.200'}
      status={status}
      rounded="lg"
      border="none !important"
      alignItems="center"
      role="group"
    >
      <HStack>
        <Box flex="0 0 auto">
          <AlertTriangle width="24px" height="24px" />
        </Box>
        <AlertTitle
          gap={1}
          display="flex"
          alignItems="center"
          ml="md"
          sx={{ a: { textDecoration: 'underline' } }}
          fontWeight={500}
          color="font.dark"
          mr={isSoftWarning ? 7 : 'none'}
        >
          {title}

          {learnMoreLink && (
            <>
              <Link
                display="flex"
                color="font.dark"
                sx={{ textDecoration: 'underline' }}
                _groupHover={{ color: 'font.maxContrast' }}
              >
                Learn more
                <ArrowRight width="16px" />
              </Link>
            </>
          )}
        </AlertTitle>
      </HStack>

      {isSoftWarning && (
        <IconButton
          variant="ghost"
          icon={<XCircle />}
          onClick={onClose}
          width="24x"
          aria-label="Close"
        />
      )}
    </Alert>
  )
}
