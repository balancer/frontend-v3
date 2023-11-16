import { ThemeTypings, extendTheme } from '@chakra-ui/react'
import { withProse } from '@nikolovlazar/chakra-ui-prose'
import { darken } from '@chakra-ui/theme-tools'
import { cardTheme } from '../../components/containers/GradientCard'

const tokens = {
  colors: {
    light: {
      // Background colors
      colorBgBase: 'hsla(43,23%,92%,1)',

      colorCardBgLevel0: 'hsla(43,23%,92%,1)',
      colorCardBgLevel1: 'hsla(43,23%,93%,1)',
      colorCardBgLevel2: 'hsla(43,23%,94%,1)',
      colorCardBgLevel3: 'hsla(43,23%,95%,1)',
      colorCardBgLevel4: 'hsla(43,23%,96%,1)',
      colorCardBgLevel5: 'hsla(43,23%,97%,1)',
      colorCardBgLevel6: 'hsla(43,23%,98%,1)',
      colorCardBgLevel7: 'hsla(43,23%,99%,1)',
      colorCardBgLevel8: 'hsla(43,23%,100%,1)',

      colorBgSpecial: 'linear-gradient(90deg, #8F86FD 0%, #A66CF3 33%, #F48975 100%)',

      // Button colors
      colorButtonBgPrimary:
        'linear-gradient(90deg, #B3AEF5 0%, #D7CBE7 25%, #E5C8C8 50%, #EAA879 100%)',
      colorButtonBgSecondary: 'linear-gradient(152deg, #E5D3BE 20.87%, #E6C6A0 86.96%)',
      colorButtonBgTertiary:
        'linear-gradient(0deg, rgba(63, 69, 80, 0.80) -16.28%, rgba(85, 94, 108, 0.80) 97.67%)',

      colorButtonBorderTopTertiary: 'gray.800',

      // Font colors
      colorFontPrimary:
        'linear-gradient(45deg, rgba(45, 76, 126, 1) 0%, rgba(45, 76, 126, 0.75) 100%)',
      colorFontSecondary: 'linear-gradient(45deg, #728097 0%, #909BAD 100%)',
      colorFontSpecial: 'linear-gradient(90deg, #8F86FD 0%, #A66CF3 33%, #F48975 100%)',
      colorFontLink: 'linear-gradient(45deg, #333 0%, #707883 100%)',
    },
    dark: {
      // Background colors
      colorBgBase: 'hsla(217,12%,29%,1)',

      colorCardBgLevel0: 'hsla(216, 12%, 25%, 1)',
      colorCardBgLevel1: 'hsla(216, 12%, 26%, 1)',
      colorCardBgLevel2: 'hsla(216, 12%, 27%, 1)',
      colorCardBgLevel3: 'hsla(216, 12%, 28%, 1)',
      colorCardBgLevel4: 'hsla(216, 12%, 29%, 1)',
      colorCardBgLevel5: 'hsla(216, 12%, 30%, 1)',
      colorCardBgLevel6: 'hsla(216, 12%, 31%, 1)',
      colorCardBgLevel7: 'hsla(216, 12%, 32%, 1)',
      colorCardBgLevel8: 'hsla(216, 12%, 33%, 1)',

      colorBgSpecial: 'linear-gradient(90deg, #B3AEF5 0%, #D7CBE7 25%, #E5C8C8 50%, #EAA879 100%)',

      // Button colors
      colorButtonBgPrimary:
        'linear-gradient(90deg, #B3AEF5 0%, #D7CBE7 25%, #E5C8C8 50%, #EAA879 100%)',
      colorButtonBgSecondary: 'linear-gradient(152deg, #E5D3BE 20.87%, #E6C6A0 86.96%)',
      colorButtonBgTertiary:
        'linear-gradient(0deg, rgba(63, 69, 80, 0.80) -16.28%, rgba(85, 94, 108, 0.80) 97.67%)',

      colorButtonBorderTopTertiary: 'gray.500',

      // Font colors
      colorFontPrimary: 'linear-gradient(45deg, #E6C6A0 0%, #E5D3BE 100%)',
      colorFontSecondary: 'linear-gradient(45deg, #909BAD 0%, #728097 100%)',
      colorFontSpecial:
        'linear-gradient(90deg, #B3AEF5 0%, #D7CBE7 25%, #E5C8C8 50%, #EAA879 100%)',
      colorFontLink: 'linear-gradient(45deg, #E6C6A0 0%, #E5D3BE 100%)',
    },
  },
  shadows: {
    light: {
      shadowInnerBase:
        '0px 2px 4px 0px rgba(0, 0, 0, 0.05) inset, 0px 4px 8px 0px rgba(0, 0, 0, 0.05) inset, 0px 10px 20px 0px rgba(0, 0, 0, 0.05) inset',
    },
    dark: {
      shadowInnerBase:
        '0px 2px 4px 0px rgba(0, 0, 0, 0.10) inset, 0px 4px 8px 0px rgba(0, 0, 0, 0.10) inset, 0px 10px 20px 0px rgba(0, 0, 0, 0.10) inset',
    },
  },
}

export const balTheme = {
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: `'Satoshi', sans-serif`,
    body: `'Satoshi', sans-serif`,
  },
  colors: {
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
    sand: {
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
    salmon: {
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
    lavender: {
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
    gradient: {
      dusk: 'linear(to-tr, lavender.300 5%, #D7CBE7 50%, #EAA879 95%)',
      sand: 'linear(to-t, #E6C6A0 0%, #E5D3BE 100%)',
    },
    Text: {
      variants: {
        heading: {
          bgGradient: 'linear(to-l, gradients.text.heading.from, gradients.text.heading.to)',
          bgClip: 'text',
        },
        primary: {
          color: 'text.primary',
        },
        secondary: {
          color: 'text.secondary',
        },
      },
    },
    Button: {
      variants: {
        buttonGroupInactive: {
          backgroundColor: 'transparent',
          height: 'fit-content',
          width: 'fit-content',
          px: '2',
          py: '1.5',
          fontSize: 'xs',
          color: 'text.secondary',
          fontWeight: 'bold',
          borderRadius: '4px',
          _hover: {
            bgGradient: 'linear(to-l, gradients.button.sand.from, gradients.button.sand.to)',
            color: 'text.primary',
          },
        },
        buttonGroupActive: {
          bgGradient: 'linear(to-l, gradients.button.sand.from, gradients.button.sand.to)',
          height: 'fit-content',
          width: 'fit-content',
          px: '2',
          py: '1.5',
          fontSize: 'xs',
          color: 'text.primary',
          fontWeight: 'bold',
          borderRadius: '4px',
        },
      },
    },
  },
  semanticTokens: {
    colors: {
      noise: 'rgba(243, 241, 336, 0.3)',
      background: '#F3F1EC',
      elevatedBackground: '#FEF9F3',
      borderColor: 'rgba(229, 211, 190, 0.6)',
      badge: '#EBE9E0',
      text: {
        primary: '#414853',
        secondary: '#728097',
      },
      primary: { _light: 'primary.500', _dark: 'primary.500' },
      'chakra-body-text': { _light: 'gray.800', _dark: 'whiteAlpha.900' },
      'chakra-body-bg': { _light: 'white', _dark: 'gray.800' },
      'chakra-border-color': { _light: 'gray.200', _dark: 'whiteAlpha.300' },
      'chakra-inverse-text': { _light: 'white', _dark: 'gray.800' },
      'chakra-subtle-bg': { _light: 'gray.100', _dark: 'gray.700' },
      'chakra-subtle-text': { _light: 'gray.600', _dark: 'gray.400' },
      'chakra-placeholder-color': {
        _light: 'gray.500',
        _dark: 'whiteAlpha.400',
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
      colorBgBase: {
        default: tokens.colors.light['colorBgBase'],
        _dark: tokens.colors.dark['colorBgBase'],
      },
      colorCardBgLevel0: {
        default: tokens.colors.light['colorCardBgLevel0'],
        _dark: tokens.colors.dark['colorCardBgLevel0'],
      },
      colorCardBgLevel1: {
        default: tokens.colors.light['colorCardBgLevel1'],
        _dark: tokens.colors.dark['colorCardBgLevel1'],
      },
      colorCardBgLevel2: {
        default: tokens.colors.light['colorCardBgLevel2'],
        _dark: tokens.colors.dark['colorCardBgLevel2'],
      },
      colorCardBgLevel3: {
        default: tokens.colors.light['colorCardBgLevel3'],
        _dark: tokens.colors.dark['colorCardBgLevel3'],
      },
      colorCardBgLevel4: {
        default: tokens.colors.light['colorCardBgLevel4'],
        _dark: tokens.colors.dark['colorCardBgLevel4'],
      },
      colorCardBgLevel5: {
        default: tokens.colors.light['colorCardBgLevel5'],
        _dark: tokens.colors.dark['colorCardBgLevel5'],
      },
      colorCardBgLevel6: {
        default: tokens.colors.light['colorCardBgLevel6'],
        _dark: tokens.colors.dark['colorCardBgLevel6'],
      },
      colorCardBgLevel7: {
        default: tokens.colors.light['colorCardBgLevel7'],
        _dark: tokens.colors.dark['colorCardBgLevel7'],
      },
      colorCardBgLevel8: {
        default: tokens.colors.light['colorCardBgLevel8'],
        _dark: tokens.colors.dark['colorCardBgLevel8'],
      },

      colorBgSpecial: {
        default: tokens.colors.light['colorBgSpecial'],
        _dark: tokens.colors.dark['colorBgSpecial'],
      },

      // Button colors
      colorButtonBgPrimary: {
        default: tokens.colors.light['colorButtonBgPrimary'],
        _dark: tokens.colors.dark['colorButtonBgPrimary'],
      },
      colorButtonBgSecondary: {
        default: tokens.colors.light['colorButtonBgSecondary'],
        _dark: tokens.colors.dark['colorButtonBgSecondary'],
      },
      colorButtonBgTertiary: {
        default: tokens.colors.light['colorButtonBgTertiary'],
        _dark: tokens.colors.dark['colorButtonBgTertiary'],
      },
      colorButtonBorderTopTertiary: {
        default: tokens.colors.light['colorButtonBorderTopTertiary'],
        _dark: tokens.colors.dark['colorButtonBorderTopTertiary'],
      },

      // Text colors
      colorFontPrimary: {
        default: tokens.colors.light['colorFontPrimary'],
        _dark: tokens.colors.dark['colorFontPrimary'],
      },
      colorFontSecondary: {
        default: tokens.colors.light['colorFontSecondary'],
        _dark: tokens.colors.dark['colorFontSecondary'],
      },
      colorFontSpecial: {
        default: tokens.colors.light['colorFontSpecial'],
        _dark: tokens.colors.dark['colorFontSpecial'],
      },
      colorFontLink: {
        default: tokens.colors.light['colorFontLink'],
        _dark: tokens.colors.dark['colorFontLink'],
      },
      colorFontDark: '#414853',
      colorFontLight: '#F3F1EC',
    },
    space: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '4rem',
    },
    shadows: {
      innerSm: 'inset 0 0 4px 0 rgba(0, 0, 0, 0.06)',
      innerBase: {
        default: tokens.shadows.light['shadowInnerBase'],
        _dark: tokens.shadows.dark['shadowInnerBase'],
      },
      innerMd: 'inset 0 0 6px 0 rgba(0, 0, 0, 0.1)',
      innerLg: 'inset 0 0 8px 0 rgba(0, 0, 0, 0.15)',
    },
    sizes: {
      maxContent: '1320px',
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
        background: 'colorBgBase',
      },
      'p + ul': {
        mt: '1',
      },
      // li: {
      //   color: 'red',
      // },
      // 'body:before': {
      //   background: `linear-gradient(45deg, rgba(243,241,236,0.5), rgba(223,218,205,0.5)),
      //   url(/images/patterns/texture.svg) repeat`,
      //   content: '" "',
      //   width: '100vw',
      //   height: '100%',
      //   position: 'absolute',
      //   zIndex: '-1',
      //   filter: 'brightness(200%) contrast(100%)',
      //   opacity: '0.1',
      // },
    },
  },
  components: {
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
        letterSpacing: '-1px',
        mb: 'sm',
        display: 'block',
        width: 'fit-content',
        background: 'colorFontPrimary',
        backgroundClip: 'text',
      },
      variants: {
        secondary: {
          background: 'colorFontSecondary',
          backgroundClip: 'text',
        },
        special: {
          background: 'colorFontSpecial',
          backgroundClip: 'text',
        },
<<<<<<< HEAD
        sand: (props: any) => ({
=======
        sand: props => ({
>>>>>>> origin/ui/theming
          bgGradient: props.theme.colors.gradient.sand,
          bgClip: 'text',
        }),
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
        background: 'colorFontPrimary',
        backgroundClip: 'text',
      },
      variants: {
        secondary: {
          background: 'colorFontSecondary',
          backgroundClip: 'text',
        },
        special: {
          background: 'colorFontSpecial',
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
        background: 'colorFontPrimary',
        backgroundClip: 'text',
      },
    },
    Button: {
      baseStyle: {
        borderRadius: 'lg',
        color: 'text-body',
        _hover: {
          borderColor: 'transparent',
          transform: 'translateY(1px)',
        },
      },
      variants: {
        solid: {
          color: 'text-body',
        },
        primary: {
          background: 'colorButtonBgPrimary',
          borderTop: '2px solid',
          borderColor: 'lavender.200',
          color: 'colorFontDark',
        },
        secondary: {
          background: 'colorButtonBgSecondary',
          borderTop: '2px solid',
          borderBottom: '2px solid',
          borderTopColor: '#F4EBE1',
          borderBottomColor: darken('#F4EBE1', 25),
          color: 'colorFontDark',
        },
        tertiary: {
          background: 'colorButtonBgTertiary',
          borderTop: '2px solid',
          borderColor: 'colorButtonBorderTopTertiary',
          color: 'colorFontPrimary',
        },
        'tx-gas': {
          bgGradient: 'linear(to-tr, blue.300 0%, #D7CBE7 50%, #EAA879 100%)',
          borderTop: '2px solid',
          borderColor: 'lavender.200',
          color: 'black',
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          background: 'colorCardBgLevel0',
        },
      },
      variants: {
        level0: {
          container: {
            background: 'colorCardBgLevel0',
          },
        },
        level1: {
          container: {
            background: 'colorCardBgLevel1',
          },
        },
        level2: {
          container: {
            background: 'colorCardBgLevel2',
          },
        },
        level3: {
          container: {
            background: 'colorCardBgLevel3',
          },
        },
        level4: {
          container: {
            background: 'colorCardBgLevel4',
          },
        },
        level5: {
          container: {
            background: 'colorCardBgLevel5',
          },
        },
        level6: {
          container: {
            background: 'colorCardBgLevel6',
          },
        },
        level7: {
          container: {
            background: 'colorCardBgLevel7',
          },
        },
        level8: {
          container: {
            background: 'colorCardBgLevel8',
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          background: 'colorCardBgLevel8',
        },
      },
    },
    // List: {
    //   baseStyle: {
    //     background: 'red',
    //     backgroundClip: 'text',
    //   },
    // },
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

const theme = extendTheme(
  {
    ...balTheme,
    components: {
      ...balTheme.components,
      Card: cardTheme,
    },
  },
  proseTheme
) as ThemeTypings

export default theme
