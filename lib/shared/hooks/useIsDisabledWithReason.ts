export type IsDisabledWithReason = {
  isDisabled: boolean
  disabledReason?: string
}

function disabled(reason: string): IsDisabledWithReason {
  return {
    isDisabled: true,
    disabledReason: reason,
  }
}

export function useIsDisabledWithReason(
  ...conditionsWithReasons: [boolean, string][]
): IsDisabledWithReason {
  const notDisabled = { isDisabled: false }

  for (const [condition, reason] of conditionsWithReasons) {
    if (condition) {
      return disabled(reason)
    }
  }

  return notDisabled
}
