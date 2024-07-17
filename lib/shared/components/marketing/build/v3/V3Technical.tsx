/* eslint-disable max-len */
import {
  Button,
  Card,
  Divider,
  Heading,
  Text,
  Link,
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
} from '@chakra-ui/react'
import Section from '@/lib/shared/components/layout/Section'

import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { X, Check } from 'react-feather'
import { InfoIcon } from '@/lib/shared/components/icons/InfoIcon'

export function V3Technical() {
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
    <Section className="technical">
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
                Technical
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
                the heavily audited vault. For example, here&rsquo;s all the code needed to build a
                swap function for a Constant Product Pool.
              </Text>
            </Box>
          </FadeInOnView>

          <FadeInOnView>
            <Box mb="2xl">
              <Box bg="background.level2" my="lg" p="md" textAlign="left" rounded="xl" shadow="xl">
                <SyntaxHighlighter
                  language="solidity"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '16px',
                    borderRadius: '0 0 8px 8px',
                  }}
                  codeTagProps={{
                    style: {
                      fontSize: '13px',
                    },
                  }}
                >
                  {code}
                </SyntaxHighlighter>
              </Box>
            </Box>
          </FadeInOnView>

          <FadeInOnView>
            <Heading textAlign={{ base: 'left', md: 'center' }} w="full" display="block" pb="lg">
              Watch and learn
            </Heading>
            <Box mb="2xl" sx={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
                src="https://www.youtube.com/embed/2lInvpCt2o4?si=47Utep5ANNQv_HDk"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </Box>
          </FadeInOnView>

          <FadeInOnView>
            <Box pb={{ base: 'md', md: 'lg' }} w="full" maxW="4xl" m="auto">
              <Heading textAlign={{ base: 'left', md: 'center' }} w="full" display="block">
                Feature comparison
              </Heading>
            </Box>
            <Card textAlign="left" mb="xl">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
                        <Box display="flex" justifyContent="flex-end" alignItems="center" mx="xxs">
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
          <FadeInOnView>
            <Flex
              gap="ms"
              justify={{ base: 'start', md: 'center' }}
              width="max-content"
              m={{ base: 'none', md: 'auto' }}
            >
              <Button
                size="lg"
                as={Link}
                href="https://docs-v3.balancer.fi/"
                variant="primary"
                flex="1"
              >
                View v3 docs
              </Button>

              <Button
                size="lg"
                as={Link}
                href="https://github.com/balancer/scaffold-balancer-v3"
                variant="secondary"
                flex="1"
              >
                Prototype on v3
              </Button>
            </Flex>
          </FadeInOnView>
        </Box>
      </Box>
    </Section>
  )
}
