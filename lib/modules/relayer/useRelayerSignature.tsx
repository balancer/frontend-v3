'use client'

import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { PropsWithChildren, createContext, useState } from 'react'

import { Address } from 'viem'

export type UseRelayerSignatureResponse = ReturnType<typeof _useRelayerSignature>
export const RelayerSignatureContext = createContext<UseRelayerSignatureResponse | null>(null)

export function _useRelayerSignature() {
  const [relayerApprovalSignature, setRelayerApprovalSignature] = useState<Address | undefined>()

  return {
    relayerApprovalSignature,
    setRelayerApprovalSignature,
  }
}

export function RelayerSignatureProvider({ children }: PropsWithChildren) {
  const hook = _useRelayerSignature()
  return (
    <RelayerSignatureContext.Provider value={hook}>{children}</RelayerSignatureContext.Provider>
  )
}

export const useRelayerSignature = (): UseRelayerSignatureResponse =>
  useMandatoryContext(RelayerSignatureContext, 'Signature')
