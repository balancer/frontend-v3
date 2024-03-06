'use client'
import { Heading, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'

export default function Debug() {
  return (
    <VStack padding="lg" margin="lg">
      <Heading size="md">Demos</Heading>
      <Link
        as={NextLink}
        href="pools/ethereum/v2/0x68e3266c9c8bbd44ad9dca5afbfe629022aee9fe000200000000000000000512/add-liquidity"
      >
        Add liquidity in wjAura-weth (unbalanced)
      </Link>
      <Link
        as={NextLink}
        href="pools/ethereum/v2/0x08775ccb6674d6bdceb0797c364c2653ed84f3840002000000000000000004f0/add-liquidity"
      >
        Add liquidity in nested pool (50WETH-50-3pool)
      </Link>
      <Link
        as={NextLink}
        href="pools/polygon/v2/0xee278d943584dd8640eaf4cc6c7a5c80c0073e85000200000000000000000bc7/add-liquidity"
      >
        Add liquidity in Gyro pool (2CLP_WMATIC/MATICX)
      </Link>
      <Link
        as={NextLink}
        href="pools/ethereum/v2/0x4fd4687ec38220f805b6363c3c1e52d0df3b5023000200000000000000000473"
      >
        Pool in recovery mode
      </Link>
      <Link
        as={NextLink}
        href="pools/ethereum/v2/0x4fd4687ec38220f805b6363c3c1e52d0df3b5023000200000000000000000473"
      >
        Pool in recovery mode
      </Link>
      <Link as={NextLink} href="/debug/token-select">
        Token select
      </Link>
      <Link as={NextLink} href="/debug/token-input">
        Token input
      </Link>
      <Link as={NextLink} href="/debug/sentry">
        Sentry
      </Link>
    </VStack>
  )
}
