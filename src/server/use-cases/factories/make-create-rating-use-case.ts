import { PrismaRatingsRepository } from '@/server/repositories/prisma/prisma-ratings-repository'
import { PrismaUsersRepository } from '@/server/repositories/prisma/prisma-users-repository'
import { PrismaBooksRepository } from '@/server/repositories/prisma/prisma-books-repository'
import { CreateRatingUseCase } from '../create-rating'

export function makeCreateRatingUseCase() {
  const ratingsRepository = new PrismaRatingsRepository()
  const usersRepository = new PrismaUsersRepository()
  const booksRepository = new PrismaBooksRepository()

  const useCase = new CreateRatingUseCase(
    ratingsRepository,
    usersRepository,
    booksRepository,
  )

  return useCase
}
