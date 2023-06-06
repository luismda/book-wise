import { makeFetchRatingsOfUserUseCase } from '@/server/use-cases/factories/make-fetch-ratings-of-user-use-case'
import { excludeFields } from '@/server/utils/exclude-fields'

interface FetchRatingsOfUserServiceParams {
  page: number
  perPage: number
  userId: string
  query?: string
}

interface Rating {
  id: string
  rate: number
  description: string
  created_at: string
  book: {
    id: string
    name: string
    author: string
    cover_url: string
  }
}

interface FetchRatingsOfUserServiceResponse {
  ratings: Rating[]
  totalRatings: number
}

export async function fetchRatingsOfUserService({
  page,
  perPage,
  userId,
  query,
}: FetchRatingsOfUserServiceParams): Promise<FetchRatingsOfUserServiceResponse> {
  const fetchRatingsOfUserUseCase = makeFetchRatingsOfUserUseCase()

  const { ratings, totalRatings } = await fetchRatingsOfUserUseCase.execute({
    page,
    perPage,
    userId,
    query,
  })

  const transformedRatings = ratings.map((rating) => {
    return {
      ...excludeFields(rating, ['user_id']),
      created_at: rating.created_at.toISOString(),
      book: excludeFields(rating.book, [
        'summary',
        'total_pages',
        'created_at',
      ]),
    }
  })

  return {
    ratings: transformedRatings,
    totalRatings,
  }
}
