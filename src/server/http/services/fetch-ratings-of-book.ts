import { makeFetchRatingsOfBookUseCase } from '@/server/use-cases/factories/make-fetch-ratings-of-book-use-case'
import { excludeFields } from '@/server/utils/exclude-fields'

interface FetchRatingsOfBookServiceParams {
  bookId: string
  page: number
  perPage: number
}

interface Rating {
  id: string
  rate: number
  description: string
  created_at: Date
  user: {
    id: string
    name: string
    avatar_url: string | null
  }
}

interface FetchRatingsOfBookServiceResponse {
  ratings: Rating[]
  totalRatings: number
}

export async function fetchRatingsOfBookService({
  bookId,
  page,
  perPage,
}: FetchRatingsOfBookServiceParams): Promise<FetchRatingsOfBookServiceResponse> {
  const fetchRatingsOfBookUseCase = makeFetchRatingsOfBookUseCase()

  const { ratings, totalRatings } = await fetchRatingsOfBookUseCase.execute({
    bookId,
    page,
    perPage,
  })

  const transformedRatings = ratings.map((rating) => {
    return {
      ...excludeFields(rating, ['book_id']),
      user: excludeFields(rating.user, ['email', 'created_at']),
    }
  })

  return {
    ratings: transformedRatings,
    totalRatings,
  }
}
