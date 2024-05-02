'use client'

import { getChainShortName } from '@/lib/config/app.config'
import { NetworkIcon } from '@/lib/shared/components/icons/NetworkIcon'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { getSelectStyles } from '@/lib/shared/services/chakra/theme/chakra-react-select'
import { HStack, Text } from '@chakra-ui/react'
import { Select, OptionBase, GroupBase, SingleValue, chakraComponents } from 'chakra-react-select'
import { ReactNode, useEffect, useState } from 'react'
import { ChevronDown, Globe } from 'react-feather'
import { supportedNetworks } from '../web3/Web3Provider'

interface ChainOption extends OptionBase {
  label: ReactNode
  value: GqlChain
}

type Props = {
  value: GqlChain
  onChange(value: GqlChain): void
}

const networkOptions: ChainOption[] = supportedNetworks.map(network => ({
  label: (
    <HStack>
      <NetworkIcon chain={network} size={6} />
      <Text>{getChainShortName(network)}</Text>
    </HStack>
  ),
  value: network,
}))

export function ChainSelect({ value, onChange }: Props) {
  const [chainValue, setChainValue] = useState<ChainOption | undefined>(undefined)
  const chakraStyles = getSelectStyles<ChainOption>()

  function handleChange(newOption: SingleValue<ChainOption>) {
    if (newOption) onChange(newOption.value)
  }

  useEffect(() => setChainValue(networkOptions.find(option => option.value === value)), [value])

  return (
    <Select<ChainOption, false, GroupBase<ChainOption>>
      instanceId="chain-select"
      name="Chain"
      value={chainValue}
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
