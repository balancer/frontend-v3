import { IconButton, Input, InputGroup, InputRightElement, useBoolean } from '@chakra-ui/react'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'
import { HiOutlineX, HiOutlineSearch } from 'react-icons/hi'
import { usePoolList } from '../usePoolList'

export function PoolListSearch() {
  const [isSearching, { on, off }] = useBoolean()
  const {
    refetch,
    state,
    setPageNumber,
    poolFilters: { searchText, setSearchText },
  } = usePoolList()

  const submitSearch = debounce(async () => {
    setPageNumber(0)
    await refetch({ ...state, textSearch: searchText, skip: 0 })
    off()
  }, 250)

  const firstUpdate = useRef(true)
  useEffect(() => {
    if (!firstUpdate.current) submitSearch()
    firstUpdate.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  return (
    <InputGroup size="md">
      <Input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={e => {
          setSearchText(e.target.value)
          if (!isSearching) on()
        }}
      />
      <InputRightElement>
        <IconButton
          variant="ghost"
          size="sm"
          aria-label="Search for a pool"
          icon={searchText !== '' ? <HiOutlineX /> : <HiOutlineSearch />}
          isLoading={isSearching}
          onClick={() => {
            if (searchText !== '') setSearchText('')
          }}
        />
      </InputRightElement>
    </InputGroup>
  )
}
