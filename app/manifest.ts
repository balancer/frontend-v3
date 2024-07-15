import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: 'Balancer',
    name: 'Balancer',
    description: 'Balancer is a battle-tested toolkit for true AMM experimentation and innovation.',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon',
      },
    ],
    start_url: '.',
    display: 'standalone',
    theme_color: '#000000',
    background_color: '#ffffff',
  }
}
