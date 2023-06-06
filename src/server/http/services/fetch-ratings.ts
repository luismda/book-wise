import { makeFetchRatingsUseCase } from '@/server/use-cases/factories/make-fetch-ratings-use-case'
import { excludeFields } from '@/server/utils/exclude-fields'

interface FetchRatingsServiceParams {
  page: number
  perPage: number
  excludedUserId?: string
}

interface Rating {
  id: string
  rate: number
  description: string
  created_at: string
  user: {
    name: string
    avatar_url: string | null
  }
  book: {
    id: string
    name: string
    author: string
    cover_url: string
  }
}

interface FetcRatingsServiceResponse {
  ratings: Rating[]
  totalRatings: number
}

export async function fetchRatingsService({
  page,
  perPage,
  excludedUserId,
}: FetchRatingsServiceParams): Promise<FetcRatingsServiceResponse> {
  const fetchRatingsUseCase = makeFetchRatingsUseCase()

  const { ratings, totalRatings } = await fetchRatingsUseCase.execute({
    page,
    perPage,
    excludedUserId,
  })

  const transformedRatings = ratings.map((rating) => {
    return {
      ...rating,
      created_at: rating.created_at.toISOString(),
      book: excludeFields(rating.book, [
        'summary',
        'total_pages',
        'created_at',
      ]),
      user: excludeFields(rating.user, ['id', 'email', 'created_at']),
    }
  })

  return {
    ratings: transformedRatings,
    totalRatings,
  }
}
