'use client'

import { Link, LinkProps } from '@chakra-ui/react'
import { FetchPoolProps } from './pool.types'
import { getPoolPath } from './pool.utils'

type Props = FetchPoolProps & LinkProps

export function PoolLink({ id, chain, balancerVersion, ...props }: Props) {
  return <Link href={getPoolPath({ id, chain, balancerVersion })} {...props} />
}
