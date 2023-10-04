import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@chakra-ui/icons'
import {
  HStack,
  Flex,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Text,
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

interface Props {
  goToFirstPage: () => void
  gotoLastPage: () => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  canPreviousPage: boolean
  canNextPage: boolean
  currentPageNumber: number
  totalPageCount: number
  setPageIndex: (page: number) => void
  setPageSize: (page: number) => void
  pageSize: number
}

export function Pagination({
  goToFirstPage,
  gotoLastPage,
  goToNextPage,
  goToPreviousPage,
  canPreviousPage,
  canNextPage,
  currentPageNumber,
  totalPageCount,
  setPageIndex,
  setPageSize,
  pageSize,
}: Props) {
  const t = useTranslations('Pagination')

  return (
    <HStack justifyContent="center" alignItems="center" m="4" gap="8">
      <Flex>
        <IconButton
          aria-label={t('label.firstPage')}
          onClick={goToFirstPage}
          isDisabled={!canPreviousPage}
          icon={<ArrowLeftIcon h="3" w="3" />}
          mr="4"
        />
        <IconButton
          aria-label={t('label.previousPage')}
          onClick={goToPreviousPage}
          isDisabled={!canPreviousPage}
          icon={<ChevronLeftIcon h="6" w="6" />}
        />
      </Flex>
      <Flex alignItems="center">
        <Text flexShrink="0" mr="8">
          {t('page')}
          <Text fontWeight="bold" as="span">
            {currentPageNumber}
          </Text>
          {t('of')}
          <Text fontWeight="bold" as="span">
            {totalPageCount}
          </Text>
        </Text>
        <Text flexShrink="0">{t('goToPage')}</Text>{' '}
        <NumberInput
          ml="2"
          mr="8"
          w="28"
          min={1}
          max={totalPageCount}
          onChange={value => {
            const page = value ? parseInt(value) - 1 : 0
            setPageIndex(page)
          }}
          defaultValue={currentPageNumber}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Select
          w="32"
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {`${t('show')} ${pageSize}`}
            </option>
          ))}
        </Select>
      </Flex>
      <Flex>
        <IconButton
          aria-label={t('label.nextPage')}
          onClick={goToNextPage}
          isDisabled={!canNextPage}
          icon={<ChevronRightIcon h="6" w="6" />}
        />
        <IconButton
          aria-label={t('label.lastPage')}
          onClick={gotoLastPage}
          isDisabled={!canNextPage}
          icon={<ArrowRightIcon h="3" w="3" />}
          ml="4"
        />
      </Flex>
    </HStack>
  )
}
