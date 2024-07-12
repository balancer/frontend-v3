'use client'

import NextLink from 'next/link'
import { Stack, Text, Box, Card, VStack, HStack, Link, Button, IconButton } from '@chakra-ui/react'
import { staggeredFadeIn, fadeIn } from '@/lib/shared/utils/animations'
import { isProd } from '@/lib/config/app.config'
import { motion } from 'framer-motion'
import { DefaultPageContainer } from '../containers/DefaultPageContainer'
import { useBreakpoints } from '../../hooks/useBreakpoints'
import { BalancerLogoType } from '../imgs/BalancerLogoType'
import { ArrowUpRight } from 'react-feather'
import { useNav } from './useNav'

type LinkSection = {
  title: string
  links: { href: string; label: string; isExternal?: boolean }[]
}

function CardContent() {
  const linkSections: LinkSection[] = [
    {
      title: 'Build on Balancer',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Balancer v3', href: '/build/v3' },
        { label: 'v3 Docs', href: 'https://docs-v3.balancer.fi', isExternal: true },
        { label: 'v2 Docs', href: 'https://docs.balancer.fi', isExternal: true },
        { label: 'Grants', href: 'https://grants.balancer.community', isExternal: true },
      ],
    },
    {
      title: 'Use Balancer protocol',
      links: [
        { label: 'Explore pools', href: '/pools' },
        { label: 'Swap tokens', href: '/swap' },
        { label: 'View portfolio', href: '/portfolio' },
        { label: 'Get veBAL', href: 'https://app.balancer.fi/#/vebal', isExternal: true },
        {
          label: 'Create an LBP',
          href: 'https://www.fjordfoundry.com/?utm_source=balancer&utm_medium=website',
          isExternal: true,
        },
        {
          label: 'Create an NFT drop',
          href: 'https://fjordnfts.com/?utm_source=balancer&utm_medium=website',
          isExternal: true,
        },
      ],
    },
    {
      title: 'Ecosystem',
      links: [
        { label: 'Forum', href: 'https://forum.balancer.fi', isExternal: true },
        { label: 'Governance', href: 'https://vote.balancer.fi', isExternal: true },
        {
          label: 'Bug bounties',
          href: 'https://immunefi.com/bug-bounty/balancer',
          isExternal: true,
        },
        { label: 'Dune Analytics', href: 'https://dune.com/balancer', isExternal: true },
        { label: 'Defilytica', href: 'https://balancer.defilytica.com', isExternal: true },
      ],
    },
  ]

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      justify="space-between"
      p="lg"
      spacing={{ base: 'xl', md: 'md' }}
    >
      <VStack color="font.primary" align="start" spacing="lg" maxW="96">
        <BalancerLogoType width="120px" />
        <VStack align="start" spacing="sm">
          <Text fontSize="4xl" fontWeight="bold">
            AMMs made easy
          </Text>
          <Text>
            Balancer is a battle-tested toolkit for true AMM experimentation and innovation.
          </Text>
        </VStack>
      </VStack>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        w="full"
        justify="space-around"
        align="start"
        spacing={{ base: 'lg', md: 'md' }}
      >
        {linkSections.map(section => (
          <VStack key={section.title} align="start" spacing={{ base: 'sm', md: 'md' }}>
            <Text fontSize="lg" fontWeight="bold">
              {section.title}
            </Text>
            <VStack align="start" spacing={{ base: 'xs', md: 'sm' }}>
              {section.links.map(link => (
                <Link
                  as={NextLink}
                  variant="nav"
                  key={link.href}
                  href={link.href}
                  flexBasis="row"
                  flex="auto"
                >
                  <HStack>
                    <Box>{link.label}</Box>
                    {link.isExternal && (
                      <Box color="grayText">
                        <ArrowUpRight size={12} />
                      </Box>
                    )}
                  </HStack>
                </Link>
              ))}
            </VStack>
          </VStack>
        ))}
      </Stack>
    </Stack>
  )
}

function SocialLinks() {
  const { getSocialLinks } = useNav()

  return (
    <HStack
      justify={{ base: 'space-around', md: 'space-between' }}
      spacing="md"
      w={{ base: 'full', md: 'auto' }}
    >
      {getSocialLinks(16).map(({ href, icon }) => (
        <IconButton
          as={Link}
          key={href}
          href={href}
          aria-label="Social icon"
          variant="tertiary"
          isRound
          rounded="full"
          isExternal
          size="lg"
        >
          {icon}
        </IconButton>
      ))}
    </HStack>
  )
}

function LegalLinks() {
  const legalLinks = [
    { label: 'Terms of use', href: '/terms-of-use' },
    { label: 'Privacy policy', href: '/privacy-policy' },
    { label: 'Cookies policy', href: '/cookies-policy' },
    { label: '3rd party services', href: '/3rd-party-services' },
    { label: 'Risks', href: '/risks' },
  ]

  return (
    <Stack w="full" direction={{ base: 'column', md: 'row' }} justify="end" spacing="lg">
      {legalLinks.map(link => (
        <Link color="grayText" fontSize="sm" key={link.href} href={link.href} as={NextLink}>
          {link.label}
        </Link>
      ))}
    </Stack>
  )
}

export function Footer() {
  const { isMobile } = useBreakpoints()

  const CardComponent = isMobile ? Box : Card

  return (
    <Box as="footer" background="background.level0" shadow="innerLg">
      <DefaultPageContainer>
        <VStack align="start" spacing="lg">
          <CardComponent>
            <CardContent />
          </CardComponent>
          <Stack
            align="start"
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            gap="md"
            as={motion.div}
            variants={staggeredFadeIn}
            initial="hidden"
            animate="show"
            w="full"
          >
            <SocialLinks />
            <LegalLinks />
          </Stack>
        </VStack>
      </DefaultPageContainer>
    </Box>
  )
}
