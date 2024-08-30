'use client'

import PageError from '@/lib/shared/components/errors/PageError'

/**
 * Global App ErrorBoundary.
 *
 * Catches:
 * - components errors (e.g. throw new Error() inside render function)
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling#using-error-boundaries
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const title = error.digest
    ? `Something went wrong (Digest - ${error.digest})`
    : 'Something went wrong'

  return <PageError error={error} onReset={reset} title={title} captureException />
}
