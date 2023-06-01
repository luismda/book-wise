import { MagnifyingGlass } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { TextInput } from './TextInput'

const searchFormSchema = z.object({
  search: z.string(),
})

export type SearchFormData = z.infer<typeof searchFormSchema>

interface SearchFormProps {
  onSubmit: (data: SearchFormData) => void
}

export function SearchForm({ onSubmit }: SearchFormProps) {
  const { register, handleSubmit } = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
  })

  return (
    <form className="w-full max-w-[420px]" onSubmit={handleSubmit(onSubmit)}>
      <TextInput.Root iconPosition="right">
        <TextInput.Input
          type="text"
          placeholder="Buscar livro ou autor"
          aria-label="Digite o nome de um livro ou de um autor para buscar"
          {...register('search')}
        />

        <TextInput.Icon>
          <button
            type="submit"
            aria-label="Buscar livros"
            className="leading-[0] outline-none"
          >
            <MagnifyingGlass className="h-full w-full" />
          </button>
        </TextInput.Icon>
      </TextInput.Root>
    </form>
  )
}
