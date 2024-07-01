import { Metadata } from 'next'
import { Providers } from './providers'
import { Navbar } from '@/lib/shared/components/navs/Navbar'
import { Footer } from '@/lib/shared/components/navs/Footer'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { satoshiFont } from '@/lib/assets/fonts/satoshi/satoshi'
import NextTopLoader from 'nextjs-toploader'
import { Container } from '@chakra-ui/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/lib/assets/css/global.css'

const { projectName, projectId } = getProjectConfig()
const iconUrl = `/images/icons/${projectId}.ico`

export const metadata: Metadata = {
  title: `${projectName} DeFi Liquidity Pools`,
  description: `
    Explore DeFi liquidity pools or create your own.
    Provide liquidity to accumulate yield from swap fees
    while retaining your token exposure as prices move.
  `,
  icons: {
    icon: [{ url: iconUrl }],
    shortcut: [iconUrl],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://w.appzi.io/w.js?token=8TY8k"></script>
      </head>
      <body className={satoshiFont.className} suppressHydrationWarning>
        <NextTopLoader showSpinner={false} color="#7f6ae8" />
        <Providers>
          <Navbar />
          <Container maxW="100%" py="0" px="0" overflowX={{ base: 'hidden', md: 'visible' }}>
            {children}
            <SpeedInsights />
          </Container>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
