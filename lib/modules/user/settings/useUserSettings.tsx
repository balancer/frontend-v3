'use client'

import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { SupportedCurrency } from '@/lib/shared/utils/currencies'
import { PropsWithChildren, createContext } from 'react'
import { useLocalStorage } from 'usehooks-ts'

export type UseUserSettingsResult = ReturnType<typeof _useUserSettings>
export const UserSettingsContext = createContext<UseUserSettingsResult | null>(null)

export function _useUserSettings() {
  const [currency, setCurrency] = useLocalStorage('currency', SupportedCurrency.USD)

  return { currency, setCurrency }
}

export function UserSettingsProvider({ children }: PropsWithChildren) {
  const hook = _useUserSettings()
  return <UserSettingsContext.Provider value={hook}>{children}</UserSettingsContext.Provider>
}

export const useUserSettings = (): UseUserSettingsResult =>
  useMandatoryContext(UserSettingsContext, 'UserSettings')
