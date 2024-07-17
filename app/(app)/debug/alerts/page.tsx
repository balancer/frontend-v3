'use client'

import { BalAlert } from '@/lib/shared/components/alerts/BalAlert'
import { BalAlertButton } from '@/lib/shared/components/alerts/BalAlertButton'
import { BalAlertTitle } from '@/lib/shared/components/alerts/BalAlertTitle'
import { ErrorAlert } from '@/lib/shared/components/errors/ErrorAlert'
import { VStack } from '@chakra-ui/react'

const exceptionTitle = 'Error fetching swap'
const exceptionDescription = `Execution reverted for an unknown reason. Raw Call Arguments:
to:0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5
Docs: https://viem.sh/docs/contract/simulateContract Details: execution reverted Version:
viem@2.16.3`

export default function Page() {
  return (
    <VStack width="full">
      <BalAlert title={<TitleWithButton title="Info alert" />} status="info" />
      <BalAlert title={<TitleWithButton title="Warning alert" />} status="warning" />
      <BalAlert title={<TitleWithButton title="Error alert" />} status="error" />
      <BalAlert title={<TitleWithButton title="Success alert" />} status="success" />
      <BalAlert
        title="Warning alert with close button (soft warning)"
        status="warning"
        isSoftWarning
      />
      <BalAlert
        title="Error alert with learn more button link"
        learnMoreLink="https://balancer.fi"
        status="error"
      />

      <ErrorAlert title={exceptionTitle} maxWidth="500">
        {exceptionDescription}
      </ErrorAlert>
    </VStack>
  )
}

function TitleWithButton({ title }: { title: string }) {
  return (
    <BalAlertTitle title={title} description="Optional description" tooltipLabel="Optional tooltip">
      <BalAlertButton onClick={() => console.log('Clicked')}>Click me</BalAlertButton>
    </BalAlertTitle>
  )
}
