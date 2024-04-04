import { mins } from '../hooks/useTime'

export enum SupportedCurrency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  CNY = 'CNY',
}

export type FxRates = Record<SupportedCurrency, number>
type FxRatesResponse = {
  data: FxRates
}

export function symbolForCurrency(currency: SupportedCurrency): string {
  switch (currency) {
    case SupportedCurrency.USD:
      return '$'
    case SupportedCurrency.EUR:
      return '€'
    case SupportedCurrency.GBP:
      return '£'
    case SupportedCurrency.JPY:
      return '¥'
    case SupportedCurrency.CNY:
      return '¥'
    default:
      return '$'
  }
}

export async function getFxRates(): Promise<FxRates | undefined> {
  try {
    const res = await fetch(
      'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_tjV51qbYMpQeYi3hHUmu2bNyJp0w0TcBZym15REf',
      { next: { revalidate: mins(10).toSecs() } }
    )
    const { data: rates } = (await res.json()) as FxRatesResponse
    return rates
  } catch (error) {
    console.error('Unable to fetch FX rates', error)
    return undefined
  }
}
