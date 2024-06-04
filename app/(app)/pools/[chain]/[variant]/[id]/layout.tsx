import { FetchPoolProps } from '@/lib/modules/pool/pool.types'
import { ChainSlug } from '@/lib/modules/pool/pool.utils'
import { PropsWithChildren, Suspense } from 'react'
import PoolLoader from '@/lib/modules/pool/PoolLoader'
import { PoolDetailSkeleton } from '@/lib/modules/pool/PoolDetail/PoolDetailSkeleton'
import { PartnerThemeToggle } from '@/lib/shared/services/chakra/PartnerThemeToggle'

type Props = PropsWithChildren<{
  params: Omit<FetchPoolProps, 'chain'> & { chain: ChainSlug }
}>

export default async function PoolLayout({ params: { id, chain, variant }, children }: Props) {
  return (
    <>
      {variant && <PartnerThemeToggle themeName={variant} />}
      <Suspense fallback={<PoolDetailSkeleton />}>
        <PoolLoader id={id} chain={chain} variant={variant}>
          {children}
        </PoolLoader>
      </Suspense>
    </>
  )
}
