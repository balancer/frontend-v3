import { ThemeOverride, ThemeTypings, extendTheme } from '@chakra-ui/react'

export const balTheme: ThemeOverride = {
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    body: 'monospace, sans-serif',
  },
  colors: {
    primary: {
      '50': '#E5F6FF',
      '100': '#BEE8FF',
      '200': '#8ED1FF',
      '300': '#5DB9FF',
      '400': '#2DA2FF',
      '500': '#00ff33',
      '600': '#0062CC',
      '700': '#004A99',
      '800': '#003166',
      '900': '#001933',
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
  },
}

const theme = extendTheme(balTheme) as ThemeTypings

export default theme
