import { publicActions, walletActions } from 'viem'
import { useWalletClient } from 'wagmi'
import { Client, PublicActions, WalletActions } from 'viem'

export type SdkClient = Client & WalletActions & PublicActions

export function useSdkViemClient(): SdkClient | undefined {
  const { data: walletClient } = useWalletClient()
  if (!walletClient) return
  return walletClient.extend(publicActions).extend(walletActions) as SdkClient
}
