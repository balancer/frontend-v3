import { publicActions, walletActions } from 'viem'
import { useWalletClient } from 'wagmi'
import { Relayer } from '@balancer/sdk'

// TODO: replace this type with the one exposed by the SDK (WIP)
// https://github.com/balancer/b-sdk/pull/417
type SignRelayerApprovalParams = Parameters<typeof Relayer.signRelayerApproval>
export type SdkClient = SignRelayerApprovalParams[2]

export function useSdkViemClient(): SdkClient | undefined {
  const { data: walletClient } = useWalletClient()
  if (!walletClient) return
  return walletClient.extend(publicActions).extend(walletActions) as SdkClient
}
