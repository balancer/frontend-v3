import { ThemeTypings, extendTheme } from '@chakra-ui/react'
import { colors, primaryTextColor } from './colors'
import { getTokens } from '../base/tokens'
import { getComponents } from '../base/components'
import { config, fonts, styles } from '../base/foundations'
import { proseTheme } from '../base/prose'
import { getCowSemanticTokens } from './semantic-tokens'

const tokens = getTokens(colors, primaryTextColor)
const components = getComponents(tokens, primaryTextColor)
const semanticTokens = getCowSemanticTokens(tokens, colors)

export const cowTheme = {
  config,
  fonts,
  styles,
  colors,
  semanticTokens,
  components,
}

export const theme = extendTheme(cowTheme, proseTheme) as ThemeTypings
