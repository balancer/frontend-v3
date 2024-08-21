'use client'

import { Navbar } from '@/lib/shared/components/navs/Navbar'
import { Box, VStack, Card, useColorModeValue } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { PoolActionsNav } from './PoolActionsNav'
import { usePool } from '../PoolProvider'
import { usePoolRedirect } from '../pool.hooks'
import { PoolName } from '../PoolName'

type Props = PropsWithChildren

export function PoolActionsLayout({ children }: Props) {
  const { pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  const bg = useColorModeValue('whiteAlpha.100', 'blackAlpha.500')
  const fontColor = useColorModeValue('font.dark', 'font.light')
  const blur = useColorModeValue('blur(8px) hue-rotate(90deg)', 'blur(3px) hue-rotate(90deg)')

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
      <VStack w="full" bg={bg} backdropFilter={blur} zIndex={51} onClick={redirectToPoolPage}>
        <Navbar leftSlot={<PoolName pool={pool} color={fontColor} />} />
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
