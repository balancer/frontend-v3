import { ChakraStylesConfig } from 'chakra-react-select'

export function getSelectStyles<T>(): ChakraStylesConfig<T> {
  return {
    container: provided => ({
      ...provided,
      width: 'full',
      cursor: 'pointer',
      _focus: {
        background: 'background.level3',
      },
    }),
    control: provided => ({
      ...provided,
      background: 'background.level3',
      shadow: 'sm',
      borderColor: 'border.base',
      rounded: 'md',
      _hover: {
        background: 'background.level3',
      },
      _focus: {
        background: 'background.level3',
        boxShadow: '0px 0px 0px 1px var(--chakra-colors-purple-500)',
      },
      _focusVisible: {
        background: 'background.level3',
        boxShadow: '0px 0px 0px 1px var(--chakra-colors-purple-500)',
      },
    }),
    menuList: provided => ({
      ...provided,
      background: 'background.level4',
      borderColor: 'border.base',
      rounded: 'md',
      shadow: 'lg',
    }),
    option: provided => ({
      ...provided,
      background: 'background.level4',
      _hover: {
        background: 'background.level3',
      },
      _active: {
        background: 'background.level3',
      },
      _selected: {
        background: 'purple.500',
      },
    }),
    indicatorSeparator: provided => ({
      ...provided,
      display: 'none',
    }),
    dropdownIndicator: provided => ({
      ...provided,
      background: 'background.level3',
    }),
  }
}
