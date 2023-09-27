import { Providers } from './providers'
import { Navbar } from '@/components/navs/Navbar'
import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { createTranslator } from 'next-intl'

// cannot use a hook here
import { ProjectConfigBeets } from '@/lib/config/projects/beets'
import { ProjectConfigBalancer } from '@/lib/config/projects/balancer'

const allProjects = {
  [ProjectConfigBalancer.projectId]: { ...ProjectConfigBalancer },
  [ProjectConfigBeets.projectId]: { ...ProjectConfigBeets },
}

const PROJECT_CONFIG = process.env.NEXT_PUBLIC_PROJECT_ID
  ? allProjects[process.env.NEXT_PUBLIC_PROJECT_ID]
  : ProjectConfigBalancer

export function generateStaticParams() {
  return [{ locale: 'en' }]
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const messages = (await import(`../../messages/${locale}.json`)).default
  const t = createTranslator({ locale, messages })
  const { name, projectId } = PROJECT_CONFIG
  const iconUrl = `/images/icons/${projectId}.ico`

  return {
    title: t('RootLayout.title', { name }),
    description: t('RootLayout.description'),
    icons: {
      icon: [{ url: iconUrl }],
      shortcut: [iconUrl],
    },
  }
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: ReactNode
  params: { locale: string }
}) {
  let messages
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers locale={locale} messages={messages}>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
