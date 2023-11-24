import { ThemeTypings, extendTheme } from '@chakra-ui/react'
import { withProse } from '@nikolovlazar/chakra-ui-prose'
import tinycolor from 'tinycolor2'

const balColors = {
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
    dawnLight: 'linear-gradient(90deg, #8F86FD 0%, #A66CF3 33%, #F48975 100%)',
    dawnDark: 'linear-gradient(90deg, #B3AEF5 0%, #D7CBE7 25%, #E5C8C8 50%, #EAA879 100%)',
    sunsetLight: 'linear-gradient(90deg, #F06147 0%, #EA9A43 100%)',
    sunsetDark: 'linear-gradient(90deg, #F06147 0%, #EA9A43 100%)',
  },    
}

const tokens = {
  colors: {
    light: {
      background: {
        // Background colors
        base: 'hsla(43,23%,92%,1)',
        baseWithOpacity: 'hsla(43,23%,92%,0.4)',
        special: balColors.gradient.dawnLight,
        specialSecondary: balColors.gradient.sunsetLight,
      },

      // Button colors
      button: {
        background: {
          primary: 'linear-gradient(90deg, #8076FE 0%, #E38C4F 100%)',
          secondary: 'linear-gradient(152deg, #E5D3BE 20.87%, #E6C6A0 86.96%)',
          tertiary:
            'linear-gradient(0deg, rgba(63, 69, 80, 0.80) -16.28%, rgba(85, 94, 108, 0.80) 97.67%)',
        },
        border: {
          tertiary: 'gray.500',
          disabled: '#B4BDC8',
        },
        text: {
          disabled: '#B4BDC8',
        },
      },

      // Font colors
      text: {
        primary: 'linear-gradient(45deg, rgba(45, 76, 126, 1) 0%, rgba(45, 76, 126, 0.75) 100%)',
        secondary: 'linear-gradient(45deg, #728097 0%, #909BAD 100%)',
        special: balColors.gradient.dawnLight,
        specialSecondary: balColors.gradient.sunsetLight,
        link: 'linear-gradient(45deg, #333 0%, #707883 100%)',        
      },

      card: {
        border: {
          card: 'red',
        },
        background: {
          level0: 'hsla(43,23%,92%,1)',
          level1: 'hsla(43,23%,93%,1)',
          level2: 'hsla(43,23%,94%,1)',
          level3: 'hsla(43,23%,95%,1)',
          level4: 'hsla(43,23%,96%,1)',
          level5: 'hsla(43,23%,97%,1)',
          level6: 'hsla(43,23%,98%,1)',
          level7: 'hsla(43,23%,99%,1)',
          level8: 'hsla(43,23%,100%,1)',
        },
      },
      // Input colors
      input: {
        border: '#ff0000',
        bg: 'hsla(43,23%,96%,1)',
        bgHover: 'hsla(43,23%,98%,1)',
        bgFocus: 'hsla(43,23%,100%,1)',
      },
    },
    dark: {
      // Background colors
      background: {
        base: 'hsla(217,12%,29%,1)',
        baseWithOpacity: 'hsla(217,12%,29%,0.95)',
        special: balColors.gradient.dawnDark,
        specialSecondary: balColors.gradient.sunsetDark,
      },
      // Button colors
      button: {
        background: {
          primary: 'linear-gradient(90deg, #B3AEF5 0%, #D7CBE7 25%, #E5C8C8 50%, #EAA879 100%)',
          secondary: 'linear-gradient(152deg, #E5D3BE 20.87%, #E6C6A0 86.96%)',
          tertiary:
            'linear-gradient(0deg, rgba(63, 69, 80, 0.80) -16.28%, rgba(85, 94, 108, 0.80) 97.67%)',
        },
        border: {
          tertiary: 'gray.500',
          disabled: '#B4BDC8',
        },
        text: {
          disabled: '#B4BDC8',
        },
      },

      // Font colors
      text: {
        primary: 'linear-gradient(45deg, #E6C6A0 0%, #E5D3BE 100%)',
        secondary: 'linear-gradient(45deg, #909BAD 0%, #728097 100%)',
        special: 'linear-gradient(90deg, #B3AEF5 0%, #D7CBE7 25%, #E5C8C8 50%, #EAA879 100%)',
        specialSecondary: 'linear-gradient(180deg, #EA9A43 0%, #F06147 100%)',
        link: 'linear-gradient(45deg, #E6C6A0 0%, #E5D3BE 100%)',
      },

      // card colors
      card: {
        border: {
          card: '#4F5764',
        },
        background: {
          level0: 'hsla(216, 12%, 25%, 1)',
          level1: 'hsla(216, 12%, 26%, 1)',
          level2: 'hsla(216, 12%, 27%, 1)',
          level3: 'hsla(216, 12%, 28%, 1)',
          level4: 'hsla(216, 12%, 29%, 1)',
          level5: 'hsla(216, 12%, 30%, 1)',
          level6: 'hsla(216, 12%, 31%, 1)',
          level7: 'hsla(216, 12%, 32%, 1)',
          level8: 'hsla(216, 12%, 33%, 1)',
        },
      },
      input: {
        border: 'red.500',   
        bg: 'hsla(216, 12%, 25%, 1)',
        bgHover: 'hsla(216, 12%, 25%, 1)',
        bgFocus: 'hsla(216, 12%, 21%, 1)',         
      },
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
    heading: `inherit`,
    body: `inherit`,
  },
  colors: {
    ...balColors,
  },
  semanticTokens: {
    colors: {
      lightBorderColor: 'rgba(229, 211, 190, 0.6)',
      darkBorderColor: '#4F5764',
      lightBadge: '#EBE9E0',
      borderColor: {
        _light: 'lightBorderColor',
        _dark: 'darkBorderColor',
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
      background: {
        base: {
          default: tokens.colors.light.background.base,
          _dark: tokens.colors.dark.background.base,
        },
        baseWithOpacity: {
          default: tokens.colors.light.background.baseWithOpacity,
          _dark: tokens.colors.dark.background.baseWithOpacity,
        },
        special: {
          default: tokens.colors.light.background.special,
          _dark: tokens.colors.dark.background.special,
        },
        specialSecondary: {
          default: tokens.colors.light.background.specialSecondary,
          _dark: tokens.colors.dark.background.specialSecondary,
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
          tertiary: {
            default: tokens.colors.light.button.background.tertiary,
            _dark: tokens.colors.dark.button.background.tertiary,
          },
        },
        card: {
          level0: {
            default: tokens.colors.light.card.background.level0,
            _dark: tokens.colors.dark.card.background.level0,
          },
          level1: {
            default: tokens.colors.light.card.background.level1,
            _dark: tokens.colors.dark.card.background.level1,
          },
          level2: {
            default: tokens.colors.light.card.background.level2,
            _dark: tokens.colors.dark.card.background.level2,
          },
          level3: {
            default: tokens.colors.light.card.background.level3,
            _dark: tokens.colors.dark.card.background.level3,
          },
          level4: {
            default: tokens.colors.light.card.background.level4,
            _dark: tokens.colors.dark.card.background.level4,
          },
          level5: {
            default: tokens.colors.light.card.background.level5,
            _dark: tokens.colors.dark.card.background.level5,
          },
          level6: {
            default: tokens.colors.light.card.background.level6,
            _dark: tokens.colors.dark.card.background.level6,
          },
          level7: {
            default: tokens.colors.light.card.background.level7,
            _dark: tokens.colors.dark.card.background.level7,
          },
          level8: {
            default: tokens.colors.light.card.background.level8,
            _dark: tokens.colors.dark.card.background.level8,
          },
        },
      },
      input: {
        border: {
          default: tokens.colors.light.input.border,
          _dark: tokens.colors.dark.input.border,
        },
        bg: {
          default: tokens.colors.light.input.bg,
          _dark: tokens.colors.dark.input.bg,
        },
        bgHover: {
          default: tokens.colors.light.input.bgHover,
          _dark: tokens.colors.dark.input.bgHover,
        },
        bgFocus: {
          default: tokens.colors.light.input.bgFocus,
          _dark: tokens.colors.dark.input.bgFocus,
        },                                        
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

      // Button colors
      border: {
        button: {
          tertiary: {
            default: tokens.colors.light.button.border.tertiary,
            _dark: tokens.colors.dark.button.border.tertiary,
          },
          disabled: {
            default: tokens.colors.light.button.border.disabled,
            _dark: tokens.colors.dark.button.border.disabled,
          },
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
        accordionHeading: {
          default: tokens.colors.light.button.background.primary,
          _dark: tokens.colors.dark.button.background.primary,
        },
        button: {
          disabled: {
            default: tokens.colors.light.button.text.disabled,
            _dark: tokens.colors.dark.button.text.disabled,
          },
          primary: {
            default: '#F3F1EC',
            _dark: '#414853',
          },
        },
        dark: '#414853',
        light: '#F3F1EC',
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
        // border: '3px solid transparent',
        // backgroundClip: 'content-box',
      },
      '::-webkit-scrollbar-thumb:hover': {
        transition: 'all 0.3s ease',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        // border: 'none',
      },
      '.chakra-ui-light ::-webkit-scrollbar-thumb, .chakra-ui-dark ::-webkit-scrollbar-thumb': {
        // border: 'none',
      },
      '.chakra-ui-dark::-webkit-scrollbar-thumb, .chakra-ui-dark ::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',        
      },
      '.chakra-ui-dark::-webkit-scrollbar-thumb:hover, .chakra-ui-dark ::-webkit-scrollbar-thumb:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        // backgroundColor: 'pink',
        // border: 'none',
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
            color: 'sand.300',
          },
          button: {
            px: '5',
            py: '6',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            rounded: 'lg',
            borderWidth: 0,
            border: 'none',
            background: 'lightBadge',
            _dark: {
              background: 'background.card.level3',
            },
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
      },
    },
    Input: {
      baseStyle: {
        field: {
          // background: 'white', // Set the default background color
          shadow: 'innerBase',
          border: '1px solid',
          borderColor: 'input.border',
          bg: 'input.bg',
          _hover: {
            bg: 'input.bgHover', // Background color on hover
          },
          _focus: {
            bg: 'input.bgFocus', // Background color on focus
            borderColor: 'primary.400',
          },
          _disabled: {
            shadow: 'none',
            _hover: {
              bg: 'red.500', // Background color on hover
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
        background: 'font.primary',
        backgroundClip: 'text',
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
        background: 'font.primary',
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
        disabled: {
          minWidth: '100px',
          background: 'transparent',
          color: 'font.button.disabled',
          borderWidth: 1,
          borderColor: 'border.button.disabled',
          _hover: {
            borderColor: 'border.button.disabled',
            transform: 'none',
          },
        },
        primary: {
          minWidth: '100px',
          background: 'background.button.primary',
          color: 'font.button.primary',
        },
        secondary: {
          background: 'background.button.secondary',
          borderTop: '2px solid',
          borderBottom: '2px solid',
          borderTopColor: '#F4EBE1',
          // borderBottomColor: darken('#F4EBE1', 25),
          color: 'font.button.secondary',
        },
        tertiary: {
          background: 'background.button.tertiary',
          borderTop: '2px solid',
          borderColor: 'border.button.tertiary',
          color: 'font.primary',
        },
        'tx-gas': {
          bgGradient: 'linear(to-tr, blue.300 0%, #D7CBE7 50%, #EAA879 100%)',
          borderTop: '2px solid',
          borderColor: 'lavender.200',
          color: 'black',
        },
        buttonGroupInactive: {
          backgroundColor: 'transparent',
          height: 'fit-content',
          width: 'fit-content',
          px: '2',
          py: '1.5',
          fontSize: 'xs',
          color: '#414853',
          fontWeight: 'bold',
          borderRadius: '4px',
          _hover: {
            background: 'background.button.secondary',
            color: '##728097',
            transform: 'none',
          },
          _dark: {
            color: 'gray.300',
            _hover: {
              color: 'background.card.level5',
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
          color: '##728097',
          fontWeight: 'bold',
          borderRadius: '4px',
          _hover: {
            transform: 'none',
          },
          _dark: {
            color: 'background.card.level5',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          background: 'background.card.level0',
        },
      },
      variants: {
        level0: {
          container: {
            background: 'background.card.level0',
            borderColor: 'rgba(229, 211, 190, 0.6)',
            _dark: {
              borderColor: 'darkBorderColor',
            },
          },
        },
        level1: {
          container: {
            background: 'background.card.level1',
            borderColor: 'lightBorderColor',
            _dark: {
              borderColor: 'darkBorderColor',
            },
          },
        },
        level2: {
          container: {
            background: 'background.card.level2',
            borderColor: 'lightBorderColor',
            _dark: {
              borderColor: 'darkBorderColor',
            },
          },
        },
        level3: {
          container: {
            background: 'background.card.level3',
            borderColor: 'lightBorderColor',
            _dark: {
              borderColor: 'darkBorderColor',
            },
          },
        },
        level4: {
          container: {
            background: 'background.card.level4',
            borderColor: 'lightBorderColor',
            _dark: {
              borderColor: 'darkBorderColor',
            },
          },
        },
        level5: {
          container: {
            background: 'background.card.level5',
            borderColor: 'lightBorderColor',
            _dark: {
              borderColor: 'darkBorderColor',
            },
          },
        },
        level6: {
          container: {
            background: 'background.card.level6',
            borderColor: 'lightBorderColor',
            _dark: {
              borderColor: 'darkBorderColor',
            },
          },
        },
        level7: {
          container: {
            background: 'background.card.level7',
            borderColor: 'lightBorderColor',
            _dark: {
              borderColor: 'darkBorderColor',
            },
          },
        },
        level8: {
          container: {
            background: 'background.card.level8',
            borderColor: 'lightBorderColor',
            _dark: {
              borderColor: 'darkBorderColor',
            },
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
