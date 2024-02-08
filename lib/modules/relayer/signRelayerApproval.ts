/* eslint-disable @typescript-eslint/ban-ts-comment */
import networkConfig from '@/lib/config/networks/mainnet'
import { ensureError } from '@/lib/shared/utils/errors'
import { Relayer } from '@balancer/sdk'
import { Address, publicActions, walletActions } from 'viem'
import { GetWalletClientResult } from 'wagmi/actions'

// TODO: replace this type with the one exposed by the SDK (WIP)
type SignRelayerApprovalParams = Parameters<typeof Relayer.signRelayerApproval>
type SdkClient = SignRelayerApprovalParams[2]

export async function signRelayerApproval(
  userAddress: Address,
  client?: GetWalletClientResult
): Promise<Address | undefined> {
  if (!client) return undefined

  // TODO: ignore TS error due to SDK using viem v2 (this won't be needed once we migrate to wagmi v2)
  // @ts-ignore
  const publicClient = client.extend(publicActions).extend(walletActions) as SdkClient

  try {
    const signature = await Relayer.signRelayerApproval(
      networkConfig.contracts.balancer.relayerV6,
      userAddress,
      publicClient
    )
    return signature
  } catch (e: unknown) {
    const error = ensureError(e)
    // When the user explicitly rejects in the wallet we return undefined to ignore the error and do nothing
    if (error.name === 'UserRejectedRequestError') return
    throw error
  }
}
