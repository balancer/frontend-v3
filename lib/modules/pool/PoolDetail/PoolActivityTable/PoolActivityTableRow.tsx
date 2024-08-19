import {
  Box,
  Grid,
  GridItem,
  GridProps,
  HStack,
  Text,
  Image,
  Link,
  useTheme,
} from '@chakra-ui/react'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { formatDistanceToNow, secondsToMilliseconds } from 'date-fns'
import { abbreviateAddress } from '@/lib/shared/utils/addresses'
import { useEnsAvatar, useEnsName } from 'wagmi'
import { usePool } from '../../PoolProvider'
import { getChainId } from '@/lib/config/app.config'
import { createAvatar } from '@dicebear/core'
import { identicon } from '@dicebear/collection'
import { ArrowUpRight } from 'react-feather'
import {
  getBlockExplorerAddressUrl,
  getBlockExplorerTxUrl,
} from '@/lib/shared/hooks/useBlockExplorer'
import { PoolActivityEl } from '../PoolActivity/poolActivity.types'

interface Props extends GridProps {
  event: PoolActivityEl
  keyValue: number
}

function EnsOrAddress({ userAddress }: { userAddress: `0x${string}` }) {
  const { chain } = usePool()
  const chainId = getChainId(chain)
  const { data: name } = useEnsName({ address: userAddress, chainId })

  const { data: ensAvatar } = useEnsAvatar({
    name: name as string,
    chainId,
  })

  const fallbackSVG = createAvatar(identicon, {
    seed: userAddress || 'unknown',
  })

  return (
    <Link target="_blank" href={getBlockExplorerAddressUrl(userAddress)}>
      <HStack>
        <Image
          src={ensAvatar || fallbackSVG.toDataUriSync()}
          alt={name || userAddress}
          width="24px"
          height="24px"
          borderRadius="100%"
          backgroundColor="background.level4"
        />
        <HStack gap="0.5">
          <Text>{name || abbreviateAddress(userAddress)}</Text>
          <Text variant="secondary">
            <ArrowUpRight size={12} />
          </Text>
        </HStack>
      </HStack>
    </Link>
  )
}

export function PoolActivityTableRow({ event, keyValue, ...rest }: Props) {
  const { toCurrency } = useCurrency()
  const theme = useTheme()

  const poolEvent = event[2]

  return (
    <FadeInOnView>
      <Box
        key={keyValue}
        transition="all 0.2s ease-in-out"
        _hover={{
          bg: 'background.level0',
        }}
        rounded="md"
        px={{ base: '0', sm: 'md' }}
        w="full"
      >
        <Grid {...rest} py={{ base: 'ms', md: 'md' }} pr="4">
          <GridItem>
            <EnsOrAddress userAddress={poolEvent.userAddress as `0x${string}`} />
          </GridItem>
          <GridItem>
            <HStack>
              <Box
                height="2"
                width="2"
                backgroundImage={
                  theme.semanticTokens.colors.chart.pool.scatter[poolEvent.action].label
                }
                borderRadius="50%"
                display="inline-block"
              />
              <Text casing="capitalize">{poolEvent.action}</Text>
            </HStack>
          </GridItem>
          <GridItem>{/* transaction details */}</GridItem>
          <GridItem textAlign="right">
            <Text>{toCurrency(poolEvent.usdValue)}</Text>
          </GridItem>
          <GridItem textAlign="right">
            <Link target="_blank" href={getBlockExplorerTxUrl(poolEvent.tx)}>
              <HStack gap="0.5">
                <Text>
                  {formatDistanceToNow(new Date(secondsToMilliseconds(event[0])), {
                    addSuffix: true,
                  })}
                </Text>
                <Text variant="secondary">
                  <ArrowUpRight size={12} />
                </Text>
              </HStack>
            </Link>
          </GridItem>
        </Grid>
      </Box>
    </FadeInOnView>
  )
}
