import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import * as Dialog from '@radix-ui/react-dialog'
import { BookOpen, BookmarkSimple } from 'phosphor-react'
import { useQuery } from '@tanstack/react-query'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import colors from 'tailwindcss/colors'

import { api } from '@/lib/axios'

import { BookCover } from '../BookCover'
import { RatingStarsView } from '../RatingStarsView'

interface Book {
  name: string
  author: string
  cover_url: string
  total_pages: number
  average_grade: number
  ratings_amount: number
  categories: string[]
}

interface BookDetailsProps {
  bookId: string
}

export function BookDetails({ bookId }: BookDetailsProps) {
  const { data: book, isLoading } = useQuery(['books', bookId], async () => {
    const response = await api.get<{ book: Book }>(`/books/${bookId}`)

    const { book } = response.data

    return book
  })

  return (
    <>
      <VisuallyHidden.Root>
        <Dialog.Title>
          Detalhes e avaliações do livro {isLoading ? <Skeleton /> : book?.name}
        </Dialog.Title>

        <Dialog.Description>
          Tenha acesso aos detalhes do livro como categorias, total de páginas,
          nota média, além da avaliação de outros leitores sobre o livro. Faça
          sua avaliação também!
        </Dialog.Description>
      </VisuallyHidden.Root>

      <SkeletonTheme
        baseColor={colors.gray[800]}
        highlightColor={colors.gray[700]}
      >
        <article className="rounded-sm bg-gray-700 px-8 pb-4 pt-6">
          <div className="flex items-stretch gap-8">
            {isLoading ? (
              <Skeleton
                width="10.75rem"
                height="15.125rem"
                className="rounded-xs"
              />
            ) : (
              <BookCover
                bookCoverUrl={book?.cover_url ?? ''}
                altText=""
                size="lg"
              />
            )}

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex flex-col gap-2">
                <strong className="text-lg leading-short">
                  {isLoading ? <Skeleton /> : book?.name}
                </strong>
                <span className="leading-base text-gray-300">
                  {isLoading ? <Skeleton width="40%" /> : book?.author}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                {isLoading ? (
                  <Skeleton width="40%" />
                ) : (
                  <RatingStarsView
                    ratingStarsAmount={book?.average_grade ?? 0}
                    size="md"
                  />
                )}
                <span className="text-sm leading-base text-gray-400">
                  {isLoading ? (
                    <Skeleton width="25%" />
                  ) : (
                    <>
                      {book?.ratings_amount}{' '}
                      {book?.ratings_amount === 1 ? 'avaliação' : 'avaliações'}
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 items-center gap-13 border-t border-gray-600 py-6">
            <div className="flex items-center gap-4">
              {isLoading ? (
                <Skeleton width="1.5rem" height="1.5rem" />
              ) : (
                <BookmarkSimple className="h-6 w-6 text-green-100" />
              )}

              <div className="flex-1">
                <span className="text-sm leading-base text-gray-300">
                  {isLoading ? <Skeleton width="30%" /> : 'Categoria'}
                </span>
                <strong className="block leading-short text-gray-200">
                  {isLoading ? (
                    <Skeleton width="10.75rem" />
                  ) : (
                    <>
                      {book?.categories[0].concat(', ')}{' '}
                      <span className="lowercase">
                        {book?.categories.slice(1).join(', ')}
                      </span>
                    </>
                  )}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isLoading ? (
                <Skeleton width="1.5rem" height="1.5rem" />
              ) : (
                <BookOpen className="h-6 w-6 text-green-100" />
              )}

              <div className="flex-1">
                <span className="text-sm leading-base text-gray-300">
                  {isLoading ? <Skeleton width="25%" /> : 'Páginas'}
                </span>
                <strong className="block leading-short text-gray-200">
                  {isLoading ? <Skeleton width="15%" /> : book?.total_pages}
                </strong>
              </div>
            </div>
          </div>
        </article>
      </SkeletonTheme>
    </>
  )
}
