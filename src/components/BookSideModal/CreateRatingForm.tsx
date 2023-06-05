import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Check, X } from 'phosphor-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { clsx } from 'clsx'

import { api } from '@/lib/axios'

import { Avatar } from '../Avatar'
import { RatingsStarsRadioGroup } from '../RatingsStarsRadioGroup'

const createRatingFormSchema = z.object({
  rate: z.coerce
    .number({
      invalid_type_error: 'Informe quantas estrelas você quer dar ao livro.',
      required_error: 'Informe quantas estrelas você quer dar ao livro.',
    })
    .min(1, 'Você precisar dar no mínimo 1 estrela para o livro.')
    .max(5, 'Você pode dar no máximo 5 estrelas para o livro.'),
  description: z
    .string({
      required_error: 'Informe sua avaliação do livro.',
    })
    .trim()
    .min(10, 'Sua avaliação precisa ter no mínimo 10 caracteres.')
    .max(450, 'Sua avaliação não pode ter mais que 450 caracteres.'),
})

type CreateRatingFormData = z.infer<typeof createRatingFormSchema>

interface CreateRatingFormProps {
  bookId: string
  isShouldBeHidden?: boolean
  onHide?: () => void
}

export function CreateRatingForm({
  bookId,
  isShouldBeHidden = false,
  onHide = () => {},
}: CreateRatingFormProps) {
  const session = useSession()

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateRatingFormData>({
    resolver: zodResolver(createRatingFormSchema),
  })

  const queryClient = useQueryClient()

  const createRating = useMutation(
    async (data: CreateRatingFormData) => {
      await api.post(`/ratings/books/${bookId}/rate`, {
        rate: data.rate,
        description: data.description,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ratings', bookId])
        queryClient.invalidateQueries(['books', bookId])
        queryClient.invalidateQueries([
          'ratings',
          session.data?.user.id,
          bookId,
        ])
      },
    },
  )

  async function handleCreateRating(data: CreateRatingFormData) {
    try {
      await createRating.mutateAsync({
        rate: data.rate,
        description: data.description,
      })

      reset()
      onHide()
    } catch (error) {
      console.error(error)
    }
  }

  function handleHideForm() {
    reset()
    onHide()
  }

  const isUserAuthenticated = !!session.data?.user
  const isShouldBeDisabled =
    createRating.isLoading || isShouldBeHidden || !isUserAuthenticated

  return (
    <form
      aria-hidden={isShouldBeHidden}
      className={clsx('mb-3 flex flex-col gap-6 rounded-sm bg-gray-700 p-6', {
        hidden: isShouldBeHidden,
      })}
      onSubmit={handleSubmit(handleCreateRating)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar avatarUrl={session.data?.user.avatar_url} />

          <strong className="leading-short">
            {session.data?.user.name ?? 'Leitor'}
          </strong>
        </div>

        <Controller
          name="rate"
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <RatingsStarsRadioGroup
                aria-required
                aria-invalid={!!errors.rate}
                aria-disabled={isShouldBeDisabled}
                disabled={isShouldBeDisabled}
                value={String(value)}
                onValueChange={onChange}
              />
            )
          }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <textarea
            aria-required
            aria-label="Digite algum comentário sobre o que você achou do livro"
            aria-invalid={!!errors.description}
            aria-disabled={isShouldBeDisabled}
            disabled={isShouldBeDisabled}
            placeholder="Escreva sua avaliação"
            className="min-h-[10.25rem] w-full rounded-xs border border-gray-500 bg-gray-800 px-5 py-3 text-sm leading-base text-gray-200 outline-none transition-colors placeholder:text-gray-400 focus:border-green-200 disabled:cursor-not-allowed disabled:opacity-70"
            {...register('description')}
          />

          {!!errors.description && (
            <p role="alert" className="text-sm leading-base text-red-400">
              {errors.description.message}
            </p>
          )}

          {!!errors.rate && (
            <p role="alert" className="text-sm leading-base text-red-400">
              {errors.rate.message}
            </p>
          )}

          {!isUserAuthenticated && (
            <p role="alert" className="text-sm leading-base text-gray-400">
              <Link
                href="/sign-in"
                className="underline outline-none transition-colors hover:text-gray-300 focus:text-gray-300"
              >
                Faça login
              </Link>{' '}
              para deixar sua avaliação.
            </p>
          )}

          {!!createRating.error && (
            <p role="alert" className="text-sm leading-base text-red-400">
              Não foi possível salvar sua avaliação, tente novamente.
            </p>
          )}
        </div>

        <div className="space-x-2 self-end">
          <button
            type="button"
            aria-label="Descartar minha avaliação desse livro"
            aria-disabled={isShouldBeDisabled}
            disabled={isShouldBeDisabled}
            className="rounded-xs bg-gray-600 p-2 leading-[0] outline-none transition-colors hover:bg-gray-500 focus:ring focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-gray-600"
            onClick={handleHideForm}
          >
            <X className="h-6 w-6 text-purple-100" />
          </button>
          <button
            type="submit"
            aria-label="Enviar minha avaliação sobre esse livro"
            aria-disabled={isShouldBeDisabled}
            disabled={isShouldBeDisabled}
            className="rounded-xs bg-gray-600 p-2 leading-[0] outline-none transition-colors hover:bg-gray-500 focus:ring focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-gray-600"
          >
            <Check className="h-6 w-6 text-green-100" />
          </button>
        </div>
      </div>
    </form>
  )
}
