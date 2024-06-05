'use client'

import { Alert, AlertStatus, AlertTitle, Box, IconButton, Link, Stack } from '@chakra-ui/react'
import { usePool } from '../PoolProvider'
import { PoolAlert, getNetworkPoolAlerts, getTokenPoolAlerts } from './pool-issues/PoolIssue.rules'
import { WarningIcon } from '@/lib/shared/components/icons/WarningIcon'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { ArrowForwardIcon, CloseIcon } from '@chakra-ui/icons'
import { MouseEvent, useCallback, useEffect, useState } from 'react'

export type PoolAlertProps = {
  title: JSX.Element | string
  learnMoreLink?: string
  status: AlertStatus
  isSoftWarning: boolean
  onClose?: (event: MouseEvent) => void
}

export function PoolAlerts() {
  const { pool } = usePool()
  const [poolAlerts, setPoolAlerts] = useState<PoolAlert[]>([])

  useEffect(() => {
    const networkPoolAlerts = getNetworkPoolAlerts(pool)
    const tokenPoolAlerts = getTokenPoolAlerts(pool)

    setPoolAlerts([...networkPoolAlerts, ...tokenPoolAlerts])
  }, [])

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
        ></PoolAlertDisplay>
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
    (children: JSX.Element) => {
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
      bg={colorMode === 'dark' ? 'orange.300' : 'orange.200'}
      status={status}
      rounded="lg"
      border="none !important"
      alignItems="center"
      role="group"
    >
      <Box flex="0 0 auto">
        <WarningIcon width="24px" height="24px" />
      </Box>
      <AlertTitle
        ml={3}
        sx={{ a: { textDecoration: 'underline' } }}
        fontWeight={500}
        color="font.dark"
        mr={isSoftWarning ? 7 : 'none'}
      >
        {title}

        {learnMoreLink && (
          <>
            {' '}
            <Link
              color="font.dark"
              sx={{ textDecoration: 'underline' }}
              _groupHover={{ color: 'font.maxContrast' }}
            >
              Learn more
              <ArrowForwardIcon />
            </Link>
          </>
        )}
      </AlertTitle>
      {isSoftWarning && (
        <IconButton
          onClick={onClose}
          position="absolute"
          right="12px"
          top="14px"
          width="24px !important"
          height="24px !important"
          minWidth={0}
          padding={0}
          icon={<CloseIcon width="10px" height="10px" />}
          aria-label="Close button"
          bg="white"
          color="black"
          borderRadius="full"
          _hover={{ bg: 'gray.200' }}
        />
      )}
    </Alert>
  )
}
