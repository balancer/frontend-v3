import { ThemeTypings, extendTheme, textDecoration } from '@chakra-ui/react'
import { withProse } from '@nikolovlazar/chakra-ui-prose'
import tinycolor from 'tinycolor2'

export const DEFAULT_THEME_COLOR_MODE = 'dark'

export const balColors = {
  primary: {
    '50': '#eaf6ff',
    '100': '#daedff',
    '200': '#bcddff',
    '300': '#93c6ff',
    '400': '#68a1ff',
    '500': '#457dff',
    '600': '#2554ff',
    '700': '#2048e9',
    '800': '#183bbb',
    '900': '#1d3992',
    '950': '#112055',
  },
  gray: {
    '50': '#F7FAFC',
    '100': '#EDF2F7',
    '200': '#E2E8F0',
    '300': '#CBD5E0',
    '400': '#A0AEC0',
    '500': '#718096',
    '600': '#4A5568',
    '700': '#2D3748',
    '800': '#1A202C',
    '900': '#171923',
  },
  brown: {
    '50': '#F8F3ED',
    '100': '#EBDCCC',
    '200': '#DDC6AB',
    '300': '#D0B08A',
    '400': '#C39A6A',
    '500': '#B68449',
    '600': '#92693A',
    '700': '#6D4F2C',
    '800': '#49351D',
    '900': '#241A0F',
  },
  orange: {
    '50': '#fff7ed',
    '100': '#ffedd5',
    '200': '#fed7aa',
    '300': '#fdba74',
    '400': '#fb923c',
    '500': '#f97316',
    '600': '#ea580c',
    '700': '#c2410c',
    '800': '#9a3412',
    '900': '#7c2d12',
    '950': '#431407',
  },
  red: {
    '50': '#fef4f2',
    '100': '#fde7e3',
    '200': '#fcd4cc',
    '300': '#f9b5a8',
    '400': '#f48975',
    '500': '#ea6249',
    '600': '#d7462b',
    '700': '#b43821',
    '800': '#95321f',
    '900': '#7c2e20',
    '950': '#43150c',
  },
  purple: {
    '50': '#f5f4fe',
    '100': '#ecebfc',
    '200': '#dbdafa',
    '300': '#b3aef5',
    '400': '#9f95f0',
    '500': '#7f6ae8',
    '600': '#6c4add',
    '700': '#5c38c9',
    '800': '#4d2ea9',
    '900': '#40288a',
    '950': '#26175e',
  },
  green: {
    '50': '#eafff6',
    '100': '#cdfee7',
    '200': '#a0fad4',
    '300': '#63f2be',
    '400': '#25e2a4',
    '500': '#00d395',
    '600': '#00a474',
    '700': '#008361',
    '800': '#00674e',
    '900': '#005541',
    '950': '#003026',
  },
  // sand: 'hsla(43,23%,91%,1)',
  base: {
    light: 'hsla(44,22%,90%,1)',
    hslLight: '44,22%,90%',
    dark: 'hsla(216,12%,25%,1)',
    hslDark: '216,12%,25%',
  },
  chartBorder: {
    light: '#edeae3',
    dark: '#4F5764',
  },
  gradient: {
    // dusk: 'linear(to-tr, purple.300 5%, #D7CBE7 50%, #EAA879 95%)',
    // sand: 'linear(to-t, #E6C6A0 0%, #E5D3BE 100%)',
    dawnLight: 'linear-gradient(90deg, #8F86FD 0%, #A66CF3 40%, #F48975 100%)',
    dawnDark: 'linear-gradient(90deg, #B3AEF5 0%, #D7CBE7 25%, #E5C8C8 50%, #EAA879 100%)',
    sunsetLight: 'linear-gradient(45deg, #F06147 0%, #EA9A43 100%)',
    sunsetDark: 'linear-gradient(45deg, #F06147 0%, #EA9A43 100%)',
    sandLight: 'linear-gradient(180deg, #E5D3BE 0%, #E6C6A0 100%)',
    sandDark: 'linear-gradient(180deg, #E5D3BE 0%, #E6C6A0 100%)',
  },
}

// Function to create a color with opacity
const createBackgroundOpacity = (baseColor: string, opacity: number) =>
  `hsla(${baseColor}, ${opacity})`

const primaryTextColor = `linear-gradient(45deg, ${balColors.gray['700']} 0%, ${balColors.gray['500']} 100%)`

export const tokens = {
  colors: {
    light: {
      background: {
        // Background colors
        level0: '#EBE8E0',
        level1: '#EFEDE6',
        level2: '#F5F3EF',
        level3: '#FBFAF9',
        level4: '#FFFFFF',
        base: balColors.base.light,
        baseWithOpacity: createBackgroundOpacity(balColors.base.hslLight, 0.5),
        special: balColors.gradient.dawnLight,
        specialSecondary: balColors.gradient.sunsetLight,
        highlight: balColors.green['600'],
      },
      border: {
        base: '#FFFFFF',
        highlight: balColors.green['600'],
        subduedZen: 'rgba(176, 126, 67, 0.08)',
      },
      // Button colors
      button: {
        background: {
          primary: balColors.gradient.dawnDark,
          secondary: balColors.gradient.sandLight,
        },
        border: {
          disabled: 'gray.400',
        },
        text: {
          tertiary: balColors.gray['600'],
          disabled: 'gray.400',
        },
      },
      // Font colors
      text: {
        primary: balColors.gray['700'],
        secondary: balColors.gray['500'],
        primaryGradient: primaryTextColor,
        secondaryGradient: 'linear-gradient(45deg, #728097 0%, #909BAD 100%)',
        special: balColors.gradient.dawnLight,
        specialSecondary: balColors.gradient.sunsetLight,
        link: balColors.purple['500'],
        linkHover: balColors.purple['700'],
        maxContrast: '#000',
        highlight: balColors.green['600'],
      },
      // Input colors
      input: {
        labelFocus: balColors.purple['500'], // Not implemented
        labelError: balColors.purple['600'], // Not implemented
        fontDefault: 'gray.700',
        fontFocus: 'gray.900',
        fontPlaceholder: tinycolor(balColors.brown['500']).setAlpha(0.5),
        fontError: balColors.red['900'],
        fontHint: 'gray.500',
        fontHintError: balColors.red['600'],
        caret: 'blue.400',
        bgDefault: balColors.base.light,
        bgHover: tinycolor(balColors.base.light).lighten(4),
        bgHoverDisabled: tinycolor(balColors.red[500]).setAlpha(0.2),
        bgFocus: tinycolor(balColors.base.light).lighten(8),
        bgError: tinycolor(balColors.red['50']).setAlpha(0.5),
        bgErrorFocus: tinycolor(balColors.base.light).lighten(8),
        borderDefault: tinycolor(balColors.base.light).darken(10),
        borderHover: balColors.purple['500'],
        borderFocus: balColors.purple['500'],
        borderError: balColors.red['500'],
        borderErrorFocus: balColors.red['600'],
        borderDisabled: 'blue',
        clearIcon: tinycolor(balColors.base.light).lighten(5),
        clearHover: tinycolor(balColors.base.light).lighten(1),
        clearError: balColors.red['500'],
        clearErrorHover: balColors.red['600'],
      },
      icon: {
        base: 'gray.500',
      },
    },
    dark: {
      // Background colors
      background: {
        level0: '#31373F',
        level1: '#383E47',
        level2: '#3F4650',
        level3: '#464D58',
        level4: '#4C5561',
        base: balColors.base.dark,
        baseWithOpacity: createBackgroundOpacity(balColors.base.hslDark, 0.97),
        level0WithOpacity: 'rgba(49, 55, 63, 0.96)',
        special: balColors.gradient.dawnDark,
        specialSecondary: balColors.gradient.sunsetDark,
        highlight: balColors.green['500'],
      },
      // Border colors
      border: {
        base: '#4C5561',
        highlight: balColors.green['500'],
        zen: 'rgba(76, 85, 97, 0.50)',
        subduedZen: 'rgba(229, 211, 190, 0.05)',
      },
      // Button colors
      button: {
        background: {
          primary: balColors.gradient.dawnDark,
          secondary: balColors.gradient.sandDark,
          tertiary: `linear-gradient(180deg, ${tinycolor(balColors.base.dark).lighten(8)} 0%, ${
            balColors.base.dark
          } 100%)`,
        },
        border: {
          tertiary: tinycolor(balColors.base.dark).lighten(15),
          disabled: 'gray.500',
        },
        text: {
          tertiary: balColors.gray['300'],
          disabled: 'gray.500',
        },
      },
      // Font colors
      text: {
        primary: '#E5D3BE',
        secondary: balColors.gray['400'],
        primaryGradient: 'linear-gradient(45deg, #E6C6A0 0%, #E5D3BE 100%)',
        secondaryGradient: 'linear-gradient(45deg, #909BAD 0%, #728097 100%)',
        special: 'linear-gradient(90deg, #B3AEF5 0%, #D7CBE7 25%, #E5C8C8 50%, #EAA879 100%)',
        specialSecondary: 'linear-gradient(180deg, #EA9A43 0%, #F06147 100%)',
        link: balColors.purple['300'],
        linkHover: balColors.purple['100'],
        maxContrast: '#fff',
        highlight: balColors.green['500'],
      },
      input: {
        labelFocus: balColors.purple['400'],
        labelError: balColors.red['400'],

        fontDefault: 'brown.200',
        fontFocus: 'white',
        fontPlaceholder: tinycolor(balColors.gray['500']).setAlpha(0.8),
        fontError: balColors.red['200'],
        fontHint: 'gray.400',
        fontHintError: balColors.red['400'],
        caret: 'green.400',
        bgDefault: tinycolor(balColors.base.dark).darken(2),
        bgHover: tinycolor(balColors.base.dark).darken(4),
        bgHoverDisabled: tinycolor(balColors.red[500]).setAlpha(0.2),
        bgFocus: tinycolor(balColors.base.dark).darken(8),
        bgError: '#474046',
        bgErrorFocus: tinycolor(balColors.base.dark).darken(8),
        borderDefault: tinycolor(balColors.base.dark).lighten(10),
        borderHover: balColors.purple['400'],
        borderFocus: balColors.purple['400'],
        borderError: balColors.red['400'],
        borderErrorFocus: balColors.red['300'],
        borderDisabled: 'yellow',
        clearIcon: tinycolor(balColors.base.dark).lighten(5),
        clearHover: tinycolor(balColors.base.light).lighten(1),
        clearError: balColors.red['400'],
        clearErrorHover: balColors.red['500'],
      },
      icon: {
        base: 'gray.400',
      },
    },
  },
  shadows: {
    light: {
      sm: '0px 0px 0px 1px #49351D05, 1px 1px 1px -0.5px #49351D0F, 3px 3px 3px -1.5px #49351D0F, -0.5px -1px 0px 0px #FFFFFF',
      md: '0px 0px 0px 1px #49351D05, 1px 1px 1px -0.5px #49351D0F, 3px 3px 3px -1.5px #49351D0F, 6px 6px 6px -3px #49351D0F, -0.5px -0.5px 0px 0px #FFFFFF',
      lg: '0px 0px 0px 1px #49351D05, 1px 1px 1px -0.5px #49351D0F, 3px 3px 3px -1.5px #49351D0F, 6px 6px 6px -3px #49351D0F, 12px 12px 12px -6px #49351D0F, -0.5px -1px 0px 0px #FFFFFF',
      xl: '0px 0px 0px 1px #49351D05, 1px 1px 1px -0.5px #49351D0F, 3px 3px 3px -1.5px #49351D0F, 6px 6px 6px -3px #49351D0F, 12px 12px 12px -6px #49351D0F, 24px 24px 24px -12px #49351D0F, -0.5px -1px 0px 0px #FFFFFF',
      '2xl':
        '0px 0px 0px 1px #49351D05, 1px 1px 1px -0.5px #49351D0F, 3px 3px 3px -1.5px #49351D0F, 6px 6px 6px -3px #49351D0F, 12px 12px 12px -6px #49351D0F, 24px 24px 24px -12px #49351D0F, 42px 42px 42px -24px #49351D0F, -0.5px -1px 0px 0px #FFFFFF',
      shadowInnerBase:
        '0px 2px 4px 0px rgba(0, 0, 0, 0.05) inset, 0px 4px 8px 0px rgba(0, 0, 0, 0.05) inset, 0px 10px 20px 0px rgba(0, 0, 0, 0.05) inset',
      btnDefault:
        '0.1rem 0.1rem 0.1rem 0px rgba(255, 255, 255, 0.5) inset, -0.1rem -0.1rem 0.1rem 0px rgba(0, 0, 0, 0.15) inset, 0.125rem 0.125rem 0.125rem 0px rgba(0, 0, 0, 0.15)',
      btnDefaultActive:
        '0px 0px 8px 0px rgba(0, 0, 0, 0.1) inset, 0px 0px 2px 0px rgba(0, 0, 0, 0.1) inset',
      btnTertiary:
        '0.1rem 0.1rem 0.1rem 0px rgba(255, 255, 255, 0.5) inset, -0.1rem -0.1rem 0.1rem 0px rgba(0, 0, 0, 0.15) inset, 0.1rem 0.1rem 0.1rem 0px rgba(0, 0, 0, 0.07)',
      fontDefault: '0px -1px 0px rgba(255, 255, 255, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.2)',
      fontLight: '0px -1px 0px rgba(255, 255, 255, 0.30), 0px 1px 2px rgba(0, 0, 0, 0.20)',
      fontDark: '0px -1px 0px rgba(255, 255, 255, 0.30), 0px 1px 2px rgba(0, 0, 0, 0.05)',
      input: {
        innerBase:
          '0px 2px 4px 0px rgba(0, 0, 0, 0.05) inset, 0px 4px 8px 0px rgba(0, 0, 0, 0.05) inset, 0px 10px 20px 0px rgba(0, 0, 0, 0.05) inset, 0px -1px 0px 0px rgba(255, 255, 255, 0.8) inset',
        innerFocus: `0px 2px 4px 0px ${tinycolor(balColors.purple['500']).setAlpha(
          0.1
        )} inset, 0px 4px 8px 0px ${tinycolor(balColors.purple['500']).setAlpha(
          0.2
        )} inset, 0 0 0 1px ${balColors.purple['500']}`,
        innerError: `0px 2px 4px 0px ${tinycolor(balColors.red['500']).setAlpha(
          0.1
        )} inset, 0px 4px 8px 0px ${tinycolor(balColors.red['500']).setAlpha(
          0.1
        )} inset, 0 0 0 1px ${balColors.red['500']}`,
      },
      innerXl:
        '4px 4px 4px 0px rgba(0, 0, 0, 0.04) inset, 7px 6px 12px 0px rgba(0, 0, 0, 0.08) inset, 40px 40px 80px 0px rgba(0, 0, 0, 0.05) inset, 0px -1px 1px 0px rgba(255, 255, 255, 0.25) inset',
      chartIconInner:
        'drop-shadow(0px 0px 0px rgba(73, 53, 29, 0.02)) drop-shadow(1px 1px 1px rgba(73, 53, 29, 0.06)) drop-shadow(3px 3px 3px rgba(73, 53, 29, 0.06)) drop-shadow(-0.5px -1px 0px #FFF)',
      chartIconOuter:
        'drop-shadow(0px 0px 0px rgba(73, 53, 29, 0.02)) drop-shadow(1px 1px 1px rgba(73, 53, 29, 0.06)) drop-shadow(3px 3px 3px rgba(73, 53, 29, 0.06)) drop-shadow(-0.5px -1px 0px #FFF)',
      chart:
        'drop-shadow(0px 0px 0px rgba(73, 53, 29, 0.4)) drop-shadow(1px 1px 1px rgba(73, 53, 29, 0.09)) drop-shadow(5px 3px 15px rgba(73, 53, 29, 0.3)) drop-shadow(4px -2px 4px rgba(73, 53, 29, 0.2)) drop-shadow(-0.5px -1px 0px #FFF)',
      zen: '0px 4px 4px 0px rgba(0, 0, 0, 0.03);',
    },
    dark: {
      sm: '0px 0px 0px 1px #00000005, 1px 1px 1px -0.5px #0000000F, 3px 3px 3px -1.5px #0000000F',
      md: '0px 0px 0px 1px #00000005, 1px 1px 1px -0.5px #0000000F, 3px 3px 3px -1.5px #0000000F, 6px 6px 6px -3px #0000001A, -0.5px -1px 0px 0px #FFFFFF33',
      lg: '0px 0px 0px 1px #00000005, 1px 1px 1px -0.5px #0000000F, 3px 3px 3px -1.5px #0000000F, 6px 6px 6px -3px #0000000F, 12px 12px 12px -6px #0000001A, 0px -1px 0px 0px #FFFFFF26',
      xl: '0px 0px 0px 1px #00000005, 1px 1px 1px -0.5px #0000000F, 3px 3px 3px -1.5px #0000000F, 6px 6px 6px -3px #0000000F, 12px 12px 12px -6px #0000000F, 24px 24px 24px -12px #0000001A, 0px -1px 0px 0px #FFFFFF26',
      '2xl':
        '0px 0px 0px 1px #00000005, 1px 1px 1px -0.5px #0000000F, 3px 3px 3px -1.5px #0000000F, 6px 6px 6px -3px #0000000F, 12px 12px 12px -6px #0000000F, 24px 24px 24px -12px #0000000F, 42px 42px 42px -24px #0000000F, -0.5px -0.5px 0px 0px #FFFFFF26',
      shadowInnerBase:
        '0px 2px 4px 0px rgba(0, 0, 0, 0.10) inset, 0px 4px 8px 0px rgba(0, 0, 0, 0.10) inset, 0px 10px 20px 0px rgba(0, 0, 0, 0.10) inset',
      btnDefault:
        '0.1rem 0.1rem 0.1rem 0px rgba(255, 255, 255, 0.75) inset, -0.1rem -0.1rem 0.1rem 0px rgba(0, 0, 0, 0.3) inset, 0.125rem 0.125rem 0.125rem 0px rgba(0, 0, 0, 0.25)',
      btnDefaultActive:
        '0px 0px 8px 0px rgba(0, 0, 0, 0.50) inset, 0px 0px 4px 0px rgba(0, 0, 0, 0.70) inset',
      btnTertiary:
        '0.1rem 0.1rem 0.1rem 0px rgba(255, 255, 255, 0.05) inset, -0.1rem -0.1rem 0.1rem 0px rgba(0, 0, 0, 0.15) inset, 0.125rem 0.125rem 0.125rem 0px rgba(0, 0, 0, 0.09)',
      fontDefault: '0px -1px 0px rgba(255, 255, 255, 0.30), 0px 1px 2px rgba(0, 0, 0, 0.20)',
      fontLight: '0px -1px 0px rgba(255, 255, 255, 0.30), 0px 1px 2px rgba(0, 0, 0, 0.20)',
      fontDark: '0px -1px 0px rgba(255, 255, 255, 0.30), 0px 1px 2px rgba(0, 0, 0, 0.20)',
      input: {
        innerBase:
          '0px 2px 4px 0px rgba(0, 0, 0, 0.10) inset, 0px 4px 8px 0px rgba(0, 0, 0, 0.10) inset, 0px 10px 20px 0px rgba(0, 0, 0, 0.10) inset, 0px -1px 0px 0px rgba(255, 255, 255, 0.15) inset',
        innerFocus: `0px 2px 4px 0px ${tinycolor(balColors.purple['400']).setAlpha(
          0.1
        )} inset, 0px 4px 8px 0px ${tinycolor(balColors.purple['400']).setAlpha(
          0.2
        )} inset, 0 0 0 1px ${balColors.purple['400']}`,
        innerError: `0px 2px 4px 0px ${tinycolor(balColors.red['500']).setAlpha(
          0.2
        )} inset, 0px 4px 8px 0px ${tinycolor(balColors.red['500']).setAlpha(
          0.2
        )} inset, 0 0 0 1px ${balColors.red['500']}`,
      },
      innerXl:
        '20px 20px 50px 0px rgba(0, 0, 0, 0.25) inset, 10px 10px 25px 0px rgba(0, 0, 0, 0.18) inset, 2px 2px 11px 0px rgba(0, 0, 0, 0.19) inset, 0px -1px 1px 0px #FFFFFF40 inset',

      chartIconInner:
        'drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.02)) drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.06)) drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.06))',
      chartIconOuter:
        'drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.2)) drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.1)) drop-shadow(3px 5px 5px rgba(0, 0, 0, 0.2))',
      chart:
        'drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.02)) drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.1)) drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.1)) drop-shadow(6px 6px 6px rgba(0, 0, 0, 0.1)) drop-shadow(12px 12px 12px rgba(0, 0, 0, 0.06)) drop-shadow(42px 42px 42px rgba(0, 0, 0, 0.06))',
      zen: '0px 4px 4px 0px rgba(0, 0, 0, 0.10)',
    },
  },
  transition: {
    default: 'all 0.3s ease-in-out',
    fast: 'all 0.2s ease-in-out',
    slow: 'all 0.5s ease-in-out',
  },
}

export const balTheme = {
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: `inherit`,
    body: `inherit`,
  },
  colors: {
    ...balColors,
  },
  semanticTokens: {
    colors: {
      primary: { _light: 'primary.500', _dark: 'primary.500' },
      grayText: {
        default: tokens.colors.light.text.secondary,
        _dark: tokens.colors.dark.text.secondary,
      },
      gradients: {
        text: {
          heading: {
            from: '#707883',
            to: '#2D4C7E',
          },
        },
        button: {
          sand: {
            from: '#E5D3BE',
            to: '#E6C6A0',
          },
        },
      },

      // Background colors
      background: {
        level0: {
          default: tokens.colors.light.background.level0,
          _dark: tokens.colors.dark.background.level0,
        },
        level1: {
          default: tokens.colors.light.background.level1,
          _dark: tokens.colors.dark.background.level1,
        },
        level2: {
          default: tokens.colors.light.background.level2,
          _dark: tokens.colors.dark.background.level2,
        },
        level3: {
          default: tokens.colors.light.background.level3,
          _dark: tokens.colors.dark.background.level3,
        },
        level4: {
          default: tokens.colors.light.background.level4,
          _dark: tokens.colors.dark.background.level4,
        },
        base: {
          default: tokens.colors.light.background.base,
          _dark: tokens.colors.dark.background.base,
        },
        baseWithOpacity: {
          default: tokens.colors.light.background.baseWithOpacity,
          _dark: tokens.colors.dark.background.baseWithOpacity,
        },
        level0WithOpacity: {
          default: tokens.colors.light.background.baseWithOpacity,
          _dark: tokens.colors.dark.background.level0WithOpacity,
        },
        special: {
          default: tokens.colors.light.background.special,
          _dark: tokens.colors.dark.background.special,
        },
        specialSecondary: {
          default: tokens.colors.light.background.specialSecondary,
          _dark: tokens.colors.dark.background.specialSecondary,
        },
        highlight: {
          default: tokens.colors.light.background.highlight,
          _dark: tokens.colors.dark.background.highlight,
        },
        button: {
          primary: {
            default: tokens.colors.light.button.background.primary,
            _dark: tokens.colors.dark.button.background.primary,
          },
          secondary: {
            default: tokens.colors.light.button.background.secondary,
            _dark: tokens.colors.dark.button.background.secondary,
          },
        },
      },
      input: {
        fontDefault: {
          default: tokens.colors.light.input.fontDefault,
          _dark: tokens.colors.dark.input.fontDefault,
        },
        fontPlaceholder: {
          default: tokens.colors.light.input.fontPlaceholder,
          _dark: tokens.colors.dark.input.fontPlaceholder,
        },
        fontFocus: {
          default: tokens.colors.light.input.fontFocus,
          _dark: tokens.colors.dark.input.fontFocus,
        },
        fontError: {
          default: tokens.colors.light.input.fontError,
          _dark: tokens.colors.dark.input.fontError,
        },
        fontHint: {
          default: tokens.colors.light.input.fontHint,
          _dark: tokens.colors.dark.input.fontHint,
        },
        fontHintError: {
          default: tokens.colors.light.input.fontHintError,
          _dark: tokens.colors.dark.input.fontHintError,
        },
        borderDefault: {
          default: tokens.colors.light.input.borderDefault,
          _dark: tokens.colors.dark.input.borderDefault,
        },
        borderHover: {
          default: tokens.colors.light.input.borderHover,
          _dark: tokens.colors.dark.input.borderHover,
        },
        borderFocus: {
          default: tokens.colors.light.input.borderFocus,
          _dark: tokens.colors.dark.input.borderFocus,
        },
        borderError: {
          default: tokens.colors.light.input.borderError,
          _dark: tokens.colors.dark.input.borderError,
        },
        borderErrorFocus: {
          default: tokens.colors.light.input.borderErrorFocus,
          _dark: tokens.colors.dark.input.borderErrorFocus,
        },
        borderDisabled: {
          default: tokens.colors.light.input.borderDisabled,
          _dark: tokens.colors.dark.input.borderDisabled,
        },
        caret: {
          default: tokens.colors.light.input.caret,
          _dark: tokens.colors.dark.input.caret,
        },
        bgDefault: {
          default: tokens.colors.light.input.bgDefault,
          _dark: tokens.colors.dark.input.bgDefault,
        },
        bgHover: {
          default: tokens.colors.light.input.bgHover,
          _dark: tokens.colors.dark.input.bgHover,
        },
        bgHoverDisabled: {
          default: tokens.colors.light.input.bgHoverDisabled,
          _dark: tokens.colors.dark.input.bgHoverDisabled,
        },
        bgFocus: {
          default: tokens.colors.light.input.bgFocus,
          _dark: tokens.colors.dark.input.bgFocus,
        },
        bgError: {
          default: tokens.colors.light.input.bgError,
          _dark: tokens.colors.dark.input.bgError,
        },
        bgErrorFocus: {
          default: tokens.colors.light.input.bgErrorFocus,
          _dark: tokens.colors.dark.input.bgErrorFocus,
        },
        clearIcon: {
          default: tokens.colors.light.input.clearIcon,
          _dark: tokens.colors.dark.input.clearIcon,
        },
      },
      formLabel: {
        focus: {
          default: tokens.colors.light.input.labelFocus,
          _dark: tokens.colors.dark.input.labelFocus,
        },
        error: {
          default: tokens.colors.light.input.labelError,
          _dark: tokens.colors.dark.input.labelError,
        },
      },
      formErrorMessage: {
        default: tokens.colors.light.input.labelError,
        _dark: tokens.colors.dark.input.labelError,
      },
      backgroundImage: {
        card: {
          gradient: {
            default: `radial-gradient(
                farthest-corner at 80px 0px,
                rgba(235, 220, 204, 0.3) 0%,
                rgba(255, 255, 255, 0.0) 100%
              )`,
            _dark: `radial-gradient(
                farthest-corner at 80px 0px,
                rgba(180, 189, 200, 0.3) 0%,
                rgba(255, 255, 255, 0.0) 100%
              )`,
          },
        },
      },

      border: {
        base: {
          default: tokens.colors.light.background.level4,
          _dark: tokens.colors.dark.background.level4,
        },
        highlight: {
          default: tokens.colors.light.border.highlight,
          _dark: tokens.colors.dark.border.highlight,
        },
        button: {
          disabled: {
            default: tokens.colors.light.button.border.disabled,
            _dark: tokens.colors.dark.button.border.disabled,
          },
        },
        zen: {
          default: 'brown.50',
          _dark: tokens.colors.dark.border.zen,
        },
        subduedZen: {
          default: tokens.colors.light.border.subduedZen,
          _dark: tokens.colors.dark.border.subduedZen,
        },
      },

      icon: {
        base: {
          default: tokens.colors.light.icon.base,
          _dark: tokens.colors.dark.icon.base,
        },
      },

      // Text colors
      font: {
        primary: {
          default: tokens.colors.light.text.primary,
          _dark: tokens.colors.dark.text.primary,
        },
        secondary: {
          default: tokens.colors.light.text.secondary,
          _dark: tokens.colors.dark.text.secondary,
        },
        primaryGradient: {
          default: tokens.colors.light.text.primaryGradient,
          _dark: tokens.colors.dark.text.primaryGradient,
        },
        secondaryGradient: {
          default: tokens.colors.light.text.secondaryGradient,
          _dark: tokens.colors.dark.text.secondaryGradient,
        },
        special: {
          default: tokens.colors.light.text.special,
          _dark: tokens.colors.dark.text.special,
        },
        specialSecondary: {
          default: tokens.colors.light.text.specialSecondary,
          _dark: tokens.colors.dark.text.specialSecondary,
        },
        link: {
          default: tokens.colors.light.text.link,
          _dark: tokens.colors.dark.text.link,
        },
        linkHover: {
          default: tokens.colors.light.text.linkHover,
          _dark: tokens.colors.dark.text.linkHover,
        },
        maxContrast: {
          default: tokens.colors.light.text.maxContrast,
          _dark: tokens.colors.dark.text.maxContrast,
        },
        highlight: {
          default: tokens.colors.light.text.highlight,
          _dark: tokens.colors.dark.text.highlight,
        },
        accordionHeading: {
          default: tokens.colors.light.button.background.primary,
          _dark: tokens.colors.dark.button.background.primary,
        },
        button: {
          tertiary: {
            default: tokens.colors.light.button.text.tertiary,
            _dark: tokens.colors.dark.button.text.tertiary,
          },
          disabled: {
            default: tokens.colors.light.button.text.disabled,
            _dark: tokens.colors.dark.button.text.disabled,
          },
          primary: {
            default: '#F3F1EC',
            _dark: '#414853',
          },
        },
        dark: balColors.gray['700'], // always dark
        light: '#E5D3BE', // always light
      },

      chart: {
        stakedBalance: '#9F95F0',
        pool: {
          bar: {
            volume: {
              from: 'rgba(0, 211, 149, 1)',
              to: 'rgba(0, 211, 149, 0.2)',
            },
          },
          scatter: {
            add: {
              from: 'rgba(0, 211, 149, 100%)',
              to: 'rgba(0, 211, 149, 20%)',
            },
            remove: {
              from: 'rgba(239, 68, 68, 100%)',
              to: 'rgba(239, 68, 68, 20%)',
            },
            swap: {
              from: 'rgba(109, 173, 249, 100%)',
              to: 'rgba(109, 173, 249, 20%)',
            },
          },
        },
      },
    },
    space: {
      none: '0',
      xxs: '0.125rem',
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '4rem',
    },
    shadows: {
      sm: {
        default: tokens.shadows.light.sm,
        _dark: tokens.shadows.dark.sm,
      },
      md: {
        default: tokens.shadows.light.md,
        _dark: tokens.shadows.dark.md,
      },
      lg: {
        default: tokens.shadows.light.lg,
        _dark: tokens.shadows.dark.lg,
      },
      xl: {
        default: tokens.shadows.light.xl,
        _dark: tokens.shadows.dark.xl,
      },
      '2xl': {
        default: tokens.shadows.light['2xl'],
        _dark: tokens.shadows.dark['2xl'],
      },
      innerSm: 'inset 0 0 4px 0 rgba(0, 0, 0, 0.06)',
      innerBase: {
        default: tokens.shadows.light['shadowInnerBase'],
        _dark: tokens.shadows.dark['shadowInnerBase'],
      },
      innerMd: 'inset 0 0 6px 0 rgba(0, 0, 0, 0.1)',
      innerLg: 'inset 0 0 8px 0 rgba(0, 0, 0, 0.15)',

      innerXl: {
        default: tokens.shadows.light.innerXl,
        _dark: tokens.shadows.dark.innerXl,
      },
      chartIconInner: {
        default: tokens.shadows.light.chartIconInner,
        _dark: tokens.shadows.dark.chartIconInner,
      },
      chartIconOuter: {
        default: tokens.shadows.light.chartIconOuter,
        _dark: tokens.shadows.dark.chartIconOuter,
      },
      chart: {
        default: tokens.shadows.light.chart,
        _dark: tokens.shadows.dark.chart,
      },
      zen: {
        default: tokens.shadows.light.zen,
        _dark: tokens.shadows.dark.zen,
      },
      btnDefault: {
        default: tokens.shadows.light.btnDefault,
        _dark: tokens.shadows.dark.btnDefault,
      },
      btnDefaultActive: {
        default: tokens.shadows.light.btnDefaultActive,
        _dark: tokens.shadows.dark.btnDefaultActive,
      },
      btnTertiary: {
        default: tokens.shadows.light.btnTertiary,
        _dark: tokens.shadows.dark.btnTertiary,
      },
      fontDefault: {
        default: tokens.shadows.light.fontDefault,
        _dark: tokens.shadows.dark.fontDefault,
      },
      fontLight: {
        default: tokens.shadows.light.fontLight,
        _dark: tokens.shadows.dark.fontLight,
      },
      fontDark: {
        default: tokens.shadows.light.fontDark,
        _dark: tokens.shadows.dark.fontDark,
      },
      input: {
        innerBase: {
          default: tokens.shadows.light.input.innerBase,
          _dark: tokens.shadows.dark.input.innerBase,
        },
        innerFocus: {
          default: tokens.shadows.light.input.innerFocus,
          _dark: tokens.shadows.dark.input.innerFocus,
        },
        innerError: {
          default: tokens.shadows.light.input.innerError,
          _dark: tokens.shadows.dark.input.innerError,
        },
      },
    },
    sizes: {
      maxContent: '1320px',
      screenHeight: '100vh',
      screenWidth: '100vw',
    },
    radii: {
      default: 'md',
      xs: '0.125rem',
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
  },
  styles: {
    global: {
      html: {
        scrollBehavior: 'smooth',
      },
      'body > div[data-rk]': {
        minHeight: '100vh',
      },
      body: {
        background: 'background.base',
      },
      '::-webkit-scrollbar': {
        width: '10px',
      },
      '.chakra-ui-light ::-webkit-scrollbar, .chakra-ui-dark ::-webkit-scrollbar': {
        width: '6px',
      },
      '::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
      },
      '::-webkit-scrollbar-thumb': {
        boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease-in-out',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '16px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        transition: 'all 0.3s ease',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      '.chakra-ui-light ::-webkit-scrollbar-thumb, .chakra-ui-dark ::-webkit-scrollbar-thumb': {},
      '.chakra-ui-dark::-webkit-scrollbar-thumb, .chakra-ui-dark ::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
      },
      '.chakra-ui-dark::-webkit-scrollbar-thumb:hover, .chakra-ui-dark ::-webkit-scrollbar-thumb:hover':
        {
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
        },
      'p + ul': {
        mt: '1',
      },
    },
  },
  components: {
    Accordion: {
      variants: {
        gradient: {
          icon: {
            color: 'brown.300',
          },
          panel: {
            px: '0',
            py: '6',
          },
          button: {
            px: '5',
            py: '6',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            rounded: 'lg',
            borderWidth: 0,
            border: 'none',
            background: 'background.level1',
          },
          container: {
            border: 'none',
            borderWidth: 0,
            mb: '4',
          },
          root: {
            border: 'none',
          },
        },
        button: {
          icon: {
            color: 'grayText',
          },
          button: {
            color: 'grayText',
          },
          panel: {
            borderTop: '1px solid',
            borderColor: 'border.base',
          },
          container: {
            border: 'none',
            borderWidth: 0,
            background: 'background.level1',
            shadow: 'md',
            rounded: 'md',
          },
        },
        incentives: {
          root: {
            width: 'full',
            background: 'background.level2',
            rounded: 'lg',
            borderWidth: '1px',
            borderColor: 'input.borderDefault',
            shadow: 'xl',
          },
          container: {
            width: 'full',
          },
          panel: {
            width: 'full',
          },
          icon: {
            color: 'orange.500',
            _dark: {
              color: 'green.500',
            },
          },
          button: {
            width: 'full',
            borderTopWidth: 0,
            borderBottomWidth: 0,
            backgroundColor: 'background.level2',
            p: '3',
            rounded: 'lg',
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          shadow: 'input.innerBase',
          border: '1px solid',
          color: 'input.fontDefault',
          fontWeight: 'medium',
          px: '3',
          // caretColor: 'input.caret', // Not working
          '::placeholder': {
            color: 'input.fontPlaceholder',
          },
          _hover: {
            bg: 'input.bgHover',
            borderColor: 'input.borderHover',
          },
          _focus: {
            border: '1px solid',
            bg: 'input.bgFocus',
            borderColor: 'input.borderFocus',
            color: 'white',
          },
          _focusVisible: {
            color: 'input.fontFocus',
            border: '1px solid',
            borderColor: 'input.borderFocus',
            shadow: 'input.innerFocus',
          },
          _invalid: {
            border: '1px solid',
            borderColor: 'input.borderError', // Not working
            bg: 'input.bgError', // Working
            shadow: 'input.innerError', // Not working
            color: 'input.fontError',
          },
          _disabled: {
            shadow: 'none',
            _hover: {
              bg: 'input.bgHoverDisabled',
              border: 'input.borderDefault',
            },
          },
        },
      },
      variants: {
        search: {
          field: {
            border: '1px solid',
            borderColor: 'input.border',
          },
        },
      },
    },
    FormLabel: {
      baseStyle: {
        background: 'font.primary',
        backgroundClip: 'text',
        width: 'max-content',
        fontWeight: 'medium',
      },
    },
    FormErrorMessage: {
      baseStyle: {
        text: {
          color: 'input.fontError', // Not working
          fontWeight: 'bold', // Not working
        },
      },
    },
    // Section is a custom component
    Section: {
      baseStyle: {
        marginBottom: { base: '16', md: '24' },
      },
      variants: {
        subsection: {
          marginBottom: { base: '8', md: '12' },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        display: 'block',
        width: 'fit-content',
        background: 'font.primary',
        backgroundClip: 'text',
        letterSpacing: '-0.04rem',
      },
      variants: {
        secondary: {
          background: 'font.secondary',
          backgroundClip: 'text',
        },
        special: {
          background: 'font.special',
          backgroundClip: 'text',
        },
        specialSecondary: {
          background: 'font.specialSecondary',
          backgroundClip: 'text',
        },
        sand: (props: any) => ({
          bgGradient: props.theme.colors.gradient.sand,
          bgClip: 'text',
        }),
        gradient: {
          bgGradient: 'linear(to-l, gradients.text.heading.from, gradients.text.heading.to)',
          bgClip: 'text',
        },
        accordionHeading: {
          background: 'font.accordionHeading',
          backgroundClip: 'text',
          fontSize: '1.25rem',
          textAlign: 'left',
        },
      },
      sizes: {
        'h1-hero': {
          fontSize: { base: '3rem', md: '4rem' },
          lineHeight: { base: '3.5rem', md: '4.5rem' },
          letterSpacing: '-1.25px',
          mb: '8',
        },
        h1: {
          fontSize: { base: '3rem', md: '4rem' },
          lineHeight: { base: '3.5rem', md: '4.5rem' },
          letterSpacing: '-1.25px',
        },
        h2: {
          fontSize: { base: '2rem', md: '3rem' },
          lineHeight: { base: '2.5rem', md: '3.5rem' },
        },
        h3: {
          fontSize: { base: '2rem', md: '2rem' },
          lineHeight: { base: '2.5rem', md: '3.5rem' },
        },
        h4: {
          fontSize: { base: '2rem', md: '1.5rem' },
          lineHeight: { base: '2.5rem', md: '2.5rem' },
        },
        h5: {
          fontSize: { base: '2rem', md: '1.25rem' },
          lineHeight: { base: '2.5rem', md: '1.5rem' },
        },
        h6: {
          fontSize: { base: '2rem', md: '1.125rem' },
          lineHeight: { base: '2.5rem', md: '1.5rem' },
        },
      },
    },
    Text: {
      baseStyle: {
        color: 'font.primary',
        fontWeight: 'medium',
        letterSpacing: '-0.25px',
        lineHeight: '1.3',
      },
      variants: {
        secondary: {
          color: 'font.secondary',
        },
        primaryGradient: {
          background: 'font.primaryGradient',
          backgroundClip: 'text',
        },
        secondaryGradient: {
          background: 'font.secondaryGradient',
          backgroundClip: 'text',
        },
        special: {
          background: 'font.special',
          backgroundClip: 'text',
        },
        specialSecondary: {
          background: 'font.specialSecondary',
          backgroundClip: 'text',
        },
        eyebrow: {
          textTransform: 'uppercase',
          fontSize: 'xs',
          fontWeight: 'semibold',
          letterSpacing: '1px',
          width: 'fit-content',
        },
      },
    },
    Link: {
      baseStyle: {
        color: 'font.link',
        transition: tokens.transition.default,
        _hover: {
          color: 'font.linkHover',
        },
      },
      variants: {
        nav: {
          color: 'font.primary',
          transition: tokens.transition.default,
          _hover: {
            color: 'font.link',
            textDecoration: 'none',
          },
        },
      },
    },
    IconButton: {
      variants: {
        tertiary: {
          background: 'background.elevation1',
          color: 'font.button.tertiary',
          boxShadow: 'btnTertiary',
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          background: 'background.level1',
          fontWeight: 'bold',
          color: 'font.primary',
          shadow: 'md',
          border: '0px solid transparent',
          borderColor: 'transparent',
          outline: 'none',
        },
        icon: {
          color: 'font.link',
        },
      },
      variants: {
        secondary: {
          field: {
            background: 'background.button.secondary',
            py: 'sm',
            fontSize: 'md',
            fontWeight: 'bold',
            pl: '2',
            pr: '1',
          },
          icon: {
            color: primaryTextColor,
          },
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: 'lg',
        color: 'text-body',
        letterSpacing: '-0.02em',
        _disabled: {
          background: 'background.level3',
          border: '1px solid',
          borderColor: 'border.base',
          color: 'grayText',
        },
        _hover: {
          _disabled: {
            background: 'background.level3',
          },
        },
      },
      variants: {
        primary: {
          color: 'font.dark',
          background: 'background.button.primary',
          backgroundPosition: '100% 0',
          backgroundSize: '100% 100%',
          transition: '0.1s ease-in-out',
          shadow: 'md',
          _hover: {
            shadow: 'sm',
            backgroundSize: '120% 100%',
          },
        },
        secondary: {
          color: 'font.dark',
          background: 'background.button.secondary',
          shadow: 'md',
          _hover: {
            shadow: 'sm',
          },
        },
        tertiary: {
          background: 'background.level3',
          color: 'font.primary',
          shadow: 'md',
          _hover: {
            shadow: 'sm',
          },
          _active: {
            background: 'background.level2',
            shadow: 'none',
          },
        },
        solid: {
          color: 'text-body',
        },
        'tx-gas': {
          bgGradient: 'linear(to-tr, blue.300 0%, #D7CBE7 50%, #EAA879 100%)',
          borderTop: '2px solid',
          borderColor: 'purple.200',
          color: 'black',
        },
        buttonGroupInactive: {
          backgroundColor: 'transparent',
          height: 'fit-content',
          width: 'fit-content',
          shadow: 'none',
          px: '2',
          py: '1.5',
          fontSize: 'xs',
          color: 'font.secondary',
          fontWeight: 'bold',
          borderRadius: '4px',
          _hover: {
            background: 'background.button.secondary',
            color: '#728097',
            transform: 'none',
          },
          _dark: {
            color: 'gray.300',
            _hover: {
              color: 'background.level3',
            },
          },
        },
        buttonGroupActive: {
          background: 'background.button.secondary',
          height: 'fit-content',
          width: 'fit-content',
          px: '2',
          py: '1.5',
          fontSize: 'xs',
          color: 'gray.700',
          fontWeight: 'bold',
          borderRadius: '4px',
          _hover: {
            transform: 'none',
          },
          _dark: {
            color: 'background.level3',
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          background: 'background.level0',
        },
        closeButton: {
          top: 3,
          color: 'font.primary',
          rounded: 'full',
        },
        header: {
          color: 'font.primary',
        },
      },
      defaultProps: {
        size: 'md',
      },
    },
    Popover: {
      baseStyle: {
        content: {
          bg: 'background.level3',
          shadow: '2xl',
          border: '1px solid',
          borderColor: 'border.base',
        },
        arrow: {
          bg: 'background.level3',
          borderColor: 'background.level3',
          color: 'background.level3',
        },
        closeButton: {
          color: 'font.primary',
          rounded: 'full',
        },
      },
      variants: {
        tooltip: {
          content: {
            background: 'background.level2',
            borderColor: 'transparent',
            color: 'grayText',
            fontWeight: 'bold',
            shadow: 'lg',
          },
          body: {
            background: 'background.level2',
            color: 'grayText',
            px: 'sm',
            py: 'xs',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          background: 'background.level2',
          rounded: 'lg',
          borderWidth: '1px',
          borderColor: 'input.borderDefault',
          shadow: 'xl',
          p: 'md',
          width: 'full',
        },
      },
      variants: {
        subSection: {
          container: {
            background: 'background.level3',
            borderWidth: '1px',
            borderColor: 'input.borderDefault',
            shadow: 'sm',
            padding: 'md',
            width: 'full',
            rounded: 'md',
          },
          header: {
            padding: 'none',
            paddingBottom: 'md',
            color: 'font.primary',
            fontWeight: 'bold',
            fontSize: 'sm',
          },
        },
        modalSubSection: {
          container: {
            background: 'background.level2',
            borderWidth: '1px',
            borderColor: 'input.borderDefault',
            shadow: 'sm',
            padding: 'md',
            width: 'full',
            rounded: 'md',
          },
          header: {
            padding: 'none',
            paddingBottom: 'md',
            color: 'font.primary',
            fontWeight: 'bold',
            fontSize: 'sm',
          },
        },
        level0: {
          container: {
            background: 'background.level0',
          },
        },
        level1: {
          container: {
            background: 'background.level1',
          },
        },
        level2: {
          container: {
            background: 'background.level2',
          },
        },
        level3: {
          container: {
            background: 'background.level3',
          },
        },
        level4: {
          container: {
            background: 'background.level4',
          },
        },
        gradient: {
          container: {
            width: 'full',
            height: 'full',
            rounded: '2xl',
            _light: {
              backgroundColor: 'transparent',
              backgroundImage: `radial-gradient(
                      farthest-corner at 80px 0px,
                      rgba(235, 220, 204, 0.3) 0%,
                      rgba(255, 255, 255, 0.0) 100%
                    )`,
            },
            _dark: {
              backgroundColor: 'transparent',
              backgroundImage: `radial-gradient(
                  farthest-corner at 80px 0px,
                  rgba(180, 189, 200, 0.1) 0%,
                  rgba(255, 255, 255, 0.0) 100%
                )`,
            },
          },
        },
      },
    },
    Tag: {
      baseStyle: {
        container: {
          background: 'background.level1',
          shadow: 'md',
          borderColor: 'border.base',
          borderWidth: '1px',
          borderRadius: 'full',
          color: 'font.primary',
          fontWeight: 'semibold',
          fontSize: '14px',
          _hover: {
            color: 'white',
          },
        },
        label: {
          userSelect: 'none',
        },
        closeButton: {
          color: 'font.maxContrast',
        },
      },
    },
    Radio: {
      baseStyle: {
        control: {
          border: '1px solid',
          bg: 'background.level0',
          borderColor: 'border.base',
          _checked: {
            bg: 'background.highlight',
            borderColor: 'border.highlight',
            _hover: {
              bg: 'background.highlight',
              borderColor: 'border.highlight',
            },
          },
          _hover: {
            boxShadow: '0 0 0 2px var(--chakra-colors-green-600)',
            _dark: {
              boxShadow: '0 0 0 2px var(--chakra-colors-green-500)',
            },
          },
          _focus: {
            boxShadow: '0 0 0 2px var(--chakra-colors-green-600)',
            _dark: {
              boxShadow: '0 0 0 2px var(--chakra-colors-green-500)',
            },
          },
          _disabled: {
            border: '1px solid',
            bg: 'background.level0',
            borderColor: 'border.base',
            opacity: '0.5',
          },
        },
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          border: '1px solid',
          bg: 'background.level0',
          borderColor: 'border.base',
          _checked: {
            bg: 'background.highlight',
            borderColor: 'border.highlight',
            _hover: {
              bg: 'background.highlight',
              borderColor: 'border.highlight',
            },
          },
          _hover: {
            boxShadow: '0 0 0 2px var(--chakra-colors-green-600)',
            _dark: {
              boxShadow: '0 0 0 2px var(--chakra-colors-green-500)',
            },
          },
          _focus: {
            boxShadow: '0 0 0 2px var(--chakra-colors-green-600)',
            _dark: {
              boxShadow: '0 0 0 2px var(--chakra-colors-green-500)',
            },
          },
          _disabled: {
            border: '1px solid',
            bg: 'background.level3',
            borderColor: 'border.base',
            opacity: '0.5',
          },
        },
      },
    },
    Slider: {
      baseStyle: {
        filledTrack: {
          bg: 'background.highlight',
        },
        thumb: {
          borderColor: 'background.highlight',
          boxShadow: 'md',
        },
      },
    },
    Switch: {
      baseStyle: {
        track: {
          background: 'purple.500',
        },
      },
    },
    Alert: {
      baseStyle: {
        container: {
          rounded: 'md',
          alignItems: 'start',
          "&[data-status='error']": {
            border: '1px solid red',
          },
        },
        title: {
          letterSpacing: '-0.25px',
          mb: 'xs',
        },
        description: {
          fontWeight: 'medium',
          letterSpacing: '-0.25px',
        },
      },
      variants: {},
    },
    Badge: {
      variants: {
        meta: {
          background: 'background.level3',
          color: 'font.secondary',
          shadow: 'sm',
          py: 1,
          px: 2,
          textTransform: 'capitalize',
        },
      },
    },
  },
}

const proseTheme = withProse({
  baseStyle: {
    h1: {
      fontWeight: 'semibold',
      letterSpacing: '-1px',
      marginBottom: '0',
    },
    h2: {
      fontWeight: 'light',
      letterSpacing: '-1px',
      marginBottom: { base: '0', sm: '0' },
    },
  },
})

const theme = extendTheme(balTheme, proseTheme) as ThemeTypings

export default theme
