import { useForm } from 'react-hook-form'
import {
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  forwardRef,
  Box,
  BoxProps,
} from '@chakra-ui/react'
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi'
import { usePoolListQueryState } from '@/lib/modules/pool/PoolList/usePoolListQueryState'
import { useEffect } from 'react'
import { useDebounce } from '@/lib/shared/hooks/useDebounce'
import { usePoolList } from '../usePoolList'

const SEARCH = 'search'

export const PoolListSearch = forwardRef<BoxProps, 'div'>((props, ref) => {
  const { searchText, setSearch } = usePoolListQueryState()
  const { loading } = usePoolList()

  const { register, reset, setValue, getFieldState } = useForm()

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const debouncedChangeHandler = useDebounce(changeHandler, 300)

  useEffect(() => {
    reset({
      search: searchText,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset])

  return (
    <Box ref={ref} {...props}>
      <form>
        <FormControl>
          <InputGroup size="md">
            <Input
              id={SEARCH}
              placeholder="Search..."
              {...register(SEARCH)}
              onChange={debouncedChangeHandler}
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="search for a pool"
                icon={searchText ? <HiOutlineX /> : <HiOutlineSearch />}
                isLoading={getFieldState(SEARCH).isTouched && loading}
                onClick={() => {
                  setSearch('')
                  setValue(SEARCH, '')
                }}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </form>
    </Box>
  )
})
