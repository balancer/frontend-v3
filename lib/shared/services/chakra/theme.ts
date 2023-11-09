import { ThemeOverride, ThemeTypings, extendTheme } from '@chakra-ui/react'
import { withProse } from '@nikolovlazar/chakra-ui-prose'
import { cardTheme } from '../../components/containers/GradientCard'

export const balTheme = {
  styles: {
    global: {
      'body > div[data-rk]': {
        minHeight: '100vh',
      },
    },
  },
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
  },
  components: {
    Heading: {
      variants: {
        'heading-1': {
          fontSize: '1rem',
          fontWeight: 'bold',
          lineHeight: '3rem',
        },
      },
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
      elevatedBackground: '#F6F3ED',
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
    },
    space: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '4rem',
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
}

const proseTheme = withProse({
  baseStyle: {
    h1: {
      fontWeight: 'bold',
      letterSpacing: '-1px',
      marginBottom: '0',
    },
    h2: {
      fontWeight: 'bold',
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
