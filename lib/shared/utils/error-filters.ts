import { ensureError } from './errors'

export function shouldIgnoreExecutionError(error: Error): boolean {
  const e = ensureError(error)
  return isUserRejectedError(e)
}

export function isUserRejectedError(error: Error): boolean {
  return error.message.startsWith('User rejected the request.')
}
