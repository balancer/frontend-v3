/* eslint-disable react-hooks/exhaustive-deps */
import { SdkQueryAddLiquidityOutput } from '@/lib/modules/pool/actions/add-liquidity/add-liquidity.types'
import { AddLiquidityHandler } from '@/lib/modules/pool/actions/add-liquidity/handlers/AddLiquidity.handler'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { useSdkWalletClient } from '@/lib/modules/web3/useSdkViemClient'
import { Toast } from '@/lib/shared/components/toasts/Toast'
import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { SignPermit2State, usePermit2Signature } from './Permit2SignatureProvider'
import { signPermit2TokenTransfer } from './signPermit2TokenTransfer'
import { NoncesByTokenAddress } from './usePermit2Nonces'
import { useTokens } from '../../TokensProvider'

export type AddLiquidityPermit2Params = {
  chainId: number
  handler: AddLiquidityHandler
  queryOutput?: SdkQueryAddLiquidityOutput
  slippagePercent: string
  nonces?: NoncesByTokenAddress
}
export function useSignPermit2Transfer({
  chainId,
  queryOutput,
  slippagePercent,
  handler,
  nonces,
}: AddLiquidityPermit2Params) {
  const toast = useToast()
  const { userAddress } = useUserAccount()
  const { getToken } = useTokens()

  //TODO: We will probably need to extract this logic to be reusable by other components (StepTracker)
  const amountsIn = queryOutput?.sdkQueryOutput.amountsIn
  const tokenSymbols = amountsIn
    ?.filter(a => a.amount > 0n)
    .map(a => getToken(a.token.address, chainId)?.symbol)

  const { setSignPermit2State, setPermit2TransferSignature, signPermit2State } =
    usePermit2Signature()

  const [error, setError] = useState<string | undefined>()

  const sdkClient = useSdkWalletClient()

  useEffect(() => {
    if (sdkClient === undefined) {
      setSignPermit2State(SignPermit2State.Preparing)
    } else {
      setSignPermit2State(SignPermit2State.Ready)
    }
  }, [setSignPermit2State, sdkClient])

  //TODO: Generalize for Swaps and other potential signatures
  const minimumBpt = queryOutput?.sdkQueryOutput.bptOut.amount
  useEffect(() => {
    if (minimumBpt) {
      setPermit2TransferSignature(undefined)
      setSignPermit2State(SignPermit2State.Ready)
    }
  }, [minimumBpt])

  async function signPermit2() {
    if (!queryOutput) throw new Error('No input provided for permit2 signature')
    if (!nonces) throw new Error('No nonces provided for permit2 signature')
    setSignPermit2State(SignPermit2State.Confirming)
    setError(undefined)

    try {
      const signature = await signPermit2TokenTransfer({
        handler,
        sdkClient,
        permit2Input: {
          account: userAddress,
          slippagePercent,
          sdkQueryOutput: queryOutput.sdkQueryOutput,
        },
        nonces,
      })

      if (signature) {
        setSignPermit2State(SignPermit2State.Completed)
        toast({
          title: 'Permit2 approval signed!',
          description: '',
          status: 'success',
          duration: 5000,
          isClosable: true,
          render: ({ ...rest }) => <Toast {...rest} />,
        })
      } else {
        setSignPermit2State(SignPermit2State.Ready)
      }

      setPermit2TransferSignature(signature)
    } catch (error) {
      console.error(error)
      setError('Error in permit2 signature call')
      setSignPermit2State(SignPermit2State.Ready)
    }
  }

  return {
    signPermit2,
    signPermit2State,
    buttonLabel: getButtonLabel(signPermit2State, tokenSymbols),
    isLoading: isLoading(signPermit2State) || !queryOutput,
    isDisabled: isDisabled(signPermit2State),
    error,
  }
}

function isDisabled(signPermit2State: SignPermit2State) {
  return (
    signPermit2State === SignPermit2State.Confirming ||
    signPermit2State === SignPermit2State.Completed
  )
}

function isLoading(signPermit2State: SignPermit2State) {
  return (
    signPermit2State === SignPermit2State.Confirming ||
    signPermit2State === SignPermit2State.Preparing
  )
}

function getButtonLabel(signPermit2State: SignPermit2State, tokenSymbols?: (string | undefined)[]) {
  if (signPermit2State === SignPermit2State.Ready) return getReadyLabel(tokenSymbols)
  if (signPermit2State === SignPermit2State.Confirming) return 'Confirm permit2 signature in wallet'
  if (signPermit2State === SignPermit2State.Preparing) return 'Preparing'
  if (signPermit2State === SignPermit2State.Completed) return 'Permit2 Signed'
  return ''
}

function getReadyLabel(tokenSymbols?: (string | undefined)[]) {
  if (!tokenSymbols) return 'Permit transfer'
  if (tokenSymbols.length === 1) return 'Permit transfer: ' + tokenSymbols[0]
  return 'Permit transfers: ' + tokenSymbols.join(', ')
}
