import { colors as baseColors } from '../base/colors'

export const colors = {
  ...baseColors,
  base: {
    light: 'blue.300',
    hslLight: '44,22%,90%',
    dark: 'blue.800',
    hslDark: '216,12%,25%',
  },
}

export const primaryTextColor = `linear-gradient(45deg, ${colors.gray['700']} 0%, ${colors.gray['500']} 100%)`
