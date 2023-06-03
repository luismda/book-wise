import { makeGetBookDetailsUseCase } from '@/server/use-cases/factories/make-get-book-details-use-case'
import { excludeFields } from '@/server/utils/exclude-fields'

interface GetBookDetailsServiceParams {
  bookId: string
}

export async function getBookDetailsService({
  bookId,
}: GetBookDetailsServiceParams) {
  const getBookDetailsUseCase = makeGetBookDetailsUseCase()

  const { book } = await getBookDetailsUseCase.execute({
    bookId,
  })

  if (!book) {
    return null
  }

  const transformedBook = excludeFields(book, ['created_at', 'id', 'summary'])

  return transformedBook
}
