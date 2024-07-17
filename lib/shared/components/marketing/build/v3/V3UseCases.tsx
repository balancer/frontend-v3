import { Center, Heading, Text, Flex, Box } from '@chakra-ui/react'
import Section from '@/lib/shared/components/layout/Section'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { Picture } from '../../../other/Picture'

export function V3UseCases() {
  return (
    <Section className="use-cases">
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
              as="h2"
              size="2xl"
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
              v3 enables the next wave of DeFi products to come to market. Learn about the new types
              of things that can be built on Balancer v3.
            </Text>
          </FadeInOnView>
          <FadeInOnView>
            <Flex gap="lg" pt={{ base: '0', md: 'md' }}>
              <Box position="relative" rounded="full">
                <Center>
                  <Box className="enso">
                    <Picture
                      imgName="use-case-1"
                      altText="100% boosted pools"
                      defaultImgType="png"
                      directory="/images/v3/"
                      imgPngDark={true}
                      imgPng={true}
                    />
                  </Box>

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
                  <Box className="enso">
                    <Picture
                      imgName="use-case-2"
                      altText="100% boosted pools"
                      defaultImgType="png"
                      directory="/images/v3/"
                      imgPngDark={true}
                      imgPng={true}
                    />
                  </Box>

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
                  <Box className="enso">
                    <Picture
                      imgName="use-case-3"
                      altText="100% boosted pools"
                      defaultImgType="png"
                      directory="/images/v3/"
                      imgPngDark={true}
                      imgPng={true}
                    />
                  </Box>

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
  )
}
