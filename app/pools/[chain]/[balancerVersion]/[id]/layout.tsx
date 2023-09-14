'use client'
import { BalancerVersion } from '@/lib/modules/pool/pool.types'
import { ChainSlug } from '@/lib/modules/pool/pool.utils'
import { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  params: { id: string; chain: ChainSlug; balancerVersion: BalancerVersion }
}

export default function PoolLayout({ children }: Props) {
  return <>{children}</>
}
