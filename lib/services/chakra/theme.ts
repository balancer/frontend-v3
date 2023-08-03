import { ThemeOverride, ThemeTypings, extendTheme } from '@chakra-ui/react'

export const balTheme: ThemeOverride = {
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
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
  },
}

const theme = extendTheme(balTheme) as ThemeTypings

export default theme
