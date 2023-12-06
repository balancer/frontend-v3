'use client'

import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { SupportedCurrency } from '@/lib/shared/utils/currencies'
import { PropsWithChildren, createContext } from 'react'
import { useCookieState } from '../../cookies/useCookieState'
import { COOKIE_KEYS } from '../../cookies/cookie.constants'

const DEFAULT_CURRENCY = SupportedCurrency.USD
const DEFAULT_SLIPPAGE = '0.005' // 0.5%

export type UseUserSettingsResult = ReturnType<typeof _useUserSettings>
export const UserSettingsContext = createContext<UseUserSettingsResult | null>(null)

export function _useUserSettings({
  initCurrency,
  initSlippage,
}: {
  initCurrency: SupportedCurrency
  initSlippage: string
}) {
  const [currency, setCurrency] = useCookieState<SupportedCurrency>(
    COOKIE_KEYS.UserSettings.Currency,
    initCurrency
  )
  const [slippage, setSlippage] = useCookieState<string>(
    COOKIE_KEYS.UserSettings.Slippage,
    initSlippage
  )

  return { currency, slippage, setCurrency, setSlippage }
}

type ProviderProps = PropsWithChildren<{
  initCurrency: string | undefined
  initSlippage: string | undefined
}>

export function UserSettingsProvider({ initCurrency, initSlippage, children }: ProviderProps) {
  const _initCurrency = (initCurrency as SupportedCurrency) || DEFAULT_CURRENCY
  const _initSlippage = (initSlippage as string) || DEFAULT_SLIPPAGE

  const hook = _useUserSettings({ initCurrency: _initCurrency, initSlippage: _initSlippage })
  return <UserSettingsContext.Provider value={hook}>{children}</UserSettingsContext.Provider>
}

export const useUserSettings = (): UseUserSettingsResult =>
  useMandatoryContext(UserSettingsContext, 'UserSettings')
