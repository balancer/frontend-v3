/* eslint-disable max-len */

import { MotionValue, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { BeetsIcon } from '@/lib/shared/components/icons/logos/BeetsIcon'
import { AaveIcon } from '@/lib/shared/components/icons/logos/AaveIcon'
import { AuraIcon } from '@/lib/shared/components/icons/logos/AuraIcon'
import { CowIcon } from '@/lib/shared/components/icons/logos/CowIcon'
import { GyroIcon } from '@/lib/shared/components/icons/logos/GyroIcon'
import { CronIcon } from '@/lib/shared/components/icons/logos/CronIcon'
import { XaveIcon } from '@/lib/shared/components/icons/logos/XaveIcon'
import { FjordIcon } from '@/lib/shared/components/icons/logos/FjordIcon'
export function HomeCaseStudies() {
  const mouseX = useMotionValue(Infinity)

  const logos = [
    { icon: CowIcon, name: 'Cow' },
    { icon: AuraIcon, name: 'Aura' },
    { icon: BeetsIcon, name: 'Beets' },
    { icon: AaveIcon, name: 'Aave' },
    { icon: GyroIcon, name: 'Gyro' },
    { icon: XaveIcon, name: 'Xave' },
    { icon: CronIcon, name: 'Cron' },
    { icon: FjordIcon, name: 'Fjord' },
  ]

  return (
    <Box overflowX="hidden">
      <VStack
        w="full"
        py={['xl', 'xl']}
        px={['ms', 'md']}
        alignItems={{ base: 'flex-start', md: 'center' }}
      >
        <Text>Top DeFi protocols build on Balancer</Text>
        <Flex display={{ base: 'none', md: 'flex' }} justifyContent="center">
          <Box position="relative" h="54px"></Box>
          <Box position="absolute" bottom="20px">
            <Box
              as={motion.div}
              onMouseMove={e => mouseX.set(e.pageX)}
              onMouseLeave={() => mouseX.set(Infinity)}
              mx="auto"
              display="flex"
              alignItems="flex-end"
              justifyContent="center"
              gap="sm"
              flexWrap="wrap"
            >
              {logos.map((logo, i) => (
                <AppIcon mouseX={mouseX} key={i} Icon={logo.icon} name={logo.name} />
              ))}
            </Box>
          </Box>
        </Flex>
        <Flex
          flexWrap="wrap"
          gap="ms"
          display={{ base: 'flex', md: 'none' }}
          justifyContent="flex-start"
          pt="sm"
        >
          {logos.map((logo, i) => (
            <SmallIcon key={i} Icon={logo.icon} name={logo.name} />
          ))}
        </Flex>
      </VStack>
    </Box>
  )
}

function AppIcon({
  mouseX,
  Icon,
  name,
}: {
  mouseX: MotionValue
  Icon: React.ComponentType
  name: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, val => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distance, [-150, -50, 0, 50, 150], [60, 100, 100, 100, 60])
  const width = useSpring(widthSync, { mass: 1, stiffness: 100, damping: 20 })

  return (
    <Box
      as={motion.div}
      ref={ref}
      style={{ width }}
      aspectRatio={1}
      w="200px"
      borderRadius="full"
      transition="color 0.3s ease-out, background-color 0.3s ease-out, box-shadow 0.3s ease-out"
      shadow="sm"
      color="brown.300"
      bg="background.level2"
      willChange="box-shadow, background-color"
      _hover={{
        bg: 'background.level4',
        color: 'brown.500',
        boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.1)',
      }}
      _dark={{
        bg: 'background.level2',
        color: 'font.secondary',
        _hover: {
          color: 'font.maxContrast',
          bg: 'background.level4',
          boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.2)',
        },
      }}
      cursor="pointer"
      display="flex"
      alignItems="center"
      justifyContent="center"
      title={name}
    >
      <Icon />
    </Box>
  )
}

function SmallIcon({ Icon, name }: { Icon: React.ComponentType; name: string }) {
  return (
    <Box
      aspectRatio={1}
      w="60px"
      borderRadius="full"
      transition="color 0.3s ease-out, background-color 0.3s ease-out, box-shadow 0.3s ease-out, transform 0.3s ease-out"
      shadow="sm"
      color="brown.300"
      bg="background.level2"
      willChange="box-shadow, background-color"
      _hover={{
        bg: 'background.level4',
        color: 'brown.500',
        boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.1)',
        transform: 'scale(1.1)',
        transition: 'scale 0.3s ease-out',
      }}
      _dark={{
        bg: 'background.level2',
        color: 'font.secondary',
        _hover: {
          color: 'font.maxContrast',
          bg: 'background.level4',
          boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.2)',
        },
      }}
      cursor="pointer"
      display="flex"
      alignItems="center"
      justifyContent="center"
      title={name}
      //   sx={{
      //     '& svg': {
      //       transform: 'scale(0.8)',
      //     },
      //   }}
    >
      <Icon />
    </Box>
  )
}
