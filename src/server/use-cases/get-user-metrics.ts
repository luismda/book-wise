import {
  RatingsRepository,
  RatingsMetricsOfUser,
} from '../repositories/ratings-repository'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  userMetrics: RatingsMetricsOfUser
}

export class GetUserMetricsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private ratingsRepository: RatingsRepository,
  ) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError('User')
    }

    const userMetrics = await this.ratingsRepository.countMetricsByUserId(
      userId,
    )

    return {
      userMetrics,
    }
  }
}
