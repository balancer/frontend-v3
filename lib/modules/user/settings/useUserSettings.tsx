'use client'

import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { SupportedCurrency } from '@/lib/shared/utils/currencies'
import { PropsWithChildren, createContext } from 'react'
import { useCookieState } from '../../cookies/useCookieState'
import { COOKIE_KEYS } from '../../cookies/cookie.constants'

export enum PoolListView {
  Grid = 'grid',
  List = 'list',
}

const DEFAULT_CURRENCY = SupportedCurrency.USD
const DEFAULT_SLIPPAGE = '0.5' // 0.5%
const DEFAULT_POOL_LIST_VIEW = PoolListView.List

export type UseUserSettingsResult = ReturnType<typeof _useUserSettings>
export const UserSettingsContext = createContext<UseUserSettingsResult | null>(null)

export function _useUserSettings({
  initCurrency,
  initSlippage,
  initPoolListView,
}: {
  initCurrency: SupportedCurrency
  initSlippage: string
  initPoolListView: PoolListView
}) {
  const [currency, setCurrency] = useCookieState<SupportedCurrency>(
    COOKIE_KEYS.UserSettings.Currency,
    initCurrency
  )
  const [slippage, setSlippage] = useCookieState<string>(
    COOKIE_KEYS.UserSettings.Slippage,
    initSlippage
  )
  const [poolListView, setPoolListView] = useCookieState<string>(
    COOKIE_KEYS.UserSettings.PoolListView,
    initPoolListView
  )

  return { currency, slippage, poolListView, setCurrency, setSlippage, setPoolListView }
}

type ProviderProps = PropsWithChildren<{
  initCurrency: string | undefined
  initSlippage: string | undefined
  initPoolListView: string | undefined
}>

export function UserSettingsProvider({
  initCurrency,
  initSlippage,
  initPoolListView,
  children,
}: ProviderProps) {
  const _initCurrency = (initCurrency as SupportedCurrency) || DEFAULT_CURRENCY
  const _initSlippage = (initSlippage as string) || DEFAULT_SLIPPAGE
  const _initPoolListView = (initPoolListView as PoolListView) || DEFAULT_POOL_LIST_VIEW

  const hook = _useUserSettings({
    initCurrency: _initCurrency,
    initSlippage: _initSlippage,
    initPoolListView: _initPoolListView,
  })
  return <UserSettingsContext.Provider value={hook}>{children}</UserSettingsContext.Provider>
}

export const useUserSettings = (): UseUserSettingsResult =>
  useMandatoryContext(UserSettingsContext, 'UserSettings')
