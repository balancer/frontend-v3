import { InputGroup, Input, InputRightElement, IconButton } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { HiOutlineX, HiOutlineSearch } from 'react-icons/hi'
import { useDebounce } from '@/lib/shared/hooks/useDebounce'
import { defaultDebounceMs } from '@/lib/shared/utils/queries'

interface SearchInputProps {
  search: string | null
  setSearch: (search: string) => void
  placeholder: string
  ariaLabel: string
  isLoading?: boolean
}

const SEARCH = 'search'

export function SearchInput({
  search,
  setSearch,
  placeholder,
  ariaLabel,
  isLoading,
}: SearchInputProps) {
  const { register, setValue, getFieldState } = useForm()

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const debouncedChangeHandler = useDebounce(changeHandler, defaultDebounceMs)

  return (
    <InputGroup size="md">
      <Input
        {...register(SEARCH)}
        id={SEARCH}
        tabIndex={1}
        placeholder={placeholder}
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
          aria-label={ariaLabel}
          icon={search ? <HiOutlineX /> : <HiOutlineSearch />}
          onClick={() => {
            setSearch('')
            setValue(SEARCH, '')
          }}
          isLoading={isLoading && getFieldState(SEARCH).isTouched}
        />
      </InputRightElement>
    </InputGroup>
  )
}
