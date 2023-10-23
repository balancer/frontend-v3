import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@chakra-ui/icons'
import {
  HStack,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Text,
  Center,
  Grid,
  GridItem,
} from '@chakra-ui/react'

interface Props {
  goToFirstPage: () => void
  goToLastPage: () => void
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
  goToLastPage,
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
  return (
    <Center w="full">
      <Grid
        w={{ base: 'full', lg: '75%' }}
        mt={{ base: '4', lg: '8' }}
        templateColumns={{
          base: '2fr repeat(2, 1fr)',
          lg: 'repeat(5, 1fr)',
        }}
        templateAreas={{
          base: `"left page right"
                 "goto goto size"`,
          lg: `"left goto page size right"`,
        }}
        gap={{ base: '2', lg: '4' }}
      >
        <GridItem area="left" justifySelf={{ base: 'start', lg: 'end' }}>
          <IconButton
            aria-label="first page"
            onClick={goToFirstPage}
            isDisabled={!canPreviousPage}
            icon={<ArrowLeftIcon h="3" w="3" />}
            mr="2"
          />

          <IconButton
            aria-label="previous page"
            onClick={goToPreviousPage}
            isDisabled={!canPreviousPage}
            icon={<ChevronLeftIcon h="6" w="6" />}
          />
        </GridItem>
        <GridItem area="page" alignSelf="center">
          <Center>
            <Text flexShrink="0" mr="8">
              Page{' '}
              <Text fontWeight="bold" as="span">
                {currentPageNumber}
              </Text>{' '}
              of{' '}
              <Text fontWeight="bold" as="span">
                {totalPageCount}
              </Text>
            </Text>
          </Center>
        </GridItem>
        <GridItem area="goto" justifySelf={{ base: 'start', lg: 'end' }}>
          <HStack alignContent="space-between">
            <Text flexShrink="0">Goto page:</Text>{' '}
            <NumberInput
              ml="2"
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
          </HStack>
        </GridItem>
        <GridItem area="size">
          <Select
            w="32"
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {`Show ${pageSize}`}
              </option>
            ))}
          </Select>
        </GridItem>
        <GridItem area="right" justifySelf={{ base: 'end', lg: 'start' }}>
          <IconButton
            aria-label="next page"
            onClick={goToNextPage}
            isDisabled={!canNextPage}
            icon={<ChevronRightIcon h="6" w="6" />}
          />
          <IconButton
            aria-label="last page"
            onClick={goToLastPage}
            isDisabled={!canNextPage}
            icon={<ArrowRightIcon h="3" w="3" />}
            ml="2"
          />
        </GridItem>
      </Grid>
    </Center>
  )
}
