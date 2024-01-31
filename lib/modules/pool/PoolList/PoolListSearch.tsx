import { useForm } from 'react-hook-form'
import {
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Box,
} from '@chakra-ui/react'
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi'
import { usePoolListQueryState } from './usePoolListQueryState'
import { useEffect } from 'react'
import { useDebounce } from '@/lib/shared/hooks/useDebounce'
import { usePoolList } from './usePoolList'
import { defaultDebounceMs } from '@/lib/shared/utils/queries'

const SEARCH = 'search'

export function PoolListSearch() {
  const { searchText, setSearch } = usePoolListQueryState()
  const { loading } = usePoolList()

  const { register, reset, setValue, getFieldState } = useForm()

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const debouncedChangeHandler = useDebounce(changeHandler, defaultDebounceMs)

  useEffect(() => {
    reset({
      search: searchText,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset])

  return (
    <Box w={{ base: 'full', md: 'md' }}>
      <form>
        <FormControl w="full">
          <InputGroup size="md">
            <Input
              id={SEARCH}
              placeholder="Search..."
              {...register(SEARCH)}
              onChange={debouncedChangeHandler}
              bg="input.bgDefault"
              border="1px solid"
              borderColor="input.borderDefault"
              _hover={{ bg: 'input.bgHover', borderColor: 'input.borderHover' }}
              _focus={{
                bg: 'input.bgFocus',
                borderColor: 'input.borderFocus',
              }}
              _focusVisible={{
                bg: 'input.bgFocus',
                borderColor: 'input.borderFocus',
                shadow: 'input.innerFocus',
                color: 'input.fontFocus',
              }}
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
}
