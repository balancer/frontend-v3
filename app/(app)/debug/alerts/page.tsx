'use client'

import { BalAlert } from '@/lib/shared/components/alerts/BalAlert'
import { BalAlertButton } from '@/lib/shared/components/alerts/BalAlertButton'
import { BalAlertTitle } from '@/lib/shared/components/alerts/BalAlertTitle'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { Button, Link, VStack, transform } from '@chakra-ui/react'
import { ArrowUpRight } from 'react-feather'

export default function Page() {
  return (
    <VStack width="full">
      <BalAlert title={<TitleWithButton title="Info alert" />} status="info" />
      <BalAlert title={<TitleWithButton title="Warning alert" />} status="warning" />
      <BalAlert title={<TitleWithButton title="Error alert" />} status="error" />
      <BalAlert title={<TitleWithButton title="Success alert" />} status="success" />
      <BalAlert
        title="Warning alert with close button (soft warning)"
        status="warning"
        isSoftWarning={true}
      />
      <BalAlert title="Error alert with learnMoreLink" status="error" learnMoreLink="alerts" />
      <BalAlert
        title={<TitleWithLink title="Error alert with alternative learn more link" href="alerts" />}
        status="error"
      />
    </VStack>
  )
}

function TitleWithButton({ title }: { title: string }) {
  return (
    <BalAlertTitle title={title}>
      <BalAlertButton onClick={() => console.log('Clicked')}>Click me</BalAlertButton>
    </BalAlertTitle>
  )
}

// TODO: alternative implementation of link inside alert
function TitleWithLink({ title, href }: { title: string; href: string }) {
  const colorMode = useThemeColorMode()
  const isDark = colorMode === 'dark'

  return (
    <BalAlertTitle title={title}>
      <Button
        as={Link}
        target="_blank"
        href={href}
        width="auto"
        variant="outline"
        h="24px"
        py="md"
        my="-2"
        borderColor={isDark ? 'white' : 'black'}
        _hover={{ transform: 'scale(1.05)' }}
        rightIcon={<ArrowUpRight />}
      >
        Learn more
      </Button>
    </BalAlertTitle>
  )
}
