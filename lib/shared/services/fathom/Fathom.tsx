'use client'

import { load, trackPageview } from 'fathom-client'
import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { isProd } from '@/lib/config/app.config'

function TrackPageView() {
  // Current Path
  const pathname = usePathname()
  // Current query params
  const searchParams = useSearchParams()

  // Load the Fathom script on mount
  useEffect(() => {
    // Optional: Only track on production; remove these two lines if you want to track other environments
    if (!isProd) return

    load('MKFEFCXC', {
      auto: false,
      // Optional but I like to explicitly choose the domains to track:
      includedDomains: ['balancer.fi', 'zen.balancer.fi'],
    })
  }, [])

  // Record a pageview when route changes
  useEffect(() => {
    if (!pathname) return

    trackPageview({
      url: pathname + searchParams.toString(),
      referrer: document.referrer,
    })
  }, [pathname, searchParams]) // 👈 Track page views if path or params change

  return null
}

// We use this in our main layout.tsx or jsx file
export function Fathom() {
  return (
    <Suspense fallback={null}>
      <TrackPageView />
    </Suspense>
  )
}
