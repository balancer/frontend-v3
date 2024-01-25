import { Select } from '@chakra-ui/react'

interface SelectorOption {
  value: string
  label: string
}

interface SelectorProps {
  activeOption: SelectorOption
  options: SelectorOption[]
  variant?: 'primary' | 'secondary'
  onChange: (option: string) => void
}

export function Selector({ activeOption, onChange, options, variant }: SelectorProps) {
  return (
    <Select
      variant={variant}
      onChange={e => onChange(e.currentTarget.value)}
      defaultValue={activeOption.value}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}
