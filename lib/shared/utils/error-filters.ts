import { ensureError } from './errors'

export function shouldIgnoreExecutionError(error: unknown): boolean {
  const e = ensureError(error)
  return e.message.startsWith('User rejected the request.')
}
