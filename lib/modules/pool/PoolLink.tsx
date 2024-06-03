'use client'

import { Link, LinkProps } from '@chakra-ui/react'
import { PoolPathProps } from './pool.types'
import { getPoolPath } from './pool.utils'

type Props = PoolPathProps & LinkProps

export function PoolLink({ id, chain, poolType, ...props }: Props) {
  return <Link href={getPoolPath({ id, chain, poolType })} {...props} />
}
