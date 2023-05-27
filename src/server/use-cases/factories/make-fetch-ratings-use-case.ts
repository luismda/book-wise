import { PrismaRatingsRepository } from '@/server/repositories/prisma/prisma-ratings-repository'
import { FetchRatingsUseCase } from '../fetch-ratings'

export function makeFetchRatingsUseCase() {
  const ratingsRepository = new PrismaRatingsRepository()

  const useCase = new FetchRatingsUseCase(ratingsRepository)

  return useCase
}
