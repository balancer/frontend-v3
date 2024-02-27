/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useNetwork, useSwitchNetwork } from 'wagmi'
import { makeVar, useReactiveVar } from '@apollo/client'
import { Button } from '@chakra-ui/react'
import { getChainShortName } from '@/lib/config/app.config'
import { SupportedChainId } from '@/lib/config/config.types'

export const connectToChainVar = makeVar(0)

export function useChainSwitch(chainId: SupportedChainId) {
  const { chain: connectedChain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
  const connectToChain = useReactiveVar(connectToChainVar)

  const isConnectedChain = chainId === connectedChain?.id

  function setConnectToChain(chainId: SupportedChainId) {
    connectToChainVar(chainId)
  }

  const networkSwitchButtonProps = {
    name: getChainShortName(chainId),
    switchNetwork,
    chainId,
    isLoading,
  }

  return {
    connectToChain,
    isConnectedChain,
    setConnectToChain,
    NetworkSwitchButton,
    networkSwitchButtonProps,
  }
}

export interface NetworkSwitchButtonProps {
  name: string
  switchNetwork: ((chainId_?: number | undefined) => void) | undefined
  chainId: number
  isLoading: boolean
}

export const NetworkSwitchButton: React.FC<NetworkSwitchButtonProps> = function ({
  ...networkSwitchButtonProps
}) {
  return (
    <Button
      w="full"
      onClick={() => networkSwitchButtonProps.switchNetwork?.(networkSwitchButtonProps.chainId)}
      isLoading={networkSwitchButtonProps.isLoading}
    >
      Switch network to {networkSwitchButtonProps.name}
    </Button>
  )
}
