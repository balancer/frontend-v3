import { usePathname } from 'next/navigation'
import { XIcon } from '../icons/social/XIcon'
import { DiscordIcon } from '../icons/social/DiscordIcon'
import { MediumIcon } from '../icons/social/MediumIcon'
import { YoutubeIcon } from '../icons/social/YoutubeIcon'
import { GithubIcon } from '../icons/social/GithubIcon'
import { useParams } from 'next/navigation'
import NextLink from 'next/link'
import { Link, LinkProps } from '@chakra-ui/react'
import { isDev, isStaging } from '@/lib/config/app.config'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { Feature } from '@/lib/config/config.types'

export function useNav() {
  const pathname = usePathname()
  const { chain } = useParams()
  const { ecoSystemLinks, extraAppLinks, socialLinks } = getProjectConfig()

  const swapHref = chain ? '/swap/' + chain : '/swap'

  const appLinks = [
    {
      href: '/pools',
      label: 'Pools',
    },
    {
      href: swapHref,
      label: 'Swap',
    },
    {
      href: '/portfolio',
      label: 'Portfolio',
    },
  ]

  // To-do: Remove this when veBAL is live
  if (isDev || isStaging) {
    appLinks.push({
      href: '/vebal',
      label: 'veBAL (wip)',
    })
  }

  const getSocialIcon = (label: string, size: number) => {
    switch (label.toLowerCase()) {
      case 'x':
        return <XIcon size={size} />
      case 'discord':
        return <DiscordIcon size={size} />
      case 'medium':
        return <MediumIcon size={size} />
      case 'youtube':
        return <YoutubeIcon size={size} />
      case 'github':
        return <GithubIcon size={size} />
      default:
        return null
    }
  }

  const getSocialLinks = (size = 24) =>
    socialLinks.map(({ label, href }) => ({
      href,
      icon: getSocialIcon(label, size),
    }))

  function linkColorFor(path: string) {
    return pathname === path ? 'font.highlight' : 'font.primary'
  }

  const AppLink = ({
    href,
    label,
    onClick,
    ...rest
  }: {
    href: string
    label: string
    onClick?: () => void
  } & LinkProps) => (
    <Link
      key={href}
      as={NextLink}
      href={href}
      prefetch={true}
      variant="nav"
      color={linkColorFor(href)}
      onClick={onClick}
      {...rest}
    >
      {label}
    </Link>
  )

  function ProjectAppLinks({ onClick }: { onClick?: () => void }) {
    return appLinks.map(link => (
      <AppLink key={link.href} href={link.href} label={link.label} onClick={onClick} />
    ))
  }

  const projectExtraAppLinks = (onClick?: () => void) =>
    extraAppLinks.map(link => ({
      label: link.label,
      component: <AppLink key={link.href} href={link.href} label={link.label} onClick={onClick} />,
    }))

  return {
    appLinks,
    ecoSystemLinks,
    projectExtraAppLinks,
    ProjectAppLinks,
    getSocialLinks,
    linkColorFor,
    AppLink,
  }
}
