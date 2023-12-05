'use client'

import { Navbar } from '@/lib/shared/components/navs/Navbar'
import { Box, VStack, Card, Text } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { PoolActionsNav } from './PoolActionsNav'
import { usePool } from '../usePool'

export function PoolActionsLayout({ children }: PropsWithChildren) {
  const { pool } = usePool()

  return (
    <Box pos="absolute" top={0} left={0} w="full" h="full" bg="transparent" zIndex={100}>
      <VStack
        pos="absolute"
        top={0}
        left={0}
        w="full"
        h="full"
        bg="blackAlpha.700"
        backdropFilter="blur(3px) hue-rotate(90deg)"
        zIndex={101}
      >
        <Navbar leftSlot={<Text color="white">{pool.name}</Text>} />
        <Box w="full" px="md" flexGrow="1">
          <Card
            variant="level1"
            shadow="lg"
            w="full"
            h="full"
            borderBottomRadius={0}
            borderTopRadius="2xl"
            p="md"
          >
            <PoolActionsNav />
            {children}
          </Card>
        </Box>
      </VStack>
    </Box>
  )
}
