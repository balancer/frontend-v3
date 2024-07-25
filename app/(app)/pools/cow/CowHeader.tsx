'use client'

import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { Card, Center, Heading, Link, Text, VStack, Image } from '@chakra-ui/react'
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
            <Heading>The first MEV-capturing AMM</Heading>
            <Text>
              CoW AMM protects LPs from LVR so they can provide liquidity with less risk and more
              return.{' '}
              <Link href="https://cow.fi/cow-amm" textDecoration="underline" isExternal>
                Learn more
                <ArrowUpRight size={16} style={{ display: 'inline' }} />
              </Link>
            </Text>
            <Image src="/images/partners/cow/cow-amm-logo.svg" alt="cow-logo" h="30px" />
          </VStack>
        </Center>
      </Card>
    </FadeInOnView>
  )
}
