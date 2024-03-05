/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useNetwork, useSwitchNetwork } from 'wagmi'
import { Button } from '@chakra-ui/react'
import { getChainShortName } from '@/lib/config/app.config'
import { SupportedChainId } from '@/lib/config/config.types'

export function useChainSwitch(chainId: SupportedChainId) {
  const { chain: connectedChain } = useNetwork()
  const { isLoading, switchNetwork } = useSwitchNetwork()

  const shouldChangeNetwork = chainId !== connectedChain?.id

  const networkSwitchButtonProps = {
    name: getChainShortName(chainId),
    switchNetwork,
    chainId,
    isLoading,
  }

  return {
    shouldChangeNetwork,
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
      size="lg"
      variant="primary"
      onClick={() => networkSwitchButtonProps.switchNetwork?.(networkSwitchButtonProps.chainId)}
      isLoading={networkSwitchButtonProps.isLoading}
    >
      Switch network to {networkSwitchButtonProps.name}
    </Button>
  )
}
