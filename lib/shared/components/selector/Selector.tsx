import { Select } from '@chakra-ui/react'

interface SelectorOption {
  value: string
  label: string
}

interface SelectorProps {
  activeOption: SelectorOption
  options: SelectorOption[]
  onChange: (option: string) => void
}

export function Selector({ activeOption, onChange, options }: SelectorProps) {
  return (
    <Select onChange={e => onChange(e.currentTarget.value)} defaultValue={activeOption.value}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}
