import { SupportedCurrency } from '@/lib/modules/user/settings/useUserSettings'

export type FxRates = Record<SupportedCurrency, number>
type FxRatesResponse = {
  data: FxRates
}

export async function getFxRates(): Promise<FxRates | undefined> {
  try {
    const res = await fetch(
      'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_tjV51qbYMpQeYi3hHUmu2bNyJp0w0TcBZym15REf',
      { next: { revalidate: 5 * 60 } } // 5 mins
    )
    const { data: rates } = (await res.json()) as FxRatesResponse
    return rates
  } catch (error) {
    console.error('Unable to fetch FX rates', error)
    return undefined
  }
}
