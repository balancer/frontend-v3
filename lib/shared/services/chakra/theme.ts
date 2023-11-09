import { ThemeOverride, ThemeTypings, extendTheme } from '@chakra-ui/react'
import { withProse } from '@nikolovlazar/chakra-ui-prose'

export const balTheme: ThemeOverride = {
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
    body: `
      ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
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
  },
  semanticTokens: {
    colors: {
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
    },
    space: {
      px: '1px',
      xs: '0.25rem',
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

const theme = extendTheme(balTheme, proseTheme) as ThemeTypings

export default theme
