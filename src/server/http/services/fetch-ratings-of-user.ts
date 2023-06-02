import { makeFetchRatingsOfUserUseCase } from '@/server/use-cases/factories/make-fetch-ratings-of-user-use-case'
import { excludeFields } from '@/server/utils/exclude-fields'

interface FetchRatingsOfUserServiceParams {
  page: number
  perPage: number
  userId: string
  query?: string
}

export async function fetchRatingsOfUserService({
  page,
  perPage,
  userId,
  query,
}: FetchRatingsOfUserServiceParams) {
  const fetchRatingsOfUserUseCase = makeFetchRatingsOfUserUseCase()

  const { ratings } = await fetchRatingsOfUserUseCase.execute({
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

  return transformedRatings
}
