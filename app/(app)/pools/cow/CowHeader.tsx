'use client'

import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { Box, Card, Center, Heading, Link, VStack, Image } from '@chakra-ui/react'
import { ArrowUpRight } from 'react-feather'

export function CowHeader() {
  return (
    <FadeInOnView animateOnce={false}>
      <Card
        mb={{ base: '2xl', sm: '3xl' }}
        backgroundImage={{
          base: '/images/partners/cow/banner-mobile.svg',
          md: '/images/partners/cow/banner-desktop.svg',
        }}
        backgroundSize="cover"
        backgroundPosition={{ base: 'bottom', md: 'bottom' }}
      >
        <Center>
          <VStack p="xl" maxW="xl" textAlign="center" spacing="lg">
            <Heading
              color="#BCEC79"
              sx={{
                textWrap: 'balance',
              }}
            >
              The first MEV-capturing AMM
            </Heading>
            <Box color="#BCEC79">
              CoW AMM protects LPs from LVR so they can provide liquidity with less risk and more
              return.{' '}
              <Link
                href="https://cow.fi/cow-amm"
                textDecoration="underline"
                isExternal
                color="#BCEC79"
                _hover={{ color: '#fff' }}
                role="group"
                position="relative"
              >
                Learn more
                <Box
                  display="inline"
                  position="absolute"
                  transition="transform 0.2s var(--ease-out-cubic)"
                  _groupHover={{ transform: 'translateX(1.5px)' }}
                >
                  <ArrowUpRight size={14} style={{ display: 'inline' }} />
                </Box>
              </Link>
            </Box>
            <Image src="/images/partners/cow/cow-amm-logo.svg" alt="cow-logo" h="30px" />
          </VStack>
        </Center>
      </Card>
    </FadeInOnView>
  )
}
