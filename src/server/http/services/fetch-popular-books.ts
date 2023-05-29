import { makeFetchPopularBooksUseCase } from '@/server/use-cases/factories/make-fetch-popular-books-use-case'
import { excludeFields } from '@/server/utils/exclude-fields'

interface FetchPopularBooksServiceParams {
  limit: number
}

export async function fetchPopularBooksService({
  limit,
}: FetchPopularBooksServiceParams) {
  const fetchPopularBooksUseCase = makeFetchPopularBooksUseCase()

  const { books } = await fetchPopularBooksUseCase.execute({
    limit,
  })

  const transformedBooks = books.map((book) => {
    return {
      ...excludeFields(book, ['created_at', 'summary', 'total_pages']),
      average_grade: Number(book.average_grade),
    }
  })

  return transformedBooks
}
