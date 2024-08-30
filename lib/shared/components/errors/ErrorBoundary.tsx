'use client'

import {
  ErrorBoundary as BaseErrorBoundary,
  ErrorBoundaryProps as BaseErrorBoundaryProps,
  FallbackProps as BaseFallbackProps,
} from 'react-error-boundary'
import { GenericError } from '@/lib/shared/components/errors/GenericError'
import { Button, Link, Stack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { isDev, isStaging } from '@/lib/config/app.config'
import { useLocationFullPath } from '@/lib/shared/hooks/useLocationFullPath'
import { PropsWithChildren, ReactNode } from 'react'

export interface ErrorBoundaryProps extends PropsWithChildren {
  fallback?: BaseErrorBoundaryProps['fallback']
  fallbackRender?: BaseErrorBoundaryProps['fallbackRender']
  onReset?: BaseFallbackProps['resetErrorBoundary']
}

export interface FallbackProps {
  error: BaseFallbackProps['error']
  resetErrorBoundary?: BaseFallbackProps['resetErrorBoundary']
  title?: string
  showReloadButton?: boolean
  customButton?: ReactNode
}

export function DefaultFallbackRender({
  error,
  resetErrorBoundary,
  title,
  customButton,
  showReloadButton = true,
}: FallbackProps) {
  const showResetButton = isDev || isStaging

  const path = useLocationFullPath()

  const showButtons = customButton || showReloadButton || showResetButton

  return (
    <div role="alert">
      <GenericError error={error} customErrorName={title} />
      {showButtons && (
        <Stack direction="row" mt="4" spacing="4">
          {customButton}
          {showReloadButton && (
            <Link as={NextLink} href={path}>
              <Button variant="outline">Reload Page</Button>
            </Link>
          )}
          {showResetButton && resetErrorBoundary && (
            <Button variant="outline" onClick={() => resetErrorBoundary()}>
              Try Reset (dev)
            </Button>
          )}
        </Stack>
      )}
    </div>
  )
}

export function ErrorBoundary({ children, fallback, onReset, fallbackRender }: ErrorBoundaryProps) {
  if (fallback) {
    return <BaseErrorBoundary fallback={fallback}>{children}</BaseErrorBoundary>
  }

  return (
    <BaseErrorBoundary
      onReset={onReset}
      FallbackComponent={fallbackRender ?? DefaultFallbackRender}
    >
      {children}
    </BaseErrorBoundary>
  )
}
