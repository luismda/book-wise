import { makeFetchBooksUseCase } from '@/server/use-cases/factories/make-fetch-books-use-case'
import { excludeFields } from '@/server/utils/exclude-fields'

interface FetchBooksServiceParams {
  page: number
  perPage: number
  categoriesId?: string[]
  query?: string
}

export async function fetchBooksService({
  page,
  perPage,
  categoriesId,
  query,
}: FetchBooksServiceParams) {
  const fetchBooksUseCase = makeFetchBooksUseCase()

  const { books, totalBooks } = await fetchBooksUseCase.execute({
    page,
    perPage,
    categoriesId,
    query,
  })

  const transformedBooks = books.map((book) => {
    return {
      ...excludeFields(book, ['created_at', 'summary', 'total_pages']),
      average_grade: Number(book.average_grade),
    }
  })

  return {
    books: transformedBooks,
    totalBooks,
  }
}
