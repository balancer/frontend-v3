import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { isNativeOrWrappedNative } from '@/lib/modules/tokens/token.helpers'
import { HumanAmount, isSameAddress } from '@balancer/sdk'
import { Address } from 'viem'
import { useAddLiquidity } from '../useAddLiquidity'
import { VStack } from '@chakra-ui/react'

type Props = {
  tokenSelectDisclosureOpen: () => void
  /*
    Optional callback to override the default setAmountIn function (i.e. from TokenInputsAddable)
    Default scenario: only updates one token input
    Proportional scenario: updates all the inputs using proportional amount calculations
   */
  customSetAmountIn?: (tokenAddress: Address, humanAmount: HumanAmount) => void
}
export function TokenInputs({ tokenSelectDisclosureOpen, customSetAmountIn }: Props) {
  const { tokens, humanAmountsIn } = useAddLiquidity()

  const { setHumanAmountIn } = useAddLiquidity()

  const setAmountIn = customSetAmountIn || setHumanAmountIn

  function currentValueFor(tokenAddress: Address) {
    const amountIn = humanAmountsIn.find(amountIn =>
      isSameAddress(amountIn.tokenAddress, tokenAddress)
    )
    return amountIn ? amountIn.humanAmount : ''
  }

  return (
    <VStack spacing="md" w="full">
      {tokens.map((token, i) => {
        if (!token) return <div key={i}>Missing token</div>

        return (
          <TokenInput
            key={token.address}
            address={token.address}
            chain={token.chain}
            value={currentValueFor(token.address as Address)}
            onChange={e =>
              setAmountIn(token.address as Address, e.currentTarget.value as HumanAmount)
            }
            toggleTokenSelect={
              isNativeOrWrappedNative(token.address as Address, token.chain)
                ? tokenSelectDisclosureOpen
                : undefined
            }
          />
        )
      })}
    </VStack>
  )
}
