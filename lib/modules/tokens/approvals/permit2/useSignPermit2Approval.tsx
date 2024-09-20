import { AddLiquidityHandler } from '@/lib/modules/pool/actions/add-liquidity/handlers/AddLiquidity.handler'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { useSdkViemClient } from '@/lib/modules/web3/useSdkViemClient'
import { Toast } from '@/lib/shared/components/toasts/Toast'
import { AddLiquidityBaseQueryOutput } from '@balancer/sdk'
import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { SignPermit2State, usePermit2Signature } from './Permit2SignatureProvider'
import { signPermit2TokenApprovals } from './signPermit2TokenApprovals'

export type AddLiquidityPermit2Params = {
  handler: AddLiquidityHandler
  queryOutput?: AddLiquidityBaseQueryOutput
  slippagePercent: string
}
export function useSignPermit2Approval({
  queryOutput,
  slippagePercent,
  handler,
}: AddLiquidityPermit2Params) {
  const toast = useToast()
  const { userAddress } = useUserAccount()

  const { setSignPermit2State, setPermit2ApprovalSignature, signPermit2State } =
    usePermit2Signature()

  const [error, setError] = useState<string | undefined>()

  const sdkClient = useSdkViemClient()

  useEffect(() => {
    if (sdkClient === undefined) {
      setSignPermit2State(SignPermit2State.Preparing)
    } else {
      setSignPermit2State(SignPermit2State.Ready)
    }
  }, [setSignPermit2State, sdkClient])

  async function signPermit2() {
    if (!queryOutput) throw new Error('No input provided for permit2 signature')
    setSignPermit2State(SignPermit2State.Confirming)
    setError(undefined)

    try {
      const signature = await signPermit2TokenApprovals({
        handler,
        sdkClient,
        permit2Input: {
          account: userAddress,
          slippagePercent,
          sdkQueryOutput: queryOutput.sdkQueryOutput,
        },
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

      setPermit2ApprovalSignature(signature)
    } catch (error) {
      console.error(error)
      setError('Error in permit2 signature call')
      setSignPermit2State(SignPermit2State.Ready)
    }
  }

  return {
    signPermit2,
    signPermit2State,
    buttonLabel: getButtonLabel(signPermit2State),
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

function isLoading(signRelayerState: SignPermit2State) {
  return (
    signRelayerState === SignPermit2State.Confirming ||
    signRelayerState === SignPermit2State.Preparing
  )
}

function getButtonLabel(signPermit2State: SignPermit2State) {
  if (signPermit2State === SignPermit2State.Ready) return 'Permit transfer: token name'
  if (signPermit2State === SignPermit2State.Confirming) return 'Confirm permit2 signature in wallet'
  if (signPermit2State === SignPermit2State.Preparing) return 'Preparing'
  if (signPermit2State === SignPermit2State.Completed) return 'Permit2 Signed'
  return ''
}
