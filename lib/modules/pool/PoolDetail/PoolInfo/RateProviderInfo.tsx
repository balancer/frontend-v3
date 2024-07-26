import { TokenIcon } from '@/lib/modules/tokens/TokenIcon'
import { GqlPriceRateProviderData, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  VStack,
  HStack,
  Text,
  Heading,
  Box,
  Icon,
} from '@chakra-ui/react'
import Link from 'next/link'
import { ArrowUpRight } from 'react-feather'
import { getRateProviderWarnings } from '../../pool.helpers'

type RateProviderInfoPopOverProps = {
  token: GqlToken
  data: GqlPriceRateProviderData
  level: number
  children: React.ReactNode
}

export function RateProviderInfoPopOver({
  token,
  data,
  level,
  children,
}: RateProviderInfoPopOverProps) {
  const warnings = getRateProviderWarnings(data.warnings || [])

  return (
    <Popover trigger="hover">
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverArrow bg="background.level2" />
        <PopoverBody>
          <VStack w="full" alignItems="flex-start" spacing="ms">
            <HStack w="full">
              <Heading variant="h4" fontSize="1.125rem">
                {token.symbol} rate provider
              </Heading>
              <TokenIcon
                chain={token.chain}
                address={token.address}
                size={24}
                alt={token.address}
                ml="auto"
              />
            </HStack>
            {level === 0 && (
              <>
                <Text fontSize="sm">
                  This rate provider has not been reviewed.
                  <br />
                  Proceed with caution.
                </Text>
                <Text fontSize="sm">
                  Learn more about{' '}
                  <Link href="/risks#rate-provider-risk" target="_blank">
                    <Box as="span" color="font.link">
                      rate provider risks
                    </Box>
                  </Link>
                </Text>
              </>
            )}
            {level !== 0 && (
              <>
                <VStack alignItems="flex-start" gap="0">
                  <Text fontSize="sm" color="grayText">
                    Review summary:
                  </Text>
                  <Text fontSize="sm">
                    {data.summary === 'safe' ? 'No vulnerabilities were reported' : 'Unsafe'}
                  </Text>
                </VStack>
                <VStack alignItems="flex-start" gap="0">
                  <Text fontSize="sm" color="grayText">
                    Warnings:
                  </Text>
                  {warnings.length > 0 ? (
                    <Text fontSize="sm">Yes, see review details</Text>
                  ) : (
                    <Text fontSize="sm">
                      None except{' '}
                      <Link href="/risks#rate-provider-risk" target="_blank">
                        <Box as="span" color="font.link">
                          rate provider risks
                        </Box>
                      </Link>
                    </Text>
                  )}
                </VStack>
                <VStack alignItems="flex-start" gap="0">
                  <Text fontSize="sm" color="grayText">
                    Upgradeable components:
                  </Text>
                  {data.upgradeableComponents && data.upgradeableComponents.length > 0 ? (
                    <Text fontSize="sm">Yes, see review details</Text>
                  ) : (
                    <Text fontSize="sm">None</Text>
                  )}
                </VStack>
                <VStack alignItems="flex-start" gap="0">
                  <Text fontSize="sm" color="grayText">
                    Rate provider factory:
                  </Text>
                  <Text fontSize="sm">{data.factory ?? 'None'}</Text>
                </VStack>
                {data.reviewFile && (
                  <Link
                    href={`https://github.com/balancer/code-review/blob/main/rate-providers/${data.reviewFile}`}
                    target="_blank"
                  >
                    <HStack gap="xxs">
                      <Text fontSize="sm" color="font.link">
                        View review details
                      </Text>
                      <Icon as={ArrowUpRight} size={12} color="font.link" />
                    </HStack>
                  </Link>
                )}
              </>
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
