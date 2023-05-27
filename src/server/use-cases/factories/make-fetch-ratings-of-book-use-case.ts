import { PrismaBooksRepository } from '@/server/repositories/prisma/prisma-books-repository'
import { PrismaRatingsRepository } from '@/server/repositories/prisma/prisma-ratings-repository'
import { FetchRatingsOfBookUseCase } from '../fetch-ratings-of-book'

export function makeFetchRatingsOfBookUseCase() {
  const ratingsRepository = new PrismaRatingsRepository()
  const booksRepository = new PrismaBooksRepository()

  const useCase = new FetchRatingsOfBookUseCase(
    ratingsRepository,
    booksRepository,
  )

  return useCase
}
