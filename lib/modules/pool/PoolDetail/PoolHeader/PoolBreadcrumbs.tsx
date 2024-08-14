import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button } from '@chakra-ui/react'
import { usePool } from '../../PoolProvider'
import { ChevronRight } from 'react-feather'
import { BalancerLogo } from '@/lib/shared/components/imgs/BalancerLogo'
import { isCowAmmPool } from '../../pool.helpers'

export function PoolBreadcrumbs() {
  const { pool } = usePool()

  const poolsLabel = isCowAmmPool(pool.type) ? 'CoW pools' : 'Pools'
  const poolsHref = isCowAmmPool(pool.type) ? '/pools/cow' : '/pools'

  return (
    <Breadcrumb
      color="grayText"
      spacing="sm"
      fontSize="sm"
      separator={
        <Box color="border.base">
          <ChevronRight size={16} />
        </Box>
      }
    >
      <BreadcrumbItem>
        <BreadcrumbLink href="/">
          <Button variant="outline" size="xs">
            <BalancerLogo width="18px" />
          </Button>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href={poolsHref}>{poolsLabel}</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink href="#">{pool.name}</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}
