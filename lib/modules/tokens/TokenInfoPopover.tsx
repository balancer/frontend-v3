import { useBlockExplorer } from '@/lib/shared/hooks/useBlockExplorer'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react'
import { Address } from 'viem'
import { CopyTokenAddressButton } from './CopyTokenAddressButton'
import { abbreviateAddress } from '@/lib/shared/utils/addresses'
import { HiExternalLink } from 'react-icons/hi'
import { CoingeckoIcon } from '@/lib/shared/components/icons/CoingeckoIcon'

type Props = {
  tokenAddress: string | Address
  chain: GqlChain
}

export function TokenInfoPopover({ tokenAddress, chain }: Props) {
  const { getBlockExplorerTokenUrl } = useBlockExplorer(chain)

  const coingeckoUrl = `https://www.coingecko.com/en/coins/${tokenAddress}`

  return (
    <Popover placement="right" variant="tooltip" arrowSize={12}>
      <PopoverTrigger>
        <IconButton
          size="xs"
          isRound
          variant="link"
          aria-label="Token info"
          color="grayText"
          icon={<InfoOutlineIcon />}
        />
      </PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverArrow boxShadow="background.card.level3" />
        <PopoverBody>
          <HStack>
            <Text color="inherit" fontWeight="medium" fontSize="sm">
              {abbreviateAddress(tokenAddress)}
            </Text>
            <HStack spacing="xs">
              <CopyTokenAddressButton tokenAddress={tokenAddress} color="inherit" />
              <IconButton
                size="xs"
                isRound
                variant="ghost"
                aria-label="View on Coingecko"
                icon={<CoingeckoIcon width={15} height={15} />}
                as="a"
                href={coingeckoUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
              <IconButton
                size="xs"
                isRound
                variant="ghost"
                aria-label="View on block explorer"
                color="grayText"
                icon={<HiExternalLink />}
                as="a"
                href={getBlockExplorerTokenUrl(tokenAddress)}
                target="_blank"
                rel="noopener noreferrer"
              />
            </HStack>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
