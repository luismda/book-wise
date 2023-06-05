import { PrismaBooksRepository } from '@/server/repositories/prisma/prisma-books-repository'
import { PrismaRatingsRepository } from '@/server/repositories/prisma/prisma-ratings-repository'
import { PrismaUsersRepository } from '@/server/repositories/prisma/prisma-users-repository'
import { GetRatingOfUserAndBookUseCase } from '../get-rating-of-user-and-book'

export function makeGetRatingOfUserAndBookUseCase() {
  const ratingsRepository = new PrismaRatingsRepository()
  const usersRepository = new PrismaUsersRepository()
  const booksRepository = new PrismaBooksRepository()

  const useCase = new GetRatingOfUserAndBookUseCase(
    ratingsRepository,
    usersRepository,
    booksRepository,
  )

  return useCase
}
