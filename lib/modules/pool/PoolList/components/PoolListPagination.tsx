'use client'

import { Button, HStack, Text, VStack } from '@chakra-ui/react'
import { usePoolList } from '@/lib/modules/pool/PoolList/usePoolList'
import { useTranslations } from 'next-intl'

export function PoolListPagination() {
  const { pageNumber, pageSize, setPageNumber, setPageSize } = usePoolList()
  const t = useTranslations('PoolListPagination')

  return (
    <VStack align="start" spacing="md">
      <HStack align="center" spacing="1">
        <Text size="xs">{`${t('pageNum')}: ${pageNumber + 1}`}</Text>

        {[0, 1, 2].map(num => (
          <Button
            size="sm"
            variant={num === pageNumber ? 'solid' : 'outline'}
            key={num}
            onClick={() => setPageNumber(num)}
          >
            {num + 1}
          </Button>
        ))}

        <Button size="sm" onClick={() => setPageNumber(pageNumber + 1)}>
          {t('next')}
        </Button>
      </HStack>

      <HStack align="center" spacing="1">
        <Text>{t('noPerPage')}:</Text>

        {[10, 20, 30].map(num => (
          <Button
            size="sm"
            variant={num === pageSize ? 'solid' : 'outline'}
            key={num}
            onClick={() => setPageSize(num)}
          >
            {num}
          </Button>
        ))}
      </HStack>
    </VStack>
  )
}
