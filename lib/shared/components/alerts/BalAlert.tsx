import { Alert, AlertIcon, AlertStatus, AlertTitle, CloseButton, Link } from '@chakra-ui/react'
import { MouseEventHandler, ReactNode, useCallback } from 'react'
import { AlertTriangle, ArrowRight, Check, Info, Loader, XOctagon } from 'react-feather'

export type BalAlertProps = {
  title: ReactNode | string
  learnMoreLink?: string
  status: AlertStatus
  isSoftWarning?: boolean
  onClose?: MouseEventHandler
}

export function BalAlert({
  title,
  status,
  learnMoreLink,
  isSoftWarning = false,
  onClose,
}: BalAlertProps) {
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
      <AlertIcon as={getAlertIcon(status)} />

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

function getAlertIcon(status: AlertStatus) {
  switch (status) {
    case 'info':
      return Info
    case 'warning':
      return AlertTriangle
    case 'success':
      return Check
    case 'error':
      return XOctagon
    case 'loading':
      return Loader
    default:
      return Info
  }
}
