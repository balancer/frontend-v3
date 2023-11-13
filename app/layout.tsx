import { Metadata } from 'next'
import { Providers } from './providers'
import { Navbar } from '@/lib/shared/components/navs/Navbar'
import { Footer } from '@/lib/shared/components/navs/Footer'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import '@/lib/shared/utils/bigint'
import NextTopLoader from 'nextjs-toploader'
import { Box } from '@chakra-ui/react'

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
      <body suppressHydrationWarning>
        <NextTopLoader showSpinner={false} />
        <Providers>
          <Navbar />
          <Box mx="5%" mt="2%">
            {children}
          </Box>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
