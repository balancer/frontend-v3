import { IconButton, Input, InputGroup, InputRightElement, useBoolean } from '@chakra-ui/react'
import { debounce } from 'lodash'
import { useEffect } from 'react'
import { HiOutlineX, HiOutlineSearch } from 'react-icons/hi'
import { usePoolList } from '../usePoolList'
import { usePoolListFilters } from '../usePoolListFilters'
import { useTranslations } from 'next-intl'

export function PoolListSearch() {
  const [isSearching, { on, off }] = useBoolean()
  const { refetch, state } = usePoolList()
  const { searchText, setSearchText } = usePoolListFilters()

  const t = useTranslations('PoolListSearch')

  const submitSearch = debounce(async () => {
    if (searchText.length > 0) await refetch({ ...state, textSearch: searchText, skip: 0 })
    off()
  }, 250)

  useEffect(() => {
    submitSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  return (
    <InputGroup size="md">
      <Input
        type="text"
        placeholder={t('placeholder')}
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
          aria-label={t('ariaLabel')}
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
