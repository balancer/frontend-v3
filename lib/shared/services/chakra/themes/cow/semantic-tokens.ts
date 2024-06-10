import { getSemanticTokens } from '../base/semantic-tokens'

export function getCowSemanticTokens(tokens: any, colors: any) {
  const baseSemanticTokens = getSemanticTokens(tokens, colors)

  return {
    ...baseSemanticTokens,
    colors: {
      ...baseSemanticTokens.colors,
      background: {
        level0: {
          default: tokens.colors.light.background.level0,
        },
        level1: {
          default: tokens.colors.light.background.level1,
        },
        level2: {
          default: tokens.colors.light.background.level2,
        },
        level3: {
          default: tokens.colors.light.background.level3,
        },
        level4: {
          default: tokens.colors.light.background.level4,
        },
      },
    },
  }
}
