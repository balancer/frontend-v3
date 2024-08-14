'use client'

import { Navbar } from '@/lib/shared/components/navs/Navbar'
import { Box, VStack, Card } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { PoolActionsNav } from './PoolActionsNav'
import { usePool } from '../PoolProvider'
import { usePoolRedirect } from '../pool.hooks'
import { PoolName } from '../PoolName'

type Props = PropsWithChildren

export function PoolActionsLayout({ children }: Props) {
  const { pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  return (
    <Box
      pos="absolute"
      top={0}
      left={0}
      w="full"
      bg="transparent"
      zIndex={100}
      onClick={redirectToPoolPage}
    >
      <VStack
        w="full"
        bg="blackAlpha.700"
        backdropFilter="blur(3px) hue-rotate(90deg)"
        zIndex={51}
        onClick={redirectToPoolPage}
      >
        <Navbar leftSlot={<PoolName pool={pool} color="font.light" />} />
        <Box w="full" px={['0', 'md']} pt="72px">
          <Card
            position="relative"
            variant="level1"
            shadow="lg"
            borderBottomRadius={0}
            borderTopRadius="2xl"
            minH="calc(100vh - 80px)"
            onClick={e => e.stopPropagation()}
          >
            <PoolActionsNav />
            {children}
          </Card>
        </Box>
      </VStack>
    </Box>
  )
}
