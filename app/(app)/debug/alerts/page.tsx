'use client'

import { BalAlert } from '@/lib/shared/components/alerts/BalAlert'
import { BalAlertButton } from '@/lib/shared/components/alerts/BalAlertButton'
import { BalAlertContent } from '@/lib/shared/components/alerts/BalAlertContent'
import { useGlobalAlerts } from '@/lib/shared/components/alerts/GlobalAlertsProvider'
import { GenericError } from '@/lib/shared/components/errors/GenericError'
import { Button, Text, VStack } from '@chakra-ui/react'
import { ErrorBoundary } from '@/lib/shared/components/errors/ErrorBoundary'
import { useEffect, useState } from 'react'

const exceptionName = 'Error fetching swap'
const exceptionMessage = `Execution reverted for an unknown reason. Raw Call Arguments:
to:0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5
Docs: https://viem.sh/docs/contract/simulateContract Details: execution reverted Version:
viem@2.16.3`

class TestError extends Error {
  constructor(name: string, message: string) {
    super(message)
    this.name = name
  }
}

export default function Page() {
  const { addAlert } = useGlobalAlerts()
  return (
    <VStack width="full">
      <BalAlert content={<TitleWithButton title="Info alert" />} status="info" />
      <BalAlert content={<TitleWithButton title="Warning alert" />} status="warning" />
      <BalAlert content={<TitleWithButton title="Error alert" />} status="error" />
      <BalAlert content={<TitleWithButton title="Success alert" />} status="success" />
      <BalAlert
        content="Warning alert with close button (soft warning)"
        status="warning"
        isSoftWarning
      />
      <BalAlert
        content="Error alert with learn more button link"
        learnMoreLink="https://balancer.fi"
        status="error"
      />
      <GenericError
        error={new TestError(exceptionName, exceptionMessage)}
        maxWidth="500"
      ></GenericError>

      <Button
        onClick={() =>
          addAlert({
            id: 'debugAlert',
            title: 'Global warning alert:',
            description: 'with global description',
            status: 'warning',
          })
        }
      >
        Show global warning alert
      </Button>
      <DebugErrorBoundary />
    </VStack>
  )
}

function TitleWithButton({ title }: { title: string }) {
  return (
    <BalAlertContent
      title={title}
      description="Optional description"
      tooltipLabel="Optional tooltip"
    >
      <BalAlertButton onClick={() => console.log('Clicked')}>Click me</BalAlertButton>
    </BalAlertContent>
  )
}

function DebugErrorBoundary() {
  const [error, setError] = useState<Error | undefined>()

  function generateDelayedError() {
    setTimeout(() => {
      setError(new TestError(exceptionName, exceptionMessage))
    }, 3000)
  }

  function onReset() {
    setError(undefined)
    generateDelayedError()
  }

  useEffect(() => {
    generateDelayedError()
  }, [])

  return (
    <VStack width="full">
      <Text fontWeight="bold">Default Error Boundary</Text>
      <ErrorBoundary onReset={onReset}>
        <Throwable error={error} />
      </ErrorBoundary>
      <Text fontWeight="bold">Resetable Error Boundary</Text>
      <ErrorBoundary
        onReset={onReset}
        fallbackRender={({ resetErrorBoundary }) => (
          <Button color="font.warning" onClick={resetErrorBoundary}>
            Try Reset Error
          </Button>
        )}
      >
        <Throwable error={error} />
      </ErrorBoundary>
      <Text fontWeight="bold">Custom Error Boundary</Text>
      <ErrorBoundary fallback={<Text color="font.warning">Custom Error Content</Text>}>
        <Throwable error={error} />
      </ErrorBoundary>
    </VStack>
  )
}

function Throwable({ error }: { error?: Error }) {
  if (error) {
    throw error
  }
  return <Text>Waiting for error...</Text>
}
