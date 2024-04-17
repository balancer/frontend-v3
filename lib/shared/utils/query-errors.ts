import { captureException } from '@sentry/nextjs'
import { Extras, ScopeContext } from '@sentry/types'
import { SentryError, ensureError } from './errors'
import { shouldIgnoreExecutionError } from './error-filters'
import {
  AddLiquidityParams,
  stringifyHumanAmountsIn,
} from '@/lib/modules/pool/actions/add-liquidity/queries/add-liquidity-keys'
import { RemoveLiquidityParams } from '@/lib/modules/pool/actions/remove-liquidity/queries/remove-liquidity-keys'

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

export function captureAddLiquidityHandlerError(
  error: unknown,
  errorMessage: string,
  params: AddLiquidityParams
) {
  captureSentryError(error, createAddHandlerMetadata('HandlerQueryError', errorMessage, params))
}

export function captureRemoveLiquidityHandlerError(
  error: unknown,
  errorMessage: string,
  params: RemoveLiquidityParams
) {
  captureSentryError(error, createRemoveHandlerMetadata('HandlerQueryError', errorMessage, params))
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
export function captureFatalError(
  error: unknown,
  errorName: string,
  errorMessage: string,
  extra: Extras
) {
  captureSentryError(error, createFatalMetadata(errorName, errorMessage, extra))
}

/**
 * Creates sentry metadata for errors in add liquidity handlers
 */
function createAddHandlerMetadata(
  errorName: string,
  errorMessage: string,
  params: AddLiquidityParams
) {
  const extra: Extras = {
    handler: params.handler.constructor.name,
    params: {
      ...params,
      humanAmountsIn: stringifyHumanAmountsIn(params.poolType, params.humanAmountsIn),
    },
  }
  return createFatalMetadata(errorName, errorMessage, extra)
}

/**
 * Creates sentry metadata for errors in remove liquidity handlers
 */
function createRemoveHandlerMetadata(
  errorName: string,
  errorMessage: string,
  params: RemoveLiquidityParams
) {
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
