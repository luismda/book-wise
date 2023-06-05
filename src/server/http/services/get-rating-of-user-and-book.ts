import { makeGetRatingOfUserAndBookUseCase } from '@/server/use-cases/factories/make-get-rating-of-user-and-book-use-case'
import { excludeFields } from '@/server/utils/exclude-fields'

interface GetRatingOfUserAndBookServiceParams {
  userId: string
  bookId: string
}

export async function getRatingOfUserAndBookService({
  userId,
  bookId,
}: GetRatingOfUserAndBookServiceParams) {
  const getRatingOfUserAndBookUseCase = makeGetRatingOfUserAndBookUseCase()

  const { rating } = await getRatingOfUserAndBookUseCase.execute({
    userId,
    bookId,
  })

  if (!rating) {
    return null
  }

  const transformedRating = excludeFields(rating, [
    'rate',
    'description',
    'created_at',
  ])

  return transformedRating
}
