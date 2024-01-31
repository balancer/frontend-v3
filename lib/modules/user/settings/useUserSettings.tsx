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
export type SignatureAllowance = 'on' | 'off'
const DEFAULT_SIGNATURE_ALLOWANCE: SignatureAllowance = 'on'

export type UseUserSettingsResult = ReturnType<typeof _useUserSettings>
export const UserSettingsContext = createContext<UseUserSettingsResult | null>(null)

export function _useUserSettings({
  initCurrency,
  initSlippage,
  initPoolListView,
  initSignatureAllowance,
}: {
  initCurrency: SupportedCurrency
  initSlippage: string
  initSignatureAllowance: SignatureAllowance
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

  const [signatureAllowance, setSignatureAllowance] = useCookieState<SignatureAllowance>(
    COOKIE_KEYS.UserSettings.SignatureAllowance,
    initSignatureAllowance
  )

  const [poolListView, setPoolListView] = useCookieState<string>(
    COOKIE_KEYS.UserSettings.PoolListView,
    initPoolListView
  )

  return {
    currency,
    slippage,
    poolListView,
    signatureAllowance,
    setCurrency,
    setSlippage,
    setSignatureAllowance,
    setPoolListView,
  }
}

type ProviderProps = PropsWithChildren<{
  initCurrency: string | undefined
  initSlippage: string | undefined
  initPoolListView: string | undefined
  initSignatureAllowance: string | undefined
}>

export function UserSettingsProvider({
  initCurrency,
  initSlippage,
  initPoolListView,
  initSignatureAllowance,
  children,
}: ProviderProps) {
  const _initCurrency = (initCurrency as SupportedCurrency) || DEFAULT_CURRENCY
  const _initSlippage = (initSlippage as string) || DEFAULT_SLIPPAGE
  const _initPoolListView = (initPoolListView as PoolListView) || DEFAULT_POOL_LIST_VIEW
  const _initSignatureAllowance =
    (initSignatureAllowance as SignatureAllowance) || DEFAULT_SIGNATURE_ALLOWANCE

  const hook = _useUserSettings({
    initCurrency: _initCurrency,
    initSlippage: _initSlippage,
    initPoolListView: _initPoolListView,
    initSignatureAllowance: _initSignatureAllowance,
  })
  return <UserSettingsContext.Provider value={hook}>{children}</UserSettingsContext.Provider>
}

export const useUserSettings = (): UseUserSettingsResult =>
  useMandatoryContext(UserSettingsContext, 'UserSettings')
