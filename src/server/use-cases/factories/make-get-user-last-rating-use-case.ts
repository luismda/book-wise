import { PrismaRatingsRepository } from '@/server/repositories/prisma/prisma-ratings-repository'
import { PrismaUsersRepository } from '@/server/repositories/prisma/prisma-users-repository'
import { GetUserLastRatingUseCase } from '../get-user-last-rating'

export function makeGetUserLastRatingUseCase() {
  const ratingsRepository = new PrismaRatingsRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new GetUserLastRatingUseCase(
    ratingsRepository,
    usersRepository,
  )

  return useCase
}
