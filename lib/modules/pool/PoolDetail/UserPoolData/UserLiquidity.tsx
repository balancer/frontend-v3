import React from 'react'
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  HStack,
  StackDivider,
  Badge,
  Card,
  Stack,
} from '@chakra-ui/react'
import { useUserPoolData } from './useUserPoolData'

export function UserLiquidity() {
  const { btns, poolComposition } = useUserPoolData()

  return (
    <Card p={4} rounded="lg" shadow="base" flex={2}>
      <Stack divider={<StackDivider borderColor="gray.200" />} spacing={4}>
        <Stack w="full">
          <Flex justifyContent="space-between" w="full" alignItems="center">
            <Text fontWeight="bold">My liquidity</Text>
            <Text fontSize="sm">40 000$</Text>
          </Flex>
          <Flex justifyContent="space-between" w="full" alignItems="center">
            <Text>APR</Text>
            <Text fontSize="sm">15%</Text>
          </Flex>
        </Stack>

        <Stack justifyContent="space-between" w="full" alignItems="center">
          {poolComposition.map(token => (
            <HStack key={token.symbol} w="full" justifyContent="space-between">
              <VStack alignItems="start">
                <Text fontWeight="bold">{token.symbol}</Text>
                <Text fontSize="sm">{token.symbol}</Text>
              </VStack>

              <VStack alignItems="end">
                <Text fontWeight="bold">{token.balance}</Text>
                <Text fontSize="sm">{token.balance}</Text>
              </VStack>
            </HStack>
          ))}
        </Stack>

        <HStack justifyContent="space-around" w="full">
          {btns.map(btn => (
            <Button key={btn.title} variant={btn.variant} flex="1">
              {btn.title}
            </Button>
          ))}
        </HStack>
      </Stack>
    </Card>
  )
}
