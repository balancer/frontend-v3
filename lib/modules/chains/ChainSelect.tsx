'use client'

import { getChainName } from '@/lib/config/app.config'
import { PROJECT_CONFIG } from '@/lib/config/getProjectConfig'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { getSelectStyles } from '@/lib/shared/services/chakra/theme.helpers'
import { HStack, Text } from '@chakra-ui/react'
import { Select, OptionBase, GroupBase, SingleValue, chakraComponents } from 'chakra-react-select'
import { ReactNode } from 'react'
import { ChevronDown, Globe } from 'react-feather'

interface ChainOption extends OptionBase {
  label: ReactNode
  value: GqlChain
}

type Props = {
  value: GqlChain
  onChange(value: GqlChain): void
}

const networkOptions: ChainOption[] = PROJECT_CONFIG.supportedNetworks.map(network => ({
  label: (
    <HStack>
      <NetworkIcon chain={network} size={6} />
      <Text>{getChainName(network)}</Text>
    </HStack>
  ),
  value: network,
}))

export function ChainSelect({ value, onChange }: Props) {
  const chakraStyles = getSelectStyles<ChainOption>()

  function handleChange(newOption: SingleValue<ChainOption>) {
    if (newOption) onChange(newOption.value)
  }

  const _value = networkOptions.find(option => option.value === value)

  return (
    <Select<ChainOption, false, GroupBase<ChainOption>>
      name="Chain"
      value={_value}
      options={networkOptions}
      chakraStyles={chakraStyles}
      onChange={handleChange}
      components={{
        DropdownIndicator: props => (
          <chakraComponents.DropdownIndicator {...props}>
            <HStack>
              <Globe size={16} />
              <ChevronDown size={16} />
            </HStack>
          </chakraComponents.DropdownIndicator>
        ),
      }}
    />
  )
}
