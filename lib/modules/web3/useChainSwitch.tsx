/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { createContext, ReactNode, useEffect } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useNetwork, useSwitchNetwork } from 'wagmi'
import { makeVar, useReactiveVar } from '@apollo/client'
import { Box, useToast } from '@chakra-ui/react'

export const connectedChainVar = makeVar(0)

export function _useChainSwitch() {
  const toast = useToast()
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
  const connectedChain = useReactiveVar(connectedChainVar)

  const isConnectedChain = connectedChain === chain?.id

  function setConnectedChain(chainId: number) {
    connectedChainVar(chainId)
  }

  useEffect(() => {
    if (!isConnectedChain) {
      toast({
        position: 'bottom-left',
        render: () => (
          <Box color="white" p={3} bg="blue.500">
            Hello World
          </Box>
        ),
      })
    }
  }, [isConnectedChain])

  return {
    connectedChain,
    isConnectedChain,
    setConnectedChain,
  }
}

export const ChainSwitchContext = createContext<ReturnType<typeof _useChainSwitch> | null>(null)

export function ChainSwitchProvider({ children }: { children: ReactNode }) {
  const hook = _useChainSwitch()
  return <ChainSwitchContext.Provider value={hook}>{children}</ChainSwitchContext.Provider>
}

export function useChainSwitch() {
  return useMandatoryContext(ChainSwitchContext, 'ChainSwitch')
}
