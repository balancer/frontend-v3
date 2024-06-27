import { background } from '@chakra-ui/react'

export function getComponents(tokens: any, primaryTextColor: string) {
  return {
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
            rounded: 'md',
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
          root: {
            border: 'none',
            borderWidth: 0,
            background: 'background.level1',
            rounded: 'sm',
          },
        },
        incentives: {
          root: {
            width: 'full',
            background: 'background.level2',
            rounded: 'lg',
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
          lineHeight: { base: '3.25rem', md: '4.25rem' },
          letterSpacing: '-1.25px',
        },
        h2: {
          fontSize: { base: '2rem', md: '3rem' },
          lineHeight: { base: '2.25rem', md: '3.5rem' },
        },
        h3: {
          fontSize: { base: '1.5rem', md: '2rem' },
          lineHeight: { base: '1.75rem', md: '2.25rem' },
        },
        h4: {
          fontSize: { base: '1.25rem', md: '1.5rem' },
          lineHeight: { base: '1.5rem', md: '1.75rem' },
        },
        h5: {
          fontSize: { base: '1.0625rem', md: '1.25rem' },
          lineHeight: { base: '1.375rem', md: '1.5rem' },
        },
        h6: {
          fontSize: { base: '1rem', md: '1.0625rem' },
          lineHeight: { base: '1.25rem', md: '1.375rem' },
        },
      },
    },
    Text: {
      baseStyle: {
        color: 'font.primary',
        fontWeight: 'medium',
        letterSpacing: '-0.25px',
        lineHeight: '1.3',
        fontSize: ['sm', 'md'],
      },
      fontSizes: {
        xs: {
          fontSize: ['0.625rem', '0.75rem'],
          lineHeight: ['0.875rem', '1.125rem'],
        },
        sm: {
          fontSize: ['xs', 'sm'],
          lineHeight: ['1rem', '1.125rem'],
        },
        md: {
          fontSize: ['sm', 'md'],
          lineHeight: ['1.125rem', '1.3125rem'],
        },
        lg: {
          fontSize: ['md', 'lg'],
          lineHeight: ['1.3125rem', '1.5rem'],
        },
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
        fontSize: ['sm', 'md'],
        _hover: {
          color: 'font.linkHover',
        },
      },
      variants: {
        nav: {
          color: 'font.primary',
          transition: tokens.transition.default,
          fontSize: ['sm', 'md'],
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
      sizes: {
        xxs: {
          h: { base: '24px', md: '26px' },
          px: '2',
        },
        xs: {
          h: { base: '28px', md: '32px' },
          px: '2',
        },
        sm: {
          h: { base: '32px', md: '36px' },
          px: '2',
        },
        md: {
          h: { base: '36px', md: '40px' },
          px: { base: '2', md: '3' },
        },
        lg: {
          h: { base: '40px', md: '48px' },
          px: { base: '3', md: '4' },
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
            color: 'font.highlight',
            transform: 'none',
            _disabled: {
              background: 'transparent',
              color: 'font.secondary',
            },
          },
          _dark: {
            color: 'font.secondary',
            _hover: {
              color: 'font.maxContrast',
              _disabled: {
                color: 'font.secondary',
              },
            },
          },
          _disabled: {
            backgroundColor: 'transparent',
            border: 0,
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
          letterSpacing: '-0.04rem',
        },
        overlay: {
          bg: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(4px)',
          _dark: {
            bg: 'rgba(0,0,0,0.7)',
          },
        },
      },
      defaultProps: {
        size: 'md',
      },
    },
    Drawer: {
      baseStyle: {
        closeButton: {
          top: 3,
          color: 'font.primary',
          rounded: 'full',
        },
        header: {
          color: 'font.primary',
        },
        overlay: {
          bg: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(4px)',
          _dark: {
            bg: 'rgba(0,0,0,0.7)',
          },
        },
      },
    },
    Popover: {
      baseStyle: {
        content: {
          bg: 'background.level3',
          shadow: '3xl',
          border: '1px solid',
          borderColor: 'border.base',
        },
        arrow: {
          background: 'red',
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
            shadow: '3xl',
          },
          arrow: {
            background: 'red',
            borderColor: 'background.level2',
            color: 'background.level2',
            boxShadow: '1px 1px blue',
          },
          body: {
            background: 'background.level2',
            color: 'grayText',
            px: 'sm',
            py: 'xs',
            rounded: 'md',
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
          borderColor: 'transparent',
          shadow: 'xl',
          width: 'full',
          padding: ['xs', 'md'],
        },
        header: {
          padding: 'none',
          paddingBottom: 'md',
          fontSize: '2xl',
          fontWeight: 'bold',
          color: 'font.primary',
        },
        body: {
          padding: 'none',
        },
        footer: {
          padding: 'none',
          paddingTop: 'md',
        },
      },
      variants: {
        subSection: {
          container: {
            background: 'background.level3',
            borderWidth: '1px',
            borderColor: 'border.base',
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
            borderColor: 'border.base',
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
          bg: 'gray.500',
          _checked: {
            bg: 'purple.500',
          },
        },
      },
    },
    Divider: {
      baseStyle: {
        borderColor: 'brown.100',
        borderWidth: '1px',
        boxShadow: '0px 1px 0px 0px rgba(255, 255, 255, 0.8)',
        _dark: {
          borderColor: 'gray.800',
          boxShadow: '0px 1px 0px 0px rgba(255, 255, 255, 0.1)',
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
  }
}
