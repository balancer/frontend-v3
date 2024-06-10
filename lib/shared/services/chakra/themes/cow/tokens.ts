import { getTokens } from '../base/tokens'

export function getCowTokens(colors: any, primaryTextColor: any) {
  const baseTokens = getTokens(colors, primaryTextColor)

  return {
    ...baseTokens,
    colors: {
      ...baseTokens.colors,
      light: {
        ...baseTokens.colors.light,
        background: {
          ...baseTokens.colors.light.background,
          level0: '#091D02',
          level1: '#0C2602',
          level2: '#0C2602',
          level3: '#0C2602',
          level4: '#408A13',
        },
      },
      dark: {
        ...baseTokens.colors.dark,
        background: {
          ...baseTokens.colors.dark.background,
          level0: '#091D02',
          level1: '#0C2602',
          level2: '#0C2602',
          level3: '#0C2602',
          level4: '#408A13',
        },
      },
    },
  }
}
