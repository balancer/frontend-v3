'use client'

import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { SupportedCurrency } from '@/lib/shared/utils/currencies'
import { PropsWithChildren, createContext } from 'react'
import { useCookieState } from '../../cookies/useCookieState'
import { COOKIE_KEYS } from '../../cookies/cookie.constants'

export type UseUserSettingsResult = ReturnType<typeof _useUserSettings>
export const UserSettingsContext = createContext<UseUserSettingsResult | null>(null)

export function _useUserSettings({ initCurrency }: { initCurrency: SupportedCurrency }) {
  const [currency, setCurrency] = useCookieState<SupportedCurrency>(
    COOKIE_KEYS.UserSettings.Currency,
    initCurrency
  )

  return { currency, setCurrency }
}

type ProviderProps = PropsWithChildren<{
  initCurrency: string | undefined
}>

export function UserSettingsProvider({ initCurrency, children }: ProviderProps) {
  const getInitCurrency = () => {
    if (
      initCurrency &&
      Object.values(SupportedCurrency).includes(initCurrency as SupportedCurrency)
    ) {
      return initCurrency as SupportedCurrency
    }

    return SupportedCurrency.USD
  }

  const hook = _useUserSettings({ initCurrency: getInitCurrency() })
  return <UserSettingsContext.Provider value={hook}>{children}</UserSettingsContext.Provider>
}

export const useUserSettings = (): UseUserSettingsResult =>
  useMandatoryContext(UserSettingsContext, 'UserSettings')
