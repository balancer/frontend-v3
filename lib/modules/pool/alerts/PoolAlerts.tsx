'use client'

import {
  Alert,
  AlertIcon,
  AlertStatus,
  AlertTitle,
  CloseButton,
  Link,
  VStack,
} from '@chakra-ui/react'
import { usePool } from '../PoolProvider'
import { MouseEvent, ReactNode, useCallback } from 'react'
import { ArrowRight } from 'react-feather'
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
    <VStack width="full">
      {poolAlerts.map(alert => (
        <PoolAlert
          key={alert.identifier}
          onClose={e => {
            e.preventDefault()
            setPoolAlerts(poolAlerts.filter(a => a.identifier !== alert.identifier))
          }}
          {...alert}
        />
      ))}
    </VStack>
  )
}

export function PoolAlert({
  title,
  learnMoreLink,
  status,
  isSoftWarning,
  onClose,
}: PoolAlertProps) {
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
    <Alert status={status}>
      <AlertIcon />
      <AlertTitle gap={1} display="flex" w="full">
        {title}
        {learnMoreLink && (
          <Link
            display="flex"
            sx={{ textDecoration: 'underline' }}
            _groupHover={{ color: 'font.maxContrast' }}
          >
            Learn more
            <ArrowRight width="16px" />
          </Link>
        )}
      </AlertTitle>
      {isSoftWarning && (
        <CloseButton
          onClick={onClose}
          variant="softWarning"
          ml="auto"
          size="sm"
          aria-label="Close"
        />
      )}
    </Alert>
  )
}
