'use client'

import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { SupportedCurrency } from '@/lib/shared/utils/currencies'
import { PropsWithChildren, createContext } from 'react'
import { bn } from '@/lib/shared/utils/numbers'
import { useLocalStorage } from 'usehooks-ts'
import { LS_KEYS } from '../../local-storage/local-storage.constants'
import { useIsMounted } from '@/lib/shared/hooks/useIsMounted'

export enum PoolListView {
  Grid = 'grid',
  List = 'list',
}

export type EnableSignatures = 'yes' | 'no'

const DEFAULT_CURRENCY = SupportedCurrency.USD
const DEFAULT_SLIPPAGE = '0.5' // 0.5%
const DEFAULT_POOL_LIST_VIEW = PoolListView.List
const DEFAULT_ENABLE_SIGNATURES: EnableSignatures = 'yes'

export type UseUserSettingsResult = ReturnType<typeof _useUserSettings>
export const UserSettingsContext = createContext<UseUserSettingsResult | null>(null)

export function _useUserSettings({
  initCurrency,
  initSlippage,
  initPoolListView,
  initEnableSignatures,
}: {
  initCurrency: SupportedCurrency
  initSlippage: string
  initEnableSignatures: EnableSignatures
  initPoolListView: PoolListView
}) {
  const isMounted = useIsMounted()

  const [_currency, setCurrency] = useLocalStorage<SupportedCurrency>(
    LS_KEYS.UserSettings.Currency,
    initCurrency
  )
  const currency = isMounted ? _currency : initCurrency

  const [_slippage, setSlippage] = useLocalStorage<string>(
    LS_KEYS.UserSettings.Slippage,
    initSlippage
  )

  const [_enableSignatures, setEnableSignatures] = useLocalStorage<EnableSignatures>(
    LS_KEYS.UserSettings.EnableSignatures,
    initEnableSignatures
  )
  const enableSignatures = isMounted ? _enableSignatures : initEnableSignatures

  const [_poolListView, setPoolListView] = useLocalStorage<string>(
    LS_KEYS.UserSettings.PoolListView,
    initPoolListView
  )
  const poolListView = isMounted ? _poolListView : initPoolListView

  const slippage = isMounted ? _slippage : initSlippage
  const slippageDecimal = bn(slippage).div(100).toString()
  const slippageBps = bn(slippage).times(100).toString()

  return {
    currency,
    slippage,
    slippageDecimal,
    slippageBps,
    poolListView,
    enableSignatures,
    setCurrency,
    setSlippage,
    setEnableSignatures,
    setPoolListView,
  }
}

type ProviderProps = PropsWithChildren<{
  initCurrency: string | undefined
  initSlippage: string | undefined
  initPoolListView: string | undefined
  initEnableSignatures: string | undefined
}>

export function UserSettingsProvider({
  initCurrency,
  initSlippage,
  initPoolListView,
  initEnableSignatures,
  children,
}: ProviderProps) {
  const _initCurrency = (initCurrency as SupportedCurrency) || DEFAULT_CURRENCY
  const _initSlippage = (initSlippage as string) || DEFAULT_SLIPPAGE
  const _initPoolListView = (initPoolListView as PoolListView) || DEFAULT_POOL_LIST_VIEW
  const _initEnableSignatures =
    (initEnableSignatures as EnableSignatures) || DEFAULT_ENABLE_SIGNATURES

  const hook = _useUserSettings({
    initCurrency: _initCurrency,
    initSlippage: _initSlippage,
    initPoolListView: _initPoolListView,
    initEnableSignatures: _initEnableSignatures,
  })
  return <UserSettingsContext.Provider value={hook}>{children}</UserSettingsContext.Provider>
}

export const useUserSettings = (): UseUserSettingsResult =>
  useMandatoryContext(UserSettingsContext, 'UserSettings')
