'use client'

import { getVariantConfig } from '@/lib/modules/pool/pool.hooks'
import { PartnerVariant } from '@/lib/modules/pool/pool.types'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { Picture } from '@/lib/shared/components/other/Picture'
import { Box } from '@chakra-ui/react'

export function CowFooter() {
  const { banners } = getVariantConfig(PartnerVariant.cow)

  return (
    <FadeInOnView animateOnce={false}>
      <Box maxW="maxContent" mx="auto" px={['ms', 'md']} pt="xl">
        {banners?.footerSrc && (
          <Picture
            imgName="cow-footer"
            altText="CoW AMM footer"
            defaultImgType="svg"
            imgSvg={true}
            imgSvgPortraitDark={true}
            imgSvgPortrait={true}
            imgSvgDark={true}
            directory="/images/partners/"
          />
        )}
      </Box>
    </FadeInOnView>
  )
}
