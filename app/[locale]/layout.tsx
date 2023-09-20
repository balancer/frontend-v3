import { Providers } from './providers'
import { Navbar } from '@/components/navs/Navbar'
import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { createTranslator } from 'next-intl'

export function generateStaticParams() {
  return [{ locale: 'en' }]
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const messages = (await import(`../../messages/${locale}.json`)).default
  const t = createTranslator({ locale, messages })

  return {
    title: t('RootLayout.title'),
    description: t('RootLayout.description'),
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
