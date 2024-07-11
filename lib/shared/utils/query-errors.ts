import { captureException } from '@sentry/nextjs'
import { Extras, ScopeContext } from '@sentry/types'
import { SentryError, ensureError } from './errors'
import { isUserRejectedError, shouldIgnoreExecutionError } from './error-filters'
import {
  AddLiquidityParams,
  stringifyHumanAmountsIn,
} from '@/lib/modules/pool/actions/add-liquidity/queries/add-liquidity-keys'
import { RemoveLiquidityParams } from '@/lib/modules/pool/actions/remove-liquidity/queries/remove-liquidity-keys'
import { SimulateSwapParams } from '@/lib/modules/swap/queries/useSimulateSwapQuery'
import { isProd } from '@/lib/config/app.config'

/**
 * Metadata to be added to the captured Sentry error
 * We use this type in react-query v5 "meta" property (exposed by wagmi v2)
 * More info: https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose#defining-on-demand-messages
 */
export type SentryMetadata = {
  errorMessage: string
  errorName?: string
  context: Partial<ScopeContext>
}

export function sentryMetaForAddLiquidityHandler(errorMessage: string, params: AddLiquidityParams) {
  return createAddHandlerMetadata('HandlerQueryError', errorMessage, params)
}

export function sentryMetaForRemoveLiquidityHandler(
  errorMessage: string,
  params: RemoveLiquidityParams
) {
  return createRemoveHandlerMetadata('HandlerQueryError', errorMessage, params)
}

export function sentryMetaForSwapHandler(errorMessage: string, params: SimulateSwapParams) {
  return createSwapHandlerMetadata('HandlerQueryError', errorMessage, params)
}

/**
 * Used by all wagmi managed queries to create sentry metadata for simulation errors
 */
export function sentryMetaForWagmiSimulation(errorMessage: string, extra: Extras) {
  return createFatalErrorMetadata('WagmiSimulationError', errorMessage, extra)
}

/**
 * Used by all wagmi managed queries to create sentry metadata for execution errors
 */
export function sentryMetaForWagmiExecution(errorMessage: string, extra: Extras) {
  return createFatalErrorMetadata('WagmiExecutionError', errorMessage, extra)
}

export function captureWagmiExecutionError(error: unknown, errorMessage: string, extra: Extras) {
  captureSentryError(error, sentryMetaForWagmiExecution(errorMessage, extra))
}

/**
 * Only used in edge-cases when we want to capture a fatal error outside the context of a react-query
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
 * Only used in edge-cases when we want to capture a non-fatal error outside the context of a react-query
 */
type NonFatalErrorParams = {
  error: unknown
  errorName: string
  errorMessage?: string
  extra?: Extras
}
export function captureNonFatalError({
  error,
  errorName,
  extra = {},
  errorMessage = '',
}: NonFatalErrorParams) {
  captureSentryError(error, createNonFatalMetadata(errorName, errorMessage, extra))
}

/**
 * Used by all queries to capture fatal sentry errors with metadata
 */
export function createFatalErrorMetadata(errorName: string, errorMessage: string, extra: Extras) {
  return createFatalMetadata(errorName, errorMessage, extra)
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

/**
 * Creates sentry metadata for errors in swap handlers
 */
function createSwapHandlerMetadata(
  errorName: string,
  errorMessage: string,
  params: SimulateSwapParams
) {
  const extra: Extras = {
    handler: params.handler.constructor.name,
    params: {
      ...params.swapInputs,
    },
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

function createNonFatalMetadata(
  errorName: string,
  errorMessage = '',
  extra: Extras = {}
): SentryMetadata {
  const context: Partial<ScopeContext> = {
    extra,
    level: 'error',
  }
  return {
    errorMessage,
    errorName,
    context,
  }
}

export function createErrorMetadata(
  errorName: string,
  errorMessage: string,
  extra: Extras
): SentryMetadata {
  const context: Partial<ScopeContext> = {
    extra,
    level: 'error',
  }
  return {
    errorMessage,
    errorName,
    context,
  }
}

/**
 * Creates a SentryError with metadata and sends it to sentry
 * Used by all queries from QueryCache onError in global queryClient
 * More info: https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose#a-bad-api
 */
export function captureSentryError(
  e: unknown,
  { context, errorMessage, errorName }: SentryMetadata
) {
  const causeError = ensureError(e)
  if (shouldIgnoreExecutionError(causeError)) return

  // Adding the root cause message to the top level message makes slack alerts more useful
  const errorMessageWithCause = errorMessage + `\n\nCause: \n` + causeError.message

  const sentryError = new SentryError(errorMessageWithCause, {
    cause: causeError,
    name: errorName,
    context,
  })

  captureException(sentryError, context)
}

/*
  Detects common errors that we don't want to capture in Sentry
*/
export function shouldIgnoreError(e: Error) {
  /*
    Thrown from useWalletClient() when loading a pool page from scratch.
    It looks like is is caused by the useWalletClient call in AddTokenToWalletButton but it does not affect it's behavior.
  */
  const ignored = shouldIgnore(e)
  if (ignored && !isProd) console.log('Ignoring error with message: ', e.message)
  return ignored
}

function shouldIgnore(e: Error): boolean {
  if (e.message.includes('.getAccounts is not a function')) return true

  if (isUserRejectedError(e)) return true

  return false
}
