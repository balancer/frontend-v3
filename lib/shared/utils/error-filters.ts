export function isUserRejectedError(error: Error): boolean {
  return error.message.startsWith('User rejected the request.')
}

/*
  Detects "Failed to fetch" Http request errors thrown by wagmi/viem
  These errors could be caused by different reasons, like network issues, CORS, 429 etc.
*/
export function isViemHttpFetchError(error?: Error | null): boolean {
  if (!error) return false
  return (
    error.message.startsWith('HTTP request failed.') && error.message.includes('Failed to fetch')
  )
}

export function isPausedError(error?: Error | null): boolean {
  if (!error) return false
  return isPausedErrorMessage(error.message)
}

export function isPausedErrorMessage(errorMessage: string): boolean {
  return errorMessage.includes('reverted with the following reason:\nBAL#402\n')
}
