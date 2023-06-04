import { makeCreateRatingUseCase } from '@/server/use-cases/factories/make-create-rating-use-case'

interface CreateRatingServiceParams {
  userId: string
  bookId: string
  rate: number
  description: string
}

export async function createRatingService({
  userId,
  bookId,
  rate,
  description,
}: CreateRatingServiceParams) {
  const createRatingUseCase = makeCreateRatingUseCase()

  const { rating } = await createRatingUseCase.execute({
    userId,
    bookId,
    rate,
    description,
  })

  return rating
}
