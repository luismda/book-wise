import { PrismaRatingsRepository } from '@/server/repositories/prisma/prisma-ratings-repository'
import { PrismaUsersRepository } from '@/server/repositories/prisma/prisma-users-repository'
import { GetUserMetricsUseCase } from '../get-user-metrics'

export function makeGetUserMetricsUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const ratingsRepository = new PrismaRatingsRepository()

  const useCase = new GetUserMetricsUseCase(usersRepository, ratingsRepository)

  return useCase
}
