'use client'

import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { HumanAmount } from '@balancer/sdk'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Card,
  Center,
  HStack,
  Heading,
  VStack,
  Text,
  Tooltip,
  Button,
  useDisclosure,
  Select,
  IconButton,
} from '@chakra-ui/react'
import { useMemo } from 'react'
import { useSwap } from './useSwap'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { useTokens } from '../tokens/useTokens'
import { TokenSelectModal } from '../tokens/TokenSelectModal/TokenSelectModal'
import { fNum } from '@/lib/shared/utils/numbers'
import { PROJECT_CONFIG } from '@/lib/config/getProjectConfig'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { CgArrowsExchangeV } from 'react-icons/cg'

export function SwapForm() {
  const {
    tokenIn,
    tokenInAmount,
    tokenOut,
    tokenOutAmount,
    selectedChain,
    tokenSelectKey,
    isLoading,
    isDisabled,
    setSelectedChain,
    setTokenInAmount,
    setTokenOutAmount,
    setTokenSelectKey,
    setTokenIn,
    setTokenOut,
    switchTokens,
  } = useSwap()
  const { toCurrency } = useCurrency()
  const { getTokensByChain } = useTokens()
  const tokenSelectDisclosure = useDisclosure()

  const networkOptions = PROJECT_CONFIG.supportedNetworks

  const tokenMap = { tokenIn, tokenOut }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tokens = useMemo(() => getTokensByChain(selectedChain), [selectedChain])
  const tokenSelectTokens = tokens.filter(
    token =>
      !isSameAddress(token.address, tokenMap[tokenSelectKey === 'tokenIn' ? 'tokenOut' : 'tokenIn'])
  )

  function handleTokenSelect(token: GqlToken) {
    if (tokenSelectKey === 'tokenIn') {
      setTokenIn(token.address)
    } else if (tokenSelectKey === 'tokenOut') {
      setTokenOut(token.address)
    } else {
      console.error('Unhandled token select key', tokenSelectKey)
    }
  }

  function openTokenSelectModal(tokenSelectKey: 'tokenIn' | 'tokenOut') {
    setTokenSelectKey(tokenSelectKey)
    tokenSelectDisclosure.onOpen()
  }

  function submit() {
    console.log('submit')
  }

  return (
    <TokenBalancesProvider tokens={tokens}>
      <Center h="full" w="full" maxW="lg" mx="auto">
        <Card variant="level3" shadow="xl" w="full" p="md">
          <VStack spacing="lg" align="start">
            <HStack>
              <Heading fontWeight="bold" size="h5">
                Swap
              </Heading>
            </HStack>
            <VStack spacing="md" w="full">
              <Select
                value={selectedChain}
                onChange={e => {
                  setSelectedChain(e.currentTarget.value as GqlChain)
                }}
              >
                {networkOptions.map(networkOption => (
                  <option key={networkOption} value={networkOption}>
                    {networkOption}
                  </option>
                ))}
              </Select>
              <TokenInput
                address={tokenIn}
                chain={selectedChain}
                value={tokenInAmount}
                onChange={e => setTokenInAmount(e.currentTarget.value as HumanAmount)}
                toggleTokenSelect={() => openTokenSelectModal('tokenIn')}
              />
              <IconButton
                size="sm"
                fontSize="2xl"
                aria-label="Switch tokens"
                icon={<CgArrowsExchangeV />}
                onClick={switchTokens}
              />
              <TokenInput
                address={tokenOut}
                chain={selectedChain}
                value={tokenOutAmount}
                onChange={e => setTokenOutAmount(e.currentTarget.value as HumanAmount)}
                toggleTokenSelect={() => openTokenSelectModal('tokenOut')}
              />
            </VStack>

            <VStack spacing="sm" align="start" w="full">
              <HStack justify="space-between" w="full">
                <Text color="GrayText">Total</Text>
                <HStack>
                  <NumberText color="GrayText">{toCurrency(0)}</NumberText>
                  <Tooltip label="Total" fontSize="sm">
                    <InfoOutlineIcon color="GrayText" />
                  </Tooltip>
                </HStack>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text color="GrayText">Price impact</Text>
                <HStack>
                  <NumberText color="GrayText">{fNum('priceImpact', 0)}</NumberText>
                  <Tooltip label="Price impact" fontSize="sm">
                    <InfoOutlineIcon color="GrayText" />
                  </Tooltip>
                </HStack>
              </HStack>
            </VStack>

            <Tooltip label={isDisabled ? '' : 'cannot execute swap'}>
              <Button
                variant="secondary"
                w="full"
                size="lg"
                isDisabled={isDisabled}
                isLoading={isLoading}
                onClick={submit}
              >
                Swap
              </Button>
            </Tooltip>
          </VStack>
        </Card>
      </Center>
      <TokenSelectModal
        tokens={tokenSelectTokens}
        isOpen={tokenSelectDisclosure.isOpen}
        onOpen={tokenSelectDisclosure.onOpen}
        onClose={tokenSelectDisclosure.onClose}
        onTokenSelect={handleTokenSelect}
      />
    </TokenBalancesProvider>
  )
}
