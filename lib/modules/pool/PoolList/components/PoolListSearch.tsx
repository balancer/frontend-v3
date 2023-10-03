import { IconButton, Input, InputGroup, InputRightElement, useBoolean } from '@chakra-ui/react'
import { debounce } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi'
import { sleep } from '@/lib/utils/time'
import { useTranslations } from 'next-intl'
import { usePoolListQueryState } from '@/lib/modules/pool/PoolList/usePoolListQueryState'

export function PoolListSearch() {
  const [isSearching, { on, off }] = useBoolean()
  const { searchText, setSearch } = usePoolListQueryState()
  const [localSearchText, setLocalSearchText] = useState(searchText || '')

  const t = useTranslations('PoolListSearch')

  const submitSearch = debounce(async () => {
    if (isSearching) {
      await sleep(250)
      off()
    }
    setSearch(localSearchText)
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
        placeholder={t('placeholder')}
        value={searchText || ''}
        onChange={e => {
          setLocalSearchText(e.target.value)
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
            if (searchText !== '') setLocalSearchText('')
          }}
        />
      </InputRightElement>
    </InputGroup>
  )
}
