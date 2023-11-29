'use client'

import { Navbar } from '@/lib/shared/components/navs/Navbar'
import { GetPoolQuery } from '@/lib/shared/services/api/generated/graphql'
import { Box, VStack, Card } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  pool: GetPoolQuery['pool']
}>

export function PoolActionsLayout({ pool, children }: Props) {
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
        <Navbar leftSlot={<div>{pool.name}</div>} />
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
            {children}
          </Card>
        </Box>
      </VStack>
    </Box>
  )
}
