'use client'

import { Link, LinkProps } from '@chakra-ui/react'
import { getPoolPath } from '../pool.utils'
import { FetchPoolProps } from '../pool.types'

type Props = FetchPoolProps & LinkProps

export function PoolLink({ id, chain, balancerVersion, ...props }: Props) {
  return <Link href={getPoolPath({ id, chain, balancerVersion })} {...props} />
}
