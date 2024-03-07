import { Metadata } from 'next'
import { Providers } from './providers'
import { Navbar } from '@/lib/shared/components/navs/Navbar'
import { Footer } from '@/lib/shared/components/navs/Footer'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import Noise from './noise'
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
      <body className={satoshiFont.className} suppressHydrationWarning>
        <NextTopLoader showSpinner={false} />
        <Providers>
          <Noise>
            {/*<Navbar />*/}
            <Container maxW="maxContent" py="2xl">
              {children}
              <SpeedInsights />
            </Container>
            {/*<Footer />*/}
          </Noise>
        </Providers>
      </body>
    </html>
  )
}
