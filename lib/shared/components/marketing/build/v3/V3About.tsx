import { Card, Grid, Heading, Text, Flex, Box } from '@chakra-ui/react'
import Section from '@/lib/shared/components/layout/Section'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { Picture } from '@/lib/shared/components/other/Picture'

export function V3About() {
  return (
    <Section className="builders">
      <Box maxW="maxContent" m="0 auto" px={{ base: 'md', xl: '0' }}>
        <Box
          pb={{ base: 'md', md: 'lg' }}
          w="full"
          maxW="4xl"
          m="auto"
          textAlign={{ base: 'left', md: 'center' }}
        >
          <Text pb="lg" variant="eyebrow" w="full">
            About v3
          </Text>
          <Heading
            pb="md"
            w="full"
            as="h2"
            size="2xl"
            sx={{
              textWrap: 'balance',
            }}
          >
            Code less. Build more.
          </Heading>
          <Text
            w="full"
            sx={{
              textWrap: 'balance',
            }}
          >
            To simplify the developer experience, the core focus is to remove complexity from the
            creation of new AMMs and custom pools by optimizing the vault and creating a new hooks
            framework.
          </Text>
        </Box>

        <Grid
          templateRows={{ base: 'repeat(4, 1fr', md: 'repeat(3, 1fr', lg: 'repeat(2, 1fr' }}
          templateColumns={{ base: 'repeat(1, 1fr', md: 'repeat(2, 1fr', lg: 'repeat(4, 1fr' }}
          gap={4}
        >
          <Card
            variant="level2"
            gridArea={{ base: 'auto', md: '1 / 1 / 2 / 3', lg: '1 / 1 / 3 / 3' }}
          >
            <Flex direction="column" justify="flex-end" h="100%">
              <Box overflow="hidden" pb="md" rounded="lg" h="100%">
                <Picture
                  imgName="pools"
                  altText="Pools plugged into Balancer vault"
                  defaultImgType="png"
                  imgPng={true}
                />
              </Box>
              <Heading
                as="h5"
                size="h5"
                pb="sm"
                sx={{
                  textWrap: 'balance',
                }}
              >
                Simplified pools
              </Heading>
              <Text
                sx={{
                  textWrap: 'balance',
                }}
              >
                Focus on innovation rather than low level tasks like accounting and security. Simply
                supply custom AMM logic, and harness the full benefit of an optimized, battle-tested
                tech stack.
              </Text>
            </Flex>
          </Card>

          <Card>
            <FadeInOnView>
              <Flex direction="column" justify="flex-end" h="100%">
                <Box overflow="hidden" pb="md" rounded="lg" h="100%">
                  <picture className="picture">
                    {/* <source srcSet="/images/homepage/bootstrap-liquidity.avif" type="image/avif" /> */}
                    {/* <source srcSet="image.webp" type="image/webp" />
            <source srcSet="large.png" media="(min-width: 75em)" />
            <source srcSet="medium.png" media="(min-width: 40em)" /> */}
                    <img
                      src="/images/homepage/feature2.jpg"
                      alt="Plugged into Balancer vault"
                      loading="lazy"
                      decoding="async"
                      width="100%"
                      height="100%"
                      object-fit="cover"
                    />
                  </picture>
                </Box>
                <Heading
                  as="h5"
                  size="h5"
                  pb="sm"
                  sx={{
                    textWrap: 'balance',
                  }}
                >
                  Reusable hooks
                </Heading>
                <Text
                  sx={{
                    textWrap: 'balance',
                  }}
                >
                  Plug into Balancer&lsquo;s veBAL incentive mechanism and grants framework to
                  bootstrap AMM liquidity.
                </Text>
              </Flex>
            </FadeInOnView>
          </Card>

          <Card>
            <FadeInOnView>
              <Flex direction="column" justify="flex-end" h="100%">
                <Box overflow="hidden" pb="md" rounded="lg" h="100%">
                  <picture className="picture">
                    {/* <source srcSet="/images/homepage/bootstrap-liquidity.avif" type="image/avif" /> */}
                    {/* <source srcSet="image.webp" type="image/webp" />
            <source srcSet="large.png" media="(min-width: 75em)" />
            <source srcSet="medium.png" media="(min-width: 40em)" /> */}
                    <img
                      src="/images/homepage/feature3.jpg"
                      alt="Plugged into Balancer vault"
                      loading="lazy"
                      decoding="async"
                      width="100%"
                      height="100%"
                      object-fit="cover"
                    />
                  </picture>
                </Box>
                <Heading
                  as="h5"
                  size="h5"
                  pb="sm"
                  sx={{
                    textWrap: 'balance',
                  }}
                >
                  Optimized vault
                </Heading>
                <Text
                  sx={{
                    textWrap: 'balance',
                  }}
                >
                  Eliminate the cold start AMM problem entirely with streamlined aggregator
                  integrations, a prebuilt UI.
                </Text>
              </Flex>
            </FadeInOnView>
          </Card>

          <Card gridArea={{ base: 'auto', md: '3 / 1 / 4 / 3', lg: '1 / 4 / 3 / 5' }}>
            <FadeInOnView>
              <Flex direction="column" justify="flex-end" h="100%">
                <Box overflow="hidden" pb="md" rounded="lg" h="100%">
                  <picture className="picture">
                    {/* <source srcSet="/images/homepage/bootstrap-liquidity.avif" type="image/avif" /> */}
                    {/* <source srcSet="image.webp" type="image/webp" />
            <source srcSet="large.png" media="(min-width: 75em)" />
            <source srcSet="medium.png" media="(min-width: 40em)" /> */}
                    <img
                      src="/images/homepage/feature4.jpg"
                      alt="Plugged into Balancer vault"
                      loading="lazy"
                      decoding="async"
                      width="100%"
                      height="100%"
                      object-fit="cover"
                    />
                  </picture>
                </Box>
                <Heading
                  as="h5"
                  size="h5"
                  pb="sm"
                  sx={{
                    textWrap: 'balance',
                  }}
                >
                  Transient accounting
                </Heading>
                <Text
                  sx={{
                    textWrap: 'balance',
                  }}
                >
                  Unlock an extensive network of AMM expertise, audit pipelines, and partnership
                  connections.
                </Text>
              </Flex>
            </FadeInOnView>
          </Card>
        </Grid>
      </Box>
    </Section>
  )
}
