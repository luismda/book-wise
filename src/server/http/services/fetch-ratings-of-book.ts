import { makeFetchRatingsOfBookUseCase } from '@/server/use-cases/factories/make-fetch-ratings-of-book-use-case'
import { excludeFields } from '@/server/utils/exclude-fields'

interface FetchRatingsOfBookServiceParams {
  bookId: string
  page: number
  perPage: number
}

export async function fetchRatingsOfBookService({
  bookId,
  page,
  perPage,
}: FetchRatingsOfBookServiceParams) {
  const fetchRatingsOfBookUseCase = makeFetchRatingsOfBookUseCase()

  const { ratings } = await fetchRatingsOfBookUseCase.execute({
    bookId,
    page,
    perPage,
  })

  const transformedRatings = ratings.map((rating) => {
    return {
      ...excludeFields(rating, ['book_id']),
      user: excludeFields(rating.user, ['id', 'email', 'created_at']),
    }
  })

  return transformedRatings
}
