import {
  RatingsRepository,
  CompleteRating,
} from '@/server/repositories/ratings-repository'

interface FetchRatingsUseCaseRequest {
  perPage: number
  page: number
}

interface FetchRatingsUseCaseResponse {
  ratings: CompleteRating[]
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
