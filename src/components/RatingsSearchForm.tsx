import { MagnifyingGlass } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { TextInput } from './TextInput'

const ratingsSearchFormSchema = z.object({
  search: z.string(),
})

export type RatingsSearchFormData = z.infer<typeof ratingsSearchFormSchema>

interface RatingsSearchFormProps {
  onSubmit: (data: RatingsSearchFormData) => void
}

export function RatingsSearchForm({ onSubmit }: RatingsSearchFormProps) {
  const { register, handleSubmit } = useForm<RatingsSearchFormData>({
    resolver: zodResolver(ratingsSearchFormSchema),
  })

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <TextInput.Root iconPosition="right">
        <TextInput.Input
          type="text"
          placeholder="Buscar livro avaliado"
          aria-label="Digite o nome de um livro ou de um autor para buscar avaliações"
          {...register('search')}
        />

        <TextInput.Icon>
          <button
            type="submit"
            aria-label="Buscar livros avaliados"
            className="leading-[0] outline-none"
          >
            <MagnifyingGlass className="h-full w-full" />
          </button>
        </TextInput.Icon>
      </TextInput.Root>
    </form>
  )
}
