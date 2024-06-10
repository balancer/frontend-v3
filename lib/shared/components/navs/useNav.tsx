import { usePathname } from 'next/navigation'
import { XIcon } from '../icons/social/XIcon'
import { DiscordIcon } from '../icons/social/DiscordIcon'
import { MediumIcon } from '../icons/social/MediumIcon'
import { YoutubeIcon } from '../icons/social/YoutubeIcon'
import { GithubIcon } from '../icons/social/GithubIcon'

export function useNav() {
  const pathname = usePathname()

  const appLinks = [
    {
      href: '/pools',
      label: 'Pools',
    },
    {
      href: '/swap',
      label: 'Swap',
    },
    {
      href: '/portfolio',
      label: 'Portfolio',
    },
  ]

  const ecosystemLinks = [
    { label: 'Build', href: 'https://balancer.fi/build' },
    { label: 'Blog', href: 'https://medium.com/balancer-protocol' },
    { label: 'Docs', href: 'https://docs.balancer.fi/' },
    { label: 'Governance', href: 'https://vote.balancer.fi/#/' },
    { label: 'Analytics', href: 'https://dune.com/balancer' },
    { label: 'Forum', href: 'https://forum.balancer.fi/' },
    {
      label: 'Grants',
      href: 'https://grants.balancer.community',
    },
  ]

  const socialLinks = [
    {
      icon: <XIcon />,
      href: 'https://x.com/Balancer',
    },
    {
      icon: <DiscordIcon />,
      href: 'https://discord.balancer.fi/',
    },
    {
      icon: <MediumIcon />,
      href: 'https://medium.com/balancer-protocol',
    },
    {
      icon: <YoutubeIcon />,
      href: 'https://www.youtube.com/channel/UCBRHug6Hu3nmbxwVMt8x_Ow',
    },
    {
      icon: <GithubIcon />,
      href: 'https://github.com/balancer/',
    },
  ]

  function linkColorFor(path: string) {
    return pathname === path ? 'font.highlight' : 'font.primary'
  }

  return { appLinks, ecosystemLinks, socialLinks, linkColorFor }
}
