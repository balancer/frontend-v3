'use client'

/* eslint-disable max-len */
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { DefaultPageContainer } from '@/lib/shared/components/containers/DefaultPageContainer'
import { ReactLenis } from 'lenis/react'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

const { projectName } = getProjectConfig()

export const metadata: Metadata = {
  title: `${projectName} DeFi AMMs made easy`,
  description: `DeFi's most extensive AMM product suite—Balancer is a decentralized Automated Market Maker protocol built on Ethereum with a clear focus on fungible and yield-bearing liquidity.`,
}

export default function MarketingLayout({ children }: PropsWithChildren) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
      <div>{children}</div>
    </ReactLenis>
  )
}
