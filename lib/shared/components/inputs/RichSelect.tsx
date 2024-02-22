import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Menu, MenuButton, MenuButtonProps, MenuItem, MenuList } from '@chakra-ui/react'

type Option = {
  label: string | React.ReactNode
  value: string
}

type Props = {
  options: Option[]
  value: string
  onChange: (value: string) => void
  rightIcon?: React.ReactNode
}

export function RichSelect({
  options,
  value,
  rightIcon,
  onChange,
  ...rest
}: Props & MenuButtonProps) {
  const currentOption = options.find(option => option.value === value)

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={rightIcon ?? <ChevronDownIcon />}
        w="full"
        textAlign="left"
        color="font.primary"
        background="background.card.level8"
        shadow="md"
        _hover={{ background: 'background.card.level7' }}
        _active={{ background: 'background.card.level6' }}
        {...rest}
      >
        {currentOption?.label || 'Select'}
      </MenuButton>
      <MenuList>
        {options.map(option => (
          <MenuItem key={option.value} onClick={() => onChange(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
