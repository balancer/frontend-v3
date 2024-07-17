import { Alert, AlertIcon, AlertStatus, AlertTitle, CloseButton } from '@chakra-ui/react'
import { MouseEventHandler, ReactNode } from 'react'
import { AlertTriangle, Check, Info, Loader, XOctagon } from 'react-feather'
import { BalAlertButtonLink } from './BalAlertButtonLink'

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
  return (
    <Alert status={status}>
      <AlertIcon as={getAlertIcon(status)} />

      <AlertTitle gap={1} display="flex" w="full">
        {title}
      </AlertTitle>
      {learnMoreLink && <BalAlertButtonLink href={learnMoreLink}>Learn more</BalAlertButtonLink>}
      {isSoftWarning && (
        <CloseButton
          onClick={onClose}
          variant="softWarning"
          color="font.dark"
          ml="auto"
          size="sm"
          aria-label="Close"
          _hover={{
            transform: 'scale(1.2)',
          }}
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
