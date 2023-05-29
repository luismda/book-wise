import { makeFetchRatingsUseCase } from '@/server/use-cases/factories/make-fetch-ratings-use-case'
import { excludeFields } from '@/server/utils/exclude-fields'

interface FetchRatingsServiceParams {
  page: number
  perPage: number
  excludedUserId?: string
}

export async function fetchRatingsService({
  page,
  perPage,
  excludedUserId,
}: FetchRatingsServiceParams) {
  const fetchRatingsUseCase = makeFetchRatingsUseCase()

  const { ratings } = await fetchRatingsUseCase.execute({
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

  return transformedRatings
}
