import {
  RatingsRepository,
  RatingWithUserAndBook,
} from '@/server/repositories/ratings-repository'

interface FetchRatingsUseCaseRequest {
  perPage: number
  page: number
}

interface FetchRatingsUseCaseResponse {
  ratings: RatingWithUserAndBook[]
}

export class FetchRatingsUseCase {
  constructor(private ratingsRepository: RatingsRepository) {}

  async execute({
    perPage,
    page,
  }: FetchRatingsUseCaseRequest): Promise<FetchRatingsUseCaseResponse> {
    const ratings = await this.ratingsRepository.findMany({
      perPage,
      page,
    })

    return {
      ratings,
    }
  }
}
