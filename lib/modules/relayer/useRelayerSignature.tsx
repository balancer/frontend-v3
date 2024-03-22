'use client'

import { noop } from 'lodash'
import { PropsWithChildren, createContext, useContext, useState } from 'react'

import { Address } from 'viem'

export enum SignRelayerState {
  Ready = 'init',
  Confirming = 'confirming',
  Preparing = 'preparing',
  Completed = 'completed',
}

export type UseRelayerSignatureResponse = ReturnType<typeof _useRelayerSignature>
export const RelayerSignatureContext = createContext<UseRelayerSignatureResponse | null>(null)

export function _useRelayerSignature() {
  const [relayerApprovalSignature, setRelayerApprovalSignature] = useState<Address | undefined>()

  const [signRelayerState, setSignRelayerState] = useState<SignRelayerState>(
    SignRelayerState.Preparing
  )

  return {
    relayerApprovalSignature,
    setRelayerApprovalSignature,
    signRelayerState,
    setSignRelayerState,
  }
}

export function RelayerSignatureProvider({ children }: PropsWithChildren) {
  const hook = _useRelayerSignature()
  return (
    <RelayerSignatureContext.Provider value={hook}>{children}</RelayerSignatureContext.Provider>
  )
}

export const useRelayerSignature = (): UseRelayerSignatureResponse => {
  const context = useContext(RelayerSignatureContext)
  if (context) return context

  // Edge-case: useRelayer step does not have a flowStep (because it does not have a wagmi transaction)
  // but we need to render its loading state in the StepIndicator component (inside the StepTracker),
  // so we need to call useRelayerSignature for all flows.
  // For those flows (Swap) that do not use the provider we return an empty result.
  return {
    relayerApprovalSignature: '' as Address,
    setRelayerApprovalSignature: noop,
    signRelayerState: SignRelayerState.Ready,
    setSignRelayerState: noop,
  }
}
