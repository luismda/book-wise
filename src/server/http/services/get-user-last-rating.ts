import { makeGetUserLastRatingUseCase } from '@/server/use-cases/factories/make-get-user-last-rating-use-case'
import { excludeFields } from '@/server/utils/exclude-fields'

interface GetUserLastRatingServiceParams {
  userId: string
}

export async function getUserLastRatingService({
  userId,
}: GetUserLastRatingServiceParams) {
  const getUserLastRatingUseCase = makeGetUserLastRatingUseCase()

  const { rating } = await getUserLastRatingUseCase.execute({
    userId,
  })

  if (!rating) {
    return null
  }

  const transformedRating = {
    ...excludeFields(rating, ['user_id']),
    created_at: rating.created_at.toISOString(),
    book: excludeFields(rating.book, ['summary', 'created_at', 'total_pages']),
  }

  return transformedRating
}
