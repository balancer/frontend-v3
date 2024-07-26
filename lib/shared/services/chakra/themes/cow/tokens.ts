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
          level0: '#CCF38F',
          level1: '#D5F5A3',
          level2: '#DBF7B1',
          level3: '#E2F8BF',
          level4: '#E8FACC',
          level0WithOpacity: 'rgba(213, 245, 163, 0.96)',
        },
        border: {
          ...baseTokens.colors.light.border,
          base: '#F9FEF1',
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
          level0WithOpacity: 'rgba(9, 29, 2, 0.96)',
        },
        border: {
          ...baseTokens.colors.dark.border,
          base: '#194D05',
        },
      },
    },
  }
}
