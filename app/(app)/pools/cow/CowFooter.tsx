'use client'

import { getVariantConfig } from '@/lib/modules/pool/pool.hooks'
import { PartnerVariant } from '@/lib/modules/pool/pool.types'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { Image } from '@chakra-ui/react'

export function CowFooter() {
  const { banners } = getVariantConfig(PartnerVariant.cow)

  return (
    <FadeInOnView animateOnce={false}>
      {banners?.footerSrc && <Image src={banners.footerSrc} alt="cow-footer" />}
    </FadeInOnView>
  )
}
