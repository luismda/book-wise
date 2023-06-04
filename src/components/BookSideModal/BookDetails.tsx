import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import * as Dialog from '@radix-ui/react-dialog'
import { BookOpen, BookmarkSimple } from 'phosphor-react'
import { useQuery } from '@tanstack/react-query'

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
  const { data: book } = useQuery(['books', bookId], async () => {
    const response = await api.get<{ book: Book }>(`/books/${bookId}`)

    const { book } = response.data

    return book
  })

  if (!book) {
    return null
  }

  return (
    <>
      <VisuallyHidden.Root>
        <Dialog.Title>Detalhes e avaliações do livro {book.name}</Dialog.Title>

        <Dialog.Description>
          Tenha acesso aos detalhes do livro como categorias, total de páginas,
          nota média, além da avaliação de outros leitores sobre o livro. Faça
          sua avaliação também!
        </Dialog.Description>
      </VisuallyHidden.Root>

      <article className="rounded-sm bg-gray-700 px-8 pb-4 pt-6">
        <div className="flex items-stretch gap-8">
          <BookCover bookCoverUrl={book.cover_url} altText="" size="lg" />

          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              <strong className="text-lg leading-short">{book.name}</strong>
              <span className="leading-base text-gray-300">{book.author}</span>
            </div>

            <div className="flex flex-col gap-1">
              <RatingStarsView
                ratingStarsAmount={book.average_grade}
                size="md"
              />
              <span className="text-sm leading-base text-gray-400">
                {book.ratings_amount}{' '}
                {book.ratings_amount === 1 ? 'avaliação' : 'avaliações'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-13 border-t border-gray-600 py-6">
          <div className="flex items-center gap-4">
            <BookmarkSimple className="h-6 w-6 text-green-100" />
            <div>
              <span className="text-sm leading-base text-gray-300">
                Categoria
              </span>
              <strong className="block leading-short text-gray-200">
                {book.categories[0].concat(', ')}{' '}
                <span className="lowercase">
                  {book.categories.slice(1).join(', ')}
                </span>
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <BookOpen className="h-6 w-6 text-green-100" />
            <div>
              <span className="text-sm leading-base text-gray-300">
                Páginas
              </span>
              <strong className="block leading-short text-gray-200">
                {book.total_pages}
              </strong>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
