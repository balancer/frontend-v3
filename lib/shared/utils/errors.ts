/**
 * For Patterns see: https://medium.com/with-orus/the-5-commandments-of-clean-error-handling-in-typescript-93a9cbdf1af5
 *
 * try/catch should looks something like this:
 *
 *    try {
 *      runFragileCode(params)
 *    } catch (err) {
 *      const error = ensureError(err)
 *
 *      throw new SentryError('A constant error message, no interpolation', {
 *        cause: error // maintain stack trace
 *        context: { extra: params } // add additional context
 *      })
 *    }
 */
import { captureException } from '@sentry/nextjs'
import { ScopeContext } from '@sentry/types/types/scope'

// Wraps Sentry's captureException to allow for additional context or to use
// where we don't want to throw an error.
export function captureError(error: Error, context?: Partial<ScopeContext>): void {
  captureException(error, { ...context })
}

// Extends base Error class to allow for additional context and to automatically
// capture the error in Sentry. Enforces that all errors thrown are of this type.
export class SentryError extends Error {
  public readonly context: Partial<ScopeContext>

  constructor(
    message: string,
    options: {
      name?: string
      cause?: Error
      context?: Partial<ScopeContext>
    } = {}
  ) {
    const { cause, context, name } = options

    super(message, { cause })
    this.name = name || this.constructor.name

    this.context = context || {}

    if (cause instanceof Error && cause.stack) {
      this.stack = cause.stack
    }
  }
}

// Ensures returned value is an Error type.
export function ensureError(value: unknown): Error & { shortMessage?: string } {
  if (value instanceof Error) return value

  let stringified = '[Unable to stringify thrown value]'
  try {
    stringified = JSON.stringify(value)
  } catch {
    /* empty */
  }

  const shortMessage = stringified
  const error = new ErrorWithShortMessage(
    `This value was thrown as is, not through an Error: ${stringified}`,
    shortMessage
  )

  return error
}

class ErrorWithShortMessage extends Error {
  shortMessage: string

  constructor(message: string, shortMessage: string) {
    super(message)
    this.shortMessage = shortMessage

    Object.setPrototypeOf(this, ErrorWithShortMessage.prototype)
  }
}
