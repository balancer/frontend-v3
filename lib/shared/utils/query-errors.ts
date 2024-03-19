import { captureException } from '@sentry/nextjs'
import { Extras, ScopeContext } from '@sentry/types'
import { SentryError, ensureError } from './errors'
import { HandlerParams } from '@/lib/modules/pool/actions/liquidity-types'
import { shouldIgnoreExecutionError } from './error-filters'

/**
 * Metadata to be added to the captured Sentry error
 * We will use this type in query "meta" property once we migrate to wagmi v2 (with react-query v5)
 * More info: https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose#defining-on-demand-messages
 */
export type SentryMetadata = {
  errorMessage: string
  errorName?: string
  context: Partial<ScopeContext>
}

/**
 * Used by all liquidity handlers to capture sentry errors with metadata
 */
export function captureLiquidityHandlerError(
  error: unknown,
  errorMessage: string,
  params: HandlerParams
) {
  captureSentryError(error, createHandlerMetadata('HandlerQueryError', errorMessage, params))
}

/**
 * Used by all wagmi managed queries to capture simulation errors with sentry metadata
 */
export function captureWagmiSimulationError(error: unknown, errorMessage: string, extra: Extras) {
  captureFatalError(error, 'WagmiSimulationError', errorMessage, extra)
}

/**
 * Used by all wagmi managed queries to capture execution errors with sentry metadata
 */
export function captureWagmiExecutionError(error: unknown, errorMessage: string, extra: Extras) {
  if (shouldIgnoreExecutionError(error)) return

  captureFatalError(error, 'WagmiExecutionError', errorMessage, extra)
}

/**
 * Used by all queries to capture fatal sentry errors with metadata
 */
function captureFatalError(error: unknown, errorName: string, errorMessage: string, extra: Extras) {
  captureSentryError(error, createFatalMetadata(errorName, errorMessage, extra))
}

/**
 * Creates sentry metadata for errors in liquidity handlers
 */
function createHandlerMetadata(errorName: string, errorMessage: string, params: HandlerParams) {
  const extra: Extras = {
    handler: params.handler.constructor.name,
    params,
  }
  return createFatalMetadata(errorName, errorMessage, extra)
}

function createFatalMetadata(
  errorName: string,
  errorMessage: string,
  extra: Extras
): SentryMetadata {
  const context: Partial<ScopeContext> = {
    extra,
    level: 'fatal',
  }
  return {
    errorMessage,
    errorName,
    context,
  }
}

/**
 * Creates a SentryError with metadata and sends it to sentry
 * Used by all queries from onError option
 * We will move this call to global QueryCache options once we migrate to wagmi v2 (with react-query v5)
 * More info: https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose#a-bad-api
 */
function captureSentryError(e: unknown, { context, errorMessage, errorName }: SentryMetadata) {
  const error = ensureError(e)
  const sentryError = new SentryError(errorMessage, {
    cause: error,
    name: errorName,
    context,
  })

  // console.error('Sentry error en wagmi react query wrapper 2. Context', sentryError)
  captureException(sentryError, context)
}
