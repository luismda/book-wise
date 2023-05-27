import { PrismaRatingsRepository } from '@/server/repositories/prisma/prisma-ratings-repository'
import { PrismaUsersRepository } from '@/server/repositories/prisma/prisma-users-repository'
import { FetchRatingsOfUserUseCase } from '../fetch-ratings-of-user'

export function makeFetchRatingsOfUserUseCase() {
  const ratingsRepository = new PrismaRatingsRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new FetchRatingsOfUserUseCase(
    ratingsRepository,
    usersRepository,
  )

  return useCase
}
