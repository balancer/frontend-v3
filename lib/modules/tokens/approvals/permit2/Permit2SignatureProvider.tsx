'use client'

import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { Permit2 } from '@balancer/sdk'
import { PropsWithChildren, createContext, useState } from 'react'

export enum SignPermit2State {
  Ready = 'init',
  Confirming = 'confirming',
  Preparing = 'preparing',
  Completed = 'completed',
}

export type UsePermit2SignatureResponse = ReturnType<typeof _usePermit2Signature>
export const Permit2SignatureContext = createContext<UsePermit2SignatureResponse | null>(null)

export function _usePermit2Signature() {
  const [permit2TransferSignature, setPermit2TransferSignature] = useState<Permit2 | undefined>()

  const [signPermit2State, setSignPermit2State] = useState<SignPermit2State>(
    SignPermit2State.Preparing
  )

  return {
    permit2TransferSignature,
    setPermit2TransferSignature,
    signPermit2State,
    setSignPermit2State,
  }
}

export function Permit2SignatureProvider({ children }: PropsWithChildren) {
  const hook = _usePermit2Signature()
  return (
    <Permit2SignatureContext.Provider value={hook}>{children}</Permit2SignatureContext.Provider>
  )
}

export const usePermit2Signature = (): UsePermit2SignatureResponse =>
  useMandatoryContext(Permit2SignatureContext, 'Permit2Signature')
