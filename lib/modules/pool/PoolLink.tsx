'use client'

import { Link, LinkProps } from '@chakra-ui/react'
import { FetchPoolProps } from '@/lib/modules/pool/pool.types'
import { getPoolPath } from '@/lib/modules/pool/pool.utils'

type Props = FetchPoolProps & LinkProps

export function PoolLink({ id, chain, variant, ...props }: Props) {
  return <Link href={getPoolPath({ id, chain, variant })} {...props} />
}
