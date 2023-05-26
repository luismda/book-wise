import {
  RatingsRepository,
  RatingWithBook,
} from '@/server/repositories/ratings-repository'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserLastRatingUseCaseRequest {
  userId: string
}

interface GetUserLastRatingUseCaseResponse {
  rating: RatingWithBook | null
}

export class GetUserLastRatingUseCase {
  constructor(
    private ratingsRepository: RatingsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
  }: GetUserLastRatingUseCaseRequest): Promise<GetUserLastRatingUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError('User')
    }

    const rating = await this.ratingsRepository.findByUserId(userId)

    return {
      rating,
    }
  }
}
