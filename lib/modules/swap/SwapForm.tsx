'use client'

import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { HumanAmount } from '@balancer/sdk'
import {
  Card,
  Center,
  HStack,
  Heading,
  VStack,
  Tooltip,
  useDisclosure,
  IconButton,
  Button,
  Text,
  Box,
} from '@chakra-ui/react'
import { useMemo, useRef } from 'react'
import { useSwap } from './useSwap'
import { useTokens } from '../tokens/useTokens'
import { TokenSelectModal } from '../tokens/TokenSelectModal/TokenSelectModal'
import { PROJECT_CONFIG } from '@/lib/config/getProjectConfig'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { CgArrowsExchangeV } from 'react-icons/cg'
import { Address } from 'viem'
import { SwapPreviewModal } from './SwapPreviewModal'
import { getChainName } from '@/lib/config/app.config'
import { RichSelect } from '@/lib/shared/components/inputs/RichSelect'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { FiGlobe } from 'react-icons/fi'
import { TransactionSettings } from '../user/settings/TransactionSettings'
import { SwapDetailsAccordian } from './SwapDetailsAccordian'
import { ChevronDownIcon } from '@chakra-ui/icons'

export function SwapForm() {
  const {
    tokenIn,
    tokenOut,
    selectedChain,
    tokenSelectKey,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    simulationQuery,
    setSelectedChain,
    setTokenInAmount,
    setTokenOutAmount,
    setTokenSelectKey,
    setTokenIn,
    setTokenOut,
    switchTokens,
  } = useSwap()
  const { getTokensByChain } = useTokens()
  const tokenSelectDisclosure = useDisclosure()

  const nextBtn = useRef(null)

  const networkOptions = PROJECT_CONFIG.supportedNetworks.map(network => ({
    label: (
      <HStack>
        <NetworkIcon chain={network} size={6} />
        <Text>{getChainName(network)}</Text>
      </HStack>
    ),
    value: network,
  }))

  const tokenMap = { tokenIn, tokenOut }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tokens = useMemo(() => getTokensByChain(selectedChain), [selectedChain])

  // Exclude the currently selected token from the token select modal search.
  const tokenSelectTokens = tokens.filter(
    token =>
      !isSameAddress(
        token.address,
        tokenMap[tokenSelectKey === 'tokenIn' ? 'tokenOut' : 'tokenIn'].address
      )
  )

  function handleTokenSelect(token: GqlToken) {
    if (tokenSelectKey === 'tokenIn') {
      setTokenIn(token.address as Address)
    } else if (tokenSelectKey === 'tokenOut') {
      setTokenOut(token.address as Address)
    } else {
      console.error('Unhandled token select key', tokenSelectKey)
    }
  }

  function openTokenSelectModal(tokenSelectKey: 'tokenIn' | 'tokenOut') {
    setTokenSelectKey(tokenSelectKey)
    tokenSelectDisclosure.onOpen()
  }

  return (
    <TokenBalancesProvider tokens={tokens}>
      <Center h="full" w="full" maxW="lg" mx="auto">
        <Card variant="level3" shadow="xl" w="full" p="md">
          <VStack spacing="lg" align="start">
            <HStack w="full" justify="space-between">
              <Heading fontWeight="bold" size="h5">
                Swap
              </Heading>
              <TransactionSettings size="sm" />
            </HStack>
            <VStack spacing="md" w="full">
              <RichSelect
                value={selectedChain}
                options={networkOptions}
                onChange={newValue => {
                  setSelectedChain(newValue as GqlChain)
                }}
                rightIcon={
                  <HStack>
                    <FiGlobe />
                    <ChevronDownIcon fontWeight="bold" fontSize="xl" />
                  </HStack>
                }
              />
              <VStack w="full">
                <TokenInput
                  address={tokenIn.address}
                  chain={selectedChain}
                  value={tokenIn.amount}
                  onChange={e => setTokenInAmount(e.currentTarget.value as HumanAmount)}
                  toggleTokenSelect={() => openTokenSelectModal('tokenIn')}
                />
                <Box position="relative" border="red 1px solid">
                  <IconButton
                    position="absolute"
                    variant="tertiary"
                    size="sm"
                    fontSize="2xl"
                    ml="-16px"
                    mt="-16px"
                    isRound={true}
                    aria-label="Switch tokens"
                    icon={<CgArrowsExchangeV />}
                    onClick={switchTokens}
                  />
                </Box>
                <TokenInput
                  address={tokenOut.address}
                  chain={selectedChain}
                  value={tokenOut.amount}
                  onChange={e => setTokenOutAmount(e.currentTarget.value as HumanAmount)}
                  toggleTokenSelect={() => openTokenSelectModal('tokenOut')}
                />
              </VStack>
            </VStack>

            {simulationQuery.data && <SwapDetailsAccordian />}

            <Tooltip label={isDisabled ? disabledReason : ''}>
              <Button
                ref={nextBtn}
                variant="secondary"
                w="full"
                size="lg"
                isDisabled={isDisabled}
                onClick={() => !isDisabled && previewModalDisclosure.onOpen()}
              >
                Next
              </Button>
            </Tooltip>
          </VStack>
        </Card>
      </Center>
      <TokenSelectModal
        chain={selectedChain}
        tokens={tokenSelectTokens}
        isOpen={tokenSelectDisclosure.isOpen}
        onOpen={tokenSelectDisclosure.onOpen}
        onClose={tokenSelectDisclosure.onClose}
        onTokenSelect={handleTokenSelect}
      />
      <SwapPreviewModal
        finalFocusRef={nextBtn}
        isOpen={previewModalDisclosure.isOpen}
        onOpen={previewModalDisclosure.onOpen}
        onClose={previewModalDisclosure.onClose}
      />
    </TokenBalancesProvider>
  )
}
