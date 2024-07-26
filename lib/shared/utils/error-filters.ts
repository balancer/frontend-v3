export function isUserRejectedError(error: Error): boolean {
  return error.message.startsWith('User rejected the request.')
}
