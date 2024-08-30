'use client'

import { DefaultPageContainer } from '@/lib/shared/components/containers/DefaultPageContainer'
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { DefaultFallbackRender, FallbackProps } from '@/lib/shared/components/errors/ErrorBoundary'

export interface PageErrorProps {
  error: Error
  /**
   * (dev only) Call reset() to reset the error boundary and retry the render
   */
  onReset?: () => void
  title?: string
  /**
   * Send error to Sentry
   */
  captureException?: boolean
  showReloadButton?: FallbackProps['showReloadButton']
  customButton?: FallbackProps['customButton']
}

export default function PageError({
  error,
  onReset,
  title,
  captureException,
  showReloadButton,
  customButton,
}: PageErrorProps) {
  useEffect(() => {
    if (captureException) {
      Sentry.captureException(error)
    }
  }, [captureException, error])

  return (
    <DefaultPageContainer>
      <DefaultFallbackRender
        error={error}
        resetErrorBoundary={onReset}
        title={title}
        showReloadButton={showReloadButton}
        customButton={customButton}
      />
    </DefaultPageContainer>
  )
}
