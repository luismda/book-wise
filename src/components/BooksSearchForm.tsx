import { MagnifyingGlass } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { TextInput } from './TextInput'

const booksSearchFormSchema = z.object({
  search: z.string(),
})

export type BooksSearchFormData = z.infer<typeof booksSearchFormSchema>

interface BooksSearchFormProps {
  onSubmit: (data: BooksSearchFormData) => void
}

export function BooksSearchForm({ onSubmit }: BooksSearchFormProps) {
  const { register, handleSubmit } = useForm<BooksSearchFormData>({
    resolver: zodResolver(booksSearchFormSchema),
  })

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
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
