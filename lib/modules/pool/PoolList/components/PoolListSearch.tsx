import { useForm } from 'react-hook-form'
import { FormControl, IconButton, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi'
import { useTranslations } from 'next-intl'
import { usePoolListQueryState } from '@/lib/modules/pool/PoolList/usePoolListQueryState'
import { useEffect, useMemo } from 'react'
import { debounce } from 'lodash'
import { usePoolList } from '../usePoolList'

export function PoolListSearch() {
  const t = useTranslations('PoolListSearch')
  const { searchText, setSearch } = usePoolListQueryState()
  const { loading } = usePoolList()

  const { register, reset, setValue, getFieldState } = useForm()

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChangeHandler = useMemo(() => debounce(changeHandler, 300), [])

  useEffect(() => {
    reset({
      search: searchText,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset])

  return (
    <form>
      <FormControl>
        <InputGroup size="md">
          <Input
            id="search"
            placeholder="Search..."
            {...register('search')}
            onChange={debouncedChangeHandler}
          />
          <InputRightElement>
            <IconButton
              variant="ghost"
              size="sm"
              aria-label={t('ariaLabel')}
              icon={searchText !== '' ? <HiOutlineX /> : <HiOutlineSearch />}
              isLoading={getFieldState('search').isTouched && loading}
              onClick={() => {
                setSearch('')
                setValue('search', '')
              }}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
    </form>
  )
}
