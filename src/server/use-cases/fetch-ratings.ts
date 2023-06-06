import {
  RatingsRepository,
  RatingWithUserAndBook,
} from '@/server/repositories/ratings-repository'

interface FetchRatingsUseCaseRequest {
  perPage: number
  page: number
  excludedUserId?: string
}

interface FetchRatingsUseCaseResponse {
  ratings: RatingWithUserAndBook[]
  totalRatings: number
}

export class FetchRatingsUseCase {
  constructor(private ratingsRepository: RatingsRepository) {}

  async execute({
    perPage,
    page,
    excludedUserId,
  }: FetchRatingsUseCaseRequest): Promise<FetchRatingsUseCaseResponse> {
    const ratings = await this.ratingsRepository.findMany({
      perPage,
      page,
      excludedUserId,
    })

    const totalRatings = await this.ratingsRepository.count({
      excludedUserId,
    })

    return {
      ratings,
      totalRatings,
    }
  }
}
