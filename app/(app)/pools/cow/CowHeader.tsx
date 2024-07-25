'use client'

import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { Card } from '@chakra-ui/react'

export function CowHeader() {
  return (
    <FadeInOnView animateOnce={false}>
      <Card
        h="300px"
        mb={{ base: '2xl', sm: '3xl' }}
        backgroundImage="/images/partners/cow/background-desktop-grain.svg"
        backgroundSize="cover"
        backgroundPosition="center"
      ></Card>
    </FadeInOnView>
  )
}
