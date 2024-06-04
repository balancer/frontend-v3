import { usePathname } from 'next/navigation'

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

  // const socialLinks = {
  //   TwitterIcon: {
  //     icon: TwitterIcon,
  //     url: 'https://twitter.com/BalancerLabs',
  //   },
  //   DiscordIcon: {
  //     component: DiscordIcon,
  //     url: 'https://discord.balancer.fi/',
  //   },
  //   MediumIcon: {
  //     component: MediumIcon,
  //     url: 'https://medium.com/balancer-protocol',
  //   },

  //   YoutubeIcon: {
  //     component: YoutubeIcon,
  //     url: 'https://www.youtube.com/channel/UCBRHug6Hu3nmbxwVMt8x_Ow',
  //   },

  //   GithubIcon: {
  //     url: 'https://github.com/balancer/',
  //     component: GithubIcon,
  //   },
  // }

  function linkColorFor(path: string) {
    return pathname === path ? 'font.highlight' : 'font.primary'
  }

  return { appLinks, ecosystemLinks, linkColorFor }
}
