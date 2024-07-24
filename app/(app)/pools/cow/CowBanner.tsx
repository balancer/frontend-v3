'use client'

import { getVariantConfig } from '@/lib/modules/pool/pool.hooks'
import { PartnerVariant } from '@/lib/modules/pool/pool.types'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { Box, Image } from '@chakra-ui/react'

export function CowBanner() {
  const { banners } = getVariantConfig(PartnerVariant.cow)

  return (
    <FadeInOnView animateOnce={false}>
      <Box mb={{ base: '2xl', sm: '3xl' }}>
        {banners?.headerSrc && <Image src={banners.headerSrc} alt="Cow banner" />}
      </Box>
    </FadeInOnView>
  )
}
