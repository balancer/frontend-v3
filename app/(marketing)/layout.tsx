'use client'

import { ReactLenis } from 'lenis/react'

import { PropsWithChildren } from 'react'

export default function MarketingLayout({ children }: PropsWithChildren) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
      <div>{children}</div>
    </ReactLenis>
  )
}
