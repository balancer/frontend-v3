import { ThemeOverride, ThemeTypings, extendTheme } from '@chakra-ui/react'
import { withProse } from '@nikolovlazar/chakra-ui-prose'
import { darken } from '@chakra-ui/theme-tools'

// const colors = {
//   primary: {
//     '50': '#eaf6ff',
//     '100': '#daedff',
//     '200': '#bcddff',
//     '300': '#93c6ff',
//     '400': '#68a1ff',
//     '500': '#457dff',
//     '600': '#2554ff',
//     '700': '#2048e9',
//     '800': '#183bbb',
//     '900': '#1d3992',
//     '950': '#112055',
//   },
//   sand: {
//     '50': '#f8f7f4',
//     '100': '#f3f1ec',
//     '200': '#ddd8cb',
//     '300': '#c8bda9',
//     '400': '#b19f86',
//     '500': '#a18a6e',
//     '600': '#947a62',
//     '700': '#7c6452',
//     '800': '#655247',
//     '900': '#53443b',
//     '950': '#2c231e',
//   },
//   salmon: {
//     '50': '#fef4f2',
//     '100': '#fde7e3',
//     '200': '#fcd4cc',
//     '300': '#f9b5a8',
//     '400': '#f48975',
//     '500': '#ea6249',
//     '600': '#d7462b',
//     '700': '#b43821',
//     '800': '#95321f',
//     '900': '#7c2e20',
//     '950': '#43150c',
//   },
//   lavender: {
//     '50': '#f5f4fe',
//     '100': '#ecebfc',
//     '200': '#dbdafa',
//     '300': '#b3aef5',
//     '400': '#9f95f0',
//     '500': '#7f6ae8',
//     '600': '#6c4add',
//     '700': '#5c38c9',
//     '800': '#4d2ea9',
//     '900': '#40288a',
//     '950': '#26175e',
//   },
//   green: {
//     '50': '#eafff6',
//     '100': '#cdfee7',
//     '200': '#a0fad4',
//     '300': '#63f2be',
//     '400': '#25e2a4',
//     '500': '#00d395',
//     '600': '#00a474',
//     '700': '#008361',
//     '800': '#00674e',
//     '900': '#005541',
//     '950': '#003026',
//   },
//   orange: {
//     '500': '#7452FF',
//   },
// }

// Use the above customization with this format: colors.orange['500']
// or use the default Chakra colors: 'orange.500'

const tokens = {
  colors: {
    light: {
      'bg-default': 'hsla(43,23%,94%,1)',
      'text-body': 'linear-gradient(45deg, #333 0%, #707883 100%)',
      'text-link': 'orange.500',
      'gradient-dusk': 'gradient.dusk',
    },
    dark: {
      'bg-default': 'hsla(217,12%,29%,1)',
      'text-body': 'linear-gradient(45deg, #E6C6A0 0%, #E5D3BE 100%)',
      'text-link': 'orange.500',
      'gradient-dusk': 'gradient.dusky',
    },
  },
}

export const balTheme: ThemeOverride = {
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
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
      // Text styles
      'text-body': {
        default: tokens.colors.light['text-body'],
        _dark: tokens.colors.dark['text-body'],
      },
      'text-gradient-dusk': {
        default: tokens.colors.light['gradient-dusk'],
        _dark: tokens.colors.dark['gradient-dusk'],
      },
      'text-dark': '#414853',
      'text-light': '#F3F1EC',
      'text-link': {
        default: tokens.colors.light['text-link'],
        _dark: tokens.colors.dark['text-link'],
      },
      // Backgrounds
      'bg-default': {
        default: tokens.colors.light['bg-default'],
        _dark: tokens.colors.dark['bg-default'],
      },
      'bg-gradient-dusk': {
        default: tokens.colors.light['gradient-dusk'],
        _dark: tokens.colors.dark['gradient-dusk'],
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
  styles: {
    global: {
      html: {
        scrollBehavior: 'smooth',
      },
      'body > div[data-rk]': {
        minHeight: '100vh',
      },
      body: {
        background: 'bg-default',
      },
      p: {
        background: 'text-body',
        backgroundClip: 'text',
        '--webkitBackgroundClip': 'text',
        '--webkitTextFillColor': 'transparent',
      },
      'p + ul': {
        mt: '1',
      },
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
        background: 'text-body',
        backgroundClip: 'text',
      },
      variants: {
        'gradient-dusk': props => ({
          bgGradient: props.theme.colors.gradient.dusk,
          bgClip: 'text',
        }),
        sand: props => ({
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
      variants: {
        eyebrow: {
          textTransform: 'uppercase',
          fontSize: 'xs',
          fontWeight: 'semibold',
          letterSpacing: '1px',
          width: 'fit-content',
        },
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
        dusk: props => ({
          bgGradient: props.theme.colors.gradient.dusk,
          borderTop: '2px solid',
          borderColor: 'lavender.200',
          color: 'text-dark',
        }),
        'tx-gas': {
          bgGradient: 'linear(to-tr, blue.300 0%, #D7CBE7 50%, #EAA879 100%)',
          borderTop: '2px solid',
          borderColor: 'lavender.200',
          color: 'black',
        },
        sand: props => ({
          bgGradient: props.theme.colors.gradient.sand,
          borderTop: '2px solid',
          borderBottom: '2px solid',
          borderTopColor: '#F4EBE1',
          borderBottomColor: darken('#F4EBE1', 25),
          color: 'text-dark',
        }),
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
