import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(cardAnatomy.keys)

const variants = {
  gradient: definePartsStyle({
    container: {
      width: 'full',
      height: 'full',
      rounded: '2xl',
      backgroundColor: 'transparent',
      backgroundImage: `radial-gradient(
            farthest-corner at 80px 0px,
            rgba(235, 220, 204, 0.3) 0%,
            rgba(255, 255, 255, 0.0) 100%
          )`,
    },
  }),
}

export const cardTheme = defineMultiStyleConfig({ variants })
