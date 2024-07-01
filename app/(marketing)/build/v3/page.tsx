'use client'

import {
  Button,
  Card,
  Center,
  Divider,
  Grid,
  GridItem,
  Heading,
  Text,
  Stack,
  VStack,
  Flex,
  Box,
  Image,
  Circle,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import Section from '@/lib/shared/components/layout/Section'
import Link from 'next/link'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'

export default function Home() {
  return (
    <Box className="build">
      <Box className="hero" pb="2xl">
        <Flex direction="column" justify="center" className="hero-container">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'null', md: 'center' }}
            height="100%"
          >
            <Flex
              direction="column"
              w="full"
              height="100%"
              justifyContent="center"
              alignItems={{ base: 'start', md: 'center' }}
              px={['ms', 'md']}
              py={['lg', 'lg']}
            >
              <Box
                py={{ base: 'lg', md: '2xl' }}
                pb={{ base: 'md', md: 'lg' }}
                w="full"
                maxW="4xl"
                m="auto"
                textAlign={{ base: 'left', md: 'center' }}
              >
                <FadeInOnView>
                  <Text pb="xl" variant="eyebrow" w="full">
                    Balancer v3
                  </Text>
                  <Heading
                    position="relative"
                    pb="xl"
                    fontWeight="normal"
                    left={{ base: '-3px', md: '0' }}
                    letterSpacing="-5px"
                    lineHeight="0.9"
                    w="full"
                    sx={{
                      fontSize: 'clamp(100px, 15vw, 120px)',
                    }}
                  >
                    AMMs made easy
                  </Heading>
                  <Text
                    pb="lg"
                    sx={{
                      textWrap: 'balance',
                    }}
                  >
                    Balancer v3 powers the next generation of AMM innovation. Simplified pool
                    creation with an optimized vault. Plug in audited reusable hooks to import
                    additional functionality.
                  </Text>
                  <Box>
                    <Button size="lg" as={Link} href="/pools" prefetch={true} variant="primary">
                      Get started
                    </Button>
                  </Box>
                </FadeInOnView>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Box>

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
                  <picture className="picture">
                    {/* <source srcSet="/images/homepage/bootstrap-liquidity.avif" type="image/avif" /> */}
                    {/* <source srcSet="image.webp" type="image/webp" />
            <source srcSet="large.png" media="(min-width: 75em)" />
            <source srcSet="medium.png" media="(min-width: 40em)" /> */}
                    <img
                      src="/images/homepage/pools.png"
                      alt="Plugged into Balancer vault"
                      loading="lazy"
                      decoding="async"
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
                  Code less. Build more.
                </Heading>
                <Text
                  sx={{
                    textWrap: 'balance',
                  }}
                >
                  Focus on innovation rather than low level tasks like accounting and security.
                  Simply supply custom AMM logic, and harness the full benefit of an optimized,
                  battle-tested tech stack.
                </Text>
              </Flex>
            </Card>

            <Card>
              <Flex direction="column" justify="flex-end" h="100%">
                <Box overflow="hidden" pb="md" rounded="lg" h="100%">
                  <picture className="picture">
                    {/* <source srcSet="/images/homepage/bootstrap-liquidity.avif" type="image/avif" /> */}
                    {/* <source srcSet="image.webp" type="image/webp" />
            <source srcSet="large.png" media="(min-width: 75em)" />
            <source srcSet="medium.png" media="(min-width: 40em)" /> */}
                    <img
                      src="/images/homepage/pools.png"
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
                  Booststrap liquidity
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
            </Card>
            <Card>
              <Flex direction="column" justify="flex-end" h="100%">
                <Box overflow="hidden" pb="md" rounded="lg" h="100%">
                  <picture className="picture">
                    {/* <source srcSet="/images/homepage/bootstrap-liquidity.avif" type="image/avif" /> */}
                    {/* <source srcSet="image.webp" type="image/webp" />
            <source srcSet="large.png" media="(min-width: 75em)" />
            <source srcSet="medium.png" media="(min-width: 40em)" /> */}
                    <img
                      src="/images/homepage/pools.png"
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
                  Launch your product faster
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
            </Card>
            <Card gridArea={{ base: 'auto', md: '3 / 1 / 4 / 3', lg: '1 / 4 / 3 / 5' }}>
              <Flex direction="column" justify="flex-end" h="100%">
                <Box overflow="hidden" pb="md" rounded="lg" h="100%">
                  <picture className="picture">
                    {/* <source srcSet="/images/homepage/bootstrap-liquidity.avif" type="image/avif" /> */}
                    {/* <source srcSet="image.webp" type="image/webp" />
            <source srcSet="large.png" media="(min-width: 75em)" />
            <source srcSet="medium.png" media="(min-width: 40em)" /> */}
                    <img
                      src="/images/homepage/pools.png"
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
                  Join the largest AMM network
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
            </Card>
          </Grid>
        </Box>
      </Section>

      <Section className="protocols">
        <Box maxW="maxContent" m="0 auto" px={{ base: 'md', xl: '0' }}>
          <Box
            pb={{ base: 'md', md: 'lg' }}
            w="full"
            maxW="4xl"
            m="auto"
            textAlign={{ base: 'left', md: 'center' }}
          >
            <FadeInOnView>
              <Text pb="lg" variant="eyebrow" w="full">
                Use cases
              </Text>
              <Heading
                pb="md"
                w="full"
                sx={{
                  textWrap: 'balance',
                }}
              >
                Flexible design space for AMMs
              </Heading>
              <Text
                pb="lg"
                sx={{
                  textWrap: 'balance',
                }}
              >
                v3 enables the next wave of DeFi products to come to market. Learn about the new
                types of things that can be built on Balancer v3.
              </Text>
            </FadeInOnView>
          </Box>
        </Box>
      </Section>

      <Section className="protocols">
        <Box maxW="maxContent" m="0 auto" px={{ base: 'md', xl: '0' }}>
          <Box
            pb={{ base: 'md', md: 'lg' }}
            w="full"
            maxW="4xl"
            m="auto"
            textAlign={{ base: 'left', md: 'center' }}
          >
            <FadeInOnView>
              <Text pb="lg" variant="eyebrow" w="full">
                v2 vs v3
              </Text>
              <Heading
                pb="md"
                w="full"
                sx={{
                  textWrap: 'balance',
                }}
              >
                v3 pools are beautifully simple
              </Heading>
              <Text
                pb="lg"
                sx={{
                  textWrap: 'balance',
                }}
              >
                Complexity moves from pool development to the heavily audited vault to make life
                easier for developers. This can result in some custom pools requiring 30% less code!
              </Text>
            </FadeInOnView>
            <FadeInOnView>
              <Card textAlign="left">
                <TableContainer>
                  <Table variant="unstyled" className="feature-table">
                    <Thead>
                      <Tr>
                        <Th pt="xs">Balancer pools</Th>
                        <Th pt="xs" textAlign="right">
                          v2
                        </Th>
                        <Th pt="xs" textAlign="right">
                          v3
                        </Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      <Tr>
                        <Td colSpan={3} padding={0}>
                          <Divider pt="sm" mb="sm" />
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Access to reuseable hooks</Td>
                        <Td textAlign="right">N</Td>
                        <Td textAlign="right">Y</Td>
                      </Tr>
                      <Tr>
                        <Td>Management of pool tokens (BPT)</Td>
                        <Td textAlign="right">Y</Td>
                        <Td textAlign="right">N</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Card>
            </FadeInOnView>
          </Box>
        </Box>
      </Section>

      <Section className="protocols">
        <Box maxW="maxContent" m="0 auto" px={{ base: 'md', xl: '0' }}>
          <Box
            pb={{ base: 'md', md: 'lg' }}
            w="full"
            maxW="4xl"
            m="auto"
            textAlign={{ base: 'left', md: 'center' }}
          >
            <Text pb="lg" variant="eyebrow" w="full">
              Balancer grants
            </Text>
            <Heading
              pb="md"
              w="full"
              sx={{
                textWrap: 'balance',
              }}
            >
              Grants for AMM experimentation
            </Heading>
            <Text
              pb="lg"
              sx={{
                textWrap: 'balance',
              }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, itaque sequi.
              Veritatis eligendi impedit ullam nam quos et dolores eaque, error nemo quia
              consectetur dolorum doloribus sapiente non, ipsam illum.
            </Text>
            <Flex gap="sm" justify={{ base: 'start', md: 'center' }}>
              <Button size="lg" as={Link} href="/pools" prefetch={true} variant="primary">
                Learn more
              </Button>

              <Button size="lg" as={Link} href="/pools" prefetch={true} variant="secondary">
                View v3 docs
              </Button>
            </Flex>
          </Box>
        </Box>
      </Section>
    </Box>
  )
}
