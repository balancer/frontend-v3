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
  UnorderedList,
  ListItem,
} from '@chakra-ui/react'
import Link from 'next/link'

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
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverArrow bg="background.level2" />
        <PopoverBody>
          <VStack w="full" alignItems="flex-start" spacing="lg" mb="sm">
            <HStack w="full">
              <Heading variant="h4" fontSize="1.25rem">
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
                <Text>
                  This rate provider has not been reviewed.
                  <br />
                  Proceed with caution.
                </Text>
                <Text>
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
                <VStack alignItems="flex-start">
                  <Text color="grayText">Review summary</Text>
                  <Text>
                    {data.summary === 'safe' ? 'No vulnerabilities were reported' : 'Unsafe'}
                  </Text>
                </VStack>
                <VStack alignItems="flex-start">
                  <Text color="grayText">Warnings</Text>1
                  {data.warnings && data.warnings.length > 0 ? (
                    <UnorderedList>
                      {data.warnings.map((warning, index) => (
                        <ListItem key={index}>{warning}</ListItem>
                      ))}
                    </UnorderedList>
                  ) : (
                    <Text>
                      None except{' '}
                      <Link href="/risks#rate-provider-risk" target="_blank">
                        <Box as="span" color="font.link">
                          rate provider risks
                        </Box>
                      </Link>
                    </Text>
                  )}
                </VStack>
                <VStack alignItems="flex-start">
                  <Text color="grayText">Upgradeable components</Text>
                  {data.upgradeableComponents && data.upgradeableComponents.length > 0 ? (
                    data.upgradeableComponents.map((component, index) => (
                      <HStack w="full" key={index}>
                        <Text>{component?.entryPoint}</Text>
                        <Text ml="auto">{component?.implementationReviewed}</Text>
                      </HStack>
                    ))
                  ) : (
                    <Text>None</Text>
                  )}
                </VStack>
                <VStack alignItems="flex-start">
                  <Text color="grayText">Rate provider factory</Text>
                  <Text>{data.factory ?? 'None'}</Text>
                </VStack>
                <VStack alignItems="flex-start">
                  <Text color="grayText">Review URL</Text>
                  {data.reviewUrl ? (
                    <Link href={data.reviewUrl} target="_blank">
                      <Box as="span" color="font.link">
                        Link
                      </Box>
                    </Link>
                  ) : (
                    <Text>&mdash;</Text>
                  )}
                </VStack>
              </>
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
