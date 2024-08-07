import {
  Box,
  Button,
  ButtonProps,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react'
import { ReactNode, useState } from 'react'
import { ChevronDown } from 'react-feather'
import useMeasure from 'react-use-measure'
import { GqlChain } from '../../services/api/generated/graphql'

type Props = {
  label: string
} & ButtonProps

type Option = {
  label: ReactNode
  value: any
}

export function MultiSelect({ label, ...buttonProps }: Props) {
  const [ref, { width }] = useMeasure()

  const contentWidth = width > 200 ? `${width}px` : 'auto'

  const [options] = useState<Option[]>([
    { label: 'Ethereum', value: GqlChain.Mainnet },
    { label: 'Polygon', value: GqlChain.Polygon },
    { label: 'Arbitrum', value: GqlChain.Arbitrum },
    { label: 'Optimism', value: GqlChain.Optimism },
  ])

  return (
    <Popover variant="multiSelect" preventOverflow placement="bottom-start">
      <PopoverTrigger>
        <Button ref={ref} variant="tertiary" w="full" {...buttonProps}>
          <HStack w="full" justify="space-between">
            <Box>{label}</Box>
            <ChevronDown size={16} />
          </HStack>
        </Button>
      </PopoverTrigger>
      <PopoverContent w={contentWidth}>
        <PopoverBody>
          {options.map(option => (
            <Box key={option.value}>{option.label}</Box>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
