'use client'
import { Card, Center, Grid, Heading, Text, Flex, Box, SimpleGrid } from '@chakra-ui/react'
import Section from '@/lib/shared/components/layout/Section'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'

import { ParallaxImage } from '@/lib/shared/components/marketing/ParallaxImage'
import { AnimatedSVG } from '@/lib/shared/components/marketing/AnimatedSVG'
import { Picture } from '@/lib/shared/components/other/Picture'
import { HomeHero } from '@/lib/shared/components/marketing/HomeHero'
import { EcosystemActivityChart } from './components/EcosystemActivityChart'
import { ProtocolStatsSection } from '@/lib/modules/marketing/ProtocolStatsSection'

export default function Home() {
  return (
    <Box className="homepage" overflowX="hidden">
      <HomeHero />

      <Box height={{ base: '100px', md: '200px' }} zIndex="-1" position="relative">
        <AnimatedSVG />
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
            <FadeInOnView>
              <Text pb="lg" variant="eyebrow" w="full">
                For Builders
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
                Liquidity tech for DeFi
              </Heading>
              <Text
                w="full"
                sx={{
                  textWrap: 'balance',
                }}
              >
                Build innovative AMMs and custom liquidity pools without restriction on Balancer
                smart contracts. Balancer is the one protocol with a track record of enabling true
                AMM experimentation and innovation.
              </Text>
            </FadeInOnView>
          </Box>

          <FadeInOnView>
            <Box maxW={{ base: '720px', lg: '100%' }} mx="auto">
              <Grid
                templateRows={{ base: 'repeat(4, 1fr', md: 'repeat(3, 1fr', lg: 'repeat(2, 1fr' }}
                templateColumns={{
                  base: 'repeat(1, 1fr',
                  md: 'repeat(2, 1fr',
                  lg: 'repeat(4, 1fr',
                }}
                gap={4}
              >
                <Card
                  variant="level2"
                  gridArea={{ base: 'auto', md: '1 / 1 / 2 / 3', lg: '1 / 1 / 3 / 3' }}
                >
                  <Flex direction="column" justify="flex-end" h="100%">
                    <Box overflow="hidden" pb="md" rounded="lg" h="100%">
                      <ParallaxImage
                        scaleStart="100%"
                        scaleEnd="120%"
                        yStart="-10%"
                        yEnd="30%"
                        transformOrigin="bottom"
                      >
                        <Picture
                          imgName="build"
                          altText="Liquidity pools"
                          defaultImgType="jpg"
                          imgJpg={true}
                          imgAvif={true}
                          imgAvifDark={true}
                        />
                      </ParallaxImage>
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
                      <ParallaxImage
                        scaleStart="100%"
                        scaleEnd="120%"
                        yStart="-10%"
                        yEnd="30%"
                        transformOrigin="bottom"
                      >
                        <Picture
                          imgName="vebal"
                          altText="veBAL tokens"
                          defaultImgType="jpg"
                          imgJpg={true}
                          imgJpgDark={true}
                        />
                      </ParallaxImage>
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
                      <ParallaxImage
                        scaleStart="100%"
                        scaleEnd="120%"
                        yStart="-10%"
                        yEnd="30%"
                        transformOrigin="bottom"
                      >
                        <Picture
                          imgName="aggregators"
                          altText="Aggregator integrations like CoW, 1inch and Paraswap"
                          defaultImgType="jpg"
                          imgJpg={true}
                          imgJpgDark={true}
                        />
                      </ParallaxImage>
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
                      Eliminate the cold start AMM problem with streamlined aggregator integrations
                      and a prebuilt UI.
                    </Text>
                  </Flex>
                </Card>

                <Card gridArea={{ base: 'auto', md: '3 / 1 / 4 / 3', lg: '1 / 4 / 3 / 5' }}>
                  <Flex direction="column" justify="flex-end" h="100%">
                    <Box overflow="hidden" pb="md" rounded="lg" h="100%">
                      <ParallaxImage
                        scaleStart="100%"
                        scaleEnd="120%"
                        yStart="-10%"
                        yEnd="30%"
                        transformOrigin="bottom"
                      >
                        <Picture
                          imgName="network"
                          altText="The Balancer network"
                          defaultImgType="jpg"
                          imgAvif={true}
                          imgAvifDark={true}
                          imgAvifPortrait={true}
                          imgAvifPortraitDark={true}
                          imgJpgDark={true}
                          imgJpg={true}
                        />
                      </ParallaxImage>
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
          </FadeInOnView>
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
                For Protocols
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
                Plug in to bootstrap liquidity
              </Heading>
              <Text
                sx={{
                  textWrap: 'balance',
                }}
              >
                Launch your token with confidence by plugging into the Balancer vault and ecosystem.
                Find product market fit and revenue faster with day 1 liquidity and community.
              </Text>
            </FadeInOnView>
          </Box>
        </Box>

        <Box maxW="maxContent" m="0 auto">
          <FadeInOnView>
            <ParallaxImage>
              <Picture
                imgName="bootstrap-liquidity"
                altText="Pools plugged into Balancer vault"
                defaultImgType="png"
                imgAvif={true}
                imgPng={true}
                imgAvifPortrait={true}
              />
            </ParallaxImage>
          </FadeInOnView>
        </Box>

        <Box maxW="maxContent" m="0 auto" px={{ base: 'md', xl: '0' }}>
          <FadeInOnView>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 8, md: 8, xl: '12' }} py="xl">
              <Box>
                <Heading variant="h5" as="h5" size="h5" pb="sm">
                  Get swaps on day 1
                </Heading>
                <Text>
                  Access to the Balancer vault for smart swap routing via your pools. Plus, fast
                  track inclusion to aggregator partners.
                </Text>
              </Box>
              <Box>
                <Heading variant="h5" as="h5" size="h5" pb="sm">
                  Liquidity incentives
                </Heading>
                <Text>
                  In addition to your own points / token, boost your liquidity by utilizing the
                  veBAL system for BAL and AURA incentives.
                </Text>
              </Box>
              <Box>
                <Heading variant="h5" as="h5" size="h5" pb="sm">
                  Access Balancer&lsquo;s community
                </Heading>
                <Text>
                  By building on Balancer, LPs and swappers can find and / or interact with your AMM
                  / pools via the ecosystem app.
                </Text>
              </Box>
              <Box>
                <Heading variant="h5" as="h5" size="h5" pb="sm">
                  ve8020 tokenomics
                </Heading>
                <Text>
                  Enable community staking & governance without sacrificing the liquidity of your
                  token in a specialized 80/20 pool.
                </Text>
              </Box>
            </SimpleGrid>
          </FadeInOnView>
        </Box>
      </Section>

      <Section className="activity">
        <Box maxW="maxContent" m="0 auto" px={{ base: 'md', xl: '0' }}>
          <Box pb="xl" w="full" maxW="4xl" m="auto" textAlign={{ base: 'left', md: 'center' }}>
            <Heading w="full" pb="xl">
              Building together across networks
            </Heading>

            <Box pt="md" pb="lg">
              <ProtocolStatsSection />
            </Box>
          </Box>
          <Box>
            <Center w="full">
              <EcosystemActivityChart />
            </Center>
          </Box>
        </Box>
      </Section>
    </Box>
  )
}
