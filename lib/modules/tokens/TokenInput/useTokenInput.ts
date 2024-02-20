import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { Numberish, bn } from '@/lib/shared/utils/numbers'
import { ChangeEvent } from 'react'
import { useTokenBalances } from '../useTokenBalances'
import { useTokenInputsValidation } from '../useTokenInputsValidation'
import { Address } from 'viem'

export function overflowProtected(value: Numberish, decimalLimit: number): string {
  const stringValue = value.toString()
  const [numberSegment, decimalSegment] = stringValue.split('.')

  if (decimalSegment && decimalSegment.length > decimalLimit) {
    const maxLength = numberSegment.length + decimalLimit + 1
    return stringValue.slice(0, maxLength)
  } else return stringValue
}

export function useTokenInput(
  token: GqlToken | undefined,
  parentOnChange?: (event: { currentTarget: { value: string } }) => void
) {
  const { setValidationError } = useTokenInputsValidation()
  const { balanceFor } = useTokenBalances()

  function updateValue(value: string) {
    const safeValue = overflowProtected(value, token?.decimals || 18)
    parentOnChange && parentOnChange({ currentTarget: { value: safeValue } })
  }

  function validateInput(value: string) {
    if (!token) return
    const tokenAddress = token.address as Address
    const userBalance = balanceFor(token.address)

    if (value && userBalance !== undefined) {
      if (bn(value).gt(bn(userBalance.formatted))) {
        return setValidationError(tokenAddress, 'Exceeds balance')
      }
    }

    setValidationError(tokenAddress, '')
  }

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value
    updateValue(newValue)
    return validateInput(newValue)
  }

  return {
    handleOnChange,
    updateValue,
  }
}
