import {
  RatingsRepository,
  RatingWithBook,
} from '@/server/repositories/ratings-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UsersRepository } from '../repositories/users-repository'

interface FetchRatingsOfUserUseCaseRequest {
  userId: string
  query?: string
  perPage: number
  page: number
}

interface FetchRatingsOfUserUseCaseResponse {
  ratings: RatingWithBook[]
  totalRatings: number
}

export class FetchRatingsOfUserUseCase {
  constructor(
    private ratingsRepository: RatingsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    query,
    perPage,
    page,
  }: FetchRatingsOfUserUseCaseRequest): Promise<FetchRatingsOfUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError('User')
    }

    const ratings = await this.ratingsRepository.findManyByUserId({
      userId,
      query,
      page,
      perPage,
    })

    const totalRatings = await this.ratingsRepository.countByUserId({
      userId,
      query,
    })

    return {
      ratings,
      totalRatings,
    }
  }
}
