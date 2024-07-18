import { Box, Text } from '@chakra-ui/react'
import Section from '@/lib/shared/components/layout/Section'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'

export function V3VideoTutorial() {
  return (
    <Section className="tutorial">
      <FadeInOnView>
        <Box
          pt={{ base: 'lg', md: '2xl' }}
          px={{ base: 'md', xl: '0' }}
          w="full"
          maxW="4xl"
          m="auto"
          textAlign={{ base: 'left', md: 'center' }}
        >
          <Text fontWeight="bold" fontSize="lg" pb="md">
            Tutorial: Getting started with Scaffold Balancer
          </Text>
          <Box mb="md" position="relative" paddingTop="56.25%" width="100%">
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

          <Text
            color="font.secondary"
            sx={{
              textWrap: 'balance',
            }}
          >
            Learn how to write a liquidity pool contract and get set up on Scafold Balancer—the new
            streamlined developer prototyping tool for creating custom AMMs on Balancer v3.
          </Text>
        </Box>
      </FadeInOnView>
    </Section>
  )
}
