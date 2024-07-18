import { Button, Heading, Text, Link, Card, Flex, Box } from '@chakra-ui/react'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'

export function V3Hero() {
  return (
    <Box className="hero" pb="2xl">
      {/* <SandPatterns> */}
      <Flex direction="column" justify="center" pb="2xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'null', md: 'center' }}
          height="100%"
        >
          <Flex
            direction="column"
            w="full"
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
                  Balancer v3 powers the next generation of AMM innovation. Simplified pool creation
                  with an optimized vault. Plug in audited reusable hooks for additional
                  functionality.
                </Text>
                <Box>
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
                </Box>
              </FadeInOnView>
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <FadeInOnView>
        <Box
          py={{ base: 'lg', md: '2xl' }}
          pb={{ base: 'md', md: 'lg' }}
          w="full"
          maxW="4xl"
          m="auto"
          textAlign={{ base: 'left', md: 'center' }}
        >
          <Heading textAlign={{ base: 'left', md: 'center' }} w="full" display="block" pb="lg">
            Tutorial: Write a pool contract
          </Heading>
          <Text
            pb="lg"
            sx={{
              textWrap: 'balance',
            }}
          >
            Learn how to write a liquidity pool contract and get set up on Scafold Balancer—the new
            streamlined developer prototyping tool for creating custom AMMs on Balancer v3.
          </Text>
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
        </Box>
      </FadeInOnView>

      {/* </SandPatterns> */}
    </Box>
  )
}
