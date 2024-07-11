/* eslint-disable max-len */
'use client'

import {
  Button,
  Card,
  Center,
  Divider,
  Grid,
  Heading,
  Text,
  Flex,
  Box,
  Circle,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react'
import Section from '@/lib/shared/components/layout/Section'
import Link from 'next/link'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { X, Check } from 'react-feather'
import { InfoIcon } from '@/lib/shared/components/icons/InfoIcon'

export default function Home() {
  const { colorMode } = useColorMode()

  const code = `contract ConstantProductPool is IBasePool, BalancerPoolToken {
    
    /**
     * @notice Execute a swap in the pool.
     * @param params Swap parameters
     * @return amountCalculated Calculated amount for the swap
     */
    
    function onSwap(PoolSwapParams calldata params)
      external
      view
      returns (uint256 amountCalculatedScaled18)
    {
      amountCalculatedScaled18 = 
        params.balancesScaled[params.indexIn] *
        params.amountGivenScaled18 /
        (params.balancesScaled[params.indexIn] +
        params.amountGivenScaled18);
    }

    /** Add your own further customizations **/

  }`

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
            maxW="6xl"
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
                maxW="4xl"
                m="auto"
                sx={{
                  textWrap: 'balance',
                }}
              >
                v3 enables the next wave of DeFi products to come to market. Learn about the new
                types of things that can be built on Balancer v3.
              </Text>
            </FadeInOnView>
            <FadeInOnView>
              <Flex gap="lg" pt={{ base: '0', md: 'md' }}>
                <Box position="relative" rounded="full">
                  <Center>
                    <picture className="picture enso">
                      {/* <source srcSet="/images/homepage/enso3.avif" type="image/avif" />
                        <source srcSet="image.webp" type="image/webp" />
                        <source srcSet="large.png" media="(min-width: 75em)" />
                        <source srcSet="medium.png" media="(min-width: 40em)" /> */}
                      <source
                        srcSet="/images/v3/use-case-1.png"
                        media={colorMode === 'dark' ? 'all' : 'none'}
                      />

                      <img
                        src="/images/v3/use-case-1.png"
                        alt="Plugged into Balancer vault"
                        loading="lazy"
                        decoding="async"
                        width="100%"
                        height="100%"
                        object-fit="cover"
                        border-radius="100%"
                      />
                    </picture>

                    <Box
                      textAlign="center"
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%,-50%)"
                      zIndex="10"
                      width="full"
                      padding="md"
                    >
                      <Box>
                        <Text
                          fontWeight="bold"
                          color="white"
                          position="relative"
                          top={{ base: '0', md: '0' }}
                        >
                          100% Boosted Pools
                        </Text>
                      </Box>
                    </Box>
                  </Center>
                </Box>
                <Box position="relative" rounded="full">
                  <Center>
                    <picture className="picture enso">
                      {/* <source srcSet="/images/homepage/enso3.avif" type="image/avif" />
                        <source srcSet="image.webp" type="image/webp" />
                        <source srcSet="large.png" media="(min-width: 75em)" />
                        <source srcSet="medium.png" media="(min-width: 40em)" /> */}
                      <source
                        srcSet="/images/v3/use-case-1.png"
                        media={colorMode === 'dark' ? 'all' : 'none'}
                      />

                      <img
                        src="/images/v3/use-case-1.png"
                        alt="Plugged into Balancer vault"
                        loading="lazy"
                        decoding="async"
                        width="100%"
                        height="100%"
                        object-fit="cover"
                        border-radius="100%"
                      />
                    </picture>

                    <Box
                      textAlign="center"
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%,-50%)"
                      zIndex="10"
                      width="full"
                      padding="md"
                    >
                      <Box>
                        <Text
                          fontWeight="bold"
                          color="white"
                          position="relative"
                          top={{ base: '0', md: '0' }}
                        >
                          Stablesurge hooks
                        </Text>
                      </Box>
                    </Box>
                  </Center>
                </Box>

                <Box position="relative" rounded="full">
                  <Center>
                    <picture className="picture enso">
                      {/* <source srcSet="/images/homepage/enso3.avif" type="image/avif" />
                        <source srcSet="image.webp" type="image/webp" />
                        <source srcSet="large.png" media="(min-width: 75em)" />
                        <source srcSet="medium.png" media="(min-width: 40em)" /> */}
                      <source
                        srcSet="/images/v3/use-case-1.png"
                        media={colorMode === 'dark' ? 'all' : 'none'}
                      />

                      <img
                        src="/images/v3/use-case-1.png"
                        alt="Plugged into Balancer vault"
                        loading="lazy"
                        decoding="async"
                        width="100%"
                        height="100%"
                        object-fit="cover"
                        border-radius="100%"
                      />
                    </picture>

                    <Box
                      textAlign="center"
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%,-50%)"
                      zIndex="10"
                      width="full"
                      padding="md"
                    >
                      <Box>
                        <Text
                          fontWeight="bold"
                          color="white"
                          position="relative"
                          top={{ base: '0', md: '0' }}
                        >
                          LVR mitigation
                        </Text>
                      </Box>
                    </Box>
                  </Center>
                </Box>
              </Flex>
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
              <Box maxW="4xl" m="auto">
                <Text pb="lg" variant="eyebrow" w="full">
                  v2 vs v3
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
                  Building on v3 is simple
                </Heading>
                <Text
                  pb="sm"
                  sx={{
                    textWrap: 'balance',
                  }}
                >
                  To make custom pool creation easy, core functions have been moved from pools into
                  the heavily audited vault. For example, here&rsquo;s all the code needed to build
                  a swap function for a Constant Product Pool.
                </Text>
              </Box>
            </FadeInOnView>

            {/* <Heading
              pb="md"
              w="full"
              as="h3"
              size="xl"
              sx={{
                textWrap: 'balance',
              }}
            >
              Simple custom pool creation
            </Heading>
            <Text>
              For example, here’s all the code needed to build a swap function for a Constant
              Product Pool.
            </Text> */}

            <FadeInOnView>
              <Box mb="2xl">
                <Box
                  bg="background.level2"
                  my="lg"
                  p="md"
                  textAlign="left"
                  rounded="xl"
                  shadow="xl"
                >
                  <SyntaxHighlighter
                    language="solidity"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '16px',
                      borderRadius: '0 0 8px 8px',
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </Box>
              </Box>
            </FadeInOnView>

            <FadeInOnView>
              <Box pb={{ base: 'md', md: 'lg' }} w="full" maxW="4xl" m="auto">
                <Heading textAlign={{ base: 'left', md: 'center' }} w="full" display="block">
                  Feature comparison
                </Heading>
              </Box>
              <Card textAlign="left">
                <TableContainer>
                  <Table variant="unstyled" className="feature-table">
                    <Thead>
                      <Tr>
                        <Th pt="xs">Balancer pools</Th>
                        <Th pt="xs" textAlign="right" mx="xs">
                          <Text fontSize="xs" fontWeight="bold" pr="xs">
                            v2
                          </Text>
                        </Th>
                        <Th pt="xs" textAlign="right" mx="xs">
                          <Text fontSize="xs" fontWeight="bold" pr="xs">
                            v3
                          </Text>
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
                        <Td position="relative">
                          <Tooltip label="Hooks extend existing pool types at various key points throughout the pool&rsquo;s lifecycle. Hooks can execute actions during pool operation and also compute a dynamic swap fee.">
                            <HStack position="relative" width="max-content" gap="xs" role="group">
                              <Text display="inline">Reusable hooks</Text>

                              <Box
                                as={InfoIcon}
                                display="inline"
                                opacity="0.5"
                                transform="scale(0.9)"
                                transition="all 0.2s ease-out"
                                _groupHover={{ opacity: '1', transform: 'scale(1)' }}
                              ></Box>
                            </HStack>
                          </Tooltip>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip
                              label="Custom logic was allowed in v2 but there was no concept of
                                      reusable hooks."
                            >
                              <Circle
                                bg="background.level4"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={X} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip label="Balancer v3 introduces reusable hooks.">
                              <Circle
                                bg="green.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={Check} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td position="relative">
                          <Tooltip label="Hooks extend existing pool types at various key points throughout the pool&rsquo;s lifecycle. Hooks can execute actions during pool operation and also compute a dynamic swap fee.">
                            <HStack position="relative" width="max-content" gap="xs" role="group">
                              <Text display="inline">BPT managed by vault</Text>

                              <Box
                                as={InfoIcon}
                                display="inline"
                                opacity="0.5"
                                transform="scale(0.9)"
                                transition="all 0.2s ease-out"
                                _groupHover={{ opacity: '1', transform: 'scale(1)' }}
                              ></Box>
                            </HStack>
                          </Tooltip>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip
                              label="Custom logic was allowed in v2 but there was no concept of
                                      reusable hooks."
                            >
                              <Circle
                                bg="red.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={X} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip label="Balancer v3 introduces reusable hooks.">
                              <Circle
                                bg="green.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={Check} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td position="relative">
                          <Tooltip label="Hooks extend existing pool types at various key points throughout the pool&rsquo;s lifecycle. Hooks can execute actions during pool operation and also compute a dynamic swap fee.">
                            <HStack position="relative" width="max-content" gap="xs" role="group">
                              <Text display="inline">Transient accounting (EIP-1153)</Text>

                              <Box
                                as={InfoIcon}
                                display="inline"
                                opacity="0.5"
                                transform="scale(0.9)"
                                transition="all 0.2s ease-out"
                                _groupHover={{ opacity: '1', transform: 'scale(1)' }}
                              ></Box>
                            </HStack>
                          </Tooltip>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip
                              label="Custom logic was allowed in v2 but there was no concept of
                                      reusable hooks."
                            >
                              <Circle
                                bg="red.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={X} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip label="Balancer v3 introduces reusable hooks.">
                              <Circle
                                bg="green.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={Check} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td position="relative">
                          <Tooltip label="Hooks extend existing pool types at various key points throughout the pool&rsquo;s lifecycle. Hooks can execute actions during pool operation and also compute a dynamic swap fee.">
                            <HStack position="relative" width="max-content" gap="xs" role="group">
                              <Text display="inline">Decimal scaling (managed by vault)</Text>

                              <Box
                                as={InfoIcon}
                                display="inline"
                                opacity="0.5"
                                transform="scale(0.9)"
                                transition="all 0.2s ease-out"
                                _groupHover={{ opacity: '1', transform: 'scale(1)' }}
                              ></Box>
                            </HStack>
                          </Tooltip>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip
                              label="Custom logic was allowed in v2 but there was no concept of
                                      reusable hooks."
                            >
                              <Circle
                                bg="red.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={X} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip label="Balancer v3 introduces reusable hooks.">
                              <Circle
                                bg="green.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={Check} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td position="relative">
                          <Tooltip label="Hooks extend existing pool types at various key points throughout the pool&rsquo;s lifecycle. Hooks can execute actions during pool operation and also compute a dynamic swap fee.">
                            <HStack position="relative" width="max-content" gap="xs" role="group">
                              <Text display="inline">Rate scaling (managed by vault)</Text>

                              <Box
                                as={InfoIcon}
                                display="inline"
                                opacity="0.5"
                                transform="scale(0.9)"
                                transition="all 0.2s ease-out"
                                _groupHover={{ opacity: '1', transform: 'scale(1)' }}
                              ></Box>
                            </HStack>
                          </Tooltip>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip
                              label="Custom logic was allowed in v2 but there was no concept of
                                      reusable hooks."
                            >
                              <Circle
                                bg="red.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={X} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip label="Balancer v3 introduces reusable hooks.">
                              <Circle
                                bg="green.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={Check} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td position="relative">
                          <Tooltip label="Hooks extend existing pool types at various key points throughout the pool&rsquo;s lifecycle. Hooks can execute actions during pool operation and also compute a dynamic swap fee.">
                            <HStack position="relative" width="max-content" gap="xs" role="group">
                              <Text display="inline">Liquidity invariant approximation</Text>

                              <Box
                                as={InfoIcon}
                                display="inline"
                                opacity="0.5"
                                transform="scale(0.9)"
                                transition="all 0.2s ease-out"
                                _groupHover={{ opacity: '1', transform: 'scale(1)' }}
                              ></Box>
                            </HStack>
                          </Tooltip>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip
                              label="Custom logic was allowed in v2 but there was no concept of
                                      reusable hooks."
                            >
                              <Circle
                                bg="red.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={X} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip label="Balancer v3 introduces reusable hooks.">
                              <Circle
                                bg="green.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={Check} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td position="relative">
                          <Tooltip label="Hooks extend existing pool types at various key points throughout the pool&rsquo;s lifecycle. Hooks can execute actions during pool operation and also compute a dynamic swap fee.">
                            <HStack position="relative" width="max-content" gap="xs" role="group">
                              <Text display="inline">Linear pools</Text>

                              <Box
                                as={InfoIcon}
                                display="inline"
                                opacity="0.5"
                                transform="scale(0.9)"
                                transition="all 0.2s ease-out"
                                _groupHover={{ opacity: '1', transform: 'scale(1)' }}
                              ></Box>
                            </HStack>
                          </Tooltip>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip label="Balancer v3 introduces reusable hooks.">
                              <Circle
                                bg="green.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={Check} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip
                              label="Custom logic was allowed in v2 but there was no concept of
                                      reusable hooks."
                            >
                              <Circle
                                bg="red.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={X} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td position="relative">
                          <Tooltip label="Hooks extend existing pool types at various key points throughout the pool&rsquo;s lifecycle. Hooks can execute actions during pool operation and also compute a dynamic swap fee.">
                            <HStack position="relative" width="max-content" gap="xs" role="group">
                              <Text display="inline">Phantom BPT</Text>

                              <Box
                                as={InfoIcon}
                                display="inline"
                                opacity="0.5"
                                transform="scale(0.9)"
                                transition="all 0.2s ease-out"
                                _groupHover={{ opacity: '1', transform: 'scale(1)' }}
                              ></Box>
                            </HStack>
                          </Tooltip>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip label="Balancer v3 introduces reusable hooks.">
                              <Circle
                                bg="green.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={Check} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip
                              label="Custom logic was allowed in v2 but there was no concept of
                                      reusable hooks."
                            >
                              <Circle
                                bg="red.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={X} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td position="relative">
                          <Tooltip label="Hooks extend existing pool types at various key points throughout the pool&rsquo;s lifecycle. Hooks can execute actions during pool operation and also compute a dynamic swap fee.">
                            <HStack position="relative" width="max-content" gap="xs" role="group">
                              <Text display="inline">Internal balances</Text>

                              <Box
                                as={InfoIcon}
                                display="inline"
                                opacity="0.5"
                                transform="scale(0.9)"
                                transition="all 0.2s ease-out"
                                _groupHover={{ opacity: '1', transform: 'scale(1)' }}
                              ></Box>
                            </HStack>
                          </Tooltip>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip label="Balancer v3 introduces reusable hooks.">
                              <Circle
                                bg="green.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={Check} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip
                              label="Custom logic was allowed in v2 but there was no concept of
                                      reusable hooks."
                            >
                              <Circle
                                bg="red.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={X} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td position="relative">
                          <Tooltip label="Hooks extend existing pool types at various key points throughout the pool&rsquo;s lifecycle. Hooks can execute actions during pool operation and also compute a dynamic swap fee.">
                            <HStack position="relative" width="max-content" gap="xs" role="group">
                              <Text display="inline">Rebalancers</Text>

                              <Box
                                as={InfoIcon}
                                display="inline"
                                opacity="0.5"
                                transform="scale(0.9)"
                                transition="all 0.2s ease-out"
                                _groupHover={{ opacity: '1', transform: 'scale(1)' }}
                              ></Box>
                            </HStack>
                          </Tooltip>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip label="Balancer v3 introduces reusable hooks.">
                              <Circle
                                bg="green.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={Check} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip
                              label="Custom logic was allowed in v2 but there was no concept of
                                      reusable hooks."
                            >
                              <Circle
                                bg="red.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={X} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td position="relative">
                          <Tooltip label="Hooks extend existing pool types at various key points throughout the pool&rsquo;s lifecycle. Hooks can execute actions during pool operation and also compute a dynamic swap fee.">
                            <HStack position="relative" width="max-content" gap="xs" role="group">
                              <Text display="inline">Flash swaps</Text>

                              <Box
                                as={InfoIcon}
                                display="inline"
                                opacity="0.5"
                                transform="scale(0.9)"
                                transition="all 0.2s ease-out"
                                _groupHover={{ opacity: '1', transform: 'scale(1)' }}
                              ></Box>
                            </HStack>
                          </Tooltip>
                        </Td>

                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip label="Balancer v3 introduces reusable hooks.">
                              <Circle
                                bg="green.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={Check} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
                        <Td textAlign="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mx="xxs"
                          >
                            <Tooltip label="Balancer v3 introduces reusable hooks.">
                              <Circle
                                bg="green.600"
                                size="5"
                                transition="all 0.2s ease-out"
                                _hover={{
                                  transform: 'scale(1.2)',
                                }}
                              >
                                <Box as={Check} size={14} color="white" />
                              </Circle>
                            </Tooltip>
                          </Box>
                        </Td>
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
              Get help for innovating on v3
            </Heading>
            <Text
              pb="lg"
              sx={{
                textWrap: 'balance',
              }}
            >
              Balancer Community Grants aim to accelerate the development of the Balancer ecosystem.
              Grants for innovation on Balancer v3 will be prioritized. This program is managed by
              the Balancer Grants DAO, an independent community-owned grants program for the
              Balancer ecosystem.
            </Text>
            <Flex
              gap="ms"
              justify={{ base: 'start', md: 'center' }}
              width="max-content"
              m={{ base: 'none', md: 'auto' }}
            >
              <Button
                size="lg"
                as={Link}
                href="https://grants.balancer.community"
                variant="primary"
                flex="1"
              >
                Get a Grant
              </Button>

              <Button
                size="lg"
                as={Link}
                href="https://docs-v3.balancer.fi/"
                variant="secondary"
                flex="1"
              >
                View v3 docs
              </Button>
            </Flex>
          </Box>
        </Box>
      </Section>
    </Box>
  )
}
