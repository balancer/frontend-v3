import { GenericError } from '@/lib/shared/components/errors/GenericError'
import {
  PriceImpactQueryResult,
  isUnhandledAddPriceImpactError,
} from '../queries/useAddLiquidityPriceImpactQuery'

export function PriceImpactError({
  priceImpactQuery,
}: {
  priceImpactQuery: PriceImpactQueryResult
}) {
  if (!priceImpactQuery.error) return null

  if (!isUnhandledAddPriceImpactError(priceImpactQuery.error)) return null

  return (
    <GenericError
      customErrorName={'Error calculating price impact'}
      error={priceImpactQuery.error}
    />
  )
}
