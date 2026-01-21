import { InputWithLabel } from './InputWithLabel.tsx'
import { SearchFormProps } from './types.ts'

const SearchForm = ({searchTerm, onSearchSubmit, onSearchInput}: SearchFormProps) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel id = 'search' onInputChange = {onSearchInput} value = {searchTerm} isFocused>
      <strong>Search:</strong>
    </InputWithLabel>

    <button type='submit' disabled = {!searchTerm}>
      Submit
    </button>
  </form>
)

export { SearchForm }